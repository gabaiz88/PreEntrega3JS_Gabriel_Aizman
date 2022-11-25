//Variables

const listaLinksUI = document.getElementById("listaLinks");
const botonTortasUI = document.getElementById("botonTortas");

//Funciones

//EventListener

listaLinksUI.addEventListener("click", (e) => {

    e.preventDefault();

    if(e.target.innerHTML){
        console.log(e);
        let torta = e.path[1].childNodes[3].innerHTML;
        console.log(torta);
    }
});