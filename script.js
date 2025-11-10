// Función constructora para crear objetos de plantas
function Planta(nombre, precio, imagen) {
  this.nombre = nombre;
  this.precio = precio;
  this.imagen = imagen;
}

// Variables para manejar los contenedores en el HTML
const plantasContainer = document.getElementById("plantas-container");
const carritoContainer = document.getElementById("carrito-container");
const totalCarrito = document.getElementById("total-carrito");

// Array para almacenar los productos en el carrito
let carrito = [];
let plantas = []; // array para llenar con datos del JSON

// Función para cargar plantas desde un archivo JSON de manera asíncrona
async function cargarPlantas() {
  if (!plantasContainer) return; // si no existe contenedor de tienda, no hago nada
  try {
    const response = await fetch("plantas.json");
    const data = await response.json();
    plantas = data.map(
      (p) => new Planta(p.nombre, p.precio, p.imagen)
    );
    mostrarPlantas();
  } catch (error) {
    console.error("Error al cargar las plantas:", error);
  }
}

// Función para mostrar las plantas en la tienda
function mostrarPlantas() {
  if (!plantasContainer) return;
  plantasContainer.innerHTML = "";

  plantas.forEach((planta) => {
    const plantaDiv = document.createElement("article");
    plantaDiv.className = "plantas-item"; 
    plantaDiv.innerHTML = `
      <h3 class="titulos-plantas">${planta.nombre}</h3>
      <img src="/img/${planta.imagen}" alt="Planta ${planta.nombre}" class="imagen-hover" />
      <p>$${planta.precio}</p>
      <button>Agregar al carrito</button>
    `;
    const botonAgregar = plantaDiv.querySelector("button");
    botonAgregar.addEventListener("click", () => agregarAlCarrito(planta));

    plantasContainer.appendChild(plantaDiv);
  });
}

// Función para agregar al carrito
function agregarAlCarrito(planta) {
  carrito.push(planta);
  mostrarCarrito();
  guardarCarrito();
  Swal.fire({
    icon: 'success',
    title: '¡Agregado!',
    text: `${planta.nombre} se agregó al carrito`,
    timer: 1500,
    showConfirmButton: false
  });
}

// Función para mostrar el carrito
function mostrarCarrito() {
  if (!carritoContainer || !totalCarrito) return;
  carritoContainer.innerHTML = "";

  carrito.forEach((planta, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item-carrito";
    itemDiv.innerHTML = `
      <span>${planta.nombre} - $${planta.precio}</span>
      <button>Eliminar</button> 
    `;
    const botonEliminar = itemDiv.querySelector("button");
    botonEliminar.addEventListener("click", () => {
      Swal.fire({
        title: `¿Eliminar ${planta.nombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          carrito.splice(index, 1);
          mostrarCarrito();
          guardarCarrito();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: `${planta.nombre} fue eliminado del carrito`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    });
    carritoContainer.appendChild(itemDiv);
  });

  const total = carrito.reduce((acc, planta) => acc + planta.precio, 0);
  totalCarrito.textContent = `Total: $${total}`;

const footerDiv = document.createElement("div");
footerDiv.className = "carrito-footer";

// Botón finalizar compra
const botonFinalizar = document.createElement("button");
botonFinalizar.className = "btn-finalizar";
botonFinalizar.textContent = "Finalizar compra";

// Deshabilitar si el carrito está vacío
if (total === 0) {
  botonFinalizar.disabled = true;
  botonFinalizar.style.opacity = "0.6";
} else {
  botonFinalizar.disabled = false;
  botonFinalizar.style.opacity = "1";
}

// Mensaje de confirmación al finalizar compra (pide envío + método de pago antes)
botonFinalizar.addEventListener("click", async () => {
  // 1) pedir datos de envío
  const envio = await pedirDatosEnvio();
  if (!envio) return; // usuario canceló

  // 2) pedir método de pago (y datos si aplica)
  const pagoInfo = await pedirMetodoPago();
  if (!pagoInfo) return; // canceló

  // resumen de pago (ocultamos parte del número si viene tarjeta)
  let pagoResumen = pagoInfo.metodo;
  if (pagoInfo.tarjeta) {
    const last4 = pagoInfo.tarjeta.slice(-4);
    pagoResumen = `${pagoInfo.metodo} - **** ${last4}`;
  }

  // 3) confirmar todo junto
  Swal.fire({
    title: 'Confirmar compra',
    html: `Total a pagar: <b>$${total}</b><br><br>
           <b>Envío a:</b><br>
           ${envio.nombre}<br>
           ${envio.direccion}<br>
           ${envio.telefono}<br>
           ${envio.email}<br><br>
           <b>Pago:</b><br>
           ${pagoResumen}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Volver'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem('envio', JSON.stringify(envio));
      localStorage.setItem('pago', JSON.stringify(pagoInfo));
      carrito = [];
      guardarCarrito();
      mostrarCarrito();
      Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'Gracias por tu compra. Te contactaremos para la entrega.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // opcional: redirigir a tienda
        window.location.href = '/pages/tienda.html';
      });
    }
  });
});

