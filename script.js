// Diafragma-Flutter – menu, taal, formulier
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('df-lang') || 'nl';
  setLanguage(savedLang);

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      localStorage.setItem('df-lang', lang);
    });
  });

  function setLanguage(lang) {
    document.body.classList.toggle('en', lang === 'en');
    document.documentElement.lang = lang;
    langBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function isEn() {
    return document.body.classList.contains('en');
  }

  const ROLE_LABELS = {
    'patiënt': ['Patiënt', 'Patient', '👤'],
    'arts': ['Arts / specialist', 'Doctor / specialist', '🩺'],
    'behandelaar': ['Behandelaar', 'Therapist', '💚'],
    'naaste': ['Naaste / familie', 'Relative / family', '🤝'],
    'anders': ['Anders', 'Other', '💬']
  };

  // Goedgekeurde verhalen ophalen en tonen
  const storyList = document.getElementById('approved-stories');
  if (storyList) {
    fetch('/api/stories')
      .then(function (res) {
        if (!res.ok) throw new Error('status ' + res.status);
        return res.json();
      })
      .then(function (items) {
        const empty = document.getElementById('stories-empty');
        if (empty) {
          if (items.length) {
            empty.remove();
          } else {
            empty.innerHTML = '<span class="lang-nl">Er zijn nog geen verhalen van bezoekers geplaatst. Wees de eerste en deel hieronder uw ervaring!</span>' +
              '<span class="lang-en">No visitor stories have been published yet. Be the first and share your experience below!</span>';
          }
        }
        items.forEach(function (item) {
          const role = ROLE_LABELS[item.role] || ROLE_LABELS.anders;
          const article = document.createElement('article');
          article.className = 'story';

          const header = document.createElement('div');
          header.className = 'story-header';
          const avatar = document.createElement('div');
          avatar.className = 'story-avatar';
          avatar.textContent = role[2];
          const meta = document.createElement('div');
          meta.className = 'story-meta';
          const h3 = document.createElement('h3');
          h3.textContent = item.name;
          const span = document.createElement('span');
          span.innerHTML = '<span class="lang-nl"></span><span class="lang-en"></span>';
          const date = item.approvedAt ? new Date(item.approvedAt) : null;
          span.querySelector('.lang-nl').textContent = role[0] + (date ? ' • ' + date.toLocaleDateString('nl-NL') : '');
          span.querySelector('.lang-en').textContent = role[1] + (date ? ' • ' + date.toLocaleDateString('en-GB') : '');
          meta.appendChild(h3);
          meta.appendChild(span);
          header.appendChild(avatar);
          header.appendChild(meta);

          const p = document.createElement('p');
          p.className = 'story-text';
          p.textContent = '“' + item.story + '”';

          article.appendChild(header);
          article.appendChild(p);
          storyList.appendChild(article);
        });
      })
      .catch(function () {
        const empty = document.getElementById('stories-empty');
        if (empty) {
          empty.innerHTML = '<span class="lang-nl">De verhalen konden niet worden geladen. Probeer het later opnieuw.</span>' +
            '<span class="lang-en">The stories could not be loaded. Please try again later.</span>';
        }
      });
  }

  // Verhaal insturen
  const storyForm = document.getElementById('story-form');
  if (storyForm) {
    const status = document.getElementById('story-form-status');
    const submitBtn = storyForm.querySelector('button[type="submit"]');

    function showStatus(type, nl, en) {
      if (!status) return;
      status.className = 'form-status ' + type;
      status.textContent = isEn() ? en : nl;
    }

    storyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        name: storyForm.name.value.trim(),
        role: storyForm.role.value,
        story: storyForm.story.value.trim(),
        email: storyForm.email.value.trim(),
        website: storyForm.website ? storyForm.website.value : ''
      };
      if (!data.name || !data.story) {
        showStatus('error', 'Vul alstublieft uw naam en verhaal in.', 'Please fill in your name and story.');
        return;
      }

      submitBtn.disabled = true;
      showStatus('', 'Bezig met versturen…', 'Sending…');

      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('status ' + res.status);
          storyForm.reset();
          showStatus('success',
            'Bedankt voor uw verhaal! Het verschijnt op deze pagina zodra de beheerder het heeft goedgekeurd.',
            'Thank you for your story! It will appear on this page once it has been approved.');
        })
        .catch(function () {
          showStatus('error',
            'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
            'Something went wrong while sending. Please try again later.');
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  // Contactformulier (Netlify Forms)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const cStatus = document.getElementById('contact-form-status');
    const cBtn = contactForm.querySelector('button[type="submit"]');

    function showContactStatus(type, nl, en) {
      cStatus.className = 'form-status ' + type;
      cStatus.textContent = isEn() ? en : nl;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      cBtn.disabled = true;
      showContactStatus('', 'Bezig met versturen…', 'Sending…');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('status ' + res.status);
          contactForm.reset();
          showContactStatus('success',
            'Bedankt! Uw bericht is verstuurd. We nemen zo snel mogelijk contact met u op.',
            'Thank you! Your message has been sent. We will get back to you as soon as possible.');
        })
        .catch(function () {
          showContactStatus('error',
            'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
            'Something went wrong while sending. Please try again later.');
        })
        .finally(function () {
          cBtn.disabled = false;
        });
    });
  }
});
