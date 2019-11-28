class Node {
    constructor(id, label) {
        this.id = id;
        this.label = label;
        this.balance = 0;
        this.set_color();
        this.root == null;
        this.left == null;
        this.right == null;
    }

    set_color() {
        if (this.balance >= 1) {
            this.color = {background: "rgb(186, 213, 255)"}; //blue
        }

        if (this.balance == 0) {
            this.color = {background: "rgb(255, 255, 255)"}; //white
        }

        if (this.balance <= -1) {
            this.color = {background: "rgb(186, 255, 209)"}; //green
        }
    }

    calculate_balance() {
        let left_h = this.calculate_height(this.left);
        let right_h = this.calculate_height(this.right);

        return left_h - right_h;
    }

    calculate_height(node) {
        if (node == null) {
            return 0;
        }

        else {
            let left_h = this.calculate_height(node.left);
            let right_h = this.calculate_height(node.right);

            let max_h = max(left_h, right_h);
            return (max_h + 1);
        }
    }
}
