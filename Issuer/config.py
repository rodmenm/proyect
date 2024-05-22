import sys, os

def mensaje():
    print("Este script esta diseñado para modificar el fichero config.js.")
    print("Para ejecutar este script escriba 'python3 script.py *NEW_IP* *OLD_IP*'.")
    print("NEW_IP representa la IP donde se va a ejecutanco el servidor.")
    print("OLD_IP representa la IP que anteriormente alojaba el servicio (si anteriormente nunca ha modificado script.js deje este argumento en blanco).")

ruta = sys.argv[0]
ruta = ruta.replace('.py','.js')
ruta2 = ruta.replace('config','Issuer_gen')

if len(sys.argv) >= 4:
    mensaje()
    sys.exit()
if len(sys.argv) >= 2:
    if len(sys.argv) == 3:
        old_ip = sys.argv[2]
    elif len(sys.argv) == 2: 
        old_ip = "localhost"
    new_ip = sys.argv[1]
    if (new_ip == 'help'):
        mensaje()
        sys.exit()
    my_file = open(ruta,'r')
    my_data = my_file.read()
    my_data = my_data.replace(old_ip,new_ip)
    my_file.close()
    my_file = open(ruta,'w')
    my_file.write(my_data)
    my_file.close()

    my_file = open(ruta2,'r')
    my_data = my_file.read()
    my_data = my_data.replace(old_ip,new_ip)
    my_file.close()
    my_file = open(ruta2,'w')
    my_file.write(my_data)
    my_file.close()
    print("localhost cambiado por " + new_ip + "en el fichero Issuer/config y en Issuer/Issuer_gen")
else:
    mensaje()