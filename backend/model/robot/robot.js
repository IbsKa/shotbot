import { Shots } from "../order/order.js";
import { execSync } from 'child_process';

import pkg from './roslib.cjs';
const { newRoslib, newRoslibService, newRoslibServiceRequest } = pkg;

export const ROBOTSTATE = {
    Idle: 0,        // robot bored, standing by
    Moving: 2,      // moving to a location
    Pouring: 4,     // at a location, serving shots
    Completed: 8,   // job done (could've been moving or pouring [one shot])
    Homing: 50,     // robot returning home / orders are not being processed
    Fault: 99       // robot fell down stairs
}

export class Robot {
    #isConnected = false;
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
    get IsConnected() { return this.#isConnected; }

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
            console.log("Robot: set up, awaiting connection")
        } catch (err) {
            console.error("Robot: init error: " + err)
        }
/*
        this.#ros.on('connection', function() {
            this.#isConnected = true
        });
        
        this.#ros.on('error', function(error) {
            console.log('Robot: Error connecting to websocket server: ', error);
            this.#isConnected = false
            Init()
        });
        
        this.#ros.on('close', function() {
            console.log('Robot: Connection to websocket server closed.');
            this.#isConnected = false
            Init()
        });
        */
    }

    #connect() {

    }

    IsIdle() {
        return this.Status === ROBOTSTATE.Idle || this.Status === ROBOTSTATE.Completed
    }

    GoTo(target, skipReadinessCheck = false) {
        console.log(`Robot: moving to position "${target}"`)
        if (!this.IsIdle() && skipReadinessCheck) {
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
                if (this.#state != ROBOTSTATE.Homing)
                    this.#state = ROBOTSTATE.Completed
                return
            }
            console.log("Robot: error, did not reach target -> trying to return home")
            this.GoHome()
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

        this.#updateLastAction();
        execSync(`${process.env.PATH_TO_GCODEBIN} ${process.env.PATH_TO_GCODEFILES}ausgabe_${whatDrink.toLowerCase()}.gcode ${process.env.GCODE_DEVICE}`)
        
        console.log('drink poured')
        this.#state = ROBOTSTATE.Completed;
    }

    GoHome() {
        // abort operations and go home
        console.log('Robot: returning to base')
        this.#currentRound = new Shots(0, 0, 0);
        this.GoTo('Home', true)
        this.#state = ROBOTSTATE.Homing
        this.#updateLastAction();
    }

    Release() {
        // releases robot from homing and sets state to idle
        console.log('Robot: releasing "homing"-lock')
        if (this.#state === ROBOTSTATE.Homing)
            this.#state = ROBOTSTATE.Idle
        this.#updateLastAction();
    }

    RefillCups() {
        console.log('robot will lower tray')
        execSync(`${process.env.PATH_TO_GCODEBIN} ${process.env.PATH_TO_GCODEFILES}becher_nachfuellen.gcode ${process.env.GCODE_DEVICE}`)
        this.#updateLastAction();
    }
    RefillCupsFinalize() {
        console.log('robot will raise tray')
        execSync(`${process.env.PATH_TO_GCODEBIN} ${process.env.PATH_TO_GCODEFILES}becher_nachfuellen_2.gcode ${process.env.GCODE_DEVICE}`)
        this.#updateLastAction();
    }

    #updateLastAction() {
        this.#lastAction = Date.now();
    }
}
