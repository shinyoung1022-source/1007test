/* =====================================================================
   화순 가을꽃박람회  |  js/main.js
   [수정 가이드]
   · 공연 일정 수정 → 아래 PERFORMANCES 배열
   · 슬라이드 속도  → HERO_INTERVAL (밀리초)
   · 각 기능은 "기능 N" 블록으로 나뉘어 있어 필요 없는 블록은 삭제해도 됩니다.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 설정값 ---------- */
  var HERO_INTERVAL = 5000; // 메인 이미지 자동 전환 간격 (5초)

  /* 공연 데이터 (예시) : 날짜별 공연 목록.
     image 는 교체 가능한 이미지 주소입니다. */
  var PERFORMANCES = [
    { date: '10.09', day: '금', shows: [
      { time: '14:00', title: '개막 축하 공연', place: '메인 무대', desc: '국악 앙상블과 함께하는 개막 퍼포먼스', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=60' },
      { time: '16:00', title: '클래식 소공연', place: '꽃정원 정자', desc: '현악 4중주와 함께하는 오후', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=60' }
    ]},
    { date: '10.10', day: '토', shows: [
      { time: '11:00', title: '시니어 모델 패션쇼', place: '메인 무대', desc: '시니어패션모델 야외 공연', image: 'imgs/시니어.jfif' },
      { time: '15:00', title: '어쿠스틱 버스킹', place: '피크닉 잔디마당', desc: '지역 청년 뮤지션의 야외 공연',image: 'imgs/버스킹2.jfif ' },
      { time: '19:00', title: '야간 인디 콘서트', place: '메인 무대', desc: '인디 밴드 3팀이 함께하는 저녁 무대', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=60' }
    ]},
    { date: '10.11', day: '일', shows: [
      { time: '13:00', title: '어린이 랜덤플레이댄스', place: '체험 마당', desc: '온 가족이 함께 보는 가을 동화', image: 'imgs/랜덤.jfif' },
      { time: '18:30', title: '가을 밤 불꽃 쇼', place: '메인 무대', desc: '꽃정원 위로 펼쳐지는 폐막 불꽃', image: 'imgs/폐막풍경.jfif' }
    ]}
  ];

  /* 이미지 로딩 실패 시 대체 처리 : 깨진 이미지 대신 가을색 배경을 보여줍니다. */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#c8643c"/><circle cx="640" cy="130" r="70" fill="#e0a526"/></svg>');
  document.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG' && e.target.src !== FALLBACK) { e.target.src = FALLBACK; }
  }, true); // 캡처링 단계에서 모든 img 오류를 한 번에 처리

  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); };

  /* ---------- 기능 1. 헤더: 스크롤 시 배경 적용 + 모바일 메뉴 + 현재 위치 표시 ---------- */
  var header = $('#header');
  var menuBtn = $('#menuToggle');
  var navLinks = $$('.gnb a');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40); // 40px 이상 내려가면 배경 표시
    // 스크롤 위치에 해당하는 메뉴 강조 (scroll-spy)
    var pos = window.scrollY + header.offsetHeight + 80, current = '';
    $$('main section[id]').forEach(function (sec) { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
  navLinks.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); }); // 메뉴 선택 시 닫기

  /* ---------- 기능 2. 히어로 이미지 자동 전환 + 점 버튼 ---------- */
  var slides = $$('.hero-slide');
  var dotsBox = $('#heroDots');
  var idx = 0, timer;

  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', (i + 1) + '번째 이미지');
    b.addEventListener('click', function () { show(i); start(); }); // 클릭 시 이동 후 타이머 재시작
    dotsBox.appendChild(b);
  });
  var dots = $$('button', dotsBox);

  function show(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
  }
  function start() { clearInterval(timer); timer = setInterval(function () { show(idx + 1); }, HERO_INTERVAL); }
  show(0); start();

  /* ---------- 기능 3. 주요행사 카드: 터치 기기에서는 탭하면 상세 표시 ---------- */
  $$('.event-card').forEach(function (card) {
    card.addEventListener('click', function () { card.classList.toggle('is-open'); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter') { card.classList.toggle('is-open'); } });
  });

  /* ---------- 기능 4. 공연정보: 날짜 탭 → 해당 날짜의 타임라인 렌더링 ---------- */
  var tabBox = $('#dateTabs');
  var timeline = $('#timeline');

  function renderShows(i) {
    var d = PERFORMANCES[i];
    timeline.innerHTML = d.shows.map(function (s) {
      return '<li class="tl-item"><img src="' + s.image + '" alt="' + s.title + '" loading="lazy">' +
        '<div><p class="tl-time">' + s.time + ' · ' + s.place + '</p><h3>' + s.title + '</h3><p>' + s.desc + '</p></div></li>';
    }).join('');
    $$('button', tabBox).forEach(function (b, n) {
      b.classList.toggle('is-active', n === i);
      b.setAttribute('aria-selected', n === i);
    });
  }
  PERFORMANCES.forEach(function (d, i) {
    var b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.innerHTML = d.date + '<small>' + d.day + '</small>';
    b.addEventListener('click', function () { renderShows(i); });
    tabBox.appendChild(b);
  });
  renderShows(0);

  /* ---------- 기능 5. 오시는길: 교통정보 탭 전환 ---------- */
  var tpTabs = $$('.transport-tabs button');
  tpTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tpTabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
      $$('.transport-panel').forEach(function (p) { p.classList.toggle('is-active', p.id === tab.dataset.target); });
    });
  });
  /* (지도 확대·축소는 지도 iframe 자체 기능을 사용합니다.) */

  /* ---------- 기능 6. FAQ 아코디언: 하나 열면 나머지는 닫힘 ---------- */
  var faqItems = $$('.faq-item');
  faqItems.forEach(function (item) {
    var q = $('.faq-q', item), a = $('.faq-a', item);
    q.addEventListener('click', function () {
      var willOpen = q.getAttribute('aria-expanded') !== 'true';
      faqItems.forEach(function (o) { // 모두 닫기
        $('.faq-q', o).setAttribute('aria-expanded', 'false');
        $('.faq-a', o).style.maxHeight = null;
      });
      if (willOpen) { // 선택한 항목만 열기 (내용 높이만큼 펼침)
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 기능 7. 푸터 연도 자동 표시 ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
