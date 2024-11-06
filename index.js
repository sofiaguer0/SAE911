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


//POST PERSONA//
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

//GET USUARIOS FUNCIONA//
ServidorWeb.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  ConexionDB.query(
    `SELECT id, persona_id, nombre, email, rol, imagen, comisaria_id, habilitado, fecha_creacion, usuario_creacion
     FROM usuarios
     WHERE id = ? AND eliminado = false`,
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Usuario no encontrado o eliminado" });
      } else {
        res.json(results[0]);
      }
    }
  );
});


// GET: /personas/:id
ServidorWeb.get("/personas/:id", (req, res) => {
  const { id } = req.params;
  ConexionDB.query(
    `SELECT id, dni, cuit, nombres, apellidos, genero, fecha_nacimiento, habilitado, 
            fecha_creacion, usuario_creacion, eliminado, fecha_eliminacion, usuario_eliminacion
     FROM personas
     WHERE id = ? AND eliminado = false`,
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la persona" });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Persona no encontrada o eliminada" });
      } else {
        res.json(results[0]);
      }
    }
  );
});





ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
