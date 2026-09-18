// 시안 공용: 헤더·푸터 삽입, 등장 모션. 실제 구현에서는 프레임워크의 레이아웃 컴포넌트가 된다.
(function () {
  const cur = document.body.dataset.nav || "";
  const over = document.body.dataset.header === "over"; // 히어로 위에 겹치는 투명 헤더
  const items = [["프로그램", "programs.html"], ["방문 안내", "visit.html"], ["공간·대관", "space-hall.html"], ["소식", "notices.html"], ["센터 소개", "about.html"]];
  const links = (li) => items.map(([t, h]) => (li ? "<li>" : "") + `<a href="${h}"${t === cur ? ' aria-current="page"' : ""}>${t}</a>` + (li ? "</li>" : "")).join("");
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">본문 바로가기</a>
<header class="site${over ? " over" : ""}"><div class="wrap bar">
  <a class="logo" href="index.html" aria-label="비오케이아트센터 홈"><b>BOK</b><span>ART CENTER</span></a>
  <nav aria-label="주 메뉴"><ul>${links(true)}</ul>
  <details class="m"><summary>메뉴</summary><div class="sheet">${links(false)}</div></details></nav>
</div></header>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="site"><div class="wrap">
  <div class="cols">
    <div class="brand"><a class="logo" href="index.html"><b>BOK</b><span>ART CENTER</span></a><p>세종특별자치시 국책연구원3로 12, 6층<br>대표 1877-4955 · 공연장 대관 044-868-3960 · 갤러리 044-868-3962<br>bokartcenter1@naver.com</p></div>
    <div><h4>프로그램</h4><ul><li><a href="programs.html">공연</a></li><li><a href="programs.html">전시</a></li><li><a href="programs.html?view=cal">전체 일정</a></li><li><a href="programs.html#past">지난 프로그램</a></li></ul></div>
    <div><h4>방문 안내</h4><ul><li><a href="visit.html">오시는 길·주차</a></li><li><a href="visit.html#hours">운영 시간</a></li><li><a href="visit.html#access">접근성</a></li><li><a href="visit.html#floors">층별 안내</a></li></ul></div>
    <div><h4>공간·대관</h4><ul><li><a href="space-hall.html">공연장</a></li><li><a href="space-gallery.html">갤러리</a></li><li><a href="rental.html#steps">대관 절차·요금</a></li><li><a href="rental.html">대관 문의</a></li></ul></div>
    <div><h4>센터</h4><ul><li><a href="about.html">소개·인사말</a></li><li><a href="notices.html">공지사항</a></li><li><a href="about.html#contact">부서별 연락처</a></li><li><a href="#">개인정보처리방침</a></li></ul></div>
  </div>
  <div class="legal"><span>© (주)비오케이아트 · 비오케이아트센터 · 통신판매업신고 제2019-세종-0262호</span><span>제목 글꼴: 네이버에서 제공한 마루 부리 · 디자인 시안 A · <button type="button" id="viewmode" class="linkbtn"></button></span></div>
</div></footer>`);
  // 보기 방식 전환: 휴대폰에서는 "PC 버전으로 보기"(뷰포트를 1280px로 고정), PC에서는 좁은 창으로 "모바일 화면으로 보기".
  {
    const vp = document.querySelector('meta[name="viewport"]'), btn = document.getElementById("viewmode");
    const get = () => { try { return localStorage.getItem("bok-view") } catch { return null } };
    const set = (v) => { try { v ? localStorage.setItem("bok-view", v) : localStorage.removeItem("bok-view") } catch {} };
    const phone = navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) < 900;
    const apply = () => {
      const pc = get() === "pc";
      if (vp) vp.setAttribute("content", pc && phone ? "width=1280" : "width=device-width, initial-scale=1, viewport-fit=cover");
      if (btn) btn.textContent = phone ? (pc ? "모바일 버전으로 보기" : "PC 버전으로 보기") : "모바일 화면으로 보기";
    };
    if (btn) btn.onclick = () => {
      if (phone) { set(get() === "pc" ? null : "pc"); apply(); scrollTo(0, 0); }
      else window.open(location.href, "bok-mobile", "width=430,height=860,resizable=yes,scrollbars=yes");
    };
    apply();
  }
  // 무대 조명: 스크롤 진행에 따라 따뜻한 빛은 왼쪽 위→오른쪽 아래로, 커튼빛은 반대로. 마우스는 아주 살짝만.
  const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (!still) {
    const root = document.documentElement; let mx = 0, my = 0, raf = 0;
    const paint = () => { raf = 0; const max = Math.max(1, root.scrollHeight - innerHeight), p = Math.min(1, scrollY / max);
      root.style.setProperty("--lx", (18 + p * 60 + mx * 4).toFixed(1) + "%"); root.style.setProperty("--ly", (6 + p * 80 + my * 4).toFixed(1) + "%");
      root.style.setProperty("--vx", (92 - p * 70).toFixed(1) + "%"); root.style.setProperty("--vy", (100 - p * 60).toFixed(1) + "%"); };
    const ask = () => { if (!raf) raf = document.hidden ? setTimeout(paint, 16) : requestAnimationFrame(paint); };
    addEventListener("scroll", ask, { passive: true }); addEventListener("resize", ask);
    addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; ask(); }, { passive: true });
    paint();
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.06 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
})();
