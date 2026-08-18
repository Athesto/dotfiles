resource "virtualbox_vm" "kanata_lubuntu" {
  name       = "kanata-lubuntu"
  ova_source = abspath(var.ova_path)

  cpus   = 2
  memory = "4096mib"
  status = "running"

  os_type             = "Ubuntu_64"
  gui                 = true
  vram                = 128
  graphics_controller = "vmsvga"

  clipboard_mode = "bidirectional"
  drag_and_drop  = "bidirectional"
  usb_controller = "xhci"

  user_data = file("${path.module}/cloud-init.yaml")

  network_adapter {
    type                  = "nat"
    nat_dns_host_resolver = true

    port_forwarding {
      name       = "ssh"
      protocol   = "tcp"
      host_ip    = "127.0.0.1"
      host_port  = 2222
      guest_ip   = ""
      guest_port = 22
    }
  }

  shared_folder {
    name       = "keyboard"
    host_path  = abspath("${path.module}/../..")
    auto_mount = true
    writable   = true
  }
}

