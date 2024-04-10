const db = firebase.apps[0].firestore();

const title = document.querySelector('#Title');
const auth = document.querySelector('#auth');
const area = document.querySelector('#area');
const descrip =document.querySelector('#description');
const conclu = document.querySelector('#conclu');
const reco = document.querySelector('#reco');
const pdf = document.querySelector('#pdf');
const img1 =document.querySelector('#img1');
const img2 =document.querySelector('#img2');
const img3 =document.querySelector('#img3');
const img4 =document.querySelector('#img4');
const coment = document.querySelector('#coment');

window.onload = function() {
    var id = localStorage.getItem('DocID');
    var docRef = db.collection("Pruebas").doc(id);
    //var List = docRef.collection('Cometarios').get();

    docRef.get().then((doc) => {
        if (doc.exists) {
            title.innerHTML = doc.data().titulo;
            auth.innerHTML = doc.data().Correo;
            area.innerHTML =doc.data().area;
            descrip.innerHTML = doc.data().descripcion;
            conclu.innerHTML = doc.data().Conclusion;
            reco.innerHTML = doc.data().Recomendaciones;
            //PDF
            pdf.setAttribute('src',doc.data().PDF);         
            //Imagen #1
            img1.src = doc.data().Imagen_1;
            //Imagen #2
            img2.src = doc.data().Imagen_2;
            //Imagen #3
            img3.src = doc.data().Imagen_3;
            //Imagen #4
            img4.src = doc.data().Imagen_4;
            
            db.collection('Pruebas').doc(id).collection('Comentarios').get()
            .then(function (query) {
            coment.innerHTML = ''
            var salida = ''
            query.forEach(function (doc) {
                salida += '<tr class="card-body p-2 d-flex align-items-center">'
                 salida += '<td>'+ doc.data().Nombre + '</td>'
                 salida += '<td>'+ doc.data().comentario + '</td>'
                salida += '</tr>'
                })
            coment.innerHTML = salida
        })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}