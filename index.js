 const projects = [
      {id:1,title:'Coffee Shop Website',tags:['web'],desc:'Responsive coffee shop site built with vanilla HTML/CSS/JS. Includes menu,Cart UX and animations.',live:'#',code:'#'},
      {id:2,title:'SharePoint SPFx Starter',tags:['spfx'],desc:'SharePoint web part built with SPFx and React wrappers for intranet usage.',live:'#',code:'#'},
      {id:3,title:'Portfolio (This Site)',tags:['web'],desc:'Single-page portfolio demonstrating responsive layout and accessible patterns.',live:'#',code:'#'},
      {id:4,title:'Product Grid UI',tags:['react','web'],desc:'Interactive product grid with filters and local state management.',live:'#',code:'#'}
    ];

    // === Render project cards ===
    const grid = document.getElementById('projectsGrid');
    function renderProjects(filter='all'){
      grid.innerHTML='';
      const list = projects.filter(p=> filter==='all' ? true : p.tags.includes(filter));
      list.forEach(p=>{
        const el = document.createElement('div');
        el.className='project';
        el.setAttribute('tabindex',0);
        el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${p.title}</strong>
            <div class="meta">${p.tags.join(', ')}</div>
          </div>
          <p class="muted" style="margin-top:8px;font-size:14px">${p.desc}</p>`;
        el.addEventListener('click',()=> openModal(p));
        el.addEventListener('keypress',(e)=>{ if(e.key==='Enter') openModal(p) });
        grid.appendChild(el);
      })
    }

    renderProjects();

    // Filter handlers
    document.querySelectorAll('button[data-filter]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const filter = btn.dataset.filter;
        renderProjects(filter);
      })
    })

    // Modal
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalLink = document.getElementById('modalLink');
    const modalCode = document.getElementById('modalCode');
    function openModal(p){
      modalTitle.textContent = p.title;
      modalDesc.textContent = p.desc;
      modalLink.href = p.live;
      modalCode.href = p.code;
      modalLink.style.display = p.live ? 'inline-block' : 'none';
      modalCode.style.display = p.code ? 'inline-block' : 'none';
      modal.classList.add('open');
    }
    document.getElementById('closeModal').addEventListener('click',()=> modal.classList.remove('open'));
    modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.classList.remove('open') });

    // Sidebar mobile open/close
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const appRoot = document.getElementById('appRoot');
    openSidebarBtn.addEventListener('click',()=>{
      sidebar.classList.toggle('open');
      appRoot.classList.toggle('with-sidebar-open');
    })

    // Close sidebar when clicking link on mobile
    document.querySelectorAll('[data-link]').forEach(a=>{
      a.addEventListener('click',()=>{
        sidebar.classList.remove('open');
        appRoot.classList.remove('with-sidebar-open');
      })
    })

    // Contact form (local demo)
    const form = document.getElementById('contactForm');
    const formNotice = document.getElementById('formNotice');
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      formNotice.textContent = 'Sending...';
      setTimeout(()=>{
        formNotice.textContent = 'Thanks! Message sent (demo).';
        form.reset();
      },800)
    })

    // Keyboard escape closes modal and sidebar
    document.addEventListener('keydown', (e)=>{
      if(e.key==='Escape'){
        modal.classList.remove('open');
        sidebar.classList.remove('open');
      }
    })

    // Smooth scroll for nav
    document.querySelectorAll('a[data-link]').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        ev.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      })
    })

    // lightweight focus outlines for keyboard users
    (function(){
      function handleFirstTab(e){
        if(e.key==='Tab'){
          document.documentElement.classList.add('user-is-tabbing');
          window.removeEventListener('keydown', handleFirstTab);
        }
      }
      window.addEventListener('keydown', handleFirstTab);
    })();