[![Build Status](https://travis-ci.com/mdemou/discord-geoffrey-bot.svg?branch=master)](https://travis-ci.com/mdemou/discord-geoffrey-bot)

# All about Discord Bot Geoffrey
<img src="https://i0.pngocean.com/files/467/71/643/monocle-gentleman-top-hat-clip-art-gentleman.jpg" width=350 title="Monoculo" alt="Monoculo">

This is a quick guide to run a Discord bot that gathers information from:
* Chollometro - Latests deals published in [Chollometro](https://www.chollometro.com/rss)
* Cinesa - New movie listings [Cinesa](https://www.cinesa.es/Peliculas/Estrenos)
* Digital Ocean - Get balance [Digital Ocean](https://api.digitalocean.com/v2/customers/my/balance)
* El Tiempo - Get weather forecast from [El Tiempo](https://www.el-tiempo.net/) and its [API](https://www.el-tiempo.net/api)
* Elitetorrent - Latests spanish torrents available in [Elitetorrent](https://www.elitetorrent.li/calidad/1080p-10/)

Sends all that information to different Discord channles

As many connectors to different sources could be added easily

## Before you begin

Some requirements:

1. You'll need a [Discord](https://discordapp.com/) account
2. Familiar with [Node](https://nodejs.org/en/)
3. Familiar with [PostgreSQL](https://www.postgresql.org/) basics

## Discord requirements

Assuming you have your own Discord Server:

1. Create the following Discord channels: *chollometro, cinesa, elitetorrent and digitalocean* (these could be renamed in config file)
2. Create a [Discord application](https://discordapp.com/developers/applications)
3. Create a new Bot
4. Get the token and add it to *.env* file (explained below)
5. Add your bot to your Discord
   1. Go to https://discordapi.com/permissions.html#0
   2. Select `Embed Links` and `Send Messages`
   3. Fill your ClientID
   4. Go to the generated Link at the bottom of the website

## Set up and run locally

> Assuming you already have a PostgreSQL instance running

### Configuration
Add .env file to root directory with the following environment variables. Also take a look at `src/config.js` file and update with your values whatever you want

> Remember to replace values with your own ones. Timeouts are in ms

```sh
DISCORD_APIKEY={{ ADDHEREYOURAPIKEY }}
LOG_LEVEL=debug
CONNECTORS_CHOLLOMETRO_ENABLED=true
CONNECTORS_CHOLLOMETRO_TIMEOUT=300000
CONNECTORS_CINESA_ENABLED=true
CONNECTORS_CINESA_TIMEOUT=600000
CONNECTORS_DIGITALOCEAN_ENABLED=true
CONNECTORS_DIGITALOCEAN_TIMEOUT=2400000
CONNECTORS_DIGITALOCEAN_TOKEN={{ HERE YOUR DIGITAL OCEAN TOKEN }}
CONNECTORS_ELITETORRENT_ENABLED=true
CONNECTORS_ELTIEMPONET_TIMEOUT=3000
CONNECTORS_ELITETORRENT_TIMEOUT=1200000
CONNECTORS_ELTIEMPONET_ENABLED=true
CONNECTORS_ELTIEMPONET_CITYCODE=28 # Get this value from El tiempo net API https://www.el-tiempo.net/api
CONNECTORS_ELTIEMPONET_TIMEOUT=21600000
CONNECTORS_ELTIEMPONET_TOWNCODE=28004 # Get this value from El tiempo net API https://www.el-tiempo.net/api
PGHOST=localhost
PGPASSWORD=changeme
PGUSER=postgres
PGDATABASE=connectors
PGPORT=5434
```

### Running

```sh
# install dependencies
$ npm install

# start
$ node index
```

## Docker

### Requirements
1. [Docker](https://docs.docker.com/install/) installed
2. [Docker-compose](https://docs.docker.com/compose/install/) installed

### Build your own docker

```sh
$ docker build -t discord_bot:1 .
```

### Try it with docker compose
PostgreSQL already creates database and tables. It creates a volume in *./docker-compose/volumes/* path for persistence

#### Usage
```sh
$ docker-compose -f docker-compose/docker-compose.yaml up
```

> Remember to replace **DISCORD_APIKEY** and variables inside the *docker-compose.yml* file

There is also a docker-compose-papertrail version in case you want to send logs to [Papertrail](https://papertrailapp.com).

```sh
$ docker-compose -f docker-compose/docker-compose-papertrail.yaml up
```

> Remember to replace **DISCORD_APIKEY** and **syslog-address** variables inside the *docker-compose-papertrail.yml* file

## Support and PR

Feel free to ask for support, or pull requests with improvements this repository. I will be very happy to hear from you, and make this as useful as possible
Thanks!

> It is great to share this with all of you, and could be useful :)

## License

Check [LICENSE](./LICENSE)