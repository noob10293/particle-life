function randomNumber(a, b, index = false) {
    //random number from a to b
    if (index) {
        return Math.floor(Math.random() * (b - a) + a);
    } else {
        return (Math.random() * (b - a) + a) - (0.5 * (b - a));
    }
}
function getDistance(dot1, dot2) {
    let dx = Math.abs(dot1.x - dot2.x);
    let dy = Math.abs(dot1.y - dot2.y);
    if (settings.wrap) {
        if (dx > (canvas.width * 0.5)) {
            dx = canvas.width - dx;
        }
        if (dy > (canvas.height * 0.5)) {
            dy = canvas.height - dy;
        }
    }
    return Math.sqrt(dx * dx + dy * dy);
}
function accelerator(factor, distance) {
    let force;
    if (distance < settings.minDistance) {
        force = (settings.repel / settings.minDistance) * distance - settings.repel;
    } else if (distance > settings.maxDistance) {
        force = 0;
    } else {
        let mid = (settings.minDistance + settings.maxDistance) / 2;
        let slope = factor / (mid - settings.minDistance);
        force = -(slope * Math.abs(distance - mid)) + factor;
    }
    return force;
}
