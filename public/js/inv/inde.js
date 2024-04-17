const db = firebase.firestore();

const selectAutores = document.querySelector('#autores');
const selectArea = document.querySelector('#area');
const selectCiclo = document.querySelector('#filtroCiclo');
const selectFecha = document.querySelector('#filtroFecha');
const cuerpoTabla = document.querySelector('#tabla-proyectos tbody');
const btnReset = document.querySelector('#btnReset');

// Inicializa los filtros y los manejadores de eventos cuando la ventana carga
window.onload = function() {
    actualizarCombos();
    cuerpoTabla.addEventListener('click', handleTableClick);
    buscarProyectos();
};

// Añade los manejadores de eventos de cambio a los elementos select y de click al botón de reset
function inicializarFiltros() {
    selectAutores.addEventListener('change', buscarProyectos);
    selectArea.addEventListener('change', buscarProyectos);
    selectCiclo.addEventListener('change', buscarProyectos);
    selectFecha.addEventListener('change', buscarProyectos);
    btnReset.addEventListener('click', resetFilters);
}

function actualizarCombos() {
    const autores = new Set(['Todos']);
    const areas = new Set(['Todos']);
    const ciclos = new Set(['Todos']);

    db.collection('Pruebas').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const data = doc.data();
            autores.add(data.Correo);
            areas.add(data.area);
            ciclos.add(data.ciclo);
        });
        populateSelect(selectAutores, autores);
        populateSelect(selectArea, areas);
        populateSelect(selectCiclo, ciclos);
        // Inicializa los filtros para manejar cambios.
        inicializarFiltros();
        // Ejecuta la búsqueda inicial después de que todos los filtros han sido poblados.
        buscarProyectos();
    }).catch(error => {
        console.error("Error al obtener autores, áreas y ciclos: ", error);
    });
}


function buscarProyectos() {
    let query = db.collection('Pruebas');
    const autorSeleccionado = selectAutores.value;
    const areaSeleccionada = selectArea.value;
    const cicloSeleccionado = selectCiclo.value;
    const fechaSeleccionada = selectFecha.value;

    if (autorSeleccionado !== 'Todos') {
        query = query.where('Correo', '==', autorSeleccionado);
    }
    if (areaSeleccionada !== 'Todos') {
        query = query.where('area', '==', areaSeleccionada);
    }
    if (cicloSeleccionado !== 'Todos') {
        query = query.where('ciclo', '==', cicloSeleccionado);
    }
    if (fechaSeleccionada === 'Más recientes') {
        query = query.orderBy('publicationDate', 'desc');
    } else if (fechaSeleccionada === 'Más antiguos') {
        query = query.orderBy('publicationDate', 'asc');
    }

    query.get().then(querySnapshot => {
        cuerpoTabla.innerHTML = ''; // Limpiamos el cuerpo de la tabla
        if (querySnapshot.empty) {
            cuerpoTabla.innerHTML = '<tr><td colspan="5">No se encontraron proyectos con estos criterios.</td></tr>';
            return;
        }
        querySnapshot.forEach(doc => {
            const proyecto = doc.data();
            const fila = document.createElement('tr');
            fila.setAttribute('data-id', doc.id);
            fila.innerHTML = `
                <td>${proyecto.titulo}</td>
                <td>${proyecto.area}</td>
                <td>${proyecto.Correo}</td>
                <td>
                    ${proyecto.descripcion.length > 100 ? proyecto.descripcion.substring(0, 100) + '...' : proyecto.descripcion}
                    <button class="btn btn-link" data-action="leer-mas" data-description="${proyecto.descripcion}" data-bs-toggle="modal" data-bs-target="#descripcionModal">Leer más</button>
                </td>
                <td><button data-action="descargar-pdf" data-pdf-url="${proyecto.PDF}" class="btn btn-primary">Descargar PDF</button></td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }).catch(error => {
        console.error('Error al buscar proyectos:', error);
    });
}

function resetFilters() {
    selectAutores.value = 'Todos';
    selectArea.value = 'Todos';
    selectCiclo.value = 'Todos';
    selectFecha.value = 'Todos';
    buscarProyectos(); // Llama a buscar proyectos para refrescar la lista con los filtros reseteados
}

function populateSelect(selectElement, options) {
    selectElement.innerHTML = '';
    options.forEach(optionValue => {
        let option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

function handleTableClick(e) {
    // Verifica si el clic fue en un botón
    if (e.target.tagName === 'BUTTON') {
        if (e.target.dataset.action === 'leer-mas') {
            const descripcion = e.target.getAttribute('data-description');
            mostrarDescripcion(descripcion);
        } else if (e.target.dataset.action === 'descargar-pdf') {
            const pdfUrl = e.target.getAttribute('data-pdf-url');
            descargarPdf(pdfUrl);
        }
    } else {
        // Asumiendo que los clics fuera de los botones deberían llevar al detalle de la investigación
        const row = e.target.closest('tr');
        if (row) {
            const id = row.getAttribute('data-id');
            if (id) {
                Page(id);
            }
        }
    }
}


function mostrarDescripcion(descripcion) {
    const descripcionCompleta = document.getElementById('descripcionCompleta');
    descripcionCompleta.textContent = descripcion;
}

function Page(id) {
    var Info = db.collection('Pruebas').doc(id);
    Info.get().then((doc) => {
        if (doc.exists) {
            localStorage.setItem('DocID', doc.id);
            window.location.href = "investigar.html";
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

function descargarPdf(pdfUrl) {
    window.open(pdfUrl, '_blank');
}