const API_URL = "http://localhost:3000"; // ajusta según tu back
let token = null;

// Navegación
const sections = {
  register: document.getElementById("register-section"),
  login: document.getElementById("login-section"),
  users: document.getElementById("users-section")
};

document.getElementById("link-register").addEventListener("click", () => showSection("register"));
document.getElementById("link-login").addEventListener("click", () => showSection("login"));
document.getElementById("link-users").addEventListener("click", () => showSection("users"));

function showSection(name) {
  Object.values(sections).forEach(s => s.classList.add("hidden"));
  sections[name].classList.remove("hidden");
}

// Registro
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById("register-msg").textContent = data.message || data.error;
});

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById("login-msg").textContent = "Login exitoso ✅";
  } else {
    document.getElementById("login-msg").textContent = data.error;
  }
});

// Obtener usuarios
document.getElementById("load-users").addEventListener("click", async () => {
  if (!token) {
    alert("Primero inicia sesión");
    return;
  }

  const res = await fetch(`${API_URL}/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const users = await res.json();
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.id} - ${u.email}`;
    list.appendChild(li);
  });
});
