const db = firebase.firestore();

const btnBuscar = document.querySelector('#btnBuscar');
const selectAutores = document.querySelector('#autores');
const selectArea = document.querySelector('#area');
const selectCiclo = document.querySelector('#filtroCiclo');
const selectFecha = document.querySelector('#filtroFecha');
const tablaProyectos = document.querySelector('#tabla-proyectos');
const btnReset = document.querySelector('#btnReset');

window.onload = function() {
    actualizarCombos();
    btnBuscar.addEventListener('click', buscarProyectos);
    btnReset.addEventListener('click', resetFilters);
    tablaProyectos.addEventListener('click', handleTableClick);
};

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
        tablaProyectos.innerHTML = '';
        if (querySnapshot.empty) {
            tablaProyectos.innerHTML = '<tr><td colspan="5">No se encontraron proyectos con estos criterios.</td></tr>';
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
            tablaProyectos.appendChild(fila);
        });
    }).catch(error => {
        console.error('Error al buscar proyectos:', error);
    });
}

function resetFilters() {
    selectAutores.value = 'Todos';
    selectArea.value = 'Todos';
    selectCiclo.value = 'Todos';
    selectFecha.value = 'Todos'; // Asegúrate de que el valor 'Todos' exista en las opciones de fecha
    buscarProyectos();
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