const API_URL = "http://localhost:3000"; // tu back
let token = localStorage.getItem("token"); // guardá el token en login

// Agregar más inputs de producto
document.getElementById("add-product").addEventListener("click", () => {
    const container = document.getElementById("productos-container");

    const div = document.createElement("div");
    div.classList.add("producto-item");
    div.innerHTML = `
    <input type="text" placeholder="Nombre producto" class="producto-nombre" required>
    <input type="number" placeholder="Cantidad" class="producto-cantidad" min="1" required>
    <input type="number" placeholder="Precio" class="producto-precio" min="0" step="0.01" required>
  `;
    container.appendChild(div);
});

// Crear venta
document.getElementById("sale-form").addEventListener("submit", async (e) => {
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

    const res = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productos })
    });

    const data = await res.json();
    document.getElementById("sale-msg").textContent = data.message || (data.error ? data.error : "Venta registrada ✅");
});

// Obtener ventas
document.getElementById("load-sales").addEventListener("click", async () => {
    if (!token) {
        alert("Debes iniciar sesión primero.");
        return;
    }

    const res = await fetch(`${API_URL}/sales`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const ventas = await res.json();
    const list = document.getElementById("sales-list");
    list.innerHTML = "";

    ventas.forEach(v => {
        const li = document.createElement("li");
        li.textContent = `Venta #${v.id} - ${v.createdAt} - Total: $${v.total}`;
        list.appendChild(li);
    });
});
