Este es un servidor express que iniciara una futura pagina web para un login <br>
<br>
NOTAS<br>
PASOS A SEGUIR<br>
<br>
SOLO FUNCIONA EN LINUX<br>
-Al ejecutar el docker-compose por primera vez, SOLO poner la imagen de keycloak.<br>
-DESABILITAR SSL PETICIONES EXTERNAS<br>
-Una vez cargado entrar a localhost:8080<br>
-Crear un realm nuevo y dentro de ese realm realizar las siguientes modificaciones.<br>
-Crear un nuevo cliente activando “Client authentication” y establecer estos parametros <br>
    -Valid redirect URIs -> http://localhost:3000/* (así habilitamos poder acceder a las demas rutas)<br>
    -Web origins -> http://localhost:3000 (asi solo se puede acceder a la pagina de logueo desde nuestra web)<br>
-Una vez realizado esto seleccionamos nuestro cliente y le damos al boton que pone action. Luego le damos a donde pone “donwload adapter config” y copiamos todo el texto y lo pegamos en nuestra fichero keycloak.json de forma que solo aparezca lo que hemos pegado.<br>
-Crear un usuario y ponerle credenciales. En nuestro caso “user” y “xxxx”<br>
-Realizar “docker-compose down” y incluir en docker-compose.yml la imagen del servidor node.<br>
-Realizar "docker build -t server ."<br>
-Realizar “docker-compose up” y ya solo se podra acceder a la página logged mediante el usuario creado<br>
<br>
DESHABILITAR SSL PETICIONES EXTERNAS<br>
Ejecutar "docker exec -it {ID contenedor} bash"<br>
Ejecutar "cd opt/keycloak/bin"<br>
Ejecutar "./kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin"<br>
Ejecutar "./kcadm.sh update realms/master -s sslRequired=NONE"<br>
Salir del contenedor y reiniciarlo<br>
