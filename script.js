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
            <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="1">
            <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        `;
        contenedorProductos.appendChild(div);
    });
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
    const cantidadInput = document.getElementById(`cantidad-${id}`);
    let cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese una cantidad válida.");
        return;
    }

    const producto = productos.find(p => p.id === id);
    if (producto.stock >= cantidad) {
        let productoEnCarrito = carrito.find(p => p.id === id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        producto.stock -= cantidad;
        actualizarCarrito();
        mostrarProductos();
    } else {
        alert("No hay suficiente stock.");
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
            <p>Precio total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button class="btn" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        contenedorCarrito.appendChild(div);
    });
}

// Eliminar productos del carrito
function eliminarDelCarrito(id) {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }

    const productoOriginal = productos.find(p => p.id === id);
    productoOriginal.stock++;

    actualizarCarrito();
    mostrarProductos();
}

// Finalizar compra y mostrar factura con IVA
function mostrarFactura() {
    facturaContainer.innerHTML = "";
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let facturaHTML = `<div class="factura" id="factura">
        <h2>Factura de Compra</h2>
        <ul>`;

    let subtotal = 0;
    carrito.forEach(p => {
        facturaHTML += `<li>${p.nombre} - ${p.cantidad} x $${p.precio} = $${(p.precio * p.cantidad).toFixed(2)}</li>`;
        subtotal += p.precio * p.cantidad;
    });

    let iva = subtotal * 0.13;
    let total = subtotal + iva;

    facturaHTML += `</ul>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>IVA (13%): $${iva.toFixed(2)}</p>
        <h3>Total a pagar: $${total.toFixed(2)}</h3>
        <button class="btn no-imprimir" onclick="imprimirFactura()">🖨 Imprimir Factura</button>
        <button class="btn no-imprimir" onclick="seguirComprando()">Seguir Comprando</button>
    </div>`;
    
    facturaContainer.innerHTML = facturaHTML;

    // Vaciar el carrito después de la compra
    carrito = [];
    actualizarCarrito();
}

// Función para imprimir la factura sin los botones
function imprimirFactura() {
    let factura = document.getElementById("factura").cloneNode(true);

    // Ocultar los botones antes de imprimir
    let botones = factura.querySelectorAll(".no-imprimir");
    botones.forEach(boton => boton.remove());

    let ventana = window.open("", "_blank");
    ventana.document.write(`
        <html>
        <head>
            <title>Factura</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .factura { border: 1px solid #000; padding: 20px; display: inline-block; text-align: left; }
            </style>
        </head>
        <body>
            ${factura.innerHTML}
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// Seguir comprando
function seguirComprando() {
    facturaContainer.innerHTML = "";
    mostrarProductos();
}

document.getElementById("finalizarCompra").addEventListener("click", mostrarFactura);

mostrarProductos();
