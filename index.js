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
  password: '12345678', // Coloca aquí la contraseña de tu usuario de MySQL
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



//post registrp
ServidorWeb.post("/registro", async (req, res) => {
  const {
    persona_id, usuario_id, ubicacion_id, dni, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id
  } = req.body;

  const query = `
    INSERT INTO registros_detenidos 
    (persona_id, usuario_id, ubicacion_id, dni, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    persona_id, usuario_id, ubicacion_id, dni, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id
  ];

  try {
    const [result] = await ConexionDB.promise().query(query, values);
    res.status(201).json({ message: "Registro creado exitosamente", id: result.insertId });
  } catch (error) {
    console.error("Error al crear el registro:", error);
    res.status(500).json({ error: "Error al crear el registro" });
  }
});




//get 
ServidorWeb.get("/registros", async (req, res) => {
  try {
    const [results] = await ConexionDB.promise().query("SELECT * FROM registros_detenidos");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    res.status(500).json({ error: "Error al obtener los registros" });
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


//registros 

ServidorWeb.get("/registros", (req, res) => {
  const query = "SELECT * FROM registros_detenidos";
  ConexionDB.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los registros:", err);
      res.status(500).json({ error: "Error al obtener los registros" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint para crear un nuevo registro
ServidorWeb.post("/registro", (req, res) => {
  const { persona_id, usuario_id, ubicacion_id, dni, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id } = req.body;

  const query = `
    INSERT INTO registros_detenidos 
    (persona_id, usuario_id, ubicacion_id, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [persona_id, usuario_id, ubicacion_id, fecha, hora, alias, imagenes, tipo, descripcion, comisaria_id];

  ConexionDB.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al crear el registro:", err);
      res.status(500).json({ error: "Error al crear el registro" });
    } else {
      res.status(201).json({ message: "Registro creado exitosamente", id: result.insertId });
    }
  });
});



ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
