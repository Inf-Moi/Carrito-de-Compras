const productos = [
    { id: 1, nombre: "Laptop", precio: 500, stock: 10 },
    { id: 2, nombre: "Mouse", precio: 20, stock: 15 },
    { id: 3, nombre: "Teclado", precio: 30, stock: 8 }
];

let carrito = [];

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");

// Mostrar productos en la tienda
function mostrarProductos() {
    productos.forEach(producto => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
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
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
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
}

// Finalizar compra y mostrar factura
document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let factura = "Factura de compra:\n";
    let total = 0;

    carrito.forEach(p => {
        factura += `${p.nombre} - ${p.cantidad} x $${p.precio} = $${p.precio * p.cantidad}\n`;
        total += p.precio * p.cantidad;
    });

    factura += `\nTotal a pagar: $${total}`;
    alert(factura);
    
    // Vaciar el carrito
    carrito = [];
    actualizarCarrito();
});

mostrarProductos();
