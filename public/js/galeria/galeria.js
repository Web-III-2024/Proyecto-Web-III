window.addEventListener('DOMContentLoaded', () => {
    const galeria = document.getElementById('galeria-carruseles');
    const toggleButton = document.getElementById('toggleView');
    let isCarruselView = true; // Empieza con la vista del carrusel por defecto
    let datosInvestigaciones = []; // Este arreglo se llenará con los datos de Firestore

    function agregarInfoAutor(investigacionContainer, autorEmail) {
        console.log('Agregando información del autor:', autorEmail); // Depuración
        const autorInfo = document.createElement('p');
        autorInfo.className = 'autor-info';
        autorInfo.textContent = `${autorEmail} — Autor(a) de trabajo`;
        investigacionContainer.appendChild(autorInfo);
    }
    



    // Función para cargar las imágenes en una vista estática, una al lado de la otra
    function cargarVistaCuadrícula(data) {
        galeria.innerHTML = ''; // Limpiar la galería antes de cargar la nueva vista

        data.forEach(investigacion => {
            const investigacionContainer = document.createElement('div');
            investigacionContainer.className = 'investigacion-container-grid';

            let imageIndex = 1;
            let foundImage = true;
            while (foundImage) {
                const imageKey = `Imagen_${imageIndex}`;
                if (investigacion[imageKey]) {
                    const img = document.createElement('img');
                    img.src = investigacion[imageKey];
                    img.className = 'imagen-cuadricula';
                    investigacionContainer.appendChild(img);
                    imageIndex++;
                } else {
                    foundImage = false;
                }
            }

            if (imageIndex > 1) {
                const titulo = document.createElement('h5');
                titulo.textContent = investigacion.titulo;
                const descripcion = document.createElement('p');
                descripcion.textContent = investigacion.descripcion;

                investigacionContainer.insertBefore(descripcion, investigacionContainer.firstChild);
                investigacionContainer.insertBefore(titulo, investigacionContainer.firstChild);
            }

            agregarInfoAutor(investigacionContainer, investigacion.Correo);
            galeria.appendChild(investigacionContainer);
        });
        
    }

    
    // Esta función carga las investigaciones en la vista del carrusel
    function cargarCarrusel(data) {
        galeria.innerHTML = ''; // Limpiar la galería antes de cargar la nueva vista

        data.forEach(investigacion => {
            // Crear el contenedor para esta investigación
            const investigacionContainer = document.createElement('div');
            investigacionContainer.className = 'investigacion-container';

            // Crear el título y la descripción fuera del carrusel
            const titulo = document.createElement('h5');
            titulo.textContent = investigacion.titulo;
            const descripcion = document.createElement('p');
            descripcion.textContent = investigacion.descripcion;

            investigacionContainer.appendChild(titulo);
            investigacionContainer.appendChild(descripcion);

            // Crear el contenedor del carrusel para esta investigación
            const carousel = document.createElement('div');
        carousel.className = 'carousel slide';
        carousel.id = `carousel-${investigacion.id}`;
        carousel.setAttribute('data-bs-ride', 'carousel');
        
        const carouselInner = document.createElement('div');
        carouselInner.className = 'carousel-inner';

        let imageIndex = 1;
        let foundImage = true;
        while (foundImage) {
            const imageKey = `Imagen_${imageIndex}`;
            if (investigacion[imageKey]) {
                const item = document.createElement('div');
                item.className = 'carousel-item' + (imageIndex === 1 ? ' active' : '');
                item.innerHTML = `<img src="${investigacion[imageKey]}" class="d-block w-100" alt="Imagen de investigación">`;
                carouselInner.appendChild(item);
                imageIndex++;
            } else {
                foundImage = false;
            }
        }

        carousel.appendChild(carouselInner);

        if (imageIndex > 1) { // Si hay más de una imagen, agregar controles
            const prevButton = document.createElement('button');
            prevButton.className = 'carousel-control-prev';
            prevButton.setAttribute('type', 'button');
            prevButton.setAttribute('data-bs-target', `#carousel-${investigacion.id}`);
            prevButton.setAttribute('data-bs-slide', 'prev');
            prevButton.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`;
            
            const nextButton = document.createElement('button');
            nextButton.className = 'carousel-control-next';
            nextButton.setAttribute('type', 'button');
            nextButton.setAttribute('data-bs-target', `#carousel-${investigacion.id}`);
            nextButton.setAttribute('data-bs-slide', 'next');
            nextButton.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>`;

            carousel.appendChild(prevButton);
            carousel.appendChild(nextButton);
        }

        investigacionContainer.appendChild(carousel);
        galeria.appendChild(investigacionContainer);

        // Inicializar el carrusel
        new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
        agregarInfoAutor(investigacionContainer, investigacion.Correo);
        galeria.appendChild(investigacionContainer);
    });
}
    // Llamada a Firestore para obtener los datos y cargar la vista inicial del carrusel
    db.collection('Pruebas').get().then(querySnapshot => {
        datosInvestigaciones = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        cargarCarrusel(datosInvestigaciones); // Carga inicial del carrusel
    });

    toggleButton.addEventListener('click', () => {
        isCarruselView = !isCarruselView;
        toggleButton.textContent = `Cambiar a vista ${isCarruselView ? 'estática' : 'de carrusel'}`;

        if (isCarruselView) {
            cargarCarrusel(datosInvestigaciones);
        } else {
            cargarVistaCuadrícula(datosInvestigaciones);
        }
    });
});
