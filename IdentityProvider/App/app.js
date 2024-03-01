import session from "express-session";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.js";
import { HolderFinal } from "./../Holder/Holder.js";
import bodyParser from 'body-parser';

// import { IssuerFinal } from "./../Issuer/Issuer.js";
// import { VerifierFinal } from "./../Verifier/Verifier.js";

// Obtener la ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
global.w_id = "WalletCrear";
global.w_key = "walletkeycrear0000";

// Creamos un Verifier y un Issuer por defecto
let Holder = new HolderFinal();
await Holder.initializeHolder();
global.Holder = Holder

let Issuer = new IssuerFinal();
await Issuer.initializeIssuer();
global.Issuer = Issuer

// let Verifier = new VerifierFinal();
// await Verifier.initializeVerifier();

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

// Configura a partir del fichero public
app.use(express.static(`${__dirname}/public`));

// Configuración de la sesión de Express
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "dsofngsdjfngasdurgidbvilahbdfgila",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Importamos las rutas
app.get("/*", routes);
app.post("/*", routes)

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

