//Variables

const formularioUI = document.getElementById("formulario");
const botonCosto = document.getElementById("boton_costo");
const listaIngredientesUI = document.getElementById("listaIngredientes");
const boton_eliminarUI = document.getElementById("boton_eliminar");
let arrayIngredientes = [];
let arrayCostos = [];

//Funciones

//setea el ID
// function setID() {
//     let id;
//     if (arrayTortas.length === 0) {
//         id = 1;
//     } else {
//         id = arrayTortas.length + 1;
//     }
//     return id;
// }

//recibe el id de la torta en el index
function getId() {
    const urlParams = new URLSearchParams(window.location.search);
    const tortaId = urlParams.get("id");
    return tortaId;
}

//recibe el nombre de la torta en el index
function getNombre() {
    const urlParams = new URLSearchParams(window.location.search);
    const tortaNombre = urlParams.get("nombre");
    return tortaNombre;
}

//crea el item
const crearItem = (ingrediente, tamanio, precio, cantidad) => {
    let ingredienteUpper = ingrediente.toLowerCase();
    let item = {
        id: getId(),
        ingrediente: ingredienteUpper,
        tamanio: tamanio,
        precio: precio,
        cantidad: cantidad,
    };
    return item;
};

//guarda el ingrediente en el local storage, calcula costo y lista la base de datos
const guardarIngrediente = () => {
    localStorage.setItem("lista", JSON.stringify(arrayIngredientes));
    calcularCosto();
    listarDB();
};

//agrega el nombre de la torta del index al titulo de la pagina
const agregarTitulo = () => {
    let titulo = document.getElementById("titulo");
    nombre = getNombre();
    titulo.innerHTML += `<h1>Ingredientes de ${nombre}</h1>`
}

//lista la DB
const listarDB = () => {
    listaIngredientesUI.innerHTML = "";
    arrayCostos = JSON.parse(localStorage.getItem("costos"));
    if (arrayCostos === null){
        arrayCostos = [];
    }
    arrayIngredientes = JSON.parse(localStorage.getItem("lista"));
    if (arrayIngredientes === null) {
        arrayIngredientes = [];
    } else {
        let ingredienteFiltrados = arrayIngredientes.filter(item => item.id === getId())
        ingredienteFiltrados.forEach((element) => {
            listaIngredientesUI.innerHTML += `<div class="alert alert-primary" role="alert"><i class="icono float-left mr-2"><img src="./img/ingredientes.png" alt="ingredientes"></i><b>${element.ingrediente}</b><span>  - Tamaño: ${element.tamanio}</span><span>  - Precio: $${element.precio}</span><span>  - Cantidad: ${element.cantidad}</span><span class="float-right"><i id="trash" class="material-icons">delete</i></span></div>`;
        });
        let costosFiltrados = arrayCostos[getId()-1];
        if (costosFiltrados === undefined || costosFiltrados === null){
            costosFiltrados = 0;
        }
        listaIngredientesUI.innerHTML += `
        <div class="form_costo"><div class="input-group mb-3"><span class="input-group-text">RESULTADO/COSTO:</span><output id="resultado_costo" class="form-control" aria-label="">${costosFiltrados}</div></div>`;
    }
};

//elimina un item de la DB
const eliminarItem = (ingrediente) => {
    Swal.fire({
        title: "Estas seguro/a?",
        text: "No podrás revertirlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borralo!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Borrado!", "Tu ingrediente se borró.", "success");
            arrayIngredientes.forEach((elemento, index) => {
                if (elemento.ingrediente === ingrediente) {
                    indexArray = index;
                }
            });
            arrayIngredientes.splice(indexArray, 1);
            guardarIngrediente();
        }
    });
};

//Calcula el costo
const calcularCosto = () => {
    let costoIndividual = 0;
    let sumarCostos = 0;
    arrayIngredientes.forEach((elemento) => {
        if(elemento.id === getId()){
            if (elemento.precio > 0 && elemento.cantidad > 0 && elemento.tamanio > 0) {
                costoIndividual = parseFloat((elemento.cantidad / elemento.tamanio) * elemento.precio);
            } else {
                costoIndividual = 0;
            }
            sumarCostos += parseFloat(costoIndividual);
        }
    });
    arrayCostos[getId()-1] = sumarCostos.toFixed(2);
    localStorage.setItem("costos", JSON.stringify(arrayCostos));
    return sumarCostos;
};

//sweet alert del mensaje de guardado
const mensajeGuardado = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
    Toast.fire({
        icon: "success",
        title: "Ingrediente guardado",
    });
};

//valida si los datos ingresados son correctos
const validarDato = (dato) => {
    let validado = false;
    if (dato != "") {
        validado = true;
    }
    return validado;
};

//EventListener

formularioUI.addEventListener("submit", (e) => {
    e.preventDefault();
    let todosValidos = false;
    let ingrediente_inputUI = document.getElementById("ingrediente_input").value;
    if (validarDato(ingrediente_inputUI)) {
        let tamanio_inputUI = document.getElementById("tamanio_input").value;
        if (validarDato(tamanio_inputUI)) {
            let precio_inputUI = document.getElementById("precio_input").value;
            if (validarDato(precio_inputUI)) {
                let cantidad_inputUI = document.getElementById("cantidad_input").value;
                if (validarDato(cantidad_inputUI)) {
                    arrayIngredientes.push(
                        crearItem(
                            ingrediente_inputUI,
                            tamanio_inputUI,
                            precio_inputUI,
                            cantidad_inputUI
                        )
                    );
                    guardarIngrediente();
                    mensajeGuardado();
                    formularioUI.reset();
                    todosValidos = true;
                }
            }
        }
    }
    if (!todosValidos) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algunos de los campos estan vacios",
        });
    }
});

document.addEventListener("DOMContentLoaded", listarDB);
document.addEventListener("DOMContentLoaded", agregarTitulo);

listaIngredientesUI.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.innerHTML === "delete") {
        let ingrediente = e.path[2].childNodes[1].innerHTML;
        //Eliminar ingrediente
        eliminarItem(ingrediente);
    }
});

boton_eliminarUI.addEventListener("click", (e) => {
    e.preventDefault();
    ingrediente = arrayIngredientes[arrayIngredientes.length - 1].ingrediente;
    eliminarItem(ingrediente);
});

