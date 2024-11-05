const PORT = process.env.PORT || 3001; // aquí establezco el puerto
const ClaseExpress = require("express"); // aquí importo la biblioteca express
const cors = require("cors"); // Importa el paquete cors
const ServidorWeb = ClaseExpress(); // aquí instancio un obj a partir de la clase express

// Usar CORS en todas las rutas
ServidorWeb.use(cors());

ServidorWeb.use(ClaseExpress.static("frontend"));
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));

const { Pool } = require("pg");

/* const ConexionDB = new Pool({
  host: "localhost",
  port: "5432",
  database: "sae_911",
  user: "postgres",
  password: "123",
});

module.exports = { ConexionDB }; */

const mysql = require('mysql2');

const ConexionDB = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'sae_911',
  user: 'root', // Cambia 'root' por tu usuario de MySQL
  password: '', // Coloca aquí la contraseña de tu usuario de MySQL
});

// Verifica la conexión
ConexionDB.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
    connection.release(); // Libera la conexión cuando terminas de usarla
  }
});


//POST PERSONA

ServidorWeb.post("/personas", async (req, res) => {
  try {
    const {
      dni,
      cuil,
      nombres,
      apellidos,
      genero,
      fecha_nacimiento,
      habilitado,
      usuario_creacion,
    } = req.body;

    const fecha_creacion = new Date();
    const resultado = await ConexionDB.query(
      `INSERT INTO personas (dni, cuil, nombres, apellidos, genero, fecha_nacimiento, habilitado, fecha_creacion, usuario_creacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [dni, cuil, nombres, apellidos, genero, fecha_nacimiento, habilitado || true, fecha_creacion, usuario_creacion]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
});




// GET: /personas/:id
ServidorWeb.get("/personas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await ConexionDB.query(
      `SELECT * FROM personas WHERE id = $1 AND eliminado = false`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});




//GET USUARIOS

ServidorWeb.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultado = await ConexionDB.query(
      `SELECT id, persona_id, nombre, email, rol, imagen, comisaria_id, habilitado, fecha_creacion, usuario_creacion
       FROM usuarios
       WHERE id = $1 AND eliminado = false`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o eliminado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
})






ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
