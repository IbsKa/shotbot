import { Shots } from "../order/order.js";

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

    // holds the shots currently being poured (compare to order to know what to pour/do next)
    #currentRound = new Shots();
    
    constructor() {
    }

    get Status() { return this.#state; }
    get LastAction() { return this.#lastAction; }
    get CurrentRound() { return this.#currentRound; }

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
        this.#currentRound = new Shots(0,0,0); // reset shots poured
        this.#updateLastAction();

        // TODO: remove testing 
        setTimeout(() => {
            console.log('reached position')
            this.#state = ROBOTSTATE.Completed;
        }, 5_000);
    }

    Pour(whatDrink) {
        console.log(`Robot: pouring drink "${whatDrink}"`)
        if (!this.IsIdle()) {
            console.log('Robot: won\'t pour, as robot is not in position');
            return;
        }

        this.#state = ROBOTSTATE.Pouring;
        this.#currentRound[whatDrink]++;
        // TODO: talk to robot
        console.log('robot will pour '+whatDrink)
        this.#updateLastAction();

        // TODO: remove testing 
        setTimeout(() => {
            console.log('drink poured')
            this.#state = ROBOTSTATE.Completed;
        }, 500_000);
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
