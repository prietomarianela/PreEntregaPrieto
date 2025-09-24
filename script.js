// Definición de las plantas disponibles en la tienda
const plantas = [
    { nombre: "Monstera", precio: 30000},
    { nombre: "Ficus", precio: 25000},
    { nombre: "Cactus", precio: 15000},
    { nombre: "Helecho", precio: 20000},
    { nombre: "Palma", precio: 35000}
];

// Función para mostrar las plantas y permitir la selección
 
function seleccionarPlanta() {
  let mensaje = "¿Qué planta querés comprar?\n\n";

  for (let i = 0; i < plantas.length; i++) {
    mensaje += (i + 1) + ". " + plantas[i].nombre + " - $" + plantas[i].precio + "\n";
  }

  mensaje += "\nEscribí el número de la planta que querés:";

  let eleccion = prompt(mensaje);
  let indice = parseInt(eleccion) - 1;

if (indice >= 0 && indice < plantas.length) {
    console.log("Planta seleccionada: " + plantas[indice].nombre + " - $" + plantas[indice].precio);
    alert("Has seleccionado: " + plantas[indice].nombre + " - $" + plantas[indice].precio); 
    return plantas[indice];
}

else {
    alert("Selección inválida. Por favor, intentá de nuevo.");
    console.log("Selección inválida");
    return seleccionarPlanta();
}
console.log("Fin de la selección de planta");
}

// Mensaje de bienvenida

alert("¡Bienvenido a la tienda de Vivero Verde! \nAcá encontrarás las mejores plantas para tu hogar.");
console.log("mensaje de bienvenida enviado");   

// Variables para el carrito de compras
let total = 0;
let seguirComprando = true;

while (seguirComprando) {
    const planta = seleccionarPlanta();
    total += planta.precio;

    seguirComprando = confirm("¿Querés agregar otra planta?");
}

// Mostrar el total de la compra

alert("El total de tu compra es: $" + total + "\n¡Gracias por comprar en Vivero Verde!");
console.log ("Compra finalizada. Total: $" + total);




