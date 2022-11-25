//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");
const misTortas = [];

//Funciones

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

const ListarNombresTortasDB = (torta) => {
    listaLinksUI.innerHTML = "";
    if(misTortas === null){
        misTortas = [];
    } else {
        misTortas.forEach(element => {
            listaLinksUI.innerHTML += `<a href="/pastafrola.html" class="item">
            <i class="cake_icon"><img src="./img/cake.png" alt="icono_torta"></i>
            <p>${element}</p>
        </a>`
        });
    }
    console.log(misTortas);
}


const guardarNombreTorta = (torta) =>{
    let i = 0;
    let nombreIgual = false;
    if (torta != undefined) {
        if(misTortas.length != 0){
            while (i < misTortas.length && !nombreIgual){
                if (misTortas[i] != torta){
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
    guardarNombreTorta(nombreTorta);
});
