class Footer extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=`<br><hr>
<div class="div_pi">
    <strong>: </strong><br/>
    <strong>:    </strong><br />
    <strong>: </strong></div>
<div class="div_pc">
    Carrera de Tecnologías de la información<br/>
    Curso de Tecnologías y Sistemas Web 3<br/>
    Desarrollado por Eduar, William, Dylan y Keylor 
</div>
<div class="div_pd">
    <a href="https://www.facebook.com/"><i class="fa fa-2x fa-facebook"></i></a>
    <br>
    <a href="https://twitter.com/"><i class="fa fa-2x fa-twitter"></i></a>
</div>` 
    }     
}

customElements.define('footer-component', Footer);

