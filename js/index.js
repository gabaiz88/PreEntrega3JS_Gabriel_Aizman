//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");
const misTortas = [];

//Constructor
function crearTorta (id, nombre) {
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

//lista las tortas en el DOM
const ListarNombresTortasDB = (torta) => {
    listaLinksUI.innerHTML = "";
    if(misTortas === null){
        misTortas = [];
    } else {
        misTortas.forEach(element => {
            listaLinksUI.innerHTML += `<a href="./ingredientes.html?id=${element.id}" class="item">
            <i class="cake_icon"><img src="./img/cake.png" alt="icono_torta"></i>
            <p>${element.nombre}</p>
        </a>`
        });
    }
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
            confirmarGuardado();
            ListarNombresTortasDB(torta);
            console.log(misTortas);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'El nombre de la torta esta repetido. Ingrese uno nuevo.',
              })
        }
    }
}

// function getMovieId() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const movieId = urlParams.get("id");
//     return movieId;
// }

// Funcion de crear la torta
function creacionTortas (torta) {
    id = setID();
    let tortaCreada = new crearTorta(id, torta);
    guardarNombreTorta(tortaCreada);
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

// function getMovieId() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const movieId = urlParams.get("id");
//     return movieId;
// }


// FUNCION EN EL ARCHIVO PRODUCTS.JS 
//function getMovieId() {
//     const urlParams = new URLSearchParams(window.location.search);
// CALL = html: `<p>${overview}</p>
//                 <a class="btn btn-primary" href="movie.html?id=${id}">Más detalles</a>
//                 `,
// DENTRO DE Swal.fire
