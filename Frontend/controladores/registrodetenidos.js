function buscarDNI() {
    var dni = document.getElementById("dni").value;
    // Aquí iría la lógica para buscar el DNI en la base de datos
    if (false) { // Reemplazar con la lógica real
      Swal.fire({
        title: 'DNI no encontrado',
        text: `El DNI ${dni} no está cargado. Registrar nuevo detenido.`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } else {
      // El DNI está cargado, continuar con el registro
    }
  }

  function cancelar() {
    // Aquí iría la lógica para cancelar el registro
    console.log("Registro cancelado");
  }