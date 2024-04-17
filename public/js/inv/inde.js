const db = firebase.firestore();

const btnBuscar = document.querySelector('#btnBuscar');
const area = document.querySelector('#area');
const tablaProyectos = document.querySelector('#tabla');
const btnReset = document.querySelector('#btnReset');

window.onload = function() {
    All();

    // Delegación de eventos para manejar clics en la tabla
    tablaProyectos.addEventListener('click', function(e) {
        // Manejo del clic en las filas para la navegación
        const row = e.target.closest('tr');
        if (row && e.target.tagName !== 'BUTTON') {
            const id = row.getAttribute('data-id');
            if (id) {
                Page(id);
            }
        }

        // Manejo del clic en los botones dentro de las filas
        if (e.target.tagName === 'BUTTON') {
            const button = e.target;
            if (button.getAttribute('data-action') === 'leer-mas') {
                const descripcion = button.getAttribute('data-description');
                mostrarDescripcion(descripcion);
            } else if (button.getAttribute('data-action') === 'descargar-pdf') {
                const pdfUrl = button.getAttribute('data-pdf-url');
                descargarPdf(pdfUrl);
            }
        }
    });

    btnReset.addEventListener('click', function() { All(); });
    btnBuscar.addEventListener('click', buscarProyectos);
}

function All() {
    db.collection('Pruebas').get().then(function (querySnapshot) {
        tablaProyectos.innerHTML = '';
        querySnapshot.forEach(function (doc) {
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
    }).catch(function (error) {
        console.error('Error al obtener proyectos:', error);
    });
}

function buscarProyectos() {
    db.collection('Pruebas').where('area', '==', area.value)
        .get()
        .then(function (query) {
            tablaProyectos.innerHTML = '';
            query.forEach(function (doc) {
                const data = doc.data();
                const fila = document.createElement('tr');
                fila.setAttribute('data-id', doc.id);

                fila.innerHTML = `
                    <td>${data.titulo}</td>
                    <td>${data.area}</td>
                    <td>${data.Correo}</td>
                    <td>
                        ${data.descripcion.length > 100 ? data.descripcion.substring(0, 100) + '...' : data.descripcion}
                        <button class="btn btn-link" data-action="leer-mas" data-description="${data.descripcion}" data-bs-toggle="modal" data-bs-target="#descripcionModal">Leer más</button>
                    </td>
                    <td><button data-action="descargar-pdf" data-pdf-url="${data.PDF}" class="btn btn-primary">Descargar PDF</button></td>
                `;
                tablaProyectos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al filtrar proyectos:', error);
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
