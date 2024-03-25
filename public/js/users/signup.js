// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore()
var auth = firebase.apps[0].auth()
var container = firebase.apps[0].storage().ref();

// create local from webpage inputs
const txtNombre = document.querySelector('#txtNombre')
const txtEmail = document.querySelector('#txtEmail')
const txtContra = document.querySelector('#txtContra')
const txtAnho = document.querySelector('#txtAnho')
const txtIntro = document.querySelector('#txtIntro')
const txtArchi = document.querySelector('#txtArchi');

// create local insert button
const btnInsUser = document.querySelector('#btnInsUser')

// assign button listener
btnInsUser.addEventListener('click', function () {

  const archivo = txtArchi.files[0];
  const nomarch = archivo.name;
  if(archivo == null){
    alert('Debe seleccionar una imagen');
  }else{
    const metadata = {
        contentType : archivo.type
    }
    const subir = container.child('fotos/'+nomarch).put(archivo, metadata);
    subir
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then( url =>{
          auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
          .then((userCredential) => {
            const user = userCredential.user
            db.collection('datosUsuarios')
              .add({
                idemp: user.uid,
                usuario: txtNombre.value,
                email: user.email,
                anho: txtAnho.value,
                introduccion: txtIntro.value,
                url:url
              })
              .then(function (docRef) {
                alert("ID del registro: " + docRef.id);
                limpiar();
              })
              .catch(function (FirebaseError) {
                alert('Error al registrar datos del usuario.' + FirebaseError)})
            });
        });
}
})

function limpiar() {
  txtNombre.value = ''
  txtEmail.value = ''
  txtContra.value = ''
  txtAnho.value = ''
  txtIntro.value = ''
  txtNombre.focus()
}
