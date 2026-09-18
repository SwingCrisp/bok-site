// 관리자 시안 공용: 저장소(브라우저 localStorage, 시연용), 상태 계산, 메뉴, 토스트
window.ADMIN = (() => {
  const KEY = "bok-admin-v1";
  const TODAY = "2026-09-18"; // 시안 기준일 (실제 구현은 서버 시각)
  const seed = () => {
    const D = window.BOK;
    const programs = [...D.programs, ...D.past].map((p, i) => ({
      id: p.id, type: p.type, org: p.org, title: p.title, venue: p.place, start: p.start, end: p.end || "", time: (p.dateText.match(/\d{1,2}:\d{2}/) || [""])[0],
      rating: p.rating || "", price: p.status === "무료" ? "무료" : "", poster: "../" + p.img, host: "", contact: "",
      booking: p.book ? [{ label: "NOL티켓", url: p.book }] : [], bookingOpenAt: p.book ? "2026-09-01T10:00" : "", manualStatus: "", publishAt: "", draft: false, body: "", updated: "2026-09-1" + (i % 8 + 1),
    }));
    const notices = D.notices.map((n) => ({ id: "n" + n.id, title: n.title, category: n.tag, date: n.date || "2026-09-10", pinned: !!n.pin, body: "", draft: false }));
    const inquiries = [
      { id: "q1", at: "2026-09-17 14:20", space: "공연장", d1: "2026-11-14", d2: "2026-11-21", type: "클래식·연주회", ppl: 180, org: "세종챔버앙상블", name: "김OO", tel: "010-****-1234", email: "ex@example.com", msg: "리허설 전날 필요, 현장 청음 희망", state: "새 문의" },
      { id: "q2", at: "2026-09-15 09:02", space: "갤러리", d1: "2027-03-02", d2: "", type: "전시", ppl: 0, org: "", name: "이OO", tel: "010-****-5678", email: "ex2@example.com", msg: "개인전 1주, 오프닝 행사 문의", state: "답변 완료" },
    ];
    return { programs, notices, inquiries, settings: { phone: "1877-4955", hallPhone: "044-868-3960", galleryPhone: "044-868-3962", email: "bokartcenter1@naver.com", galleryHours: "화–일 10:00–19:00 · 월요일 휴관", banner: "" } };
  };
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { db = null; }
  if (!db) { db = seed(); try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };
  const reset = () => { try { localStorage.removeItem(KEY); } catch {} location.reload(); };
  // 사용자에게 보이는 상태 (기준서 규칙): 취소·연기 → 종료 → 매진 → 예매중/접수중/전시중 → 무료 → 예정. 임시저장·예약은 관리 상태.
  const status = (p, now = TODAY) => {
    if (p.draft) return "임시저장";
    if (p.publishAt && p.publishAt.slice(0, 10) > now) return "예약";
    if (p.manualStatus === "취소" || p.manualStatus === "연기") return p.manualStatus;
    const end = p.end || p.start;
    if (end && end < now) return "종료";
    if (p.manualStatus === "매진") return "매진";
    if (p.type === "전시" && p.start <= now && end >= now) return "전시중";
    if (p.booking && p.booking.length && (!p.bookingOpenAt || p.bookingOpenAt.slice(0, 10) <= now)) return p.type === "교육" ? "접수중" : "예매중";
    if (/무료/.test(p.price || "")) return "무료";
    return "예정";
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toast = (m) => { let t = document.querySelector(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); } t.textContent = m; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2200); };
  const uid = (pre) => pre + Math.random().toString(36).slice(2, 7);
  const nav = (cur) => {
    const newQ = db.inquiries.filter((q) => q.state === "새 문의").length;
    const items = [["대시보드", "index.html"], ["프로그램", "programs.html"], ["소식", "notices.html"], ["대관 문의", "inquiries.html", newQ], ["공간", "spaces.html"], ["설정", "settings.html"]];
    return `<aside class="side"><div class="logo"><b>BOK</b><span>ART CENTER</span><small>관리자 (시안)</small></div>
      ${items.map(([t, h, n]) => `<a href="${h}"${t === cur ? ' aria-current="page"' : ""}>${t}${n ? `<span class="n">${n}</span>` : ""}</a>`).join("")}
      <div class="sep"></div><a href="../index.html" target="_blank">공개 사이트 보기 ↗</a><a href="#" id="reset-demo">시연 데이터 초기화</a>
      <div class="me"><b>갤러리 담당</b>staff@bokartcenter · 편집자</div></aside>`;
  };
  document.addEventListener("click", (e) => { if (e.target.closest("#reset-demo")) { e.preventDefault(); if (confirm("시연 데이터를 처음 상태로 되돌릴까요?")) reset(); } });
  return { db, save, status, esc, toast, uid, nav, TODAY };
})();
