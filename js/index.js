//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");
const botonEliminarUI = document.getElementById("boton_eliminar")
let misTortas = [];
let misTortasFijas = [];
let sesion;

//Constructor
function Torta(id, nombre) {
    this.id = id;
    this.nombre = nombre;
}

//Funciones

function bienvenida () {
    let sesionOk = sessionStorage.getItem("sesion");
    if(!sesionOk){
        Swal.fire({
            title: 'Bienvenido al simulador de costos para tus tortas. Podes utilizar las tortas predefinidas o agregar la que desees. Comencemos!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__hinge'
            }
          })
        sessionStorage.setItem("sesion", true);
    }
}

//setea el ID
function setID() {
    if (misTortas.length == 4) {
        id = 5;
    } else {
        id++;
    }
    return id;
}

//Muestra un alert si esta guardada
const confirmarGuardado = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Nombre de torta guardado.'
    })
}

//Guarda la torta en localStorage y lista
const guardarTorta = () => {
    localStorage.setItem("listaTortas", JSON.stringify(misTortas));
    ListarNombresTortasDB();
};

//Elimina la torta
const eliminarItem = (torta) => {
    let indexArray;
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
            Swal.fire("Borrado!", "Tu torta se borró.", "success");
            misTortas.forEach((elemento, index) => {
                if (elemento.nombre === torta) {
                    indexArray = index;
                }
            });
            misTortas.splice(indexArray, 1);
            guardarTorta();
        }
    });
};

//Lista las tortas en el DOM
const ListarNombresTortasDB = () => {
    listaLinksUI.innerHTML = "";
    misTortas = JSON.parse(localStorage.getItem("listaTortas"));
    if (misTortas === null) {
        misTortas = [];
    } else {
        misTortas.forEach((element) => {
            listaLinksUI.innerHTML += `</div><a href="./ingredientes.html?id=${element.id}&nombre=${element.nombre}" class="item">
            <i class="cake_icon"><img src="./img/cake.png" alt="icono_torta"></i><div class="item_contenedor">
            <p>${element.nombre}</p></div><i id="trash_index" class="material-icons">delete</i>`
        });
    }
}

// Funcion de crear la torta
function creacionTortas(torta) {
    id = setID();
    let tortaCreada = new Torta(id, torta);
    guardarNombreTorta(tortaCreada);
}

//Guarda el nombre de la torta
const guardarNombreTorta = (torta) => {
    let i = 0;
    let nombreIgual = false;
    if (torta.nombre != undefined) {
        if (misTortas.length != 0) {
            while (i < misTortas.length && !nombreIgual) {
                if (misTortas[i].nombre != torta.nombre) {
                    i++;
                } else {
                    nombreIgual = true;
                }
            }
        }
        if (!nombreIgual) {
            misTortas.push(torta);
            guardarTorta()
            confirmarGuardado();
            const url = new URL(`https://ingredientes.html?id=${torta.id}`);
        } else {
            if (misTortasFijas.length === 4) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'El nombre de la torta esta repetido. Ingrese uno nuevo.',
                })
            }
        }
    }
}

//Alertar torta no existe
function tortaNoExiste() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La torta ingresada no existe',
    })
}

//Funcion fetch del data.json
function traerProductos() {
    if (misTortasFijas.length === 0) {
        fetch("../data.json")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                data.forEach((element) => {
                    guardarNombreTorta(element);
                    misTortasFijas.push(element);
                });
            });
    }
}

//Alerta de error al querer eliminar
function errorEliminar() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Esta torta no se puede eliminar ya que es parte de las predefinidas',
    })
}

//EventListener
botonTortasUI.addEventListener("click", async (e) => {
    e.preventDefault();
    const { value: nombreTorta } = await Swal.fire({
        title: 'Ingrese el nombre de la torta',
        input: 'text',
        inputPlaceholder: 'Ingrese aqui el nombre de la torta',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesita ingresar un nombre!'
            }
        }
    })
    creacionTortas(nombreTorta);
});

//genera la lista apenas carga el documento
document.addEventListener("DOMContentLoaded", ListarNombresTortasDB);
document.addEventListener("DOMContentLoaded", traerProductos);
document.addEventListener("DOMContentLoaded", bienvenida);


//eliminar desde Ico
listaLinksUI.addEventListener("click", (e) => {
    console.log(e);
    if (e.target.innerHTML === "delete") {
        e.preventDefault();
        let torta = e.target.parentElement.childNodes[2].childNodes[1].innerHTML;
        let found = misTortasFijas.find(element => torta === element.nombre);
        if (found) {
            errorEliminar(torta);
        } else {
            //Eliminar torta
            eliminarItem(torta);
        }
    }
});

//Eliminar en mobile
botonEliminarUI.addEventListener("click", async (e) => {
    e.preventDefault
    const { value: nombreTorta } = await Swal.fire({
        title: 'Ingrese el nombre de la torta',
        input: 'text',
        inputPlaceholder: 'Ingrese aqui el nombre de la torta',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesita ingresar un nombre!'
            }
        }
    })
    let found = misTortasFijas.find(element => nombreTorta === element.nombre);
    if (found) {
        errorEliminar();
    } else {
        misTortas.forEach(element => {
            if (element.nombre === nombreTorta) {
                eliminarItem(nombreTorta);
            } else {
                tortaNoExiste();
            }
        });
    }
});

