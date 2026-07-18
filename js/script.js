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

  // --- Document Preview Modal ---
  function openPreviewModal(fileUrl, fileName) {
    const existingModal = document.getElementById('static-export-preview-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const isPdf = fileUrl.startsWith('data:application/pdf') || fileName.toLowerCase().endsWith('.pdf');
    
    // Choose appropriate SVG icon (using standard SVG markup)
    const fileIcon = isPdf 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ef4444; margin-right: 0.5rem; flex-shrink: 0;"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M9 11h6"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6; margin-right: 0.5rem; flex-shrink: 0;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

    const modal = document.createElement('div');
    modal.id = 'static-export-preview-modal';
    modal.className = 'preview-modal-backdrop';
    
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'preview-modal-wrapper';
    
    let contentHtml = '';
    if (isPdf) {
      contentHtml = `<iframe src="${fileUrl}" title="${fileName}"></iframe>`;
    } else {
      contentHtml = `
        <div class="preview-modal-image-container">
          <img src="${fileUrl}" alt="${fileName}" class="preview-modal-image" />
        </div>
      `;
    }

    modalWrapper.innerHTML = `
      <div class="preview-modal-header">
        <div class="preview-modal-title-container">
          ${fileIcon}
          <h3 class="preview-modal-title">${fileName}</h3>
        </div>
        <button id="close-preview-modal" class="preview-modal-close-btn" aria-label="Close preview">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="preview-modal-content">
        ${contentHtml}
      </div>
    `;

    modal.appendChild(modalWrapper);
    document.body.appendChild(modal);
    
    // Disable main page scrolling and handle scrollbar layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }

    // Trigger transition animation
    requestAnimationFrame(function () {
      modal.classList.add('is-visible');
    });

    const closeModal = function () {
      modal.classList.remove('is-visible');
      setTimeout(function () {
        modal.remove();
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 300);
      document.removeEventListener('keydown', handleKeyDown);
    };

    modal.querySelector('#close-preview-modal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside content wrapper
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    const handleKeyDown = function (e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
  }

  // Handle all document "View" button clicks across the page (Certificates, Marksheets, Awards, etc.)
  document.body.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('button');
    if (viewBtn && viewBtn.textContent.trim().includes('View')) {
      const card = viewBtn.closest('.glass') || viewBtn.parentElement.parentElement.parentElement;
      if (!card) return;

      const downloadLink = card.querySelector('a[download]');
      if (!downloadLink) return;

      const fileUrl = downloadLink.getAttribute('href');
      const fileName = downloadLink.getAttribute('download') || 'document';

      if (fileUrl) {
        e.preventDefault();
        openPreviewModal(fileUrl, fileName);
      }
    }
  });
})();
