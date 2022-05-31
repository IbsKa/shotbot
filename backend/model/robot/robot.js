import { Shots } from "../order/order.js";
//import { RosNode } from "@foxglove/ros1";
//import { getEnvVar, getHostname, getNetworkInterfaces, getPid, TcpSocketNode } from "@foxglove/ros1/nodejs";
//import { HttpServerNodejs } from "@foxglove/xmlrpc/nodejs";
import { execSync } from 'child_process';

import pkg from './roslib.cjs';
const { newRoslib, newRoslibService, newRoslibServiceRequest } = pkg;

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

    #ros = undefined;
    #service = undefined;

    // holds the shots currently being poured (compare to order to know what to pour/do next)
    #currentRound = new Shots();

    constructor() {
    }

    get Status() { return this.#state; }
    get LastAction() { return this.#lastAction; }
    get CurrentRound() { return this.#currentRound; }

    async Init() {
        try {
            console.log("Robot: setting up with "+process.env.ROS_BRIDGE_URI)
            this.#ros = newRoslib({
                url: process.env.ROS_BRIDGE_URI
            });
            this.#service = newRoslibService({
                name: '/shotbot',
                ros: this.#ros,
                serviceType: 'shotbot/PositionMessage'
            });
            console.log("Robot: set up and ready")
        } catch (err) {
            console.error("Robot: init error: " + err)
        }
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

        let request = newRoslibServiceRequest({
            target: target
        });
        this.#service.callService(request, function (result) {
            console.log('Robot: goto target completed, reached target: ' + result.destinationReached)
            console.log(this)
            if (result.destinationReached) {
                this.#state = ROBOTSTATE.Completed
                return
            }
            // TODO: error handling, what to do?
            console.log("Robot: error, did not reach target")
        }.bind(this));
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
        execSync(`${process.env.PATH_TO_GCODEBIN} ${process.env.PATH_TO_GCODEFILES}ausgabe_${whatDrink.toLowerCase()}.gcode ${process.env.GCODE_DEVICE}`)
        this.#updateLastAction();


        
        // TODO: remove testing 
        setTimeout(() => {
            console.log('drink poured')
            this.#state = ROBOTSTATE.Completed;
        }, 3_000);
        
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
