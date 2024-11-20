// Función para buscar DNI
function buscarDNI() {
  const dniInput = document.getElementById("dni");
  const dni = dniInput.value.trim();

  // Verifica que el DNI ingresado no esté vacío
  if (!dni) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor ingrese un DNI.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }}

  // Realizar la llamada al servidor para obtener los datos del detenido por DNI
  fetch(`http://localhost:3001/personas/${dni}`).then(response => {
    if (!response.ok) {
      throw new Error('Persona no encontrada o eliminada');
    }z
    return response.json();
  })
    .then(data => {
      // Verificar si la persona ya está cargada en la base de datos
      if (data.fecha_creacion) {
        Swal.fire({
          title: 'Persona ya registrada',
          html: `
            <p>DNI: ${data.dni}</p>
            <p>Nombres: ${data.nombres}</p>
            <p>Apellidos: ${data.apellidos}</p>
            <p>Fecha de Nacimiento: ${data.fecha_nacimiento}</p>
            <p>Habilitado: ${data.habilitado ? 'Sí' : 'No'}</p>
            <p>Fecha de Creación: ${data.fecha_creacion}</p>
            <p>Usuario de Creación: ${data.usuario_creacion}</p>
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Registrar Nuevo Detenido'
        }).then((result) => {
          if (result.isConfirmed) {
            // Acción de "Continuar" (puedes redirigir a otra página si es necesario)
            // En este caso, solo muestra un mensaje.
            Swal.fire({
              title: 'Continuando...',
              text: 'Puede proceder con las opciones disponibles.',
              icon: 'success'
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Limpiar el campo de DNI para registrar uno nuevo
            dniInput.value = '';
          }
          return response.json();
        })
          .then(data => {
            if (data) {
              Swal.fire({
                title: 'Detenido Encontrado en Registros',
                html: `
                  <p>DNI: ${data.dni}</p>
                  <p>Nombres: ${data.nombres}</p>
                  <p>Apellidos: ${data.apellidos}</p>
                  <p>Fecha de Nacimiento: ${data.fecha_nacimiento}</p>
                  <p>Habilitado: ${data.habilitado ? 'Sí' : 'No'}</p>
                  <p>Fecha de Creación: ${data.fecha_creacion}</p>
                  <p>Usuario de Creación: ${data.usuario_creacion}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: 'DNI no encontrado',
                text: `El DNI ${dni} no está cargado en ninguna de las bases.`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          })
          .catch(error => {
            console.error('Error al buscar el DNI en registros_detenidos:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al buscar el detenido.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
      });
    
  

document.getElementById('imagenes').addEventListener('change', async function(event) {
  const files = Array.from(event.target.files);
  const previewContainer = document.getElementById('preview-container');
  previewContainer.innerHTML = ''; // Limpiar vistas previas anteriores

  // Verifica si hay más de 6 imágenes seleccionadas
  if (files.length > 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Límite de imágenes',
      text: 'Solo puedes subir un máximo de 6 imágenes.',
      confirmButtonText: 'Entendido'
    });
    event.target.value = ''; // Borra la selección de archivos
    return;
  }

  // Inicializa Pica para redimensionar
  const picaInstance = new pica();

  for (const file of files) {
    // Verifica el tipo de archivo
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no permitido',
        text: 'Solo se permiten archivos JPG y PNG.',
        confirmButtonText: 'Ok'
      });
      continue;
    }

    // Verifica el tamaño del archivo
    if (file.size > 2 * 1024 * 1024) { // Límite de 2 MB
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El archivo supera el tamaño máximo de 2 MB.',
        confirmButtonText: 'Ok'
      });
      continue;
    }

    // Crear una imagen para procesar
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    await img.decode();

    // Crear un canvas para redimensionar la imagen
    const canvas = document.createElement('canvas');
    canvas.width = 200;  // Ancho deseado para vista previa
    canvas.height = 200; // Alto deseado para vista previa

    // Redimensionar usando Pica
    await picaInstance.resize(img, canvas);

    // Convertir el canvas a un Blob para compresión
    canvas.toBlob((blob) => {
      // Crear contenedor para la imagen de vista previa y el botón de eliminar
      const previewImage = document.createElement('div');
      previewImage.classList.add('preview-image');
      
      const imgElement = document.createElement('img');
      imgElement.src = URL.createObjectURL(blob);
      imgElement.style.width = '150px'; // Tamaño de vista previa
      imgElement.style.height = '150px';
      imgElement.classList.add('thumbnail'); // Agrega clase para estilo si lo necesitas
      
      const removeButton = document.createElement('button');
      removeButton.textContent = 'x';
      removeButton.classList.add('remove-btn');
      removeButton.addEventListener('click', () => {
        previewContainer.removeChild(previewImage);
        updateImageCount();
      });

      previewImage.appendChild(imgElement);
      previewImage.appendChild(removeButton);
      previewContainer.appendChild(previewImage);
      updateImageCount();
    }, 'image/jpeg', 0.8); // Calidad de compresión (0 a 1)
  }
});

function updateImageCount() {
  const previewContainer = document.getElementById('preview-container');
  const imageCount = previewContainer.getElementsByClassName('preview-image').length;
  document.getElementById('image-count').textContent = `Imágenes restantes: ${imageCount}`;
}



// Función para limpiar el campo de DNI
function limpiarDNI() {
  document.getElementById('dni').value = '';
}
<<<<<<< HEAD



// Obtener referencias a los elementos del DOM
const provinciaSelect = document.getElementById('provincia');
const departamentoSelect = document.getElementById('departamento');
const localidadSelect = document.getElementById('localidad');

