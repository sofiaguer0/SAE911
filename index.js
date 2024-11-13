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

ServidorWeb.get('/paises', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pais');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.get('/provincias/:cod_pais', async (req, res) => {
  const { cod_pais } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM provincias WHERE id_pais = ?', [cod_pais]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.get('/departamentos/:cod_pcia', async (req, res) => {
  const { cod_pcia } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM departamentos WHERE id_pcia = ?', [cod_pcia]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.get('/municipios/:cod_depto', async (req, res) => {
  const { cod_depto } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM municipios WHERE id_depto = ?', [cod_depto]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.get('/localidades/:cod_agl', async (req, res) => {
  const { cod_agl } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM localidades WHERE id_municipio = ?', [cod_agl]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});