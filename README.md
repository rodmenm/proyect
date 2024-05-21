# Servidor Keycloak basado en Hyperledger/Indy
<br>

## PASOS A SEGUIR

**SOLO FUNCIONA EN LINUX**
- Al ejecutar el docker-compose por primera vez, SOLO poner la imagen de keycloak.
- DESABILITAR SSL PETICIONES EXTERNAS
- Una vez cargado entrar a http://localhost:8080

> [!NOTE]
> Si el despliegue se realiza en el servidor externo entrar a http://IP:8080

- Crear un realm nuevo y dentro de ese realm realizar las siguientes modificaciones.
- En Realm Settings poner "Require SSL" como none

- Crear un nuevo cliente activando “Client authentication” y establecer estos parametros 
    - Valid redirect URIs -> "http://localhost:3000/*" (así habilitamos poder acceder a las demas rutas)<br>
    - Web origins -> "http://localhost:3000" (asi solo se puede acceder a la pagina de logueo desde nuestra web)<br>

> [!NOTE]
> Si el despliegue se realiza en el servidor externo sustituir **localhost** por **IP**

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
El servicio IDP no formara parte del resultado final, su unico proposito es el testeo <br>
Ademas no esta diseñado para funcionar a la par que el resultado final ya que se solapan puertos

Las wallets creadas se encuentran en la ruta del contenedor /root/.afj/data/wallet
Se ha de emplear el algoritmo HS256 para firmar los tokens
Para vincular el IDP con keycloak hay que crear un IDP personalizado con OpenID Protocol con estos datos:

- Alias -> LoQueSea (ES UNICO)
- Display name -> DaIgual
- Authorization URL -> http://localhost:4000/login
- Token URL -> http://localhost:4000/login/token
- Issuer -> invented
- Client Authentication -> Client secret sent as post
- Client ID -> myclientid  
- CLient Secret -> myclientsecret (Con esto se firma el token)
- Store Tokens -> ON
- Stored tokens readable -> ON
- El resto OFF

> [!NOTE]
> Si el despliegue se realiza en el servidor externo sustituir **localhost** por **IP** <br>
> Todos estos parametros influencian en el codigo, si se cambian, cambiar en el codigo también


### DIreccion IP

Se ha de cambiar la direccion IP en los siguientes ficheros
- IdentityProvider\config.js
- IdentityProvider\App\views\index.ejs
- IdentityProvider\App\views\login.ejs
- server\public\scripts\script.js

- Holder\config.js
- Holder\App\controllers\HolderMainController.js
- Issuer\config.js

> [!NOTE]
> El fichero auto_IP.py automatiza dicha tarea <br>
> Lo unico que como se despliega en docker da igual y es recomendable utilizar los scripts dedicados a cambiarlos desde dentro del contenedor
