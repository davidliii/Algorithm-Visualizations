class Node {
    constructor(data, x, y, size) {
        this.data = data;
        this.x = x;
        this.y = y;
        this.size = size;
        this.r = 0;
        this.g = this.data;
        this.b = this.data - 10
    }

    show() {
        fill(this.r, this.g, this.b);
        stroke(this.r);
        strokeWeight(1);
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.size);
    }
}
