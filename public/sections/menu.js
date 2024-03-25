class Menu extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=`<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div class="container-fluid">
             <a class="navbar-brand"><img src="images/logo/libro.png" alt="" width="15%"  class="d-inline-block align-text-top"></a>
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
                    <a class="nav-link active" href="agregar.html">Estudiantes</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>` 
    }     
}

customElements.define('menu-component', Menu);

