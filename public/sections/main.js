document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a los botones
    document.getElementById('addButton').addEventListener('click', openPopup);
    document.getElementById('saveButton').addEventListener('click', saveInvestigation); // Asegúrate de tener este botón con id="saveButton" en tu HTML
    document.getElementById('cancelButton').addEventListener('click', closePopup); // Asegúrate de tener este botón con id="cancelButton" en tu HTML

    // Cargar las investigaciones existentes
    updateInvestigationsList();
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
    var area = document.getElementById('areaInput').value;
    var description = document.getElementById('descriptionInput').value;

    // Aquí necesitas manejar la subida del archivo PDF, si es necesario

    var newInvestigationRef = firebase.database().ref('investigations').push();
    newInvestigationRef.set({
        title: title,
        area: area,
        description: description
        // Agrega aquí la URL del PDF si se sube a Firebase Storage
    }).then(() => {
        alert('Investigación guardada con éxito');
        addInvestigationToTable(title, area); // Agrega la investigación a la tabla
        closePopup();
    }).catch(error => {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    });
}

function addInvestigationToTable(title, area) {
    var tableBody = document.getElementById('investigationsTable').getElementsByTagName('tbody')[0];
    var newRow = tableBody.insertRow();
    newRow.innerHTML = `<td>${title}</td><td>${area}</td>`;
}

function updateInvestigationsList() {
    firebase.database().ref('investigations').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var investigation = childSnapshot.val();
            addInvestigationToTable(investigation.title, investigation.area);
        });
    });
}
