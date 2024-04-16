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
  
    var selectedFiles = {
      pdf: null,
      images: []
    };
  
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
      updateFilePreview();
    }
  
    // Upload files to Firebase
    function uploadFiles() {
      // Validate files
      if (!selectedFiles.pdf) {
        alert('Por favor, selecciona un archivo PDF.');
        return;
      }
      if (selectedFiles.images.length < 4 || selectedFiles.images.length > 6) {
        alert('Por favor, selecciona entre 4 y 6 archivos de imagen.');
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
          descripcion: description.value,
          PDF: pdfUrl,
        };
        // Mapear los datos de las imágenes con sus nombres originales en Firestore
        imageData.forEach(function(data, index) {
          documentData[`Imagen_${index + 1}`] = data.url;
        });
        documentData.Conclusion = conclusions.value;
        documentData.Recomendaciones = recommendations.value;
        documentData.Correo = user ? user.email : null;
        
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
  
    // Actualizar la visualización de los campos de imagen al cambiar la cantidad de imágenes seleccionadas
    fileInput.addEventListener('change', function() {
      showImageFields(selectedFiles.images.length);
    });
  
    showImageFields(0); // Mostrar inicialmente 0 campos de imagen
  });
  