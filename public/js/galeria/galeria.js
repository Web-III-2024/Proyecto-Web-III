window.addEventListener('DOMContentLoaded', () => {
    const galeria = document.getElementById('galeria-carruseles');
    const toggleButton = document.getElementById('toggleView');
    const autorSelect = document.getElementById('filtroAutor');
    const areaSelect = document.getElementById('filtroArea');
    let isCarruselView = true;
    let datosInvestigaciones = [];

    function agregarInfoAutor(investigacionContainer, autorEmail) {
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

    function cargarCarrusel(data) {
        galeria.innerHTML = ''; // Limpiar la galería antes de cargar la nueva vista

        data.forEach(investigacion => {
            const investigacionContainer = document.createElement('div');
            investigacionContainer.className = 'investigacion-container';

            const titulo = document.createElement('h5');
            titulo.textContent = investigacion.titulo;
            const descripcion = document.createElement('p');
            descripcion.textContent = investigacion.descripcion;

            investigacionContainer.appendChild(titulo);
            investigacionContainer.appendChild(descripcion);

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

            new bootstrap.Carousel(carousel, {
                interval: 5000,
                wrap: true
            });

            agregarInfoAutor(investigacionContainer, investigacion.Correo);
            galeria.appendChild(investigacionContainer);
        });
    }

    function cargarAutoresYAreas() {
        const autores = new Set();
        const areas = new Set();

        datosInvestigaciones.forEach(investigacion => {
            autores.add(investigacion.Correo);
            areas.add(investigacion.area);
        });

        autores.forEach(autor => {
            const opcionAutor = document.createElement('option');
            opcionAutor.value = autor;
            opcionAutor.textContent = autor;
            autorSelect.appendChild(opcionAutor);
        });

        areas.forEach(area => {
            const opcionArea = document.createElement('option');
            opcionArea.value = area;
            opcionArea.textContent = area;
            areaSelect.appendChild(opcionArea);
        });
    }

    function aplicarFiltros() {
        const autorSeleccionado = autorSelect.value;
        const areaSeleccionada = areaSelect.value;

        let datosFiltrados = datosInvestigaciones;

        if (autorSeleccionado !== 'Todos') {
            datosFiltrados = datosFiltrados.filter(investigacion => investigacion.Correo === autorSeleccionado);
        }

        if (areaSeleccionada !== 'Todos') {
            datosFiltrados = datosFiltrados.filter(investigacion => investigacion.area === areaSeleccionada);
        }

        if (isCarruselView) {
            cargarCarrusel(datosFiltrados);
        } else {
            cargarVistaCuadrícula(datosFiltrados);
        }
    }

    db.collection('Pruebas').get().then(querySnapshot => {
        datosInvestigaciones = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        cargarAutoresYAreas(); // Cargar autores y áreas una vez que se obtengan los datos
        aplicarFiltros(); // Aplicar filtros una vez que se obtengan los datos
    });

    toggleButton.addEventListener('click', () => {
        isCarruselView = !isCarruselView;
        toggleButton.textContent = `Cambiar a vista ${isCarruselView ? 'estática' : 'de carrusel'}`;
        aplicarFiltros();
    });

    autorSelect.addEventListener('change', aplicarFiltros);
    areaSelect.addEventListener('change', aplicarFiltros);
});
