const db = firebase.apps[0].firestore();

const img1 = document.querySelector('#img1');
const img2 = document.querySelector('#img2');
const img3 = document.querySelector('#img3');
const img4 = document.querySelector('#img4');
const img5 = document.querySelector('#img5');
const img6 = document.querySelector('#img6');

window.onload = function() {
    var id = localStorage.getItem('DocID');
    var docRef = db.collection("Pruebas").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            img1.src = doc.data().Imagen_1;
            img2.src = doc.data().Imagen_2;
            img3.src = doc.data().Imagen_3;
            img4.src = doc.data().Imagen_4;

            // Verificar si los elementos img5 e img6 existen antes de establecer su src
            if (img5) img5.src = doc.data().Imagen_5 || ''; // Usar un valor predeterminado si la URL está vacía
            if (img6) img6.src = doc.data().Imagen_6 || ''; // Usar un valor predeterminado si la URL está vacía
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    const title = document.querySelector('#Title');
    const auth = document.querySelector('#auth');
    const area = document.querySelector('#area');
    const descrip = document.querySelector('#description');
    const conclu = document.querySelector('#conclu');
    const reco = document.querySelector('#reco');
    const pdf = document.querySelector('#pdf');
    const coment = document.querySelector('#coment');

    var id = localStorage.getItem('DocID');
    var docRef = db.collection("Pruebas").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            title.innerHTML = doc.data().titulo;
            auth.innerHTML = doc.data().Correo;
            area.innerHTML = doc.data().area;
            descrip.innerHTML = doc.data().descripcion;
            conclu.innerHTML = doc.data().Conclusion;
            reco.innerHTML = doc.data().Recomendaciones;
            pdf.setAttribute('src', doc.data().PDF);

            db.collection('Pruebas').doc(id).collection('Comentarios').get()

            .then(function (query) {
            coment.innerHTML = ''
            var salida = ''
            query.forEach(function (doc) {
                salida += '<tr class="card-body p-2 d-flex align-items-center">'
                 salida += '<td>'+ doc.data().Nombre + '</td>'
                 salida += '<td>' + doc.data().rating + '</td>'
                 salida += '<td>'+ doc.data().comentario + '</td>'
                 salida += '<td>'+ doc.data().Fecha + '</td>'
                salida += '</tr>'
                })
            coment.innerHTML = salida
        })
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
};
