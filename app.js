const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/paginaPrincipal") {
    mostrarConsultaBaseDeDatos(res);
  } else if (url === "/public/js/index.js") {
    // Ruta para servir el archivo JavaScript
    servirArchivoEstático(res, "public/js/index.js");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Pagina no encontrada");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

function mostrarConsultaBaseDeDatos(res) {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "Alan",
    password: "hellweg123",
    database: "nodejs",
  });

  const consultaSQL = "SELECT * FROM usuarios";
  connection.query(consultaSQL, (err, resultados) => {
    if (err) {
      console.error("Error al consultar la base de datos: " + err.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno del servidor");
      return;
    }

    let respuestaHTML =
      "<html><head><title>Pagina Principal</title></head><body>";
    respuestaHTML += "<h1>Usuarios en Pagina Principal</h1>";
    respuestaHTML += "<ul>";
    for (let i = 0; i < resultados.length; i++) {
      respuestaHTML += `<li>${resultados[i].nombre}, ${resultados[i].user}</li>`;
    }
    respuestaHTML += "</ul></body></html>";

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(respuestaHTML);

    connection.end();
  });
}

function servirArchivoEstático(res, ruta) {
  // Lee el archivo estático y lo sirve como respuesta
  const filePath = path.join(__dirname, ruta);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error al servir el archivo estático: " + err.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno del servidor");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(data);
  });
}
