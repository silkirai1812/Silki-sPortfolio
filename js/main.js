document.addEventListener("DOMContentLoaded", function () {
  
  /* ----------- Project Tabs Filtering ----------- */
  const tabs = document.querySelectorAll(".tab");
  const projects = document.querySelectorAll(".project-card");

  // Show all projects initially
  projects.forEach(project => project.classList.add("show"));

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;

      projects.forEach(project => {
        const match = category === "all" || project.dataset.category === category;
        project.classList.toggle("show", match);
        project.classList.toggle("hide", !match);
      });
    });
  });

  /* ----------- Intersection Observer for Scroll Animations ----------- */
  const revealElements = document.querySelectorAll('.timeline-item, .project-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // Theme toggle removed (single theme)

  /* ----------- Scroll to Top Button ----------- */
  const scrollBtn = document.getElementById("scrollTopBtn");
  let scrollTimeout;

  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollBtn.style.display = window.scrollY > 150 ? "block" : "none";
    }, 100);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------- Typing Animation (Reusable) ----------- */
  function initTypewriter(selector, texts) {
    const el = document.querySelector(selector);
    if (!el || !texts || !texts.length) return;
    let i = 0, j = 0, isDeleting = false;
    function tick() {
      const word = texts[i];
      const next = isDeleting ? word.substring(0, j--) : word.substring(0, j++);
      el.textContent = next;
      let timeout = isDeleting ? 50 : 100;
      if (!isDeleting && j === word.length + 1) { timeout = 900; isDeleting = true; }
      else if (isDeleting && j === 0) { isDeleting = false; i = (i + 1) % texts.length; }
      setTimeout(tick, timeout);
    }
    tick();
  }

  // Hero typing
  initTypewriter('.typing:not(.typing-projects)', ["Full Stack Developer", "ML Enthusiast", "Aspiring Software Developer"]);
  // Projects heading typing
  const projEl = document.querySelector('.typing-projects');
  if (projEl) {
    const data = projEl.getAttribute('data-texts');
    try {
      const texts = JSON.parse(data);
      initTypewriter('.typing-projects', Array.isArray(texts) && texts.length ? texts : ["Projects"]);
    } catch { initTypewriter('.typing-projects', ["Projects"]); }
  }

  /* ----------- Mobile Navbar Toggle ----------- */
  // const menuToggle = document.querySelector('.menu-toggle');
  // const navLinks = document.querySelector('.nav-links');

  // menuToggle?.addEventListener('click', () => {
  //   navLinks.classList.toggle('active');
  // });

  /* ----------- Mobile Navbar Toggle + auto-collapse on click ----------- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function collapseMobileMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('active');
  if (menuToggle) {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// keep original toggle behavior but add aria + open class
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Collapse menu when any nav item is clicked (anchors or .nav-btn)
  const navItems = navLinks.querySelectorAll('a[href^="#"], button.nav-btn[data-target]');
  navItems.forEach(item => {
    item.addEventListener('click', (ev) => {
      // Smooth-scroll for in-page anchors / buttons (keeps current behavior)
      if (item.tagName.toLowerCase() === 'a') {
        const href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            ev.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else if (item.matches('button.nav-btn')) {
        const selector = item.dataset.target;
        if (selector) {
          const target = document.querySelector(selector);
          if (target) {
            ev.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }

      // collapse only on small screens
      if (window.innerWidth <= 768) {
        // small delay so scroll starts before collapse — remove setTimeout for immediate collapse
        setTimeout(() => collapseMobileMenu(), 60);
      }
    });
  });

  // ensure menu closes when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) collapseMobileMenu();
  });
}


});
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
});


// contact
const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("success-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Send to Formspree
    const response = await fetch("https://formspree.io/f/movrdopy", {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      // Show success message
      successMsg.style.display = "block";

      // Clear form
      form.reset();

      // Hide message after 3 seconds
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    } else {
      alert("Something went wrong. Try again!");
    }
  });