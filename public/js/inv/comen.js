document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a los botones
    document.getElementById('addButton').addEventListener('click', openPopup);
    document.getElementById('saveButton').addEventListener('click', saveInvestigation); // Asegúrate de tener este botón con id="saveButton" en tu HTML
    document.getElementById('cancelButton').addEventListener('click', closePopup); // Asegúrate de tener este botón con id="cancelButton" en tu HTML
});

function openPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('addPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addPopup').style.display = 'none';
}

function saveInvestigation() {
    var title = document.getElementById('titleInput').value;
    var des = document.getElementById('descriptionInput').value;
    var id = localStorage.getItem('DocID');
    // Aquí necesitas manejar la subida del archivo PDF, si es necesario
    db.collection('Pruebas').doc(id).collection('Comentarios').add({
        'Nombre': title,
        'comentario': des,
    }).then(function(docRef) {
        location.reload();
    }).catch(function(FirebaseError) {
        alert("Error al subir la imagen: " + FirebaseError);
    });
}

