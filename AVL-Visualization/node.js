class Node {
    constructor(id, label) {
        this.id = id;
        this.label = label;

        this.balance = 0;
        this.root == null;
        this.left == null;
        this.right == null;
    }

    set_color() {
        if (this.balance > 1) {
            this.color = "rgb(128, 255, 162)"; //green
        }

        if (this.balance == 0) {
            this.color = "rgb(122, 133, 250)"; //blue
        }

        if (this.balance < 1) {
            this.color = "245, 118, 236";
        }
    }
}
