// Referencias a Firebase y elementos del DOM
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();
const user = firebase.auth().currentUser;

var title = document.getElementById('title');
var area = document.getElementById('area');
var description = document.getElementById('description');
var pdf = document.getElementById('pdf');
var Imagen_1 = document.getElementById('image1');
var Imagen_2 = document.getElementById('image2');
var Imagen_3 = document.getElementById('image3');
var Imagen_4 = document.getElementById('image4');
var conclusions = document.getElementById('conclusions');
var recommendations = document.getElementById('recommendations');

// Referencias a los nuevos elementos de imagen (asumiendo que se han agregado al HTML)
var Imagen_5 = document.getElementById('image5'); // Nuevo
var Imagen_6 = document.getElementById('image6'); // Nuevo

const PryUpload = document.querySelector('#PryUpload');

// Función para cargar imágenes y devolver promesas con sus URLs
function uploadImage(imageElement) {
    return new Promise((resolve, reject) => {
        if (imageElement && imageElement.files.length > 0) {
            const imageFile = imageElement.files[0];
            const imageName = imageFile.name;
            const metadata = { contentType: imageFile.type };
            container.child('Img/' + imageName).put(imageFile, metadata)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(resolve)
                .catch(reject);
        } else {
            resolve(null); // Si no hay archivo, resuelve con null
        }
    });
}

// Función para cargar todos los archivos y luego guardar los datos
function saveDocument() {
    const archivo = pdf.files[0];
    if (!archivo) {
        alert('Debe seleccionar un pdf');
        return;
    }
    const metadata = { contentType: archivo.type };
  
    container.child('doc/' + archivo.name).put(archivo, metadata)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(pdfUrl => {
            return Promise.all([
                pdfUrl,
                uploadImage(Imagen_1),
                uploadImage(Imagen_2),
                uploadImage(Imagen_3),
                uploadImage(Imagen_4),
                uploadImage(Imagen_5),
                uploadImage(Imagen_6)
            ]);
        })
        .then(urls => {
            const [pdfUrl, ...imageUrls] = urls;
            const documentData = {
                "titulo": title.value,
                "area": area.value,
                "descripcion": description.value,
                "PDF": pdfUrl,
                "Conclusion": conclusions.value,
                "Recomendaciones": recommendations.value,
                "Correo": user ? user.email : null
            };
            imageUrls.forEach((url, index) => {
                if (url) documentData[`Imagen_${index + 1}`] = url;
            });
            return db.collection("Pruebas").add(documentData);
        })
        .then(docRef => {
            alert("ID del registro: " + docRef.id);
        })
        .catch(error => {
            console.error("Error al subir archivos y guardar el documento:", error);
        });
}

PryUpload.addEventListener('click', saveDocument);
