(function () {
  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var yearEl = document.getElementById("year");
  var hero = document.querySelector(".hero");
  var typeEl = document.getElementById("typewriter-text");
  var loader = document.getElementById("page-loader");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var loaderStart = Date.now();
  var minLoaderMs = 900;
  var loaderFadeMs = 550;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (nav) nav.classList.toggle("is-open", open);
    if (header) header.classList.toggle("is-nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setNavOpen(false);
        }
      });
    });
  }

  function initHero() {
    if (hero && !prefersReducedMotion) {
      requestAnimationFrame(function () {
        hero.classList.add("hero--ready");
      });
    } else if (hero) {
      hero.classList.add("hero--ready");
    }
  }

  var scrollThreshold = 12;
  function onScroll() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > scrollThreshold);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function initSections() {
    var sections = document.querySelectorAll("main section.section");
    if (sections.length && !prefersReducedMotion) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("section--visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      sections.forEach(function (section) {
        observer.observe(section);
      });
    } else {
      sections.forEach(function (section) {
        section.classList.add("section--visible");
      });
    }
  }

  function initTypewriter() {
    var phrases = [
      "BCA student.",
      "MERN stack learner.",
      "Aspiring software developer.",
    ];

    if (typeEl && !prefersReducedMotion) {
      var pi = 0;
      var ci = 0;
      var deleting = false;
      var pause = 0;

      function tick() {
        var full = phrases[pi];
        if (pause > 0) {
          pause -= 1;
          return;
        }
        if (!deleting && ci <= full.length) {
          typeEl.textContent = full.slice(0, ci);
          ci += 1;
          if (ci > full.length) {
            pause = 18;
            deleting = true;
          }
        } else if (deleting) {
          ci -= 1;
          typeEl.textContent = full.slice(0, Math.max(0, ci));
          if (ci <= 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            ci = 0;
            pause = 8;
          }
        }
      }

      typeEl.textContent = "";
      setInterval(tick, 85);
    } else if (typeEl) {
      typeEl.textContent = "BCA student · MERN learner";
    }
  }

  function initPortfolio() {
    initHero();
    initSections();
    initTypewriter();
  }

  function hideLoader() {
    if (!loader || !document.body.classList.contains("is-loading")) {
      initPortfolio();
      return;
    }

    var elapsed = Date.now() - loaderStart;
    var waitExtra = Math.max(0, minLoaderMs - elapsed);

    setTimeout(function () {
      loader.classList.add("page-loader--done");
      loader.setAttribute("aria-busy", "false");
      document.body.classList.remove("is-loading");

      setTimeout(function () {
        if (loader.parentNode) {
          loader.remove();
        }
        initPortfolio();
      }, loaderFadeMs);
    }, waitExtra);
  }

  if (prefersReducedMotion) {
    if (loader) {
      loader.remove();
    }
    document.body.classList.remove("is-loading");
    initPortfolio();
  } else if (loader) {
    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
    }
  } else {
    document.body.classList.remove("is-loading");
    initPortfolio();
  }
})();
