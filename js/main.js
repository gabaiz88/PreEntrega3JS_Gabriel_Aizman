// const TAMANIO_HARINA = 1000;
// const CANT_HUEVOS = 30;
// const TAMANIO_LECHE = 1000;
// const TAMANIO_MANTECA = 500;
// const TAMANIO_AZUCAR = 1000;
// const TAMANIO_MEMBRILLO = 500;
// const TAMANIO_CHOCOLATE = 1000;
// const cantOpciones = 4; 
// let precio;

// const ingredientesPastafrola = [
//     {id: 1, nombre: "HUEVO", precio: 200, tamanio: CANT_HUEVOS},
//     {id: 2, nombre: "HARINA", precio: 0, tamanio: TAMANIO_HARINA},
//     {id: 3, nombre: "AZUCAR", precio: 0, tamanio: TAMANIO_AZUCAR},
//     {id: 4, nombre: "MANTECA", precio: 0, tamanio: TAMANIO_MANTECA},
//     {id: 5, nombre: "MEMBRILLO", precio: 0, tamanio: TAMANIO_MEMBRILLO},
// ];

// const ingredientesBrownie = [
//     {id: 1, nombre: "HUEVO", precio: 0, tamanio: CANT_HUEVOS},
//     {id: 2, nombre: "HARINA", precio: 0, tamanio: TAMANIO_HARINA},
//     {id: 3, nombre: "AZUCAR", precio: 0, tamanio: TAMANIO_AZUCAR},
//     {id: 4, nombre: "MANTECA", precio: 0, tamanio: TAMANIO_MANTECA},
//     {id: 5, nombre: "CHOCOLATE", precio: 0, tamanio: TAMANIO_CHOCOLATE},
// ];

// const tortas = [    
//     {id: 1, ingredientesPastafrola},
//     {id:2, ingredientesBrownie},
// ];

// const listaIngredientes = document.getElementById("tablaIngredientes");

// opcionModal = document.getElementById("modal_1");



// ingredientesPastafrola.forEach(ingrediente => {
//     if (ingrediente.precio == 0){
//         tabla = document.getElementById("tablaIngredientes");
//         tabla.insertRow(-1).innerHTML = 
//         `<td id="fila">${ingrediente.nombre}</td>
//         <td id="fila">${ingrediente.tamanio}</td>
//         <td><button class="btn btn-danger" id="agregarPrecio">Agregar Precio</button></td>
//         <td><button class="btn" id="boton${ingrediente.id}"><img src="./img/x.png" alt="" width=15px></button></td>`;
//     } else {
//         tabla = document.getElementById("tablaIngredientes");
//         tabla.insertRow(-1).innerHTML = 
//         `<td id="fila">${ingrediente.nombre}</td>
//         <td id="fila">${ingrediente.tamanio}</td>
//         <td id="fila">${ingrediente.precio}</td>
//         <td><button class="btn" id="boton${ingrediente.id}"><img src="./img/x.png" alt="" width=15px></button></td>`;
//     }
// });

// document.addEventListener("DOMContentLoaded", DibujarModal);
// listaIngredientes.addEventListener("click", (e) => {
//    e.preventDefault(); 
//    console.log(e);
// });

//Variables
const formularioUI = document.getElementById("formulario");
const listaIngredientesUI = document.getElementById("listaIngredientes");
let arrayIngredientes = [];



//Funciones

const crearItem = (ingrediente, tamanio, precio) => {
    let ingredienteUpper = ingrediente.toLowerCase();
    let item = {
        ingrediente: ingredienteUpper, 
        tamanio: tamanio,
        precio: precio
    }

    arrayIngredientes.push(item);
    return item;
}

const guardarIngrediente = () => {

    localStorage.setItem("lista", JSON.stringify(arrayIngredientes));
    listarDB();

}

const listarDB = () => {
    listaIngredientesUI.innerHTML = "";

    arrayIngredientes = JSON.parse(localStorage.getItem("lista")); 
    if(arrayIngredientes === null){
        arrayIngredientes = [];
    } else {
        arrayIngredientes.forEach(element => {
            listaIngredientesUI.innerHTML += `
            <div class="alert alert-primary" role="alert">
                <i class="icono float-left mr-2"><img src="./img/ingredientes.png" alt="ingredientes"></i>
                <b>${element.ingrediente}</b>
                <span>- Tamaño:${element.tamanio}</span>
                <span>- Precio: $${element.precio}</span>
                <span class="float-right">
                    <i class="material-icons">
                        delete
                    </i>
                </span>
            </div>
            `
        });
    }
}
//EventListener

formularioUI.addEventListener("submit", (e) => {
    e.preventDefault();

    let ingrediente_inputUI = document.getElementById("ingrediente_input").value;
    if (ingrediente_inputUI === ""){
        ingrediente_inputUI = "Undefined"
    }
    let tamanio_inputUI = document.getElementById("tamanio_input").value;
    if (tamanio_inputUI === ""){
        tamanio_inputUI = 0;
    }
    let precio_inputUI = document.getElementById("precio_input").value;
    if (precio_inputUI === ""){
        precio_inputUI = 0;
    }
    console.log(ingrediente_inputUI);
    crearItem(ingrediente_inputUI, tamanio_inputUI, precio_inputUI);
    guardarIngrediente();
    formularioUI.reset();
});

document.addEventListener("DOMContentLoaded", listarDB);