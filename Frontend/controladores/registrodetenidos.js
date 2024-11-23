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
  fetch(`http://localhost:3001/personas/${dni}`)// Función para buscar DNI
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
    }
  
    // Realizar la llamada al servidor para obtener los datos del detenido por DNI
    fetch(`http://localhost:3001/personas/${dni}`).then(response => {
      if (!response.ok) {
        throw new Error('Persona no encontrada o eliminada');
      }
      return response.json();
    })
      .then(data => {
        // Verificar si la persona ya está cargada en la base de datos
        if (data) {
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
              // Acción de "Continuar"
              Swal.fire({
                title: 'Continuando...',
                text: 'Puede proceder con las opciones disponibles.',
                icon: 'success'
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Limpiar el campo de DNI para registrar uno nuevo
              dniInput.value = '';
            }
          });
        }
      })
      .catch(error => {
        console.error('Error al buscar el DNI en personas:', error);
        // Buscar en registros_detenidos
        fetch(`http://localhost:3001/registros_detenidos/${dni}`).then(response => {
          if (!response.ok) {
            throw new Error('Detenido no encontrado en registros');
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
  }
  

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


//PARTE DE LOS SELECTTTTTTTTTTT 
// Obtener referencias a los elementos del DOM
const provinciaSelect = document.getElementById('provincia');
const departamentoSelect = document.getElementById('departamento');
const localidadSelect = document.getElementById('localidad');
const municipioSelect = document.getElementById('municipio');
// Función para cargar las provincias
async function cargarProvincias() {
  try {
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

    // Establecer Catamarca como seleccionada
    provinciaSelect.value = '10';
    
    // Disparar el evento change
    provinciaSelect.dispatchEvent(new Event('change'));
    
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
async function cargarMunicipios(id_depto) {
  try {
    console.log('Cargando municipios para departamento:', id_depto);
    const response = await fetch(`http://localhost:3001/municipios/${id_depto}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const municipios = await response.json();
    console.log('Municipios recibidos (cantidad):', municipios.length); // Ver cuántos municipios recibimos
    console.log('Datos completos de municipios:', JSON.stringify(municipios, null, 2)); // Ver estructura completa
    
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="" disabled selected>Seleccione departamento</option>';
    
    if (Array.isArray(municipios) && municipios.length > 0) {
      municipios.forEach((municipio, index) => {
        console.log(`Procesando municipio ${index + 1}:`, municipio);
        const option = document.createElement('option');
        option.value = municipio.cod_agl;
        option.text = municipio.nom_agl;
        console.log(`Creando opción: value=${option.value}, text=${option.text}`);
        municipioSelect.add(option);
      });
    }
    
    municipioSelect.disabled = false;
    
    // Verificar el resultado final
    console.log('Número final de opciones en el select:', municipioSelect.options.length);
    
  } catch (error) {
    console.error('Error detallado al cargar municipios:', error);
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="" disabled selected>Error al cargar municipios</option>';
    municipioSelect.disabled = true;
  }
}


async function cargarLocalidades(id_municipio) {
  try {
    console.log('Cargando localidades para municipio:', id_municipio);
    const response = await fetch(`http://localhost:3001/localidades/${id_municipio}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const localidades = await response.json();
    console.log('localidades recibidas:', localidades);
    
    const localidadSelect = document.getElementById('localidad');
    localidadSelect.innerHTML = '<option value="" disabled selected>Seleccione localidad</option>';
    
    localidades.forEach(localidad => {
      const option = document.createElement('option');
      option.value = localidad.cod_ase;
      option.text = localidad.nombre;
      localidadSelect.add(option);
    });
    
    localidadSelect.disabled = false;
  } catch (error) {
    console.error('Error detallado al cargar localidades:', error);
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
  cargarMunicipios(cod_depto);
});

// Evento para cargar las localidades cuando se selecciona un departamento
municipioSelect.addEventListener('change', (event) => {
  const cod_agl = event.target.value;
  cargarLocalidades(cod_agl);
});
localidadSelect.addEventListener('change', (event) => {
  const localidadSeleccionada = event.target.value;
  console.log('Localidad seleccionada:', localidadSeleccionada);
  // Aquí puedes agregar cualquier lógica que necesites cuando se selecciona una localidad
});



