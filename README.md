
# Servidor de Autenticacion
<br>

## IMPORTANTE
El desarrollo de este proyecto se ha trasladado a https://github.com/ging/Autenticacion-SSI <br>
No se continuará desarrollando en este repositorio, para acceder a las novedades acceder al enlace anterior

## PASOS A SEGUIR

- [MIRAR AVISOS](#avisos)
- [GESTIONAR DIRECCION IP](#gestionar-direccion-ip)
- [GESTIONAR LEDGER](#gestionar-ledger)
- Levantar Docker-compose
- [GESTIONAR SCHEMA & CRED](#gestionar-schema--cred)
- [DESABILITAR SSL PETICIONES EXTERNAS](#deshabilitar-ssl-peticiones-externas)
- [GESTIONAR KEYCLOAK](#gestionar-keycloak)
- [VINCULAR IDP CON KEYCLOAK](#vincular-idp-con-keycloak)

<br>

### GESTIONAR DIRECCION IP

En el proyecto se toma por defecto la IP localhost, en caso de desplegarlo en una IP, se ha de cambiar localhost por la direccion IP en los siguientes ficheros:
- IdentityProvider\config.js (deprecated)
- IdentityProvider\App\views\index.ejs (deprecated)
- IdentityProvider\App\views\login.ejs (deprecated)
- IdentityProvider\App\controllers\maincontroller.js (deprecated)
- IdentityProvider\Issuer\Issuer_gen.js (deprecated)
- server\public\scripts\script.js
- Holder\config.js
- Holder\App\controllers\HolderMainController.js
- Holder\App\views\index.ejs
- Holder\App\views\login.ejs
- Holder\App\public\scripts.scripts.js
- Issuer\config.js
- Issuer\Issuer_gen.js
- Verfier\config.js
- Verfier\Verfier_gen.js

> [!NOTE]
> El fichero auto_IP.py automatiza dicha tarea (no cambia los de IDP/*)  **Solo funciona en linux**<br>
> Lo unico que como se despliega en docker, es recomendable ejecutarlo antes de construir las imagenes <br>
> Estaría bien cambiarlo y utilizar variables de entorno <br>
> **HAY QUE TESTEAR LAS IPS CON NOMBRES DE CONTENEDORES EN IP PUBLICA** <br>

<br>

### GESTIONAR LEDGER

Aqui se establece una red de forma local, se puede utilizar otra aunque es recomendable emplear esta, ya que por disponibilidad las publicas a veces no van. <br>
Para que el ledger se configure correctamente hay que ejecutar:
```bash
git clone https://github.com/bcgov/von-network
cd von-network
./manage build
./manage start --logs
```
> [!NOTE]
> En caso que se quiera desplegar desde windows (habra partes posteriores que no funcionen), ejecutarlo con git bash<br>

Una vez realizados los comandos, se obtendran 5 contenedores docker, 4 nodos de una red y un servidor web donde monitorizarlos. <br>
Antes de levantar el sistema propio, registrar estos 2 dids en el ledger desde el servidor web a partir de estas semillas:
- issuersemilladebemantenersecreto
- holdersemilladebemantenersecreto 
- verifisemilladebemantenersecreto <br>

Una vez realizado, establecer en los controladores (linea 8 o asi) del issuer y del holder los resultados obtenidos <br>

<br>

### GESTIONAR SCHEMA & CRED
> [!NOTE]
> Se recuerda que se deberia haber desplegado docker-compose ya<br>

- Acceder a http://IP:5000/cre_schem <br>
- Una vez realizado establecer en el issuercontroller el schemaId obtenido <br>
- Tumbar la imagen del issuer y volverla a cargar con el schemaId correcto <br>
- Hacer lo mismo con credentialDefId <br>
- Tumbar la imagen del issuer y volverla a cargar con la credentialDefId correcta <br>

<br>

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

<br>

### GESTIONAR KEYCLOAK

- Entrar a http://IP:8080 con "admin" y "admin"
- Crear un realm nuevo y dentro de ese realm realizar las siguientes modificaciones.
- En Realm Settings poner "Require SSL" como none
- Crear un nuevo cliente activando “Client authentication” y establecer estos parametros 
    - Valid redirect URIs -> "http://IP:3000/*" (así habilitamos poder acceder a las demas rutas)<br>
    - Web origins -> "http://IP:3000" (asi solo se puede acceder a la pagina de logueo desde nuestra web)<br> 
- Una vez realizado esto seleccionamos nuestro cliente y copiamos el json de definicion en el keycloak.json del servidor. 
- Crear un usuario y ponerle credenciales. En nuestro caso “user” y “xxxx” (No influye esto en el proveedor de identidad) 
- Tumbar la imagen del server y levantarlo con el keycloak.json ya puesto bien

<br>

### VINCULAR IDP CON KEYCLOAK

El servicio IDP no formara parte del resultado final, su unico proposito es el testeo <br>
Ademas no esta diseñado para funcionar a la par que el resultado final ya que se solapan puertos <br>

Para vincular el IDP con keycloak hay que crear un IDP en Keycloak personalizado con OpenID Protocol con estos datos:

- Alias -> LoQueSea (ES UNICO)
- Display name -> DaIgual
- Authorization URL -> http://IP:4000/login
- Token URL -> http://IP:4000/login/token
- Issuer -> invented
- Client Authentication -> Client secret sent as post
- Client ID -> myclientid  
- CLient Secret -> myclientsecret (Con esto se firma el token)
- Store Tokens -> ON
- Stored tokens readable -> ON
- El resto OFF

> [!NOTE]
> Todos estos parametros influencian en el codigo, si se cambian, cambiar en el codigo también <br>
> Las wallets creadas se encuentran en la ruta del contenedor del HOLDER /root/.afj/data/wallet <br>
> Se ha de emplear el algoritmo HS256 para firmar los tokens 

<br>

### AVISOS

Esta diseñado para desplegarse un Linux aunque también funciona en Windows, de tener algun problema se recomienda pasarse a Linux <br>
HOLDER E ISSUER SOLO funciona con la version 18 de Node <br>
En la teoria Holder e Issuer pueden funcionar con una version de node superior **NUNCA UNA INFERIOR** <br>
La carpeta IdentityProvider actualmente no tiene ningun uso, sirve como registro <br>

<br>
