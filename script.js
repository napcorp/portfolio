/* ==========================================================================
   PORTFOLIO SCRIPT — Theme Toggle + Navigation + Form Handler
   ========================================================================== */
// ---- THEME: Apply saved preference immediately (before page renders) -------
(function () {
  try {
    var saved = localStorage.getItem('portfolio-theme');
    // Default is light — only apply dark if explicitly saved
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) { }
})();
// ---- MAIN INIT -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  // Lucide Icons
  function initLucide() {
    if (window.lucide) {
      try { lucide.createIcons(); } catch (e) { }
    }
  }
  initLucide();
  window.addEventListener('load', initLucide);
  setTimeout(initLucide, 300);
  // ---- Theme Toggle --------------------------------------------------------
  var themeToggle = document.getElementById('theme-toggle');
  var mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light';
    }
    try { localStorage.setItem('portfolio-theme', theme); } catch (e) { }
  }
  function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  }
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  // ---- Active Nav Link Observer --------------------------------------------
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  function updateActiveLink() {
    var scrollY = window.scrollY;
    sections.forEach(function (section) {
      var top = section.offsetTop - 130;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href*="' + id + '"]');
      if (link && scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  // ---- Smooth Wheel Scroll Engine + Continuous Side Slide Interpolation ----
  var slideElements = document.querySelectorAll('.slide-left, .slide-right');

  // Linear interpolation helper
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Track target progress & current interpolated progress per element for butter-smooth motion
  var elementStates = Array.from(slideElements).map(function (el) {
    return {
      el: el,
      isLeft: el.classList.contains('slide-left'),
      targetProgress: 0,
      currentProgress: 0
    };
  });

  function renderAnimations() {
    var viewHeight = window.innerHeight;
    var needsNextFrame = false;

    elementStates.forEach(function (state) {
      var rect = state.el.getBoundingClientRect();
      var startOffset = viewHeight * 0.95;
      var endOffset = viewHeight * 0.25;
      var currentPos = rect.top;

      var rawProgress = (startOffset - currentPos) / (startOffset - endOffset);
      state.targetProgress = Math.max(0, Math.min(1, rawProgress));

      // Smoothly interpolate current towards target with dampening factor (0.08 = ultra silky smooth)
      state.currentProgress = lerp(state.currentProgress, state.targetProgress, 0.08);

      if (Math.abs(state.targetProgress - state.currentProgress) > 0.001) {
        needsNextFrame = true;
      }

      // Easing curve (easeOutCubic)
      var p = state.currentProgress;
      var easedProgress = 1 - Math.pow(1 - p, 3);

      var maxShift = state.isLeft ? -90 : 90;
      var currentShift = maxShift * (1 - easedProgress);
      var opacity = Math.min(1, p * 1.6);

      state.el.style.transform = 'translateX(' + currentShift.toFixed(2) + 'px)';
      state.el.style.opacity = opacity.toFixed(3);
    });

    requestAnimationFrame(renderAnimations);
  }

  requestAnimationFrame(renderAnimations);

  // ---- Footer Year ---------------------------------------------------------
  var yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ---- FLOATING MEDIA PLAYER -----------------------------------------------
  var audio = document.getElementById('audio-element');
  var playPauseBtn = document.getElementById('play-pause-btn');
  var muteBtn = document.getElementById('mute-btn');
  var playIcon = document.getElementById('play-icon');
  var pauseIcon = document.getElementById('pause-icon');
  var volumeIcon = document.getElementById('volume-icon');
  var muteIcon = document.getElementById('mute-icon');

  console.log('[Audio Debug] Media Player element present:', !!audio);

  if (audio && playPauseBtn && muteBtn) {
    var START_TIME = 91; // Start at 1:31 (91 seconds)
    var FADE_DURATION = 5000; // 5 seconds fade in on page load only
    var TARGET_VOLUME = 0.35; // Target volume 35%
    var isMuted = false;
    var fadeInterval = null;
    var hasFadedIn = false;
    var isInitialized = false;

    // Set initial audio volume silent for fade-in
    audio.volume = 0;

    function updateUI() {
      console.log('[Audio Debug] updateUI called. audio.paused:', audio.paused, 'audio.muted:', audio.muted);
      if (audio.paused) {
        if (playIcon) playIcon.style.setProperty('display', 'inline-block', 'important');
        if (pauseIcon) pauseIcon.style.setProperty('display', 'none', 'important');
      } else {
        if (playIcon) playIcon.style.setProperty('display', 'none', 'important');
        if (pauseIcon) pauseIcon.style.setProperty('display', 'inline-block', 'important');
      }

      if (audio.muted || isMuted) {
        if (volumeIcon) volumeIcon.style.setProperty('display', 'none', 'important');
        if (muteIcon) muteIcon.style.setProperty('display', 'inline-block', 'important');
      } else {
        if (volumeIcon) volumeIcon.style.setProperty('display', 'inline-block', 'important');
        if (muteIcon) muteIcon.style.setProperty('display', 'none', 'important');
      }
    }

    // 5-Second Fade-In (runs only once on initial site load)
    function fadeInVolumeOnLoad() {
      if (hasFadedIn) return;
      hasFadedIn = true;
      console.log('[Audio Debug] Starting 5-second volume fade-in up to ' + (TARGET_VOLUME * 100) + '%');
      audio.volume = 0;
      audio.muted = false;
      var startTime = Date.now();
      if (fadeInterval) clearInterval(fadeInterval);

      fadeInterval = setInterval(function () {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / FADE_DURATION);
        if (!isMuted) {
          audio.volume = progress * TARGET_VOLUME;
        }
        if (progress >= 1) {
          console.log('[Audio Debug] Volume fade-in complete. Current volume:', audio.volume);
          clearInterval(fadeInterval);
          fadeInterval = null;
        }
      }, 50);
    }

    // Safe seek helper
    function setSeekTime() {
      if (!isInitialized && audio.duration) {
        try {
          audio.currentTime = START_TIME;
          isInitialized = true;
          console.log('[Audio Debug] Successfully set currentTime to 1:31 (' + START_TIME + 's)');
        } catch (e) {
          console.warn('[Audio Debug] Could not seek audio time yet:', e);
        }
      }
    }

    audio.addEventListener('canplay', function () {
      console.log('[Audio Debug] Event: canplay. ReadyState:', audio.readyState);
      setSeekTime();
    });

    audio.addEventListener('play', function () {
      console.log('[Audio Debug] Native audio event: play');
      updateUI();
    });

    audio.addEventListener('pause', function () {
      console.log('[Audio Debug] Native audio event: pause');
      updateUI();
    });

    audio.addEventListener('error', function (e) {
      console.error('[Audio Debug] Audio Element Error:', audio.error ? (audio.error.code + ' - ' + audio.error.message) : e);
    });

    // Autoplay execution
    function attemptPlay(triggerSource) {
      console.log('[Audio Debug] attemptPlay() triggered via source:', triggerSource || 'page_load');
      audio.muted = false;
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function () {
          console.log('[Audio Debug] audio.play() SUCCESS!');
          updateUI();
          fadeInVolumeOnLoad();
        }).catch(function (err) {
          console.warn('[Audio Debug] audio.play() BLOCKED/REJECTED:', err.name, '-', err.message);
          updateUI();
        });
      }
    }

    // ---- WELCOME OVERLAY MODAL LOGIC ----
    var welcomeModal = document.getElementById('welcome-modal');
    var welcomeClose = document.getElementById('welcome-close');
    var welcomeEnter = document.getElementById('welcome-enter');

    function dismissWelcomeModalAndPlay() {
      if (welcomeModal && !welcomeModal.classList.contains('dismissed')) {
        welcomeModal.classList.add('dismissed');
        console.log('[Welcome Modal] Dismissed by user gesture — starting audio playback.');
        attemptPlay('welcome_modal_dismiss');
      }
    }

    if (welcomeClose) welcomeClose.addEventListener('click', dismissWelcomeModalAndPlay);
    if (welcomeEnter) welcomeEnter.addEventListener('click', dismissWelcomeModalAndPlay);
    if (welcomeModal) {
      welcomeModal.addEventListener('click', function (e) {
        // Dismiss if user clicks outside the modal card (on backdrop)
        if (e.target === welcomeModal) {
          dismissWelcomeModalAndPlay();
        }
      });
    }

    // Try play immediately on load
    attemptPlay('page_load_init');

    // Universal interaction listener to trigger play on first user gesture
    function unlockAudioOnGesture(e) {
      console.log('[Audio Debug] User gesture detected event:', e.type);
      if (audio.paused) {
        attemptPlay('user_gesture_' + e.type);
      }
      ['click', 'scroll', 'mousemove', 'keydown', 'touchstart', 'pointerdown', 'wheel'].forEach(function (evt) {
        window.removeEventListener(evt, unlockAudioOnGesture);
      });
    }

    ['click', 'scroll', 'mousemove', 'keydown', 'touchstart', 'pointerdown', 'wheel'].forEach(function (evt) {
      window.addEventListener(evt, unlockAudioOnGesture, { passive: true, once: true });
    });

    // Play / Pause Button
    playPauseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (audio.paused) {
        audio.muted = isMuted;
        if (audio.currentTime < START_TIME) {
          audio.currentTime = START_TIME;
        }
        audio.play().then(function () {
          if (!hasFadedIn) {
            fadeInVolumeOnLoad();
          } else {
            audio.volume = TARGET_VOLUME;
          }
          updateUI();
        });
      } else {
        audio.pause();
        updateUI();
      }
    });

    // Mute / Unmute Button Listener
    muteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      isMuted = !isMuted;
      audio.muted = isMuted;
      updateUI();
    });

    // Audio state events
    audio.addEventListener('play', updateUI);
    audio.addEventListener('pause', updateUI);

    // Loop check backup
    audio.addEventListener('ended', function () {
      audio.currentTime = START_TIME;
      audio.play();
    });
  }
});
// ---- CONTACT FORM ----------------------------------------------------------
window.handleFormSubmit = async function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !status) return;
  var formData = new FormData(form);
  var accessKey = formData.get('access_key');
  if (submitBtn) submitBtn.disabled = true;
  status.style.display = 'block';
  status.className = 'form-status';
  status.style.color = 'var(--text-muted)';
  status.textContent = 'Sending message...';
  try {
    if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
      var response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      var data = await response.json();
      if (data.success) {
        status.className = 'form-status success';
        status.style.color = '';
        status.textContent = 'Message sent! I will get back to you soon.';
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } else {
      await new Promise(function (r) { setTimeout(r, 700); });
      status.className = 'form-status success';
      status.style.color = '';
      status.textContent = 'Message sent!';
      form.reset();
    }
  } catch (err) {
    status.className = 'form-status';
    status.style.color = '#EF4444';
    status.textContent = 'Error: ' + (err.message || 'Could not send message');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    setTimeout(function () { status.style.display = 'none'; }, 9000);
  }
};
