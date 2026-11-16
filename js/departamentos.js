// Links de la API que vamos a usar
const urlDepartamentos = "https://api-colombia.com/api/v1/Department";
const urlRegiones = "https://api-colombia.com/api/v1/Region";

// Traemos los elementos del HTML
const cargando = document.getElementById("cargando");
const mensajeError = document.getElementById("error");
const lista = document.getElementById("lista-departamentos");
const conteoRegiones = document.getElementById("conteo-regiones");


// Funcion principal: pide los datos y pinta todo
async function cargarDepartamentos() {
    try {
        // Los departamentos no traen el nombre de la region (viene null),
        // solo el regionId, entonces toca pedir las regiones aparte
        const respuestaRegiones = await fetch(urlRegiones);
        const respuestaDepartamentos = await fetch(urlDepartamentos);

        // Si la API responde con error lo mandamos al catch
        if (!respuestaRegiones.ok || !respuestaDepartamentos.ok) {
            throw new Error("La API no respondio bien");
        }

        const regiones = await respuestaRegiones.json();
        const departamentos = await respuestaDepartamentos.json();

        // Los ordeno por nombre para que salgan en orden alfabetico
        departamentos.sort((a, b) => a.name.localeCompare(b.name));

        mostrarConteo(departamentos, regiones);
        mostrarDepartamentos(departamentos, regiones);

        // Ya llego todo, quitamos el "Cargando..."
        cargando.hidden = true;

    } catch (error) {
        console.log("Error:", error);
        cargando.hidden = true;
        mensajeError.textContent = "No se pudieron cargar los departamentos. Intenta de nuevo mas tarde.";
        mensajeError.hidden = false;
    }
}


// Busca el nombre de la region usando el id
function nombreRegion(regiones, id) {
    const region = regiones.find(r => r.id === id);

    if (region) {
        return region.name;
    }
    return "Sin region";
}


// Crea una tarjeta por cada departamento
function mostrarDepartamentos(departamentos, regiones) {
    departamentos.forEach(departamento => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-departamento");

        // toLocaleString pone los puntos de miles
        tarjeta.innerHTML = `
            <span class="region">${nombreRegion(regiones, departamento.regionId)}</span>
            <h3>${departamento.name}</h3>
            <div class="datos">
                <p><strong>Poblacion:</strong> ${departamento.population.toLocaleString("es-CO")} hab.</p>
                <p><strong>Superficie:</strong> ${departamento.surface.toLocaleString("es-CO")} km²</p>
            </div>
            <p class="descripcion">${departamento.description}</p>
        `;

        lista.appendChild(tarjeta);
    });
}


// Contar cuantos departamentos hay en cada region
function mostrarConteo(departamentos, regiones) {
    const conteo = {};

    departamentos.forEach(departamento => {
        const region = nombreRegion(regiones, departamento.regionId);

        // si la region no estaba en el objeto arranca en 0 y le sumamos 1
        conteo[region] = (conteo[region] || 0) + 1;
    });

    // Recorremos el objeto y creamos una cajita por region
    for (const region in conteo) {
        const caja = document.createElement("div");
        caja.classList.add("caja-region");
        caja.innerHTML = `<span>${conteo[region]}</span> ${region}`;
        conteoRegiones.appendChild(caja);
    }
}


// Arrancamos
cargarDepartamentos();
