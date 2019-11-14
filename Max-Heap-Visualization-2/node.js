class Node {
    constructor(id, label) {
        this.id = id;
        this.label = label;
        let r = 0;
        let g = parseInt(this.label, 10) / 999 * 255;
        let b = parseInt(this.label, 10) / 999 * 255 - 10;

        this.color= {
            background:'rgba(0,' + g.toString() + ','+ b.toString() + ',1)'
        };

        let font_color = '#ffffff'; //white

        if (g > 150) {
            font_color = '#000000';
        }

        this.font= {
            color: font_color
        };
    }
}
