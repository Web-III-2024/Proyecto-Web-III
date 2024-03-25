// Obtén una referencia al botón de descarga y al enlace del PDF
const downloadButton = document.getElementById('download-pdf-button');
const pdfLink = document.querySelector('a[href$="investigacion-manglares.pdf"]');

// Agrega un evento click al botón de descarga
downloadButton.addEventListener('click', () => {
    // Crea una solicitud de descarga del PDF
    fetch(pdfLink.href).then(response => {
        return response.blob();
    }).then(blob => {
        // Crea un enlace temporal para la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Establece el nombre del archivo PDF
        a.download = 'investigacion-manglares.pdf';
        document.body.appendChild(a);
        // Simula un clic en el enlace para iniciar la descarga
        a.click();
        window.URL.revokeObjectURL(url);
    });
});