footerDiv.appendChild(botonFinalizar);
carritoContainer.appendChild(footerDiv);
  
}

// Guardar y cargar carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    const carritoParseado = JSON.parse(carritoGuardado);
    carrito = carritoParseado.map(
      (planta) => new Planta(planta.nombre, planta.precio, planta.imagen)
    );
  }
}

// Pide datos de envío usando SweetAlert2. Devuelve un objeto {nombre,direccion,telefono,email} o null si cancela
function pedirDatosEnvio() {
  return Swal.fire({
    title: 'Datos de envío',
    html:
      '<input id="swal-nombre" class="swal2-input" placeholder="Nombre completo">' +
      '<input id="swal-direccion" class="swal2-input" placeholder="Dirección">' +
      '<input id="swal-telefono" class="swal2-input" placeholder="Teléfono">' +
      '<input id="swal-email" class="swal2-input" placeholder="Email">',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    preConfirm: () => {
      const nombre = document.getElementById('swal-nombre').value.trim();
      const direccion = document.getElementById('swal-direccion').value.trim();
      const telefono = document.getElementById('swal-telefono').value.trim();
      const email = document.getElementById('swal-email').value.trim();
      if (!nombre || !direccion || !telefono || !email) {
        Swal.showValidationMessage('Por favor completa todos los campos');
        return;
      }
      return { nombre, direccion, telefono, email };
    }
  }).then(result => result.isConfirmed ? result.value : null);
}

// Pide método de pago y, si corresponde, datos de tarjeta. Devuelve {metodo, tarjeta?, vto?, cvv?} o null si cancela
function pedirMetodoPago() {
  return Swal.fire({
    title: 'Método de pago',
    html:
      '<select id="swal-metodo" class="swal2-select">' +
      '<option value="">Seleccione...</option>' +
      '<option value="Tarjeta">Tarjeta</option>' +
      '<option value="MercadoPago">MercadoPago</option>' +
      '<option value="Efectivo">Efectivo</option>' +
      '</select>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    preConfirm: () => {
      const metodo = document.getElementById('swal-metodo').value;
      if (!metodo) {
        Swal.showValidationMessage('Selecciona un método de pago');
        return;
      }
      return metodo;
    }
  }).then(async (result) => {
    if (!result.isConfirmed) return null;
    const metodo = result.value;
    if (metodo === 'Tarjeta') {
      const tarjetaRes = await Swal.fire({
        title: 'Datos de tarjeta',
        html:
          '<input id="swal-tarjeta" class="swal2-input" placeholder="Número de tarjeta">' +
          '<input id="swal-vto" class="swal2-input" placeholder="MM/AA">' +
          '<input id="swal-cvv" class="swal2-input" placeholder="CVV">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        preConfirm: () => {
          const tarjeta = document.getElementById('swal-tarjeta').value.replace(/\s+/g, '').trim();
          const vto = document.getElementById('swal-vto').value.trim();
          const cvv = document.getElementById('swal-cvv').value.trim();
          if (!tarjeta || !vto || !cvv) {
            Swal.showValidationMessage('Completa todos los datos de la tarjeta');
            return;
          }
          return { metodo, tarjeta, vto, cvv };
        }
      });
      return tarjetaRes.isConfirmed ? tarjetaRes.value : null;
    }
    // Para otros métodos devolvemos solo el nombre del método
    return { metodo };
  });
}

// Inicialización
function init() {
  cargarCarrito();
  cargarPlantas();
  mostrarCarrito();
}

init();
