const db = firebase.apps[0].firestore();

// Llamar a las funciones una vez que estén definidas
loadPageContent();
loadComments();

function loadPageContent() {
    var id = localStorage.getItem('DocID');
    var docRef = db.collection("Pruebas").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            // Crear el contenido dinámicamente
            createDynamicContent(doc.data());
        } else {
            console.log("No existe el documento!");
        }
    }).catch((error) => {
        console.log("Error obteniendo el documento:", error);
    });
}

function createDynamicContent(data) {
    // Obtener el contenedor principal
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Crear los elementos dinámicos
    const titleElement = document.createElement('h1');
    titleElement.textContent = data.titulo;
    mainContent.appendChild(titleElement);

    const areaElement = document.createElement('h3');
    areaElement.textContent = `Area de enfoque de ${data.area}`;
    mainContent.appendChild(areaElement);

    const authorElement = document.createElement('h5');
    authorElement.textContent = data.Correo;
    mainContent.appendChild(authorElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = data.descripcion;
    mainContent.appendChild(descriptionElement);

    const conclusionsElement = document.createElement('p');
    conclusionsElement.textContent = data.Conclusion;
    mainContent.appendChild(conclusionsElement);

    const recommendationsElement = document.createElement('p');
    recommendationsElement.textContent = data.Recomendaciones;
    mainContent.appendChild(recommendationsElement);

    // Cargar imágenes dinámicamente
    for (let i = 1; i <= 6; i++) {
        const imageUrl = data[`Imagen_${i}`];
        if (imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.setAttribute('src', imageUrl);
            imgElement.setAttribute('alt', `Imagen ${i}`);
            mainContent.appendChild(imgElement);
        }
    }

    // Cargar PDF dinámicamente
    const pdfUrl = data.PDF;
    if (pdfUrl) {
        const pdfElement = document.createElement('embed');
        pdfElement.setAttribute('src', pdfUrl);
        pdfElement.setAttribute('type', 'application/pdf');
        mainContent.appendChild(pdfElement);
    }
}

function loadComments(sortBy) {
    const mainContent = document.getElementById('mainContent');
    const commentsTable = document.createElement('table');
    commentsTable.classList.add('card', 'table', 'table-bordered', 'w-auto');
    const commentsHeader = commentsTable.createTHead();
    const headerRow = commentsHeader.insertRow();
    headerRow.innerHTML = '<th>Nombre</th><th>Rating</th><th>Comentario</th><th>Fecha</th>';
    const commentsBody = commentsTable.createTBody();
    mainContent.appendChild(commentsTable);

    const docId = localStorage.getItem('DocID');

    let query = db.collection('Pruebas').doc(docId).collection('Comentarios');

    // Aplicar orden según el parámetro sortBy
    if (sortBy === 'FechaAsc') {
        query = query.orderBy('Fecha', 'asc');
    } else if (sortBy === 'FechaDesc') {
        query = query.orderBy('Fecha', 'desc');
    } else if (sortBy === 'RankingAsc') {
        query = query.orderBy('rating', 'asc');
    } else if (sortBy === 'RankingDesc') {
        query = query.orderBy('rating', 'desc');
    }

    query.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const commentRow = commentsBody.insertRow();
                const nameCell = commentRow.insertCell();
                const ratingCell = commentRow.insertCell();
                const commentCell = commentRow.insertCell();
                const dateCell = commentRow.insertCell();

                nameCell.textContent = doc.data().Nombre;
                ratingCell.textContent = doc.data().rating;
                commentCell.textContent = doc.data().comentario;
                dateCell.textContent = doc.data().Fecha;
            });
        }).catch((error) => {
            console.error('Error obteniendo comentarios:', error);
        });
}


function addTimeToDateString(dateString) {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}

document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('addPopup').style.display = 'block';
});

document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addPopup').style.display = 'none';
});
document.getElementById('saveButton').addEventListener('click', function() {
    const name = document.getElementById('titleInput').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('descriptionInput').value;
    const date = new Date().toISOString(); // Guardar fecha y hora en formato ISO
    const docId = localStorage.getItem('DocID');

    db.collection('Pruebas').doc(docId).collection('Comentarios').add({
        Nombre: name,
        rating: rating,
        comentario: comment,
        Fecha: date
    }).then(() => {
        alert('Comentario agregado exitosamente.');
        document.getElementById('overlay').style.display = 'none'; // Cerrar el popup
        document.getElementById('addPopup').style.display = 'none'; // Cerrar el popup
        location.reload();



        // location.reload(); // Eliminar la recarga de la página
    }).catch((error) => {
        console.error('Error agregando comentario:', error);
    });
});

// Funciones para ordenar comentarios
function sortCommentsByDateAsc() {
    document.getElementById('mainContent').innerHTML = ''; // Limpiar contenido principal

    loadPageContent();
    loadComments('FechaAsc');
}

function sortCommentsByDateDesc() {
    document.getElementById('mainContent').innerHTML = ''; // Limpiar contenido principal

    loadPageContent();
    loadComments('FechaDesc');
}
function sortCommentsByRanking() {
    document.getElementById('mainContent').innerHTML = ''; // Limpiar contenido principal
    loadPageContent();

    loadComments('RankingAsc'); // Ordenar por ranking de menor a mayor
}
function sortCommentsByRankingAsc() {
    document.getElementById('mainContent').innerHTML = ''; // Limpiar contenido principal
    loadPageContent();

    loadComments('RankingAsc');
}

function sortCommentsByRankingDesc() {
    document.getElementById('mainContent').innerHTML = ''; // Limpiar contenido principal
    loadPageContent();

    loadComments('RankingDesc');
}
