⚡ Development in progress ⚡
👉 I use Docker for API, but you can run it locally

# Cockpit Minecraft Server Dashboard

<a href="https://ibb.co/XCVPPB8"><img src="https://i.ibb.co/nLRyy2C/Dashboard-MC.png" alt="Dashboard-MC" border="0"></a>

## Components
- [Pre-requisites](#pre-requisites)
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Pre-requisites

Obiously, you need a Minecraft Server running, and, Cockpit installed on the server where the Minecraft Server is running.
You also need to have RCON enabled on the Minecraft Server, and Docker installed on the server where the API will be running.

## Introduction
This is an extension of embarqued Linux Cockpit to manage Minecraft Server with RCON, logs, player list, etc.
It is compose by two parts:
- A Cockpit plugin to manage the server
- An API to interact with RCON

## Installation 

### API

First, you need to install the API on a server, it can be same server as the Minecraft Server or another one.
```bash
git clone git@github.com:erwanclx/MinecraftServerRCONAPI.git
cd MinecraftServerRCONAPI
docker-compose up -d
```

### Cockpit Plugin

Then, you need to install the Cockpit plugin on the server where the Cockpit is installed.
```bash
git clone git@github.com:erwanclx/CockpitMinecraftServerDashboard.git
cd CockpitMinecraftServerDashboard
make
mkdir -p ~/.local/share/cockpit
ln -s `pwd`/dist ~/.local/share/cockpit/minecraft-server-dashboard
```

## Usage

Go one the Cockpit interface and you will see a new menu "Minecraft Console" on the left.

Or directly go to
```https://your-server:9090/minecraft-server-dashboard```
