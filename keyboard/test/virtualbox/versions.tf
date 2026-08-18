terraform {
  required_version = ">= 1.8.0"

  required_providers {
    virtualbox = {
      source  = "eran132/virtualbox"
      version = "2.1.1"
    }
  }
}

provider "virtualbox" {}

