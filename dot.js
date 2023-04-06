class Dot {
    constructor(x, y, color, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.draw();
    }

    moveFrom(dot, distance, force, step) {
        if (distance === 0) {
            this.y += (Math.random() - 0.5) * (1 / step);
            this.x += (Math.random() - 0.5) * (1 / step);
            return;
        }
        let dx = (dot.x - this.x);
        let dy = (dot.y - this.y);
        if (settings.wrap) {
            if (Math.abs(dx) > (canvas.width * 0.5)) {
                let neg = dx / Math.abs(dx);
                dx = canvas.width - Math.abs(dx);
                dx *= -1 * neg;
            }
            if (Math.abs(dy) > (canvas.height * 0.5)) {
                let neg = dy / Math.abs(dy);
                dy = canvas.height - Math.abs(dy);
                dy *= -1 * neg;
            }
        }
        let cos = dx / distance;
        let sin = dy / distance;
        this.vx += cos * force * (1 / step);
        this.vy += sin * force * (1 / step);
    }

    wrap() {
        if (this.x > canvas.width) {
            this.x = this.x - canvas.width;
        }
        if (this.x < 0) {
            this.x = canvas.width - this.x;
        }
        if (this.y > canvas.height) {
            this.y = this.y - canvas.height;
        }
        if (this.y < 0) {
            this.y = canvas.height - this.y;
        }

    }

    bounce() {
        if (this.x > canvas.width || this.x < 0) {
            this.x -= this.vx;
            this.vx *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.y -= this.vy;
            this.vy *= -1;
        }
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, settings.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    update() {
        this.vx *= settings.friction;
        this.vy *= settings.friction;
        this.move();
        if (settings.wrap) {
            this.wrap();
        } else {
            this.bounce();
        }
    }
}
