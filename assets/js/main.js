/* main.js - renderizado dinámico y handlers
   Dependencias: auth.js
*/

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderYear();
  renderProducts();
  renderNews();
  renderTips();
  hydrateUserProfile();
  bindUserForm();
});

/* NAVBAR (inserta links correctos según sesión) */
function renderNavbar(){
  const nav = document.querySelector('#navLinks') || document.querySelector('.navbar .navbar-nav');
  if (!nav) return;
  const user = getUser();
  nav.innerHTML = '';
  nav.insertAdjacentHTML('beforeend', `<li class="nav-item"><a class="nav-link" href="#menu">Menú</a></li>`);
  nav.insertAdjacentHTML('beforeend', `<li class="nav-item"><a class="nav-link" href="#noticias">Noticias</a></li>`);
  nav.insertAdjacentHTML('beforeend', `<li class="nav-item"><a class="nav-link" href="usuario.html">Mi Cuenta</a></li>`);
  if (user && user.logged) {
    nav.insertAdjacentHTML('beforeend', `<li class="nav-item"><a class="nav-link" style="cursor:pointer" onclick="logoutUser()">Salir</a></li>`);
  } else {
    nav.insertAdjacentHTML('beforeend', `<li class="nav-item"><a class="nav-link" href="login.html">Ingresar</a></li>`);
  }
}

/* footer year */
function renderYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* Productos (demo) */
const PRODUCTS = [
  { id:1, name: "Espresso Marea", price: "$3.50", img: "assets/img/product1.jpeg", desc: "Aromático y con cuerpo." },
  { id:2, name: "Latte Aurora", price: "$4.80", img: "assets/img/product2.jpeg", desc: "Espuma sedosa y caramelo." },
  { id:3, name: "Americano Classic", price: "$3.00", img: "assets/img/product3.jpeg", desc: "Ligero y aromático." },
  { id:4, name: "Cold Brew Marina", price: "$5.20", img: "assets/img/product4.jpeg", desc: "Frío y refrescante." },
  { id:5, name: "Almojabana Marea", price: "$3.00", img: "assets/img/product5.jpeg", desc: "Perfecto acompañante." },
  { id:6, name: "Torta de Chocolate", price: "$5.20", img: "assets/img/product6.jpeg", desc: "Para amantes del chocolate." }
];

function renderProducts(){
  const wrap = document.getElementById('productosList') || document.querySelector('#menu .row');
  if (!wrap) return;
  wrap.innerHTML = '';
  PRODUCTS.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card">
        <img src="${p.img}" class="product-img" alt="${p.name}">
        <div class="product-body">
          <h5 class="product-title">${p.name}</h5>
          <p class="product-desc">${p.desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            <strong>${p.price}</strong>
            <button class="btn btn-coffee btn-sm" onclick="addToCart(${p.id})">Añadir</button>
          </div>
        </div>
      </div>
    `;
    wrap.appendChild(col);
  });
}

/* Simula añadir al carrito */
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  showToast(`${p.name} añadido al pedido`);
}

/* Noticias */
const NEWS = [
  { id:1, title: "Lanzamiento: Brew of the Month", img: "assets/img/news1.jpeg", excerpt: "Blend exclusivo con notas a cacao." },
  { id:2, title: "Taller de latte art", img: "assets/img/news2.jpeg", excerpt: "Aprende a crear flores en tu taza." }
];

function renderNews(){
  const wrap = document.getElementById('noticiasList') || document.querySelector('#noticias .row');
  if (!wrap) return;
  wrap.innerHTML = '';
  NEWS.forEach(n => {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    col.innerHTML = `
      <div class="card">
        <img src="${n.img}" class="thumb" alt="${n.title}">
        <div class="p-3">
          <h5>${n.title}</h5>
          <p class="muted small">${n.excerpt}</p>
        </div>
      </div>
    `;
    wrap.appendChild(col);
  });
}

/* Tips */
const TIPS = [
  { id:1, text:"Moler el café justo antes de prepararlo mejora el aroma.", img:"assets/img/tip1.jpeg" },
  { id:2, text:"Usa agua filtrada y temperatura entre 90-95°C.", img:"assets/img/tip2.jpeg" },
  { id:3, text:"Precalienta la taza para mantener la bebida caliente más tiempo.", img:"assets/img/tip3.jpeg" }
];

function renderTips(){
  const wrap = document.getElementById('tipsList') || document.querySelector('#consejos .row');
  if (!wrap) return;
  wrap.innerHTML = '';
  TIPS.forEach(t => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card">
        <img src="${t.img}" class="thumb" alt="Consejo">
        <div class="p-3">
          <p class="muted small">${t.text}</p>
        </div>
      </div>
    `;
    wrap.appendChild(col);
  });
}

/* Rellena perfil si existe sesión */
function hydrateUserProfile(){
  const u = getUser();
  if (!u) return;
  const nameEls = document.querySelectorAll('.user-name');
  const emailEls = document.querySelectorAll('.user-email');
  if (nameEls) nameEls.forEach(el => el.textContent = u.name || 'Usuario');
  if (emailEls) emailEls.forEach(el => el.textContent = u.email || '');
  const form = document.getElementById('userForm');
  if (form && u) {
    form.name.value = u.name || '';
    form.email.value = u.email || '';
    form.phone.value = u.phone || '';
    form.address.value = u.address || '';
  }
  const info = document.getElementById('userInfoCard');
  if (info) {
    info.innerHTML = `<h5>${u.name || 'Usuario'}</h5><p class="small muted">${u.email || ''}</p><p class="small">${u.address || ''}</p>`;
  }
}

/* binding del formulario de usuario */
function bindUserForm(){
  const form = document.getElementById('userForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = updateUser({
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim()
    });
    showToast('Perfil actualizado');
    hydrateUserProfile();
  });
}

/* Simple toast visual */
function showToast(text){
  const t = document.createElement('div');
  t.style.position='fixed'; t.style.right='20px'; t.style.bottom='20px';
  t.style.background='rgba(30,20,16,0.95)'; t.style.color='#fff'; t.style.padding='10px 14px';
  t.style.borderRadius='8px'; t.style.zIndex=9999; t.style.boxShadow='0 8px 24px rgba(0,0,0,0.5)';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(()=> t.style.transform='translateY(-6px)', 50);
  setTimeout(()=> t.remove(), 2400);
}
