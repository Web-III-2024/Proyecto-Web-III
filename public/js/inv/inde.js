const db = firebase.firestore();

const btnBuscar = document.querySelector('#btnBuscar');
const area = document.querySelector('#area');
const tablaProyectos = document.querySelector('#tabla');
const btnReset = document.querySelector('#btnReset');

window.onload = All();

btnReset.addEventListener('click', function(){ All(); });

btnBuscar.addEventListener('click', function(){
  db.collection('Pruebas').where('area', '==', area.value)
  .get()
  .then(function (query) {
    tablaProyectos.innerHTML = '';
    var salida = '';
    query.forEach(function (doc) {
        salida += '<tr onclick="Page(\''+  doc.id +'\')">';
        salida += '<td>'+ doc.data().titulo + '</td>';
        salida += '<td>'+ doc.data().area + '</td>';
        salida += '<td>'+ doc.data().Correo + '</td>';
        salida += '<td>'+ doc.data().descripcion + '</td>'; // Mostrar la descripción en la tabla
        salida += `<td><button onclick="descargarPdf('${doc.data().PDF}')">Descargar PDF</button></td>`; // Botón de descarga del PDF
        salida += '</tr>';
    });
    tablaProyectos.innerHTML = salida;
  });
});

function All(){
  db.collection('Pruebas')
  .get()
  .then(function (query) {
    tablaProyectos.innerHTML = '';
    var salida = '';
    query.forEach(function (doc) {
        salida += '<tr onclick="Page(\''+  doc.id +'\')">';
        salida += '<td>'+ doc.data().titulo + '</td>';
        salida += '<td>'+ doc.data().area + '</td>';
        salida += '<td>'+ doc.data().Correo + '</td>';
        salida += '<td>'+ doc.data().descripcion + '</td>'; // Mostrar la descripción en la tabla
        salida += `<td><button onclick="descargarPdf('${doc.data().PDF}')">Descargar PDF</button></td>`; // Botón de descarga del PDF
        salida += '</tr>';
    });
    tablaProyectos.innerHTML = salida;
  });
}

function Page(id){
  var Info = db.collection('Pruebas').doc(id);

  Info.get().then((doc) => {
    if (doc.exists) {
      localStorage.setItem('DocID', doc.id);
      window.location.href = "investigar.html"; 
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
}

function descargarPdf(pdfUrl) {
    window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva pestaña
}