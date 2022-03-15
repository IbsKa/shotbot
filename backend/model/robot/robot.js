import { Shots } from "../order/order.js";
//import { RosNode } from "@foxglove/ros1";
//import { getEnvVar, getHostname, getNetworkInterfaces, getPid, TcpSocketNode } from "@foxglove/ros1/nodejs";
//import { HttpServerNodejs } from "@foxglove/xmlrpc/nodejs";
import { execSync } from 'child_process';
/*import pkg from 'roslib';
const ROSLIB = pkg;
*/
export const ROBOTSTATE = {
    Idle: 0,        // robot bored, standing by
    Moving: 2,      // moving to a location
    Pouring: 4,     // at a location, serving shots
    Completed: 8,   // job done (could've been moving or pouring [one shot])
    Fault: 99       // robot fell down stairs
}

export class Robot {
    // the current state the robot is in (private via getter)
    #state = ROBOTSTATE.Idle;
    // when was the last time we talked to the ShotBot (for timeouts)
    #lastAction = Date.now();

    #rosNode = undefined;
    #subscription = undefined;

    // holds the shots currently being poured (compare to order to know what to pour/do next)
    #currentRound = new Shots();

    constructor() {
    }

    get Status() { return this.#state; }
    get LastAction() { return this.#lastAction; }
    get CurrentRound() { return this.#currentRound; }

    async Init() {
        /*
        ROSLIB.Ros({
            url : 'ws://192.168.55.238:9090'
        });
        */
        /*
        try {
            console.log('Robot: constructing rosNode with master URI '+getEnvVar("ROS_MASTER_URI"))
            this.#rosNode = new RosNode({
                name: 'shotbot_backend',
                rosMasterUri: getEnvVar("ROS_MASTER_URI") ?? "http://localhost:11311/",
                hostname: RosNode.GetRosHostname(getEnvVar, getHostname, getNetworkInterfaces),
                pid: getPid(),
                httpServer: new HttpServerNodejs(),
                tcpSocketCreate: TcpSocketNode.Create,
                log: console,
            });
            console.log('Robot: starting roseNode')
            await this.#rosNode.start()

            this.#subscription = this.#rosNode.subscribe({
                topic: "/shotbot_gotoTarget",
                dataType: "std_msgs/String",
              });
          
            this.#subscription.on("message", (msg, data, pub) => {
                console.log(
                  `[MSG] ${JSON.stringify(msg)} (${
                    data.byteLength
                  } bytes from ${pub.connection.getTransportInfo()})`,
                );
              });
        } catch (err) {
            console.error("Robot: init error: " + err)
            this.#rosNode?.shutdown()
        }
        */
    }

    IsIdle() {
        return this.Status === ROBOTSTATE.Idle || this.Status === ROBOTSTATE.Completed
    }

    GoTo(target) {
        console.log(`Robot: moving to position "${target}"`)
        if (!this.IsIdle()) {
            console.log('Robot: won\'t move, as robot is not idle');
            return;
        }
        this.#state = ROBOTSTATE.Moving;
        this.#currentRound = new Shots(0, 0, 0); // reset shots poured
        this.#updateLastAction();

        // TODO: remove testing 
        setTimeout(() => {
            console.log('reached position')
            this.#state = ROBOTSTATE.Completed;
        }, 15_000);
    }

    Pour(whatDrink) {
        console.log(`Robot: pouring drink "${whatDrink}"`)
        if (!this.IsIdle()) {
            console.log('Robot: won\'t pour, as robot is not in position');
            return;
        }

        this.#state = ROBOTSTATE.Pouring;
        this.#currentRound[whatDrink]++;
        console.log('robot will pour ' + whatDrink)
        // gcode-cli /home/user/gcode-snippets/ausgabe_coldbrew.gcode /dev/ttyACM1,b9600
        execSync(`gcode-cli ${process.env.PATH_TO_GCODE}ausgabe_${whatDrink.toLowerCase()}.gcode ${process.env.GCODE_DEVICE}`)
        this.#updateLastAction();

        
        /*
        // TODO: remove testing 
        setTimeout(() => {
            console.log('drink poured')
            this.#state = ROBOTSTATE.Completed;
        }, 1_000);
        */
    }

    GoHome() {
        // abort operations and go home
        console.log('Robot: returning to base')
        this.#currentRound = new Shots(0, 0, 0);
        // TODO: talk to robot
        this.#updateLastAction();
    }

    #updateLastAction() {
        this.#lastAction = Date.now();
    }
}
