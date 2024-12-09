let contador = 1;
let urlGlobal = "https://rickandmortyapi.com/api/character";

// Función para cargar datos usando AJAX
function cargarDatos(url, callback) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: callback,
        error: (error) => console.error("Error cargando datos desde la URL:", error)
    });
}

// Botón "Siguiente"
$(".btnNext").on("click", function () {
    contador++;
    let urlNext = `${urlGlobal}?page=${contador}`;
    $(".container").html("");
    $(".btnAnterior").css("display", "inline-block");
    mostrarPersonajes(urlNext);
});

// Botón "Anterior"
$(".btnAnterior").on("click", function () {
    contador--;
    let urlPrev = `${urlGlobal}?page=${contador}`;
    $(".container").html("");
    mostrarPersonajes(urlPrev);

    if (contador === 1) $(".btnAnterior").css("display", "none");
});

// Botón "Buscar"
$(".btnBuscar").on("click", function () {
    $(".personajes-container").html("")
    contador = 1;
    mostrarPersonajes(urlGlobal);
    $(".btnNext-Episodes").css("display", "none")
    $(".btnPrevious-Episodes").css("display", "none")
    $(".btnAnterior").css("display", "none");
    $(".btnNext").css("display", "inline-block");
});

// Mostrar personajes con URL dinámica
function mostrarPersonajes(url = urlGlobal) {
    cargarDatos(url, function (data) {
        const div = $(".container").html(""); // Limpia contenedor
        data.results.forEach(element => {
            div.append(`
                <div class="card" data-id="${element.id}">
                    <p>${element.name}</p>
                    <p>ID: ${element.id}</p>
                    <p>Especie: ${element.species}</p>
                    <img src="${element.image}" alt="${element.name}">
                </div>
            `);
        });

        // Mostrar Modal al hacer clic en una tarjeta
        $(".container").on("click", ".card", function () {
            const id = $(this).data("id");
            mostrarModal(id);
        });
    });
}

let contadorEpisodios = 1
$(".btnNext-Episodes").on("click", function() {
    $(".btnPrevious-Episodes").css("display", "inline-block")
    contadorEpisodios++;
    let urlPag = `https://rickandmortyapi.com/api/episode?page=${contadorEpisodios}`

    const div = $(".container").html("");

    cargarDatos(urlPag, function (data) {
        data.results.forEach(episodio => {
            div.append(`
                <div class="card-episodio-card" data-id="${episodio.id}">
                    <h3>${episodio.name}</h3>
                    <p>Episodio: ${episodio.episode}</p>
                    <p>Air Date: ${episodio.air_date}</p>
                </div>
            `);
        });
    });
})

$(".btnPrevious-Episodes").on("click", function () {
    if (contadorEpisodios > 1) {
        contadorEpisodios--;
        mostrarEpisodios(contadorEpisodios);
    }else if(contadorEpisodios === 1) {
        $(".btnPrevious-Episodes").css("display", "none")
    }
});


// Mostrar episodios
function mostrarEpisodios() {
    let urlEpisodes = "https://rickandmortyapi.com/api/episode";
    const div = $(".container").html("");

    cargarDatos(urlEpisodes, function (data) {
        data.results.forEach(episodio => {
            div.append(`
                <div class="card-episodio-card" data-id="${episodio.id}">
                    <h3>${episodio.name}</h3>
                    <p>Episodio: ${episodio.episode}</p>
                    <p>Air Date: ${episodio.air_date}</p>
                </div>
            `);
        });
    });
}



// Evento delegado para episodios
$(".container").on("click", ".card-episodio-card", function () {
    const id = $(this).data("id");

    let urlEpisodios = `https://rickandmortyapi.com/api/episode/${id}`;

    // Crear o limpiar el contenedor de personajes
    const personajesDiv = $(".personajes-container").length
        ? $(".personajes-container").html("")
        : $(".container").append(`<div class="personajes-container"></div>`).find(".personajes-container");

    // Cargar detalles del episodio
    cargarDatos(urlEpisodios, (data) => {
        // Mostrar nombre del episodio y número en la parte superior
        personajesDiv.html(`
            <div class="card-h">
                <h3>Episodio:</h3>
                <p>${data.name}</p>
                <p>Capítulo: ${data.episode}</p>
                <p>Air Date: ${data.air_date}</p>
                <br>
                <h3>Personajes:</h3>
            </div>
            <div class="personajes-grid">
                <!-- Aquí se añadirán dinámicamente las cartas de personajes -->
            </div>
        `);

        // Seleccionamos el contenedor donde se mostrarán las cartas
        const gridPersonajes = personajesDiv.find(".personajes-grid");

        // Iterar sobre cada personaje y cargar sus detalles
        data.characters.forEach((urlPersonaje) => {
            cargarDatos(urlPersonaje, (personaje) => {
                gridPersonajes.append(`
                    <div class="personaje-card">
                        <p>${personaje.name}</p>
                        <img src="${personaje.image}" alt="${personaje.name}">
                    </div>
                `);
            });
        });
    });
});

function mostrarModal(id) {
    let urlCharacter = `https://rickandmortyapi.com/api/character/${id}`;
    cargarDatos(urlCharacter, function (data) {
        $(".modal-dialog").html(`
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${data.name}</h5>
                    <button type="button" class="btn-close" data-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Nombre: ${data.name}</p>
                    <p>Estado: ${data.status}</p>
                    <p>Origen: ${data.origin.name}</p>
                    <img src="${data.image}" class="img-fluid">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        `);
        $(".modal").modal("show");
    });
}

// Botón "Buscar Episodios"
$(".btnBuscarEpisodios").on("click", () => {
    $(".container").html("");
    $(".btnAnterior").hide()
    $(".btnNext").hide()

    mostrarBtns()
    mostrarEpisodios();
});

function mostrarBtns() {
    $(".btnNext-Episodes").css("display", "inline-block")
    $(".btnPrevious-Episodes").css("display", "none")
}

function buscarBtn() {
    const nombrePersonaje = $(".form-control").val().trim(); // Obtener valor del input y limpiar espacios
    if (nombrePersonaje === "") {
        alert("Por favor, ingresa el nombre de un personaje para buscar.");
        return;
    }

    const urlBuscar = `https://rickandmortyapi.com/api/character/?name=${nombrePersonaje}`;
    const div = $(".container").html(""); // Limpiar el contenedor antes de mostrar resultados

    mostrarPersonajes(url = urlBuscar)

}
$(".btnBuscarSolo").on("click", function () {
    buscarBtn()
})
   

   

   





