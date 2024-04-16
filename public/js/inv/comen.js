// document.addEventListener('DOMContentLoaded', function() {
//     // Asignar eventos a los botones
//     document.getElementById('addButton').addEventListener('click', openPopup);
//     document.getElementById('saveButton').addEventListener('click', saveInvestigation);
//     document.getElementById('cancelButton').addEventListener('click', closePopup);
// });

// function openPopup() {
//     document.getElementById('overlay').style.display = 'block';
//     document.getElementById('addPopup').style.display = 'block';
// }

// function closePopup() {
//     document.getElementById('overlay').style.display = 'none';
//     document.getElementById('addPopup').style.display = 'none';
// }

// function saveInvestigation() {
//     var title = document.getElementById('titleInput').value;
//     var des = document.getElementById('descriptionInput').value;
//     var id = localStorage.getItem('DocID');
//     var rating = document.querySelector('input[name="rating"]:checked').value;
//     var fechaActual = new Date();
//     var month = fechaActual.getMonth() + 1;
//     var day = fechaActual.getDate();
//     var formattedDate = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day; // Formato: MM/DD

//     // Verificar si ya existe un comentario con el mismo contenido
//     db.collection('Pruebas').doc(id).collection('Comentarios')
//         .where('Nombre', '==', title)
//         .where('comentario', '==', des)
//         .where('rating', '==', rating)
//         .where('Fecha', '==', formattedDate)
//         .get()
//         .then(function(querySnapshot) {
//             if (querySnapshot.empty) {
//                 // No hay un comentario duplicado, guardar el nuevo comentario
//                 db.collection('Pruebas').doc(id).collection('Comentarios').add({
//                     'Nombre': title,
//                     'comentario': des,
//                     'rating': rating,
//                     'Fecha': formattedDate 
//                 }).then(function(docRef) {
//                     location.reload();
//                 }).catch(function(FirebaseError) {
//                     alert("Error al subir la imagen: " + FirebaseError);
//                 });
//             } else {
//                 // Ya existe un comentario duplicado, mostrar mensaje de error o simplemente no hacer nada
//                 console.log('El comentario ya existe.');
//             }
//         })
//         .catch(function(error) {
//             console.error('Error verificando comentarios duplicados:', error);
//         });
// }

