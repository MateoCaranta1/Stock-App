const API_URL = "http://localhost:3000"; // tu back
let token = localStorage.getItem("token");

// Agregar más inputs de producto
document.getElementById("add-purchase-product").addEventListener("click", () => {
  const container = document.getElementById("compra-productos-container");

  const div = document.createElement("div");
  div.classList.add("producto-item");
  div.innerHTML = `
    <input type="text" placeholder="Nombre producto" class="producto-nombre" required>
    <input type="number" placeholder="Cantidad" class="producto-cantidad" min="1" required>
    <input type="number" placeholder="Precio" class="producto-precio" min="0" step="0.01" required>
  `;
  container.appendChild(div);
});

// Crear compra
document.getElementById("purchase-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const productos = Array.from(document.querySelectorAll(".producto-item")).map(p => ({
    nombre: p.querySelector(".producto-nombre").value,
    cantidad: parseInt(p.querySelector(".producto-cantidad").value),
    precio: parseFloat(p.querySelector(".producto-precio").value)
  }));

  const res = await fetch(`${API_URL}/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ productos })
  });

  const data = await res.json();
  document.getElementById("purchase-msg").textContent = data.message || (data.error ? data.error : "Compra registrada ✅");
});

// Obtener compras
document.getElementById("load-purchases").addEventListener("click", async () => {
  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const res = await fetch(`${API_URL}/purchases`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const compras = await res.json();
  const list = document.getElementById("purchases-list");
  list.innerHTML = "";

  compras.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `Compra #${c.id} - ${c.createdAt} - Total: $${c.total}`;
    list.appendChild(li);
  });
});
