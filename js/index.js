//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");
let misTortas = [];
let id = -1;

//Constructor
function Torta (id, nombre) {
    this.id = id;
    this.nombre = nombre;
}

//Funciones

//Bienvenida
function bienvenida () {
    if (misTortas.length === 0){
        Swal.fire('Bienvenido/a al simulador de costos para tus tortas.')
    }
}

//setea el ID
function setID () {
    if(id === -1){
        id = 1;
    } else {
        id ++;
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
    if (misTortas.length === 0){
        localStorage.clear();
    }
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
    if(misTortas === null){
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
function creacionTortas (torta) {
    id = setID();
    let tortaCreada = new Torta(id, torta);
    guardarNombreTorta(tortaCreada);
}

//Guarda el nombre de la torta
const guardarNombreTorta = (torta) =>{
    let i = 0;
    let nombreIgual = false;
    if (torta.nombre != undefined) {
        if(misTortas.length != 0){
            while (i < misTortas.length && !nombreIgual){
                if (misTortas[i].nombre != torta.nombre){
                    i++;
                } else {
                    nombreIgual = true;
                }
            }
        }
        if (!nombreIgual){
            misTortas.push(torta);
            guardarTorta()
            confirmarGuardado();
            const url = new URL(`https://ingredientes.html?id=${torta.id}`);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'El nombre de la torta esta repetido. Ingrese uno nuevo.',
              })
        }
    }
}

//EventListener
botonTortasUI.addEventListener("click", async(e) => {

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
document.addEventListener("DOMContentLoaded", bienvenida);


listaLinksUI.addEventListener("click", (e) => {
    if (e.target.innerHTML === "delete") {
        e.preventDefault();
        console.log(e);
        let torta = e.path[1].childNodes[2].childNodes[1].innerHTML;
        //Eliminar torta
        eliminarItem(torta);
    }
});