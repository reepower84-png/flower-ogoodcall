"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/site.config";
import { CATEGORIES, REVIEWS, FEATURES, won, minPrice, type Item } from "@/data";

/* 오굿콜 플라워 — 퀵 배달 앱 톤(비비드 오렌지·검정·흰색, 큰 둥근 버튼, Do Hyeon 제목).
   첫 화면: 원탭 콜 + 카테고리 그리드 → 카테고리를 누르면 바텀시트(모바일)/모달(데스크톱)로 상품 목록,
   상품을 누르면 '금액 상이' 안내 팝업 → 전화 연결. */

const NAV = [
  { id: "menu", label: "꽃 메뉴" },
  { id: "steps", label: "배달 과정" },
  { id: "why", label: "서비스" },
  { id: "reviews", label: "후기" },
  { id: "call", label: "주문하기" },
];

const STEPS = [
  { t: "주문 전화", d: "대표번호로 전화 한 통" },
  { t: "제작", d: "현지 플로리스트가 제작" },
  { t: "출발", d: "가까운 곳에서 출발" },
  { t: "도착", d: "받는 분께 전달" },
];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.3 21 3 12.7 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1.1l-2.2 2.1z" />
    </svg>
  );
}

/* 배달 스쿠터 일러스트 */
function Scooter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true">
      <rect x="6" y="8" width="16" height="14" rx="3" fill="var(--orange)" />
      <circle cx="12" cy="7" r="3" fill="#ff6fa0" />
      <circle cx="17" cy="6" r="2.5" fill="#ffd23f" />
      <path d="M24 26h18l6-12h6" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 26h18c2 0 3 2 3 4H8z" fill="#111" />
      <circle cx="40" cy="8" r="5" fill="var(--orange)" />
      <path d="M38 13l-4 9h8" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="35" r="6" fill="#fff" stroke="#111" strokeWidth="3.5" />
      <circle cx="50" cy="35" r="6" fill="#fff" stroke="#111" strokeWidth="3.5" />
      <path d="M0 18h4M0 24h3" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" className="speed-lines" />
    </svg>
  );
}

