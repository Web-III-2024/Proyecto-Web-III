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

const PryUpload = document.querySelector('#PryUpload');

PryUpload.addEventListener('click', function(){
  const archivo = pdf.files[0];
  const nomarch = archivo.name;
  if(archivo == null){
      alert('Debe seleccionar un pdf');
  }else{
      const metadata = {
          contentType : archivo.type
      }
      const subir1 = container.child('doc/'+nomarch).put(archivo, metadata);
      subir1.then(snapshot => snapshot.ref.getDownloadURL()).then( url =>{
          const url1 = url;
          const Ima1 = Imagen_1.files[0];
          const noma1 = Ima1.name;
          if(Ima1 == null){
              alert('Debe seleccionar una imagen');
          }else{
              const metadata = {
                  contentType : Ima1.type
              }
              const subir2 = container.child('Img/'+noma1).put(Ima1, metadata);
              subir2.then(snapshot => snapshot.ref.getDownloadURL()).then( url =>{
                  const url2 = url;
                  const Ima2 = Imagen_2.files[0];
                  const noma2 = Ima2.name;
                  if(Ima2 == null){
                  alert('Debe seleccionar una imagen');
                  }else{
                      const metadata = {
                      contentType : Ima2.type
                      }
                      const subir3 = container.child('Img/'+noma2).put(Ima2, metadata);
                      subir3.then(snapshot => snapshot.ref.getDownloadURL()).then( url =>{
                          const url3 = url;
                          const Ima3 = Imagen_3.files[0];
                          const noma3 = Ima3.name;
                          if(Ima3 == null){
                          alert('Debe seleccionar una imagen');
                          }else{
                              const metadata = {
                                  contentType : Ima3.type
                              }
                              const subir4 = container.child('Img/'+noma3).put(Ima3, metadata);
                              subir4.then(snapshot => snapshot.ref.getDownloadURL()).then( url =>{
                                  const url4 = url;
                                  const Ima4 = Imagen_4.files[0];
                                  const noma4 = Ima4.name;
                                  if(Ima4 == null){
                                      alert('Debe seleccionar una imagen');
                                  }else{
                                  const metadata = {
                                      contentType : Ima4.type
                                  }
                                  const subir5 = container.child('Img/'+noma4).put(Ima4, metadata);
                                      subir5.then(snapshot => snapshot.ref.getDownloadURL()).then( url =>{
                                          const url5 = url;
                                          db.collection("Pruebas").add({
                                              "titulo" : title.value,
                                              "area" : area.value,
                                              "descripcion" : description.value,
                                              "PDF" : url1,
                                              "Imagen_1" : url2,
                                              "Imagen_2" : url3,
                                              "Imagen_3" : url4,
                                              "Imagen_4" : url5,
                                              "Conclusion" : conclusions.value,
                                              "Recomendaciones" : recommendations.value,
                                              "Correo": firebase.auth().currentUser.email
                                          }).then(function(docRef) {
                                              alert("ID del registro: " + docRef.id);
                                          });
                                      });
                                  }
                              });
                          }
                      });
                  }
              });
          }
      });
  }
});