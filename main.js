import paper from "@scratch/paper";
import { optimizations } from "./optimizations.js";

const optimizationsList = [optimizations]

// paper.install(window)

const width = 1830 / 4;
const height = 2600 / 4;
const FACTOR_WIDTH = width + 100;
const FACTOR_HEIGHT = height + 100;

const randomHex = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

let optimization = optimizations

var canvas = document.getElementById("canvas");
const select = document.getElementById("select");

let value = 1
select.addEventListener("change", (event) => {
  if (event.target.value === value) return
  value = event.target.value
  optimization = optimizationsList[value]
})

// Create an empty project and a view for the canvas:
const paperCanva = paper.setup(canvas);
const view = paperCanva.project.view
const tool = new paper.Tool()
tool.onMouseDrag = function (event) {
  const panOffset = event.point.subtract(event.downPoint)
  view.center = view.center.subtract(panOffset)
}

canvas.addEventListener('wheel', (event) => {
  event.preventDefault()
  let newZoom = view.zoom
  const oldZoom = view.zoom
  if (event.deltaY > 0) {
    newZoom = view.zoom * 0.95
  } else {
    newZoom = view.zoom * 1.05
  }
  const beta = oldZoom / newZoom
  const mousePosition = new paper.Point(event.offsetX, event.offsetY)
  // viewToProject: gives the coordinates in the Project space from the Screen Coordinates
  const viewPosition = view.viewToProject(mousePosition)
  const mpos = viewPosition
  const ctr = view.center
  const pc = mpos.subtract(ctr)
  const offset = mpos.subtract(pc.multiply(beta)).subtract(ctr)
  view.zoom = newZoom
  view.center = view.center.add(offset)
  // view.draw()
})

console.log(optimizations);
optimizations.sort((a, b) => b.remnantEfficiency - a.remnantEfficiency)
optimizations.slice(0,20).forEach(({ bins, efficiency, score, remnantEfficiency }, index) => {
  const text = new paper.PointText({
    content: `N° ${index + 1}: ${efficiency}%`,
    point: [0, index * FACTOR_HEIGHT - 30],
    fontSize: 20,
  });
  const area = new paper.PointText({
    content: `Area: ${Object.values(score).join('-')}\n${remnantEfficiency}`,
    point: [-200, index * FACTOR_HEIGHT],
    fontSize: 20,
  })
  Object.values(bins).forEach((bin, i) => {
    const panelPosition = [i * FACTOR_WIDTH, index * FACTOR_HEIGHT]
    const path = new paper.Path.Rectangle(
      panelPosition,
      [width, height]
    );
    path.closed = true;
    path.strokeColor = "black";
    path.strokeWidth = 2;

    const text = new paper.PointText({
      content: `${bin.usedArea / area}`,
      point: [i * FACTOR_WIDTH, index * FACTOR_HEIGHT - 10],
      fontSize: 20,
    });


    bin.items.forEach((item, i) => {
      const rectangle = new paper.Path.Rectangle(
        [item.x / 4 + panelPosition[0], item.y / 4 + panelPosition[1]],
        [item.width / 4, item.height / 4]
      );
      rectangle.center = [width / 4 / 2, height / 4 / 2];
      rectangle.strokeColor = "black";
      if (item.item.name) rectangle.fillColor = randomHex();
      const text = `${item.width}-${item.height}`;
      new paper.PointText({
        content: text,
        justification: "center",
        point: [item.x / 4 + panelPosition[0] + item.width / 4 / 2, item.y / 4 + panelPosition[1] + item.height / 4 / 2],
      });
    });
  });
});

paper.view.draw();
