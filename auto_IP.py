import subprocess, sys, os
# DEBERIA FUNCIONAR, NO ESTA TESTEADO
# COMPLETAR

def mensaje():
    print("Este script esta diseñado para modificar en todo el proyecto la ip local por la deseada")
    print("Para ejecutar este script escriba 'python3 auto_IP.py *NEW_IP*")

directorio = os.getcwd()
kk = directorio + "/server/public/scripts/script.py"
pp = directorio + "/IdentityProvider/App/views/index.py"
tt = directorio + "/IdentityProvider/config.py"
mm = directorio + "/Holder/config.py"
rr = directorio + "/Issuer/config.py"
qq = directorio + "Holder/App/controllers/HolderMainController.js"

if len(sys.argv) >= 3:
    mensaje()
    sys.exit()
elif len(sys.argv) == 2:
    new_ip = sys.argv[1]
    if (new_ip == 'help'):
        mensaje()
        sys.exit()
    rutas_y_parametros = [(kk, new_ip),(pp, new_ip),(tt, new_ip),(mm, new_ip),(rr, new_ip),(qq, new_ip)]
    for ruta, nueva_ip in rutas_y_parametros:
        subprocess.run(["python3", ruta, nueva_ip])
    print("Todos los archivos cambiados correctamente")
else:
    mensaje()