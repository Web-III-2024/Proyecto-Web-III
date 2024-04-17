const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    var db = firebase.apps[0].firestore();
    var storageRef = firebase.apps[0].storage().ref();
    var user = firebase.auth().currentUser;

    var title = document.getElementById('title');
    var area = document.getElementById('area');
    var description = document.getElementById('description');
    var conclusions = document.getElementById('conclusions');
    var recommendations = document.getElementById('recommendations');
    var fileInput = document.getElementById('file-input');
    var dropArea = document.getElementById('drop-area');
    var uploadButton = document.getElementById('PryUpload');
    var filePreview = document.getElementById('file-preview');
    var ciclo = document.getElementById('ciclo');

    var selectedFiles = {
        pdf: null,
        images: [],
        publicationDate: null
    };

    // Listener de autenticación para verificar cuándo el usuario inicia sesión
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Usuario autenticado:", user.email);
            // Luego aquí puedes realizar las operaciones que requieran el correo electrónico del usuario
        } else {
            console.log("No hay usuario autenticado.");
        }
    });

    // Helper function to update the file preview
    function updateFilePreview() {
        filePreview.innerHTML = '';
        if (selectedFiles.pdf) {
            filePreview.innerHTML += `<div>${selectedFiles.pdf.name}</div>`;
        }
        selectedFiles.images.forEach((file, index) => {
            filePreview.innerHTML += `<div>${file.name} <button onclick="removeFile(${index})">X</button></div>`;
        });
    }

    // Remove file from selectedFiles and update preview
    window.removeFile = function(index) {
        if (index === -1) {
            selectedFiles.pdf = null;
        } else {
            selectedFiles.images.splice(index, 1);
        }
        updateFilePreview();
    };

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        handleFiles(files);
    }

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        for (let i = 0, len = files.length; i < len; i++) {
            if (files[i].type === 'application/pdf') {
                selectedFiles.pdf = files[i];
            } else if (files[i].type.startsWith('image/')) {
                selectedFiles.images.push(files[i]);
            }
        }
        // Capturar el valor del nuevo campo
        selectedFiles.publicationDate = new Date().toISOString(); // Capturar la fecha actual
        updateFilePreview();
    }

    // Modificar la función uploadFiles para agregar el nuevo campo al documento de investigación
    function uploadFiles() {
        // Validar los campos
        if (!selectedFiles.pdf || !selectedFiles.publicationDate) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (selectedFiles.images.length < 4 || selectedFiles.images.length > 6) {
            alert('Por favor, selecciona entre 4 y 6 archivos de imagen.');
            return;
        }
        if (!ciclo.value) {
            alert('Por favor, selecciona el ciclo escolar.');
            return;
        }

        // Upload PDF
        var pdfRef = storageRef.child('doc/' + selectedFiles.pdf.name);
        pdfRef.put(selectedFiles.pdf).then(function(snapshot) {
            return snapshot.ref.getDownloadURL();
        }).then(function(pdfUrl) {
            // Upload images
            var uploadPromises = selectedFiles.images.map(function(image, index) {
                // Generar un nombre único para la imagen en Firebase Storage
                var imageName = Date.now() + '_' + index + '_' + image.name;
                var imageRef = storageRef.child('Img/' + imageName);
                return imageRef.put(image).then(function(snapshot) {
                    // Guardar la URL de la imagen con el nombre original en Firestore
                    var originalName = image.name;
                    return snapshot.ref.getDownloadURL().then(function(url) {
                        return { name: originalName, url: url };
                    });
                });
            });
            return Promise.all([pdfUrl, ...uploadPromises]);
        }).then(function(urls) {
            var [pdfUrl, ...imageData] = urls;
            // Add document data to Firestore
            var documentData = {
                titulo: title.value,
                area: area.value,

                ciclo: ciclo.value, 
                descripcion: description.value,
                PDF: pdfUrl,
                publicationDate: selectedFiles.publicationDate // Utilizamos la fecha capturada
            };
            // Mapear los datos de las imágenes con sus nombres originales en Firestore
            imageData.forEach(function(data, index) {
                documentData[`Imagen_${index + 1}`] = data.url;
            });
            documentData.Conclusion = conclusions.value;
            documentData.Recomendaciones = recommendations.value;

            // Log the user's email to the console
            console.log("Correo del usuario:", firebase.auth().currentUser.email);

            documentData.Correo = firebase.auth().currentUser.email;
            return db.collection('Pruebas').add(documentData);
        }).then(function(docRef) {
            alert('¡Documento subido exitosamente!');
        }).catch(function(error) {
            console.error('Error al subir el documento:', error);
        });
    }

    uploadButton.addEventListener('click', uploadFiles);

    // Mostrar solo los campos de imagen necesarios
    function showImageFields(numImages) {
        var imageFields = document.querySelectorAll('.image-field');
        for (var i = 0; i < imageFields.length; i++) {
            if (i < numImages) {
                imageFields[i].style.display = 'block';
            } else {
                imageFields[i].style.display = 'none';
            }
        }
    }

    fileInput.addEventListener('change', function() {
        showImageFields(selectedFiles.images.length);
    });

    showImageFields(0);
});
