import Swal from 'sweetalert2';

function buscarDNI() {
    const dni = document.getElementById("dni").value;
  
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
        Swal.fire({
          title: 'DNI no encontrado',
          text: `El DNI ${dni} no está cargado. Registrar nuevo detenido.`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  }
  
  function cancelar() {
    // Aquí iría la lógica para cancelar el registro
    console.log("Registro cancelado");
  }