Este es un servidor express que iniciara una futura pagina web para un login 

NOTAS
Cuando se inicie por primera vez, ejecutar el docker-compose solo con el servicio de keycloak (database), crear un realm y luego un cliente dentro de ese realm. Luego BAJARSE EL KEYCLOAK.JSON del cliente. Una vez realizado esto se puede proceder a crear la imagen del servidor y luego incluirla en el docker-compose

