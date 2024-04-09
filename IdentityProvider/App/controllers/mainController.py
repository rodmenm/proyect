import sys, os

def mensaje():
    print("Este script esta diseñado para modificar el fichero mainController.js.")
    print("Para ejecutar este script escriba 'python3 script.py *NEW_IP* *OLD_IP*'.")
    print("NEW_IP representa la IP donde se va a ejecutanco el servidor.")
    print("OLD_IP representa la IP que anteriormente alojaba el servicio (si anteriormente nunca ha modificado script.js deje este argumento en blanco).")

directorio = os.getcwd()
ruta = sys.argv[0]
ruta = ruta.replace('.py','.js')

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
    my_file = open(directorio + '/' + ruta,'r')
    my_data = my_file.read()
    my_data = my_data.replace(old_ip,new_ip)
    my_file.close()
    my_file = open(directorio + '/' + ruta,'w')
    my_file.write(my_data)
    my_file.close()
else:
    mensaje()