/* auth.js - maneja sesión demo y autenticación opcional por JSON.
   Soporta:
   - loginUserDemo({name,email}) -> guarda en localStorage y redirige
   - logoutUser() -> borra sesión
   - getUser() -> devuelve objeto o null
   - updateUser(data) -> merge y guarda
   - tryAuthFromJSON(username, password) -> opcional (no usado en demo)
*/

function loginUserDemo(payload = { name: "Usuario Marea", email: "demo@marea.coffee" }) {
  const user = {
    logged: true,
    name: payload.name || "Usuario Marea",
    email: payload.email || "demo@marea.coffee",
    phone: payload.phone || "",
    address: payload.address || ""
  };
  localStorage.setItem('marea_user', JSON.stringify(user));
  // redirigir al index
  window.location.href = 'index.html';
}

function logoutUser() {
  localStorage.removeItem('marea_user');
  window.location.href = 'index.html';
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('marea_user')); }
  catch(e){ return null; }
}

function updateUser(data) {
  const u = getUser() || { logged:true };
  const merged = Object.assign({}, u, data);
  localStorage.setItem('marea_user', JSON.stringify(merged));
  return merged;
}

/* OPTIONAL: autenticación con archivo JSON (si decides usar credenciales reales)
   Usage example:
     tryAuthFromJSON('mareaAdmin','cafe2025').then(ok=>{ if(ok) ... })
*/
async function tryAuthFromJSON(user, pass) {
  try {
    const res = await fetch('assets/data/user.json');
    if (!res.ok) return false;
    const data = await res.json();
    if (user === data.username && pass === data.password) {
      loginUserDemo({ name: data.nombre, email: data.correo });
      return true;
    }
    return false;
  } catch(e) {
    return false;
  }
}
