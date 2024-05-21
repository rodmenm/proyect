import session from "express-session";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.js";
import bodyParser from "body-parser";

// Obtener la ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 5000;

//FUNCIONES


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

// Configura a partir del fichero public
app.use(express.static(`${__dirname}/public`));

// Configuración de la sesión de Express
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "misecretosuperseguro",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Importamos las rutas
app.get("/*", routes);
app.post("/*", routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
