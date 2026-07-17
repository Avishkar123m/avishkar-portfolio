(function () {
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
    });
  }

  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    var onScroll = function () {
      backToTop.style.display = window.scrollY > 480 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('static-export-nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
      });
    });
  }

  // --- Toast helper (used by the Share button's clipboard fallback) ---
  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('static-export-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'static-export-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  // --- Hero: Download Resume ---
  // Downloads the resume file bundled inside THIS portfolio's own folder
  // (relative path, resolved against wherever the site is actually hosted)
  // — never the portfolio generator's source code.
  var resumeFileName = "Avishkar_Mandhare_Resume_260712_022225 (2).docx";
  var downloadResumeBtn = document.getElementById('hero-download-resume');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', function () {
      if (!resumeFileName) {
        showToast('Original resume file is not available for download.');
        return;
      }
      var link = document.createElement('a');
      link.href = resumeFileName;
      link.download = resumeFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  // --- Hero: Contact ---
  var contactBtn = document.getElementById('hero-contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      var target = document.getElementById('contact');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // --- Hero: Share Portfolio ---
  // window.location.href always reflects wherever this static site is
  // actually being served from (the live Vercel URL once deployed), so
  // this never shares a localhost/dev URL.
  var shareBtn = document.getElementById('hero-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var url = window.location.href;
      var title = document.title;

      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {
          /* user cancelled the native share sheet — no action needed */
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(url)
          .then(function () {
            showToast('Portfolio link copied to clipboard!');
          })
          .catch(function () {
            showToast('Could not copy link.');
          });
        return;
      }

      // Very old browsers without the Clipboard API.
      try {
        var textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('Portfolio link copied to clipboard!');
      } catch (e) {
        showToast('Could not copy link.');
      }
    });
  }
})();
