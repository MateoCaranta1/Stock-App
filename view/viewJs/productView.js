const API_URL = "http://localhost:3000"; // tu back
let token = localStorage.getItem("token");

// Crear producto
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const stock = parseInt(document.getElementById("product-stock").value);

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nombre: name, precio: price, stock })
  });

  const data = await res.json();
  document.getElementById("product-msg").textContent = data.error || "Producto agregado ✅";
});

// Cargar productos
document.getElementById("load-products").addEventListener("click", loadProducts);

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const products = await res.json();

  const table = document.getElementById("products-table");
  table.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editProduct(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock})">Editar</button>
        <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Eliminar</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

// Editar producto
async function editProduct(id, nombre, precio, stock) {
  const newName = prompt("Nuevo nombre:", nombre);
  const newPrice = prompt("Nuevo precio:", precio);
  const newStock = prompt("Nuevo stock:", stock);

  if (!newName || newPrice === null || newStock === null) return;

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: newName,
      precio: parseFloat(newPrice),
      stock: parseInt(newStock)
    })
  });

  const data = await res.json();
  alert(data.error || "Producto actualizado ✅");
  loadProducts();
}

// Eliminar producto
async function deleteProduct(id) {
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  alert(data.error || data.message);
  loadProducts();
}
