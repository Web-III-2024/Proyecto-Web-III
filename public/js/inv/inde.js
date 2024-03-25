const db = firebase.apps[0].firestore();

const btnBuscar = document.querySelector('#btnBuscar');
const area = document.querySelector('#area');
const tabla = document.querySelector('#tabla');
const btnReset = document.querySelector('#btnReset'); 

window.onload = All();

btnReset.addEventListener('click', function(){ All();});

btnBuscar.addEventListener('click', function(){
  db.collection('Pruebas').where('area', '==', area.value)
  .get()
  .then(function (query) {
    tabla.innerHTML = ''
    var salida = ''
    query.forEach(function (doc) {
        salida += '<tr onclick="Page(\''+  doc.id +'\')">'
        salida += '<td>'+ doc.data().titulo + '</td>'
        salida += '<td>'+ doc.data().area + '</td>'
        salida += '<td>'+ doc.data().Correo + '</td>'
    salida += '</tr>'
    })
    tabla.innerHTML = salida
  })
})
function All(){
db.collection('Pruebas')
.get()
.then(function (query) {
  tabla.innerHTML = ''
  var salida = ''
  query.forEach(function (doc) {
      salida += '<tr onclick="Page(\''+  doc.id +'\')">'
      salida += '<td>'+ doc.data().titulo + '</td>'
      salida += '<td>'+ doc.data().area + '</td>'
      salida += '<td>'+ doc.data().Correo + '</td>'
  salida += '</tr>'
  })
  tabla.innerHTML = salida
})  
}


function Page(id){
  var Info = db.collection('Pruebas').doc(id);

  Info.get().then((doc) => {
    if (doc.exists) {
      localStorage.setItem('DocID', doc.id);
      window.location.href = "investigar.html"; 
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
}
