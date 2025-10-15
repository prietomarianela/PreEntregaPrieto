// Función constructora para crear objetos de plantas

function Planta(nombre, precio, imagen) {
  this.nombre = nombre;
  this.precio = precio;
  this.imagen = imagen;
}

const plantas = [
  new Planta("Monstera", 30000, "monstera-tienda.jpg"),
  new Planta("Ficus", 25000, "arbusto-ficus-audrey.webp"),
  new Planta("Cactus", 15000, "suculenta-tienda.jpg"),
  new Planta("Helecho", 20000, "areca-tienda.jpg"),
  new Planta("Palma", 35000, "ave-del-paraiso.webp"),
  new Planta("Suculenta", 18000, "suculenta-tienda.jpg")  // planta agregada
];

// Variables para manejar el carrito de compras

const plantasContainer = document.getElementById("plantas-container");
const carritoContainer = document.getElementById("carrito-container");
const totalCarrito = document.getElementById("total-carrito");

// Array para almacenar los productos en el carrito

let carrito = [];

// Función para mostrar las plantas en la tienda
function mostrarPlantas() {
  plantasContainer.innerHTML = ""; // limpio el contenedor

  plantas.forEach((planta, index) => {
    const plantaDiv = document.createElement("article");
    plantaDiv.className = "plantas-item"; 
// creo un div para cada planta
      plantaDiv.innerHTML = `
      <h3 class="titulos-plantas">${planta.nombre}</h3>
      <img src="../img/${planta.imagen}" alt="Planta ${planta.nombre}" class="imagen-hover" />
      <p>$${planta.precio}</p>
      <button id="agregar-${index}">Agregar al carrito</button>
    `;

    plantasContainer.appendChild(plantaDiv);

    const botonAgregar = document.getElementById(`agregar-${index}`);
    botonAgregar.addEventListener("click", () => agregarAlCarrito(planta));
     }); 
} 

// Función para agregar una planta al carrito, mostrar el carrito y guardar en localStorage
function agregarAlCarrito(planta) {
  carrito.push(planta);
  mostrarCarrito();
  guardarCarrito();
}
// Función para mostrar el carrito de compras, eliminar productos y calcular el total
function mostrarCarrito() {
  carritoContainer.innerHTML = "";
// Recorro el carrito y creo elementos para cada planta
  carrito.forEach((planta, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item-carrito";
// Muestro el nombre, precio y botón eliminar
    itemDiv.innerHTML = `
      <span>${planta.nombre} - $${planta.precio}</span>
      <button id="eliminar-${index}">Eliminar</button>
    `;

    carritoContainer.appendChild(itemDiv);
// Agrego funcionalidad al botón eliminar
    const botonEliminar = document.getElementById(`eliminar-${index}`);
    botonEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      mostrarCarrito();
      guardarCarrito();
    });
  });

  const total = carrito.reduce((acc, planta) => acc + planta.precio, 0);
  totalCarrito.textContent = `Total: $${total}`;
}
// Función para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
// Función para cargar el carrito desde localStorage al iniciar la página
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    // Si hay un carrito guardado, lo parseo
    const carritoParseado = JSON.parse(carritoGuardado);
    // Reconvierto los objetos planos a instancias de Planta
    carrito = carritoParseado.map(
      (planta) => new Planta(planta.nombre, planta.precio, planta.imagen)
    );
  }
}
// Función de inicialización para cargar el carrito y mostrar las plantas al cargar la página
function init() {
  cargarCarrito();
  mostrarPlantas();
  mostrarCarrito();
}

init();
