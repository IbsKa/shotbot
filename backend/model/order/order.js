export const ORDERSTATE = {
    Queued: 0,      // order needs to be processed
    InTransit: 2,   // robot is on the move to location
    Pouring: 4,     // robot is serving shots
    Completed: 8    // this order is done
}

export class Shots {
    Normal;
    Spicy;
    ColdBrew;
    constructor(normal, spicy, coldbrew) {
        this.Normal = normal;
        this.Spicy = spicy;
        this.ColdBrew = coldbrew;
    }

    
    // compares two Shot objects to determine which shot is next
    static GetNextShot(shotsWanted, shotsServed) {
        for (const prop in shotsWanted) {
            if (shotsWanted[prop] > shotsServed[prop]) return prop;
        }
        return "";
    }
}
export class Order {
    Location;
    OrderTime;
    Status;
    Shots;
    constructor(location, normal, spicy, coldBrew) {
        this.Shots = new Shots(normal, spicy, coldBrew);
        this.Location = location;
        this.OrderTime = Date.now();
        this.Status = ORDERSTATE.Queued;
    }

    static compare(a, b) {
        if (a.OrderTime < b.OrderTime)
            return -1;
        if (a.OrderTime > b.OrderTime)
            return 1;
        return 0;
    }
}
