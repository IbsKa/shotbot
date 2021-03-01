# Shotbot Backend

### Setup

If you`re installing this on a new computer, don't forget to install docker engine and docker-compose.

Start backend and frontend containers with docker-compose. Add `--build` as argument if there had been changes in the code.
``` shell
docker-compose up -d
```

All order data only persists in memory, so if you restart the containers, this data will be lost.

### Configuration

All configuration is done in the .env file in the root directory.

- VUE_APP_SHOTBOT_IP: The IP or hostname where the backend is running
- VUE_APP_BACKEND_PORT: The port on which the backend listens for requests
- VUE_APP_MAX_SHOTS: The number of shots after all flasks have been refilled

