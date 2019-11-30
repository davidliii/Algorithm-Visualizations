class Node {
    constructor(id, label) {
        this.id = id;
        this.label = label;
        this.level = null; //to be set

        //shortest path info
        this.last_id = null; // last visited id on trip
    }
}
