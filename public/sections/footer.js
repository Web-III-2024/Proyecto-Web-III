class Footer extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=`<br><hr>
<div class="div_pi">
<div class="div_pc">
    Carrera de Tecnologías de la información<br/>
    Curso de Tecnologías y Sistemas Web 3<br/>
    Desarrollado por Eduar, William, Camila, David y Esteban
    <br/>
    Desarrolladores profesionales </div>

</div>` 
    }     
}

customElements.define('footer-component', Footer);