// Función para cargar las provincias
async function cargarProvincias() {
  try {
    // Asumiendo que tu servidor corre en el puerto 3000, ajusta según corresponda
    const cod_pais = 200; // O el valor que necesites
    const response = await fetch(`http://localhost:3001/provincias/${cod_pais}`);
    
    if (!response.ok) {
      throw new Error('Error al cargar provincias');
    }
    
    const provincias = await response.json();
    const provinciaSelect = document.getElementById('provincia');
    
    // Limpiar opciones existentes
    provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
    
    provincias.forEach(provincia => {
      const option = document.createElement('option');
      option.value = provincia.cod_pcia;
      option.text = provincia.nom_pcia;
      provinciaSelect.add(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
// Función para cargar las opciones de departamento
async function cargarDepartamentos(cod_pcia) {
  try {
    console.log('Cargando departamentos para provincia:', cod_pcia);
    const response = await fetch(`http://localhost:3001/departamentos/${cod_pcia}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const departamentos = await response.json();
    console.log('Departamentos recibidos:', departamentos);
    
    const departamentoSelect = document.getElementById('departamento');
    departamentoSelect.innerHTML = '<option value="" disabled selected>Seleccione departamento</option>';
    
    departamentos.forEach(departamento => {
      const option = document.createElement('option');
      option.value = departamento.cod_depto;
      option.text = departamento.nom_depto;
      departamentoSelect.add(option);
    });
    
    departamentoSelect.disabled = false;
  } catch (error) {
    console.error('Error detallado al cargar departamentos:', error);
    const departamentoSelect = document.getElementById('departamento');
    departamentoSelect.innerHTML = '<option value="" disabled selected>Error al cargar departamentos</option>';
    departamentoSelect.disabled = true;
  }
}
// En el frontend
async function cargarMunicipios(id_depto) {
  try {
    console.log('Iniciando carga de municipios para departamento:', id_depto);
    
    if (!id_depto) {
      throw new Error('Código de departamento no proporcionado');
    }

    const url = `http://localhost:3001/municipios/${id_depto}`;
    console.log('Intentando fetch a:', url);
    
    const response = await fetch(url);
    
    if (response.status === 404) {
      const municipioSelect = document.getElementById('municipio');
      municipioSelect.innerHTML = '<option value="" disabled selected>No hay municipios para este departamento</option>';
      municipioSelect.disabled = true;
      

    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const municipios = await response.json();
    console.log('Municipios recibidos:', municipios);
    
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="" disabled selected>Seleccione municipio</option>';
    
    municipios.forEach(municipios => {
      const option = document.createElement('option');
      option.value = municipios.cod_agl;  // Ajusta según el nombre de tu columna
      option.text = municipios.nom_agl;   // Ajusta según el nombre de tu columna
      municipioSelect.add(option);
    });
    
    municipioSelect.disabled = false;
    
    // Reseteamos el select de localidades
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Seleccione primero un municipio</option>';
    localidadSelect.disabled = true;
  } catch (error) {
    console.error('Error detallado al cargar municipios:', error);
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="" disabled selected>Error al cargar municipios</option>';
    municipioSelect.disabled = true;
    
    // También deshabilitamos el select de localidades
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Seleccione primero un municipio</option>';
    localidadSelect.disabled = true;
  }
}


async function cargarLocalidades(cod_agl) {
  try {
    console.log('Código de departamento seleccionado:', cod_agl); // Debug
    
    if (!cod_agl) {
      throw new Error('Código de departamento no proporcionado');
    }

    const url = `http://localhost:3001/localidades/${cod_agl}`;
    console.log('Intentando fetch a:', url); // Debug
    
    const response = await fetch(url);
    console.log('Estado de la respuesta:', response.status); // Debug
    
    if (response.status === 404) {
      const localidadSelect = document.getElementById('localidad');
      localidadSelect.innerHTML = '<option value="" disabled selected>No hay localidades para este departamento</option>';
      localidadSelect.disabled = true;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const localidades = await response.json();
    console.log('Datos de localidades:', localidades); // Debug
    
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Seleccione localidad</option>';
    
    localidades.forEach(localidades => {
      const option = document.createElement('option');
      option.value = localidades.cod_ase;
      option.text = localidades.nombre;
      localidadSelect.add(option);
    });
    
    localidadSelect.disabled = false;
  } catch (error) {
    console.error('Error completo:', error);
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Error al cargar localidades</option>';
    localidadSelect.disabled = true;
  }
}



// Evento para cargar las provincias al cargar la página
window.addEventListener('DOMContentLoaded', cargarProvincias);

// Evento para cargar los departamentos cuando se selecciona una provincia
provinciaSelect.addEventListener('change', (event) => {
  const cod_pcia = event.target.value;
  cargarDepartamentos(cod_pcia);
  localidadSelect.disabled = true;
});

// Evento para cargar las localidades cuando se selecciona un departamento
departamentoSelect.addEventListener('change', (event) => {
  const cod_depto = event.target.value;
  cargarLocalidades(cod_depto);
});

// Asegúrate de tener el evento change en el select de departamentos
document.getElementById('departamento').addEventListener('change', function() {
  const cod_depto = this.value;
  if (cod_depto) {
    cargarLocalidades(cod_depto);
  } else {
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Seleccione primero un departamento</option>';
    localidadSelect.disabled = true;
  }
});
=======
>>>>>>> c7026a26013cb8ec2f1d4104c15782711f8df393
