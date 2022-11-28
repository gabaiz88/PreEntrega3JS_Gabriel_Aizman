//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");
let misTortas = [];

//Constructor
function Torta (id, nombre) {
    this.id = id;
    this.nombre = nombre;
}

//Funciones

//setea el ID
function setID () {
    let id;
    if(misTortas.length === 0){
        id = 1;
    } else {
        id = misTortas.length + 1;
    }
    return id;
}

//muestra un alert si esta guardada
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

//lista las tortas en el DOM
const ListarNombresTortasDB = () => {
    listaLinksUI.innerHTML = "";
    misTortas = JSON.parse(localStorage.getItem("listaTortas"));
    if(misTortas === null){
        misTortas = [];
    } else {
        misTortas.forEach((element) => {
            listaLinksUI.innerHTML += `</div><a href="./ingredientes.html?id=${element.id}&nombre=${element.nombre}" class="item">
            <i class="cake_icon"><img src="./img/cake.png" alt="icono_torta"></i>
            <p>${element.nombre}</p>`
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
            console.log(url);
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
