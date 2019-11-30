class Vertex {
    constructor(id, dist, loc_in_queue) {
        this.id = id;
        this.dist = dist;
        this.loc_in_queue = loc_in_queue;
        this.last_id = -1;
    }
}

class Queue {
    constructor(vertices, vList) {
        this.vList = vList;       //vertices ordered by id
        this.vertices = vertices; //vertices ordered by distance
        this.make_queue();
    }

    make_queue() {
        let last_non_leaf = Math.floor((this.vList.length / 2)) - 1;

        for (let i = last_non_leaf; i >= 0; i--) {
            this.heapify_down(i);
        }
    }

    peak() {
        return queue.vertices[0];
    }

    extract_min() {
        this.vList[this.vertices[0].id].loc_in_queue = -1; //flag as removed from queue
        this.vertices[0] = this.vertices[this.vertices.length - 1]; //replace first with last element
        this.vList[this.vertices[0].id].loc_in_queue = 0; //update vList with correct location
        this.vertices.pop(); //pop last elemenet (we moved it to front)

        this.heapify_down(0); //maintain heap structure
    }

    heapify_up(index) {
        let parent = Math.floor((index - 1) / 2);

        if (parent > 0) {
            if (this.vertices[parent].dist > this.vertices[index].dist) {
                let index_loc = this.vList[this.vertices[index].id].loc_in_queue;
                let parent_loc = this.vList[this.vertices[parent].id].loc_in_queue;
                this.vList[this.vertices[index].id].loc_in_queue = parent_loc; //update locations
                this.vList[this.vertices[parent].id].loc_in_queue = index_loc;

                let temp = this.vertices[parent];
                this.vertices[parent] = this.vertices[index];   //update queue elements
                this.vertices[index] = temp;

                this.heapify_up(parent);
            }
        }
    }

    heapify_down(index) {
        let min = index;
        let left = index * 2 + 1;
        let right = index * 2 + 2;

        if (left < this.vertices.length && this.vertices[left].dist < this.vertices[min].dist) {
            min = left;
        }

        if (right < this.vertices.length && this.vertices[right].dist < this.vertices[min].dist) {
            min = right;
        }

        if (min != index) {
            let index_loc = this.vList[this.vertices[index].id].loc_in_queue;
            let min_loc = this.vList[this.vertices[min].id].loc_in_queue;
            this.vList[this.vertices[index].id].loc_in_queue = min_loc; //update locations
            this.vList[this.vertices[min].id].loc_in_queue = index_loc;

            let temp = this.vertices[index];
            this.vertices[index] = this.vertices[min]; //swap queue elements
            this.vertices[min] = temp;

            this.heapify_down(min);
        }
    }
}
