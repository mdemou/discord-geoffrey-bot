
# All about Discord Bot Geoffrey

<img src="https://i0.pngocean.com/files/467/71/643/monocle-gentleman-top-hat-clip-art-gentleman.jpg" width=350 title="Monoculo" alt="Monoculo">

This is a quick guide to run a Discord bot that gathers information from *Chollometro, Cinesa and Elitetorrent*, and send new result to different Discord channels.

## Before you begin

Some requirements:

1. You'll need a [Discord](https://discordapp.com/) account
2. Familiar with [Node](https://nodejs.org/en/)
3. Familiar with [PostgreSQL](https://www.postgresql.org/) basics

## Discord requirements

Assuming you have your own Discord Server:

1. Create the following Discord channels: *chollometro, elitetorrent and cinesa* (these could be renamed in config file)
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
Add .env file to root directory with the following environment variables

> Remember to replace values with your own ones. Timeouts are in ms

```sh
DISCORD_APIKEY={{ ADDHEREYOURAPIKEY }}
LOG_LEVEL=debug
SCRAPERS_CHOLLOMETRO_TIMEOUT=300000
SCRAPERS_CHOLLOMETRO_ENABLED=true
SCRAPERS_CINESA_TIMEOUT=600000
SCRAPERS_CINESA_ENABLED=true
SCRAPERS_ELITETORRENT_TIMEOUT=1200000
SCRAPERS_ELITETORRENT_ENABLED=true
PGHOST=localhost
PGPASSWORD=changeme
PGUSER=postgres
PGDATABASE=scrap
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