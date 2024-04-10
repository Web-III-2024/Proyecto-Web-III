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
  if(archivo == null){
      alert('Debe seleccionar una imagen');
  }else{
      const metadata = {
          contentType : archivo.type
      };
      auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
          .then((userCredential) => {
              const user = userCredential.user;
              // Usar el UID del usuario como nombre del archivo
              const nomarch = user.uid + "_" + archivo.name;
              const subir = container.child('fotos/'+nomarch).put(archivo, metadata);
              subir
                  .then(snapshot => snapshot.ref.getDownloadURL())
                  .then(url => {
                      db.collection('datosUsuarios')
                          .add({
                              idemp: user.uid,
                              usuario: txtNombre.value,
                              email: user.email,
                              anho: txtAnho.value,
                              introduccion: txtIntro.value,
                              url: url  // La URL de la imagen subida
                          })
                          .then(function (docRef) {
                              alert("ID del registro: " + docRef.id);
                              limpiar();
                          })
                          .catch(function (FirebaseError) {
                              alert('Error al registrar datos del usuario.' + FirebaseError);
                          });
                  });
          })
          .catch((error) => {
              alert('Error al crear usuario: ' + error.message);
          });
  }
});

function limpiar() {
  txtNombre.value = ''
  txtEmail.value = ''
  txtContra.value = ''
  txtAnho.value = ''
  txtIntro.value = ''
  txtNombre.focus()
}
