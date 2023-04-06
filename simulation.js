class Simulation {
    constructor(dots, color, ctx) {
        this.ctx = ctx;
        this.grid = [];
        this.grid.width =
            this.dots = [];
        for (let i = 0; i < dots; i++) {
            if (color == "random") {
                let tcolor = colors[randomNumber(0, 6, true)];
                this.addDot(100 + randomNumber(0, dots), 100 + randomNumber(0, dots), tcolor);
            } else {
                this.addDot(100 + randomNumber(0, dots), 100 + randomNumber(0, dots), color);
            }
        }
    }
    addDot(x, y, color) {
        this.dots.push(new Dot(x, y, color, this.ctx));
    }
    update(steps) {
        for (let i = 0; i < steps; i++) {
            for (let dot1 of this.dots) {
                for (let dot2 of this.dots) {
                    if (dot1 == dot2) {
                        continue;
                    }
                    let distance = getDistance(dot1, dot2);
                    if (distance < settings.maxDistance) {
                        let force = accelerator(matrix[dot1.color][dot2.color], distance);
                        dot1.moveFrom(dot2, distance, force, steps);
                    }
                }
            }
            for (let dot of this.dots) {
                dot.update();
            }
        }
        for (let dot of this.dots) {
            dot.draw();
        }
    }
}