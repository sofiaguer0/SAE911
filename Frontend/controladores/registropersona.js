// Cargar provincias al iniciar la página con el país fijo (Argentina)
document.addEventListener('DOMContentLoaded', () => {
    cargarProvincias();
  });
  
  function cargarProvincias() {
    const paisId = 200; // Código fijo para Argentina
  
    fetch(`/provincias/${paisId}`)
      .then(response => response.json())
      .then(data => {
        const provinciaSelect = document.getElementById('provincia');
        provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
        data.forEach(provincia => {
          const option = document.createElement('option');
          option.value = provincia.cod_pcia;
          option.textContent = provincia.nom_pcia;
          provinciaSelect.appendChild(option);
        });
        provinciaSelect.disabled = false;
      })
      .catch(error => console.error('Error al cargar provincias:', error));
  }
  
  function cargarDepartamentos() {
    const provinciaId = document.getElementById('provincia').value;
    if (!provinciaId) return;
  
    fetch(`/departamentos/${provinciaId}`)
      .then(response => response.json())
      .then(data => {
        const departamentoSelect = document.getElementById('departamento');
        departamentoSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
        data.forEach(departamento => {
          const option = document.createElement('option');
          option.value = departamento.cod_depto;
          option.textContent = departamento.nom_depto;
          departamentoSelect.appendChild(option);
        });
        departamentoSelect.disabled = false;
      })
      .catch(error => console.error('Error al cargar departamentos:', error));
  }
  
  function cargarMunicipios() {
    const departamentoId = document.getElementById('departamento').value;
    if (!departamentoId) return;
  
    fetch(`/municipios/${departamentoId}`)
      .then(response => response.json())
      .then(data => {
        const municipioSelect = document.getElementById('municipio');
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
        data.forEach(municipio => {
          const option = document.createElement('option');
          option.value = municipio.cod_agl;
          option.textContent = municipio.nom_agl;
          municipioSelect.appendChild(option);
        });
        municipioSelect.disabled = false;
      })
      .catch(error => console.error('Error al cargar municipios:', error));
  }
  
  function cargarLocalidades() {
    const municipioId = document.getElementById('municipio').value;
    if (!municipioId) return;
  
    fetch(`/localidades/${municipioId}`)
      .then(response => response.json())
      .then(data => {
        const localidadSelect = document.getElementById('localidad');
        localidadSelect.innerHTML = '<option value="">Seleccione una localidad</option>';
        data.forEach(localidad => {
          const option = document.createElement('option');
          option.value = localidad.cod_ase;
          option.textContent = localidad.nombre;
          localidadSelect.appendChild(option);
        });
        localidadSelect.disabled = false;
      })
      .catch(error => console.error('Error al cargar localidades:', error));
  }