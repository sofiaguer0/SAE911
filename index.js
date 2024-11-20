const PORT = process.env.PORT || 3001;
const ClaseExpress = require("express");
const cors = require("cors");
const ServidorWeb = ClaseExpress();

// Usar CORS en todas las rutas
ServidorWeb.use(cors());

ServidorWeb.use(ClaseExpress.static("frontend"));
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'sae_911',
  user: 'root',
  password: ''
});

//GET USUARIOS FUNCIONA//
ServidorWeb.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(
      `SELECT id, persona_id, nombre, email, rol, imagen, comisaria_id, habilitado, fecha_creacion, usuario_creacion
       FROM usuarios
       WHERE id = ? AND eliminado = false`,
      [id]
    );
    if (results.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado o eliminado" });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

// GET PERSONAS FUNCIONA// 
ServidorWeb.get("/personas/:dni", async (req, res) => {
  const { dni } = req.params;
  try {
    const [results] = await pool.query(
      `SELECT id, dni, cuil, nombres, apellidos, genero, fecha_nacimiento, habilitado, 
              fecha_creacion, usuario_creacion, eliminado, fecha_eliminacion, usuario_eliminacion
       FROM personas
       WHERE dni = ? AND eliminado = false`,
      [dni]
    );
    if (results.length === 0) {
      res.status(404).json({ message: "Persona no encontrada o eliminada" });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la persona" });
  }
});

//REGISTROS_DETENIDOS FUNCIONAAAA//
ServidorWeb.get("/registros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(
      `SELECT dni, provincia, departamento, municipio, localidad, id, persona_id, usuario_id, ubicacion_id, fecha, hora, alias, imagenes, habilitado, 
      eliminado, causa, tipo, descripcion, comisaria_id 
       FROM registros_detenidos
       WHERE id = ? AND eliminado = false`,
      [id]
    );
    if (results.length === 0) {
      res.status(404).json({ message: "Registro no encontrado o eliminado" });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ message: "Error al obtener el registro" });
  }
});
ServidorWeb.get('/provincias/:cod_pais', async (req, res) => {
  const { cod_pais } = req.params;
  try {
    // Ahora usamos el parámetro cod_pais en la consulta
    const [rows] = await pool.query('SELECT * FROM provincias WHERE id_pais = ?', [cod_pais]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.get('/departamentos/:cod_pcia', async (req, res) => {
  const { cod_pcia } = req.params;
  try {
    if (!cod_pcia) {
      return res.status(400).json({ error: 'Se requiere código de provincia' });
    }

    const [rows] = await pool.query('SELECT * FROM departamentos WHERE id_pcia = ?', [cod_pcia]);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron departamentos para esta provincia' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// En el servidor
ServidorWeb.get('/municipios/:id_depto', async (req, res) => {
  const { id_depto } = req.params;
  try {
    if (!id_depto) {
      return res.status(400).json({ error: 'Se requiere código de departamento' });
    }

    console.log('Buscando municipios para departamento:', id_depto); // Debug

    const [rows] = await pool.query('SELECT * FROM municipios WHERE id_depto = ?', [id_depto]);
    
    if (!rows || rows.length === 0) {
      console.log('No se encontraron municipios para el departamento:', id_depto);
      return res.status(404).json({ 
        message: 'No se encontraron municipios para este departamento',
        id_depto: id_depto
      });
    }
    
    console.log('Municipios encontrados:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// En el servidor
ServidorWeb.get('/localidades/:id_municipio', async (req, res) => {
  const { id_municipio} = req.params;
  try {
    console.log('Código de departamento recibido:', id_municipio); // Debug

    // Modificamos la consulta para ver si hay datos
    const [rows] = await pool.query(
      'SELECT * FROM localidades WHERE id_municipio = ? LIMIT 1',
      [id_municipio]
    );
    
    console.log('Resultados de la consulta:', rows); // Debug

    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron localidades para este departamento',
        id_municipio: id_municipio
      });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});



//////////////post/////////////
ServidorWeb.post("/registros", async (req, res) => {
  const {
    id, dni, provincia_id, departamento_id, municipio_id, localidad_id, persona_id, usuario_id, ubicacion_id, comisaria_id, fecha, hora, horaregistro, alias, causa, tipo, descripcion, habilitado, eliminado, imagenes
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO registros_detenidos (
        id, dni, provincia_id, departamento_id, municipio_id, localidad_id, persona_id, usuario_id, ubicacion_id, comisaria_id, fecha, hora, horaregistro, alias, causa, tipo, descripcion, habilitado, eliminado, imagenes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id, dni, provincia_id, departamento_id, municipio_id, localidad_id, persona_id, usuario_id, ubicacion_id, comisaria_id, fecha, hora, horaregistro, alias, causa, tipo, descripcion, habilitado, eliminado, imagenes
      ]
    );

    res.status(201).json({
      message: "Registro creado correctamente",
      id: result.insertId
    });
  } catch (error) {
    console.error("Error en la inserción:", error);
    res.status(500).json({ message: "Error al crear el registro", error: error.message });
  }
});









ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});