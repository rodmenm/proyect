Este es un servidor express que iniciara una futura pagina web para un login 

NOTAS
PASOS A SEGUIR

SOLO FUNCIONA EN LINUX
-Al ejecutar el docker-compose por primera vez, SOLO poner la imagen de keycloak. Una vez cargado entrar a localhost:8080
-Crear un realm nuevo y dentro de ese realm realizar las siguientes modificaciones.
-Crear un nuevo cliente activando “Client authentication” y establecer estos parametros 
    -Valid redirect URIs -> http://localhost:3000/* (así habilitamos poder acceder a las demas rutas)
    -Web origins -> http://localhost:3000 (asi solo se puede acceder a la pagina de logueo desde nuestra web)
-Una vez realizado esto seleccionamos nuestro cliente y le damos al boton que pone action. Luego le damos a donde pone “donwload adapter config” y copiamos todo el texto y lo pegamos en nuestra fichero keycloak.json de forma que solo aparezca lo que hemos pegado.
-Crear un usuario y ponerle credenciales. En nuestro caso “user” y “xxxx”
-Realizar “docker-compose down” y incluir en docker-compose.yml la imagen del servidor node.
-Realizar "docker build -t server ."
-Realizar “docker-compose up” y ya solo se podra acceder a la página logged mediante el usuario creado


