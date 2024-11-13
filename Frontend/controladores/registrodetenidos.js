/* // Función para buscar DNI
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
  fetch(`http://localhost:3001/personas/${dni}`)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          // Si la respuesta es 404, significa que la persona no fue encontrada o está eliminada
          throw new Error(`El DNI ${dni} no está registrado o ha sido eliminado.`);
        }
        throw new Error('Error al procesar la solicitud.');
      }
      return response.json();
    })
    .then(data => {
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
          confirmButtonText: 'Editar',
          cancelButtonText: 'Registrar Nuevo'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/editar-detenido/${data.id}`;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            dniInput.value = '';
          }
        });
      } else {
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
          `,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        document.getElementById('persona_id').value = data.id;
      }
    })
    .catch(error => {
      Swal.fire({
        title: 'DNI no encontrado',
        html: `El DNI ${dni} no está cargado. <button class="btn btn-primary" onclick="limpiarDNI()">Registrar Nuevo Detenido</button>`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Error al buscar el DNI:', error);
    });
}

// Función para limpiar el campo de DNI
function limpiarDNI() {
  document.getElementById('dni').value = '';
}

 */
////


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
        });
      } else {
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
          `,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });

        // Guardar el ID de la persona en el campo oculto
        document.getElementById('persona_id').value = data.id;
      }
    })
    .catch(error => {
      console.error('Error al buscar el DNI:', error);
      Swal.fire({
        title: 'DNI no encontrado',
        html: `El DNI ${dni} no está cargado. <button class="btn btn-primary" onclick="limpiarDNI()">Registrar Nuevo Detenido</button>`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
}

// Función para limpiar el campo de DNI
function limpiarDNI() {
  document.getElementById('dni').value = '';
}
