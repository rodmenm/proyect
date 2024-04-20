# Servidor Keycloak basado en Hyperledger/Indy
<br>

## PASOS A SEGUIR

**SOLO FUNCIONA EN LINUX**
- Al ejecutar el docker-compose por primera vez, SOLO poner la imagen de keycloak.
- DESABILITAR SSL PETICIONES EXTERNAS
- Una vez cargado entrar a http://localhost:8080

> [!NOTE]
> Si el despliegue se realiza en el servidor externo entrar a http://82.223.101.114:8080

- Crear un realm nuevo y dentro de ese realm realizar las siguientes modificaciones.
- En Realm Settings poner "Require SSL" como none

- Crear un nuevo cliente activando “Client authentication” y establecer estos parametros 
    - Valid redirect URIs -> "http://localhost:3000/*" (así habilitamos poder acceder a las demas rutas)<br>
    - Web origins -> "http://localhost:3000" (asi solo se puede acceder a la pagina de logueo desde nuestra web)<br>

> [!NOTE]
> Si el despliegue se realiza en el servidor externo sustituir **localhost** por **82.223.101.114**

- Una vez realizado esto seleccionamos nuestro cliente y le damos al boton que pone action. Luego le damos a donde pone “donwload adapter config” y copiamos todo el texto y lo pegamos en nuestra fichero keycloak.json de forma que solo aparezca lo que hemos pegado.
- Crear un usuario y ponerle credenciales. En nuestro caso “user” y “xxxx”
- Parar docker-compose e incluir en docker-compose.yml la imagen del servidor node.
- Levantar nuevamente docker-compose y ya solo se podra acceder a la página logged mediante el usuario creado
- Prerequisitos Parte Holder ( por completar)

### DESHABILITAR SSL PETICIONES EXTERNAS
Ejecutar:

```bash
docker exec -it keycloak bash
cd opt/keycloak/bin
./kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin
./kcadm.sh update realms/master -s sslRequired=NONE
```
> [!NOTE]
> Si el contenedor de keycloak no tiene como nombre **proyect-database-1** poner el nombre que tenga <br>
> Da igual que se realice en el servidor externo o no. Poner **localhost**

### PREREQUISITOS PARTE HOLDER<br>
- Solo se funcionara con la version 18 de Node 
- Instalar node-gyp forma global desde un **directorio padre** con:

```bash
sudo npm install -g node-gyp
```

### Identity Provider
Las wallets creadas se encuentran en la ruta del contenedor /root/.afj/data/wallet
Se ha de emplear el algoritmo HS256 para firmar los tokens
Para vincular el IDP con keycloak hay que crear un IDP personalizado con OpenID Protocol con estos datos:

- Authorization URL -> http://localhost:4000/login
- Token URL -> ESTAPORVER
- Client IS -> my_client_id (PROVISIONAL)
- CLient Secret -> my_client_secret ()


### DIreccion IP

Se ha de cambiar la direccion IP en los siguientes ficheros
- IdentityProvider\config.js
- IdentityProvider\App\views\index.ejs
- IdentityProvider\App\views\login.ejs
- server\public\scripts\script.js

> [!NOTE]
> El fichero auto_IP.py automatiza dicha tarea
