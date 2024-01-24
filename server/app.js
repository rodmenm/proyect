const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const keycloakConfig = require("./keycloak.json");
const app = express();
const port = 3000;

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", "./views");

// Configura a partir del fichero public
app.use(express.static("public"));

// Configuración de la sesión de Express
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "asdawda3dbqlhbdwoabyo8dygy2o8dadiuoas",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Configuración del adaptador de Keycloak
const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

// Importamos las rutas
var indexRouterProtected = require("./routes_protected/index");
var indexRouter = require("./routes/index");
app.get("/", indexRouter);
app.get("/logged", keycloak.protect(), indexRouterProtected);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