/* 배달 단계 아이콘 (STEPS 순서) */
const STEP_ICONS = [
  <svg key="s0" viewBox="0 0 48 48" aria-hidden="true">
    <rect x="13" y="4" width="22" height="40" rx="5" fill="#111" />
    <rect x="16" y="9" width="16" height="26" rx="2" fill="#fff" />
    <path d="M20.5 18.5c1 2 2.6 3.6 4.6 4.6l1.6-1.6c.2-.2.5-.3.8-.2.8.3 1.7.4 2.6.4.4 0 .7.3.7.7v2.4c0 .4-.3.7-.7.7C24.5 25.5 19 20 19 13.4c0-.4.3-.7.7-.7h2.4c.4 0 .7.3.7.7 0 .9.1 1.8.4 2.6.1.3 0 .6-.2.8z" fill="var(--orange)" />
    <circle cx="24" cy="39.5" r="1.8" fill="#fff" />
  </svg>,
  <svg key="s1" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M14 22h20l-4 20H18z" fill="#111" />
    <circle cx="18" cy="16" r="6" fill="var(--orange)" />
    <circle cx="30" cy="16" r="6" fill="#ff6fa0" />
    <circle cx="24" cy="10" r="6" fill="#ffd23f" />
    <circle cx="24" cy="10" r="2" fill="var(--orange)" />
    <path d="M20 30h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  <svg key="s2" viewBox="0 0 64 44" aria-hidden="true">
    <rect x="6" y="8" width="16" height="14" rx="3" fill="var(--orange)" />
    <path d="M24 26h18l6-12h6" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 26h18c2 0 3 2 3 4H8z" fill="#111" />
    <circle cx="40" cy="8" r="5" fill="var(--orange)" />
    <circle cx="14" cy="35" r="6" fill="#fff" stroke="#111" strokeWidth="3.5" />
    <circle cx="50" cy="35" r="6" fill="#fff" stroke="#111" strokeWidth="3.5" />
  </svg>,
  <svg key="s3" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M8 22L24 8l16 14v20H8z" fill="#111" />
    <rect x="19" y="28" width="10" height="14" rx="1.5" fill="var(--orange)" />
    <circle cx="36" cy="12" r="9" fill="var(--orange)" stroke="#fff" strokeWidth="2.5" />
    <path d="M31.5 12l3 3 5.5-6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

const FEATURE_EMOJI_BG = ["bg-[var(--orange)]", "bg-white", "bg-[#ffd23f]"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<Item | null>(null);
  const tel = `tel:${SITE.phoneHref}`;
  const sheet = CATEGORIES.find((c) => c.key === sheetKey) ?? null;
  const layerOpen = sheet !== null || notice !== null;

  // 바텀시트 또는 안내 팝업이 열려 있는 동안 배경 스크롤 잠금 (둘이 겹쳐도 한 번만 잠금)
  useEffect(() => {
    if (!layerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [layerOpen]);

  // ESC: 위에 떠 있는 안내 팝업부터 닫고, 그다음 바텀시트를 닫는다
  useEffect(() => {
    if (!layerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (notice) setNotice(null);
      else setSheetKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layerOpen, notice]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* 헤더 — 흰 배경(로고 배경과 동일) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
        <nav className="max-w-6xl mx-auto px-3 sm:px-6 h-[72px] flex items-center justify-between gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`${SITE.name} 홈으로`}
            className="shrink-0"
          >
            {SITE.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={SITE.logo} alt={SITE.name} className="h-[62px] w-[62px] object-contain" />
            ) : (
              <span className="font-display text-2xl">{SITE.name}</span>
            )}
          </button>

          <ul className="hidden md:flex items-center gap-1 bg-[var(--soft)] rounded-full p-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  className="px-4 h-10 rounded-full text-[14px] font-bold text-[var(--ink)] hover:bg-white hover:text-[var(--orange-deep)] transition"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href={tel}
              className="flex items-center gap-1.5 h-11 pl-3 pr-4 rounded-full bg-[var(--orange)] text-white font-bold text-sm shadow-[0_4px_0_var(--orange-deep)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--orange-deep)] transition"
            >
              <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                <PhoneIcon className="w-4 h-4" />
              </span>
              <span className="tabular-nums">{SITE.phone}</span>
            </a>
            <button
              className="md:hidden w-11 h-11 rounded-full bg-[var(--soft)] flex flex-col items-center justify-center gap-[4px]"
              aria-label="메뉴"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block w-[18px] h-[2.5px] rounded-full bg-[var(--ink)]" />
              <span className="block w-[18px] h-[2.5px] rounded-full bg-[var(--ink)]" />
              <span className="block w-[12px] h-[2.5px] rounded-full bg-[var(--orange)] ml-[6px]" />
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="md:hidden absolute inset-x-0 top-full px-3 pt-2">
            <ul className="bg-white rounded-3xl shadow-xl border border-black/5 p-2 grid grid-cols-2 gap-1.5">
              {NAV.map((n) => (
                <li key={n.id} className="last:col-span-2">
                  <button
                    onClick={() => go(n.id)}
                    className="w-full h-12 rounded-2xl bg-[var(--soft)] text-[15px] font-bold text-[var(--ink)] active:bg-[var(--orange)] active:text-white"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 첫 화면: 카피 + 원탭 콜 + 카테고리 그리드 */}
        <section id="menu" className="relative overflow-hidden scroll-mt-[72px]">
          <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full border-[18px] border-[var(--orange)]/15 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-12 pb-10 sm:pb-16">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-black text-white text-[11px] sm:text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[var(--orange)] live-dot" />
                  전국 당일배송 · 365일 상담
                </p>
                <h1 className="font-display mt-2 sm:mt-4 text-[34px] leading-[1.12] sm:text-6xl sm:leading-[1.1] text-[var(--ink)] break-keep">
                  전화 한 통이면
                  <br />
                  꽃이 <span className="text-[var(--orange)]">달려갑니다!</span>
                </h1>
              </div>
              <Scooter className="hidden sm:block w-40 lg:w-56 shrink-0 scooter-bob" />
            </div>

            <a
              href={tel}
              className="mt-4 sm:mt-7 flex items-center gap-3 w-full sm:w-auto sm:inline-flex h-16 sm:h-[72px] pl-2 pr-6 rounded-full bg-[var(--orange)] text-white shadow-[0_6px_0_var(--orange-deep)] active:translate-y-[3px] active:shadow-[0_3px_0_var(--orange-deep)] transition"
            >
              <span className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white text-[var(--orange)] flex items-center justify-center">
                <span className="absolute inset-0 rounded-full ring-pulse" aria-hidden="true" />
                <PhoneIcon className="w-6 h-6" />
              </span>
              <span className="flex-1 min-w-0 leading-tight">
                <span className="block text-[12px] sm:text-sm font-bold text-white/85">원탭 주문 전화</span>
                <span className="font-display block text-[26px] sm:text-[32px] tabular-nums">{SITE.phone}</span>
              </span>
              <span className="text-2xl font-display" aria-hidden="true">→</span>
            </a>

            <div className="mt-5 sm:mt-10 flex items-end justify-between">
              <h2 className="font-display text-xl sm:text-3xl text-[var(--ink)]">무엇을 보낼까요?</h2>
              <span className="text-[12px] sm:text-sm text-[var(--muted)]">눌러서 메뉴 보기</span>
            </div>
            <div className="mt-3 grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSheetKey(c.key)}
                  aria-haspopup="dialog"
                  className="group flex flex-col items-center rounded-3xl bg-white border-2 border-[var(--ink)] p-2 pt-3 sm:p-4 shadow-[0_4px_0_var(--ink)] hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-[0_2px_0_var(--ink)] transition"
                >
                  <span className="relative w-[60px] h-[60px] sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-[var(--orange)]/25 group-hover:ring-[var(--orange)] transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${c.items[0].folder}/${c.items[0].name}.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <span className="font-display mt-1.5 sm:mt-3 text-[16px] sm:text-xl text-[var(--ink)] leading-tight break-keep">
                    {c.name}
                  </span>
                  <span className="mt-0.5 text-[10.5px] sm:text-xs font-bold text-[var(--orange-deep)] tabular-nums">
                    {won(minPrice(c))}~
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 배달 진행 단계 타임라인 */}
        <section id="steps" className="bg-black text-white py-14 sm:py-24 px-4 sm:px-6 scroll-mt-[72px]">
          <div className="max-w-6xl mx-auto">
            <p className="text-[var(--orange)] font-bold text-xs sm:text-sm tracking-[0.2em]">HOW IT WORKS</p>
            <h2 className="font-display mt-1 text-3xl sm:text-5xl break-keep">
              주문부터 도착까지 <span className="text-[var(--orange)]">4단계</span>
            </h2>

            {/* 달리는 스쿠터 도로 */}
            <div className="relative mt-8 sm:mt-12 h-16 sm:h-20" aria-hidden="true">
              <div className="absolute left-0 right-0 bottom-2 border-t-4 border-dashed border-white/25" />
              <div className="absolute bottom-3 ride">
                <Scooter className="w-16 sm:w-20" />
              </div>
            </div>

            <ol className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {STEPS.map((s, i) => (
                <li key={s.t} className="relative rounded-3xl bg-white/[0.07] border border-white/10 p-4 sm:p-6">
                  <span className="absolute top-3 right-4 font-display text-3xl sm:text-4xl text-[var(--orange)]/80 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="block w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2">{STEP_ICONS[i]}</span>
                  <h3 className="font-display mt-3 text-xl sm:text-2xl">{s.t}</h3>
                  <p className="mt-0.5 text-[13px] sm:text-sm text-white/60 break-keep">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 서비스 소개 */}
        <section id="why" className="py-14 sm:py-24 px-4 sm:px-6 scroll-mt-[72px] bg-[var(--soft)]">
          <div className="max-w-6xl mx-auto">
            <p className="text-[var(--orange-deep)] font-bold text-xs sm:text-sm tracking-[0.2em]">WHY O-GOOD CALL</p>
            <h2 className="font-display mt-1 text-3xl sm:text-5xl text-[var(--ink)] break-keep">
              빠르게, 전국으로, 예쁘게
            </h2>
            <div className="mt-8 grid md:grid-cols-3 gap-4 sm:gap-6">
              {FEATURES.map((f, i) => (
                <div
                  key={f.t}
                  className="rounded-[2rem] bg-white border-2 border-[var(--ink)] p-6 sm:p-8 shadow-[0_6px_0_var(--ink)]"
                >
                  <span
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[var(--ink)] font-display text-2xl ${FEATURE_EMOJI_BG[i]} ${i === 0 ? "text-white" : "text-[var(--ink)]"}`}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-2xl sm:text-3xl text-[var(--ink)]">{f.t}</h3>
                  <p className="mt-2 text-[15px] text-[var(--muted)] break-keep">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 후기 — 채팅 말풍선 */}
        <section id="reviews" className="py-14 sm:py-24 px-4 sm:px-6 scroll-mt-[72px]">
          <div className="max-w-6xl mx-auto">
            <p className="text-[var(--orange-deep)] font-bold text-xs sm:text-sm tracking-[0.2em]">REVIEWS</p>
            <h2 className="font-display mt-1 text-3xl sm:text-5xl text-[var(--ink)] break-keep">
              받으신 분도, 보내신 분도 <span className="text-[var(--orange)]">굿!</span>
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <figure key={r.name} className="flex gap-3">
                  <span
                    className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-display text-lg ${
                      i % 3 === 0 ? "bg-[var(--orange)] text-white" : i % 3 === 1 ? "bg-black text-white" : "bg-[#ffd23f] text-black"
                    }`}
                    aria-hidden="true"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <figcaption className="text-[12px] font-bold text-[var(--muted)]">
                      {r.name} 고객님 <span className="text-[var(--orange)] ml-1" aria-label="별점 5점">★★★★★</span>
                    </figcaption>
                    <div className="mt-1 rounded-3xl rounded-tl-md bg-[var(--soft)] px-4 py-3.5">
                      <h3 className="font-bold text-[15px] text-[var(--ink)] break-keep">{r.title}</h3>
                      <blockquote className="mt-1 text-sm text-[var(--muted)] leading-relaxed break-keep">{r.body}</blockquote>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 주문 전화 */}
        <section id="call" className="px-4 sm:px-6 pb-14 sm:pb-24 scroll-mt-[72px]">
          <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-[var(--orange)] text-white px-5 py-10 sm:p-16 relative overflow-hidden">
            <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full border-[16px] border-white/15" aria-hidden="true" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl sm:text-5xl leading-tight break-keep">
                  고민될 땐
                  <br />
                  <span className="text-black">전화 한 통!</span>
                </h2>
                <p className="mt-3 text-[15px] sm:text-lg text-white/90 break-keep">
                  상담사가 상품 선택부터 배송까지 바로 도와드려요. 365일 상담, 전국 배송(도서·산간 일부 제외).
                </p>
              </div>
              <a
                href={tel}
                className="flex items-center gap-4 h-20 sm:h-24 pl-3 pr-6 rounded-full bg-black text-white shadow-[0_6px_0_rgba(0,0,0,.35)] active:translate-y-[3px] transition"
              >
                <span className="w-14 h-14 sm:w-[72px] sm:h-[72px] shrink-0 rounded-full bg-[var(--orange)] flex items-center justify-center">
                  <PhoneIcon className="w-7 h-7" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs sm:text-sm text-white/60 font-bold">누르면 바로 연결</span>
                  <span className="font-display block text-[28px] sm:text-[40px] leading-none tabular-nums">{SITE.phone}</span>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 플로팅 원탭 콜 */}
      <a
        href={tel}
        aria-label={`${SITE.phone} 전화 주문`}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 h-14 sm:h-16 pl-1.5 pr-5 rounded-full bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,.3)] active:scale-95 transition"
      >
        <span className="relative w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full bg-[var(--orange)] flex items-center justify-center">
          <span className="absolute inset-0 rounded-full ring-pulse" aria-hidden="true" />
          <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </span>
        <span className="font-display text-lg sm:text-xl tabular-nums">{SITE.phone}</span>
      </a>

      {/* 푸터 */}
      <footer className="bg-black text-white/70 pt-12 pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-6">
          {SITE.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={SITE.logo} alt={SITE.name} className="w-28 h-28 rounded-3xl bg-white p-1.5 object-contain" />
          ) : null}
          <div className="flex-1">
            <p className="font-display text-2xl text-white">{SITE.name}</p>
            <p className="mt-1 text-sm break-keep">축하화환 · 근조화환 · 꽃다발 · 꽃바구니 · 관엽화분 · 난 · 전국 당일배송</p>
            <a
              href={tel}
              className="mt-3 inline-flex items-center gap-2 h-12 px-5 rounded-full bg-[var(--orange)] text-white font-display text-xl tabular-nums"
            >
              <PhoneIcon className="w-5 h-5" />
              {SITE.phone}
            </a>
            <p className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 카테고리 → 바텀시트(모바일) / 모달(데스크톱) */}
      {sheet && (
        <div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6 bg-black/55 anim-fade"
          onClick={() => setSheetKey(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            inert={notice ? true : undefined}
            className="anim-sheet w-full md:max-w-3xl max-h-[86dvh] md:max-h-[85vh] flex flex-col bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:hidden flex justify-center pt-2.5" aria-hidden="true">
              <span className="w-12 h-1.5 rounded-full bg-black/15" />
            </div>
            <div className="flex items-start justify-between gap-3 px-5 sm:px-7 pt-3 md:pt-6">
              <div className="min-w-0">
                <h2 id="sheet-title" className="font-display text-[28px] sm:text-4xl text-[var(--ink)] leading-tight">
                  {sheet.name}
                </h2>
                <p className="text-[13px] sm:text-sm text-[var(--muted)] break-keep">
                  {sheet.desc} · {sheet.items.length}종
                </p>
              </div>
              <button
                onClick={() => setSheetKey(null)}
                aria-label="목록 닫기"
                className="w-11 h-11 shrink-0 rounded-full bg-[var(--soft)] flex items-center justify-center text-lg font-bold text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            {/* 카테고리 칩 — 시트 안에서 바로 전환 */}
            <div className="mt-3 overflow-x-auto no-scrollbar">
              <div className="flex gap-1.5 px-5 sm:px-7 pb-1 min-w-max">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSheetKey(c.key)}
                    aria-pressed={c.key === sheet.key}
                    className={`h-11 px-4 rounded-full text-[14px] font-bold whitespace-nowrap transition ${
                      c.key === sheet.key ? "bg-black text-white" : "bg-[var(--soft)] text-[var(--ink)]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <ul className="mt-2 flex-1 overflow-y-auto overscroll-contain px-3 sm:px-5 pb-[max(1rem,env(safe-area-inset-bottom))] grid md:grid-cols-2 gap-1 content-start">
              {sheet.items.map((it) => (
                <li key={`${it.folder}-${it.name}`}>
                  <button
                    onClick={() => setNotice(it)}
                    className="w-full flex items-center gap-3 p-2 rounded-3xl text-left hover:bg-[var(--soft)] active:bg-[var(--soft)] transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${it.folder}/${it.name}.jpg`}
                      alt={it.name}
                      loading="lazy"
                      className="w-[76px] h-[76px] sm:w-24 sm:h-24 shrink-0 rounded-2xl object-cover bg-[var(--soft)]"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[15px] font-bold text-[var(--ink)] break-keep leading-snug">{it.name}</span>
                      <span className="block mt-1 font-display text-xl text-[var(--orange-deep)] tabular-nums">
                        {won(it.price)}~
                      </span>
                    </span>
                    <span className="w-11 h-11 shrink-0 rounded-full bg-[var(--orange)] text-white flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 상품 클릭 → 금액 안내 팝업 → 전화 연결 (바텀시트 위에 겹쳐 뜸) */}
      {notice && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5 bg-black/50 anim-fade"
          onClick={() => setNotice(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            aria-describedby="notice-desc"
            className="anim-pop w-full max-w-[360px] bg-white rounded-[2rem] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto w-16 h-16 rounded-full bg-[var(--orange)]/12 flex items-center justify-center">
              <Scooter className="w-12" />
            </span>
            <h3 id="notice-title" className="font-display mt-3 text-2xl text-[var(--ink)] break-keep">
              {notice.name}
            </h3>
            <p id="notice-desc" className="mt-3 rounded-2xl bg-[var(--soft)] px-4 py-3 text-[15px] leading-relaxed text-[var(--ink)] break-keep">
              {SITE.priceNotice}
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              대표번호 <span className="font-bold text-[var(--ink)] tabular-nums">{SITE.phone}</span>
            </p>
            <div className="mt-5 grid grid-cols-[1fr_1.6fr] gap-2">
              <button
                onClick={() => setNotice(null)}
                className="h-14 rounded-full bg-[var(--soft)] text-[15px] font-bold text-[var(--muted)]"
              >
                취소
              </button>
              <a
                href={tel}
                onClick={() => setNotice(null)}
                autoFocus
                className="h-14 rounded-full bg-[var(--orange)] text-white text-[16px] font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_0_var(--orange-deep)] active:translate-y-[2px]"
              >
                <PhoneIcon className="w-5 h-5" />
                전화 연결
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
