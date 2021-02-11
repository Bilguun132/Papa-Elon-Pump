# Papa Elon Bot

## Setting it up
Before you setup, ensure you have `.env` file with the following structure:
```sh
BOT_TOKEN=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_PORT=
MONGO_DB=
MONGO_HOSTNAME=mongodb(this is from docker-compose service file)
```
This will be used to initialise both the mongodb instance and the bot.

----
Once you have setup the `.env` files, you can start the development environment as so:
- Via Docker-Compose

This will be the easiest way to start as all of the volumes are created accordingly. 
MongoDB data is mapped to `/data` directory so that when containers are re-created, data is not lost.

```
npm run docker-dev
```
- Local dev

Requires you to have your own mongodb instance running somewhere. 

```
ts-node src/index.ts 
```
