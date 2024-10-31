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

const ConexionDB = new Pool({
  host: "localhost",
  port: "5432",
  database: "eventoscta",
  user: "postgres",
  password: "123",
});

module.exports = { ConexionDB };

// EVENTO GET







ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
