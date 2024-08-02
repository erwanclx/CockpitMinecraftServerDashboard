⚡ Development in progress ⚡
👉 I use Docker for API, but you can run it locally

# Components
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

# Introduction
This is an extension of embarqued Linux Cockpit to manage Minecraft Server with RCON, logs, player list, etc.
It is compose by two parts:
- A Cockpit plugin to manage the server
- An API to interact with RCON

# Installation 

## API

First, you need to install the API on a server, it can be same server as the Minecraft Server or another one.
```bash
git clone git@github.com:erwanclx/MinecraftServerRCONAPI.git
cd MinecraftServerRCONAPI
docker-compose up -d
```

## Cockpit Plugin

Then, you need to install the Cockpit plugin on the server where the Cockpit is installed.
```bash
git clone git@github.com:erwanclx/CockpitMinecraftServerDashboard.git
cd CockpitMinecraftServerDashboard
make
mkdir -p ~/.local/share/cockpit
ln -s `pwd`/dist ~/.local/share/cockpit/minecraft-server-dashboard
```

# Usage

Go one the Cockpit interface and you will see a new menu "Minecraft Console" on the left.

Or directly go to
```https://your-server:9090/minecraft-server-dashboard```