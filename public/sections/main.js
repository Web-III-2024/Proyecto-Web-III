// Asumiendo que firebaseConfig ya está definido en otro lugar y que Firebase se ha inicializado
// Inicializamos Firestore aquí
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a los botones
    document.getElementById('addButton').addEventListener('click', openPopup);
    document.getElementById('saveButton').addEventListener('click', saveInvestigation);
    document.getElementById('cancelButton').addEventListener('click', closePopup);

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

    var newInvestigationRef = db.collection('investigations').doc();
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
    db.collection('investigations').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var investigation = doc.data();
            addInvestigationToTable(investigation.title, investigation.area);
            // Aquí asumimos que quieres cargar imágenes adicionales si existen en tus datos
            let img5 = document.getElementById('img5'); // Asegúrate de que este ID exista en tu HTML
            let img6 = document.getElementById('img6'); // Asegúrate de que este ID exista en tu HTML
            if (investigation.Imagen_5) {
                img5.src = investigation.Imagen_5;
            }
            if (investigation.Imagen_6) {
                img6.src = investigation.Imagen_6;
            }
        });
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
}
