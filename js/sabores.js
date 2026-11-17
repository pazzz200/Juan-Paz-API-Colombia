// Link de la API de platos tipicos
const urlPlatos = "https://api-colombia.com/api/v1/TypicalDish";

// Traemos los elementos del HTML
const cargando = document.getElementById("cargando");
const mensajeError = document.getElementById("error");
const lista = document.getElementById("lista-platos");
const totalPlatos = document.getElementById("total-platos");

// Estas imagenes de la API no cargan, entonces las descargue de Wikimedia
// y las guarde en la carpeta img/platos
const imagenesArregladas = {
    "Tamal Tolimense": "../img/platos/tamal-tolimense.jpg",
    "Arroz de Lisa": "../img/platos/arroz-de-lisa.jpg",
    "Ternera a la llanera": "../img/platos/ternera-a-la-llanera.jpg",
    "Dulce de guayaba": "../img/platos/dulce-de-guayaba.jpg",
    "Arroz con pollo": "../img/platos/arroz-con-pollo.jpg"
};

// Por si alguna otra imagen falla, se pone esta
const imagenRespaldo = "https://placehold.co/500x300/f8faf7/40916c?text=Imagen+no+disponible";


// Funcion principal: pide los platos y pinta todo
async function cargarPlatos() {
    try {
        const respuesta = await fetch(urlPlatos);

        // Si la API responde con error lo mandamos al catch
        if (!respuesta.ok) {
            throw new Error("La API no respondio bien");
        }

        const platos = await respuesta.json();

        // Extra del reto: contar los platos
        totalPlatos.textContent = platos.length;

        mostrarPlatos(platos);

        // Ya llego todo, quitamos el "Cargando..."
        cargando.hidden = true;

    } catch (error) {
        console.log("Error:", error);
        cargando.hidden = true;
        mensajeError.textContent = "No se pudieron cargar los platos. Intenta de nuevo mas tarde.";
        mensajeError.hidden = false;
    }
}


// Devuelve la imagen buena: la arreglada si esta en la lista, si no la de la API
function obtenerImagen(plato) {
    if (imagenesArregladas[plato.name]) {
        return imagenesArregladas[plato.name];
    }
    return plato.imageUrl;
}


// Crea una tarjeta por cada plato
function mostrarPlatos(platos) {
    platos.forEach(plato => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-plato");

        // La imagen la creo aparte para poder ponerle el onerror
        const imagen = document.createElement("img");
        imagen.src = obtenerImagen(plato);
        imagen.alt = plato.name;
        imagen.loading = "lazy"; // carga la foto solo cuando uno baja hasta ella

        // Si la imagen no carga, ponemos la de respaldo
        imagen.onerror = () => {
            imagen.src = imagenRespaldo;
        };

        const info = document.createElement("div");
        info.classList.add("info-plato");
        info.innerHTML = `
            <span class="departamento">${plato.department.name}</span>
            <h3>${plato.name}</h3>
            <p class="descripcion">${plato.description}</p>
        `;

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(info);
        lista.appendChild(tarjeta);
    });
}


// Arrancamos
cargarPlatos();
