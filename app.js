const express = require('express');
const app = express();
const port = 3000;

var indexRouter = require("./routes/index")

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Configura a partir del fichero public
app.use(express.static('public'));

// Importamos las rutas
app.use("/", indexRouter)

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
