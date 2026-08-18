# Laboratorio de Kanata con Terraform

Este laboratorio crea una máquina gráfica local en VirtualBox mediante
Terraform. Parte de Ubuntu Cloud 24.04 LTS y `cloud-init` instala el escritorio
mínimo de Lubuntu, SSH y las utilidades de VirtualBox.

## Requisitos

- Terraform 1.8 o posterior.
- Oracle VirtualBox con `VBoxManage` disponible en `PATH`.
- Virtualización habilitada en el firmware del equipo.
- Al menos 4 GB de RAM libres para la máquina virtual.

## Imagen

Descarga la OVA oficial de Ubuntu Cloud en la carpeta `images`:

```powershell
Invoke-WebRequest `
  -Uri "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.ova" `
  -OutFile ".\images\noble-server-cloudimg-amd64.ova"
```

La imagen y el estado de Terraform se ignoran en Git. La configuración usa una
ruta relativa y no contiene rutas personales del equipo.

## Crear la máquina

Desde esta carpeta ejecuta:

```powershell
terraform init
terraform fmt -check
terraform validate
terraform plan -out kanata.tfplan
terraform apply kanata.tfplan
```

VirtualBox abrirá la ventana de la máquina. El primer arranque empieza como
Ubuntu Server mientras `cloud-init` descarga Lubuntu. Al terminar reinicia y
entra automáticamente con el usuario local `kanata`; este usuario no tiene
contraseña y solo está pensado para el laboratorio.

El usuario no acepta autenticación SSH por contraseña. Si necesitas SSH, agrega
tu clave pública en `cloud-init.yaml` antes de crear la máquina y conéctate con
`ssh -p 2222 kanata@127.0.0.1`. También puedes consultar desde la consola de la
VM:

```bash
cloud-init status --wait
sudo tail -f /var/log/cloud-init-output.log
```

## Probar la configuración local

Terraform comparte la raíz de `keyboard` con el nombre `keyboard`. Después de
que se instalen las Guest Additions y se reinicie la VM, normalmente estará en
`/media/sf_keyboard`. Si no se monta automáticamente, revisa el recurso
compartido desde la configuración de VirtualBox.

Dentro de Lubuntu:

```bash
cd /media/sf_keyboard/linux
chmod +x install-kanata.sh setup-permissions.sh uninstall-kanata.sh
./install-kanata.sh
./setup-permissions.sh
```

Cierra la sesión de Lubuntu y vuelve a entrar para que los grupos nuevos tengan
efecto. Después activa el servicio según `linux/README.md`.

La VM recibe normalmente un teclado virtual. Para comprobar acceso directo al
dispositivo y comportamiento de bajo nivel, conecta un teclado USB físico a la
VM desde VirtualBox.

## Destruir la máquina

```powershell
terraform destroy
```

Esto elimina la máquina administrada por Terraform, pero conserva la OVA
descargada en `images`.
