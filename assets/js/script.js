(function () {
  "use strict";

  /* Page load animation */
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("is-loaded");
  });

  /* Avatar — try jpg/webp if png missing */
  const avatar = document.getElementById("avatarImg");
  if (avatar) {
    avatar.addEventListener("error", function onErr() {
      const src = this.getAttribute("src") || "";
      if (src.endsWith(".png")) {
        this.src = "assets/avatar.jpg";
      } else if (src.endsWith(".jpg")) {
        this.src = "assets/avatar.webp";
      } else {
        this.removeEventListener("error", onErr);
      }
    });
  }

  /* Register GSAP ScrollTrigger */
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Initialize Lenis Smooth Scroll */
  const lenis = new Lenis({
    duration: 2.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo easing
    smooth: !prefersReducedMotion,
  });

  // Sync ScrollTrigger with Lenis
  lenis.on("scroll", ScrollTrigger.update);

  // Sync Lenis scroll updates with GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* Smooth scroll for all anchor links using Lenis */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (id === "#contact") {
          lenis.scrollTo("bottom");
        } else {
          lenis.scrollTo(target);
        }
      }
    });
  });

  /* GSAP entrance & scroll animations */
  if (prefersReducedMotion) {
    // Instantly reveal elements if motion is reduced
    gsap.set(".hero__title .line, .hero__cta", { opacity: 1, y: 0 });
  } else {
    // Navbar load animation
    gsap.fromTo(".header__logo",
      { filter: "blur(15px)", opacity: 0 },
      { filter: "blur(0px)", opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.1 }
    );

    gsap.fromTo(".header__link",
      { scale: 0, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.4 }
    );

    gsap.fromTo(".theme-toggle",
      { scale: 0, opacity: 0, rotation: -90 },
      { 
        scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.5)", delay: 0.8,
        onComplete: () => gsap.set(".theme-toggle", { clearProps: "transform,scale,opacity,rotation" })
      }
    );

    // Hero load animation
    if (document.querySelector(".avatar-wrap")) {
      gsap.from(".avatar-wrap", {
        scale: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.2
      });
    }

    gsap.fromTo(".hero__title .line",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power4.out", delay: 0.4 }
    );

    // Apply blur reveal only to SEO and Social Media text
    gsap.fromTo(".hero__title .role, .hero__title .line--3 .highlight",
      { filter: "blur(15px)" },
      { filter: "blur(0px)", duration: 1.2, ease: "power3.out", delay: 0.5 }
    );

    gsap.fromTo(".hero__cta",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.8 }
    );

    // Services section cards reveal
    gsap.from("#services .card", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });

    // Tools section cards reveal (Whole card popup animation)
    gsap.from("#tools .tool-card", {
      scrollTrigger: {
        trigger: "#tools",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      scale: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "back.out(1.5)",
      onComplete: () => {
        // Clear GSAP properties once done to allow CSS hover transitions to work
        gsap.set("#tools .tool-card", { clearProps: "transform,scale,opacity" });
        const toolsSection = document.querySelector("#tools");
        if (toolsSection) {
          toolsSection.classList.add("js-reveal-complete");
        }
      }
    });

    // Experience section bento cards reveal
    gsap.from("#experience .xp-bento__card", {
      scrollTrigger: {
        trigger: "#experience .xp-bento",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });

    // Footer columns reveal
    gsap.from("#contact .footer-card__col", {
      scrollTrigger: {
        trigger: ".page-wrapper",
        start: "bottom bottom",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Section headers & subtitles reveal
    document.querySelectorAll(".section__title, .section__subtitle, .xp-head").forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  /* Header scroll styling transition (Frosted glass on scroll) */
  const header = document.getElementById("header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run initially in case page is refreshed while scrolled
  }

  /* Mobile navigation menu toggle */
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".header__nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const active = nav.classList.toggle("is-active");
      toggle.classList.toggle("is-active");
      toggle.setAttribute("aria-expanded", active);
      if (active) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close mobile overlay when clicking a navigation link
    nav.querySelectorAll(".header__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-active");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ScrollSpy - Highlight active section link in navbar */
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".header__link");
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", () => {
      let current = "";
      const scrollPos = window.scrollY + 140; // offset for sticky nav bar
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;

      if (isAtBottom) {
        current = sections[sections.length - 1].getAttribute("id");
      } else {
        sections.forEach((section) => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute("id");
          }
        });
      }

      navLinks.forEach((link) => {
        link.classList.remove("header__link--active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("header__link--active");
        }
      });
    });
  }

  /* Footer Reveal Animation */
  const footer = document.querySelector(".footer-card");
  const pageWrapper = document.querySelector(".page-wrapper");

  if (footer && pageWrapper && !prefersReducedMotion) {
    document.body.classList.add("has-footer-reveal");

    const updateFooterSpace = () => {
      const footerHeight = footer.offsetHeight;
      pageWrapper.style.marginBottom = `${footerHeight}px`;
    };

    // Calculate initial space and update on resize/load
    updateFooterSpace();
    window.addEventListener("resize", updateFooterSpace);
    window.addEventListener("load", updateFooterSpace);

    gsap.fromTo(footer,
      { yPercent: 35, opacity: 0.6 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".page-wrapper",
          start: "bottom bottom",
          end: () => `bottom+=${footer.offsetHeight} bottom`,
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );

    // Wordmark popup animation character by character
    const wordmark = document.querySelector(".footer-card__wordmark");
    if (wordmark) {
      const text = wordmark.textContent.trim();
      wordmark.innerHTML = text
        .split("")
        .map(char => `<span class="wordmark-char" style="display: inline-block;">${char}</span>`)
        .join("");

      gsap.fromTo(".wordmark-char",
        { y: "100%" },
        {
          y: "0",
          stagger: 0.05,
          duration: 1.0,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".page-wrapper",
            start: () => `bottom+=${footer.offsetHeight * 0.65} bottom`,
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true
          }
        }
      );
    }
  }

  /* ===== Day / Night Toggle with View Transitions ===== */
  const themeToggleBtn = document.getElementById("themeToggle");
  let isDark = false;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", (e) => {
      isDark = !isDark;

      // Fallback for browsers that don't support View Transitions
      if (!document.startViewTransition) {
        document.documentElement.classList.toggle("dark", isDark);
        return;
      }

      // Get click position for the center of the expanding circle
      const x = e.clientX ?? window.innerWidth;
      const y = e.clientY ?? 0;

      // Update CSS variables for the transition center
      document.documentElement.style.setProperty("--click-x", `${x}px`);
      document.documentElement.style.setProperty("--click-y", `${y}px`);

      // Start the native transition mask reveal
      document.startViewTransition(() => {
        document.documentElement.classList.toggle("dark", isDark);
      });
    });
  }

  /* ===== Cursor Blur Blob ===== */
  const blob = document.getElementById("cursorBlob");

  if (blob) {
    document.addEventListener("mousemove", (e) => {
      // 18px is half of the 36px width/height to center the ring exactly on the cursor
      blob.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      blob.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
      blob.style.opacity = "0";
    });
  }
})();
