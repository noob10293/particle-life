
function draw() {
  let graph = document.getElementById("graph");

  let axes = {}
  let ctx = graph.getContext("2d");
  graph.width = settings.maxDistance+6;
  graph.height = settings.maxDistance+6;
  axes.x = 3;  //x value of the y axis
  axes.y = 0.5 * graph.height; // y value of the x axis
  //dist is x, force is y
  axes.scale = 40;
  showAxes(ctx, axes);
  funGraph(ctx, axes, (dist) => { return accelerator(settings.factor, dist) }, "red");
}

function showAxes(ctx, axes) {
  var x = axes.x, y = axes.y
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(graph.width, y);  // X axis
  ctx.moveTo(x, 0);
  ctx.lineTo(x, graph.height);  // Y axis
  ctx.stroke();
}

function funGraph(ctx, axes, func, color) {
  var x = axes.x, y = axes.y
  var xMax = graph.width - x;
  var xMin = 0;
  ctx.lineWidth = 0.2;
  ctx.strokeStyle = color;
  ctx.beginPath();

  for (let i = xMin; i < xMax; i += 0.1) {
    ctx.moveTo(i, axes.y - func(i))
    ctx.lineTo(i + 0.1, axes.y - func(i + 0.1))
  }
  ctx.stroke();
}
document.addEventListener("keydown", (event) => {
  draw()
  if (event.key == 'g') {
    if (graph.style.display === "none") {
      graph.style.display = "block";
    } else {
      graph.style.display = "none";
    }
  }
})
draw()