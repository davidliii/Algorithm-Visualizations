class Node {
    constructor(data, x, y, size) {
        this.data = data;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    show() {
        fill(0, this.data, this.data - 10);
        stroke(0, 0, 0);
        strokeWeight(1);
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.size);
    }

    move(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
}
