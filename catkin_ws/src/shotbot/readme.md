# ShotBot-Package

ROS-Package containing everything we need for communcation between backend and ROS.  
The communications works via `ros-bridge` a software that allows to use ROS-topics between ROS-core-system and external software (in our case nodeJS).

## Dependencies
The `shotbot`-package relies on the `navigation/move_base`-package.  


## Structure
The package consists of a receiver-node and a service. There is also a file called `locations.yaml` that holds all known spots the shotbot can move to.

### `locations.yaml`
Add all locations where the shotbot should deliver drinks in here with coordiantes. This file is being read once the shotbot-service starts. So modification needs to take place beforehand.

### `shotbot_receiver_node`
This node listens to the ROS-topic `shotbot_gotoTarget`. The backend will publish a location-name on this topic, the receiver node will take it and pass it to the service-node.

### `shotbot_service_node`
This node starts up the service and waits for incoming calls.
Once a new target is sent to the service, it will trigger movement and compare the bot's current position to the target. As soon as target is reached, the service returns true.


## Config
The path to the `locations.yaml` is hard-coded and might need adjustment.
See file `shotbot/scripts/shotbot_service_node.py` method `shotbotUploadLocations`



