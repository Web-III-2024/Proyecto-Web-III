// JavaScript Document para autenticación, menú y visualización de imagen del usuario

// Suponiendo que ya tienes inicializado Firebase en tu aplicación
var auth = firebase.auth();

console.log("Firebase Auth inicializado");

// Menú como un componente web personalizado
class Menu extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div class="container-fluid">
                    <a class="navbar-brand"><img src="images/logo/libro.png" alt="" width="15%" class="d-inline-block align-text-top"></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="index.html">Inicio</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink_02" role="button" data-bs-toggle="dropdown"
                                   aria-expanded="false">
                                    Acceder
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink_02">
                                    <li><a class="dropdown-item" href="registrar.html">Registrar nuevo usuario</a></li>
                                    <li><a class="dropdown-item" href="login.html">Autenticar usuario</a></li>
                                    <li><a class="dropdown-item" onclick="salir()">Cerrar sesión</a></li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="proyectos.html">Proyectos</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="galeria.html">Galería</a>
                            </li>
                        </ul>
                        <div class="navbar-text" id="user-info" style="display: none;">
                            <img id="user-img" src="" alt="User" style="width: 30px; height: 30px; border-radius: 50%;">
                            <span id="user-email"></span>
                        </div>
                    </div>
                </div>
            </nav>`;
        console.log("Menú inicializado");
    }

    connectedCallback() {
        console.log("Menu connectedCallback invocado");
        this.updateUserEmailDisplay();
    }

    updateUserEmailDisplay() {
        const userEmailSpan = this.querySelector('#user-email');
        const userImg = this.querySelector('#user-img');
        const userInfoDiv = this.querySelector('#user-info');

        auth.onAuthStateChanged(user => {
            console.log("onAuthStateChanged evento detectado");
            if (user) {
                console.log(`Usuario detectado: ${user.email}`);
                userEmailSpan.textContent = user.email;
                
                // Obtener la URL de la imagen del usuario de Firestore
                db.collection('datosUsuarios').where('idemp', '==', user.uid).get()
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        userImg.src = userData.url; // Usa el campo 'url' de los datos del usuario
                        console.log(`Imagen del usuario obtenida: ${userData.url}`);
                    } else {
                        console.log("No se encontraron datos de usuario en Firestore.");
                        userImg.src = 'default-user-image-url.jpg'; // URL de imagen por defecto
                    }
                    userInfoDiv.style.display = 'flex';
                }).catch(error => {
                    console.error("Error al obtener datos del usuario de Firestore", error);
                    userImg.src = 'default-user-image-url.jpg'; // URL de imagen por defecto en caso de error
                });

            } else {
                console.log("No hay usuario logueado");
                userInfoDiv.style.display = 'none';
            }
        });
    }
}

customElements.define('menu-component', Menu);

function salir() {
    console.log("Intentando cerrar sesión...");
    auth.signOut().then(() => {
        console.log("Sesión cerrada correctamente");
        location.reload(); // O redirige al usuario donde prefieras
    }).catch((error) => {
        console.error('Error al cerrar sesión', error);
    });
}

// Código para la autenticación
document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.querySelector('#btnLogin');

    if (btnLogin) {
        btnLogin.addEventListener('click', function () {
            const txtEmail = document.querySelector('#txtEmail').value;
            const txtContra = document.querySelector('#txtContra').value;

            console.log("Intentando iniciar sesión...");
            auth.signInWithEmailAndPassword(txtEmail, txtContra)
                .then((userCredential) => {
                    console.log(`Inicio de sesión exitoso: ${userCredential.user.email}`);
                    document.location.href = 'index.html'; // Redirecciona después del login
                })
                .catch((error) => {
                    console.error(`Error al iniciar sesión: ${error.message}`);
                });
        });
    } else {
        console.log("Botón de login no encontrado en el DOM");
    }
});

auth.onAuthStateChanged(user => {
    if (user) {
        console.log(`Usuario logueado: ${user.email}`);
    } else {
        console.log("Usuario no logueado");
    }
});
