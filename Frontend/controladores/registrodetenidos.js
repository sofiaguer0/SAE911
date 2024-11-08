import Swal from 'sweetalert2';

function buscarDNI(dni) {
  const dni = document.getElementById("dni").value;

  // Verifica que el DNI ingresado no esté vacío
  if (!dni) {
      Swal.fire({
          title: 'Error',
          text: 'Por favor ingrese un DNI.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
      });
      return;
  }

  // Realizar la llamada al servidor para obtener los datos del detenido por DNI
  fetch(`/personas/${dni}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Persona no encontrada o eliminada');
      }
    })
    .then(data => {
      console.log('Datos del detenido:', data); // Verifica los datos que recibes
      // Mostrar los datos del detenido encontrado
      Swal.fire({
        title: 'Detenido Encontrado',
        html: `
          <p>Nombres: ${data.nombres}</p>
          <p>Apellidos: ${data.apellidos}</p>
          <p>DNI: ${data.dni}</p>
          <p>CUIL: ${data.cuil}</p>
          <p>Género: ${data.genero}</p>
          <p>Fecha de Nacimiento: ${data.fecha_nacimiento}</p>
          <p>Habilitado: ${data.habilitado ? 'Sí' : 'No'}</p>
          <p>Fecha de Creación: ${data.fecha_creacion}</p>
          <p>Usuario de Creación: ${data.usuario_creacion}</p>
          <p>Eliminado: ${data.eliminado ? 'Sí' : 'No'}</p>
          <p>Fecha de Eliminación: ${data.fecha_eliminacion || 'N/A'}</p>
          <p>Usuario de Eliminación: ${data.usuario_eliminacion || 'N/A'}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    })
    .catch(error => {
      console.error('Error al buscar el DNI:', error); // Agrega un log para ver el error
      Swal.fire({
        title: 'DNI no encontrado',
        text: `El DNI ${dni} no está cargado. Registrar nuevo detenido.`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
}

document.getElementById('imagenes').addEventListener('change', async function(event) {
  const files = Array.from(event.target.files);
  const previewContainer = document.getElementById('preview-container');
  previewContainer.innerHTML = ''; // Limpiar vistas previas anteriores

  if (files.length > 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Límite de imágenes',
      text: 'Solo se pueden subir un máximo de 6 imágenes.',
      confirmButtonText: 'Entendido'
    });
    event.target.value = ''; // Vaciar la selección de archivos
    return;
  }

  const pica = new Pica();

  for (const file of files) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no permitido',
        text: 'Solo se permiten archivos JPG y PNG.',
        confirmButtonText: 'Ok'
      });
      continue;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El archivo supera el tamaño máximo de 2 MB.',
        confirmButtonText: 'Ok'
      });
      continue;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = 500; // Ancho deseado
    canvas.height = 500; // Alto deseado

    // Redimensionar la imagen
    await pica.resize(img, canvas);

    // Comprimir la imagen redimensionada
    const compress = new Compress();
    const data = await compress.compress([canvas], {
      size: 2,  // Tamaño máximo en MB
      quality: 0.8,  // Calidad de compresión (0 a 1)
      maxWidth: 500,
      maxHeight: 500,
      resize: true
    });

    const { data: base64str } = data[0];
    const previewImage = document.createElement('img');
    previewImage.src = `data:image/jpeg;base64,${base64str}`;
    previewImage.classList.add('thumbnail'); // Añadir clase CSS para darle estilo
    previewContainer.appendChild(previewImage);
  }
});
