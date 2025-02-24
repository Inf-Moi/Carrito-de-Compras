const productos = [
    { id: 1, nombre: "Laptop", precio: 500, stock: 10 },
    { id: 2, nombre: "Mouse", precio: 20, stock: 15 },
    { id: 3, nombre: "Teclado", precio: 30, stock: 8 }
];

let carrito = [];

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");
const facturaContainer = document.getElementById("facturaContainer");

// Mostrar productos en la tienda
function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        `;
        contenedorProductos.appendChild(div);
    });
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const productoEnCarrito = carrito.find(p => p.id === id);

    if (producto.stock > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        producto.stock--;
        actualizarCarrito();
        mostrarProductos();
    } else {
        alert("Producto sin stock");
    }
}

// Mostrar carrito
function actualizarCarrito() {
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
        let div = document.createElement("div");
        div.classList.add("producto-carrito");
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Precio total: $${producto.precio * producto.cantidad}</p>
            <button class="btn" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        contenedorCarrito.appendChild(div);
    });
}

// Eliminar productos del carrito
function eliminarDelCarrito(id) {
    const producto = carrito.find(p => p.id === id);
    producto.cantidad--;

    if (producto.cantidad === 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    const productoOriginal = productos.find(p => p.id === id);
    productoOriginal.stock++;

    actualizarCarrito();
    mostrarProductos();
}

// Finalizar compra y mostrar factura en pantalla
function mostrarFactura() {
    facturaContainer.innerHTML = "";
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let facturaHTML = `<div class="factura">
        <h2>Factura de Compra</h2>
        <ul>`;

    let total = 0;
    carrito.forEach(p => {
        facturaHTML += `<li>${p.nombre} - ${p.cantidad} x $${p.precio} = $${p.precio * p.cantidad}</li>`;
        total += p.precio * p.cantidad;
    });

    facturaHTML += `</ul><h3>Total a pagar: $${total}</h3></div>`;
    facturaContainer.innerHTML = facturaHTML;

    // Vaciar el carrito después de la compra
    carrito = [];
    actualizarCarrito();
}

document.getElementById("finalizarCompra").addEventListener("click", mostrarFactura);

mostrarProductos();
