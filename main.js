import paper from "@scratch/paper";
import { optimizations } from "./optimizations.js";

// paper.install(window)

const width = 1830 / 4;
const height = 2600 / 4;
const FACTOR_WIDTH = width + 100;
const FACTOR_HEIGHT = height + 100;
const area = 1830 * 2600;

const randomHex = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

var canvas = document.getElementById("canvas");
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

console.log(optimizations.length);
optimizations.forEach(({ bins, efficiency }, index) => {
  const text = new paper.PointText({
    content: `N° ${index + 1}: ${efficiency}%`,
    point: [0, index * FACTOR_HEIGHT - 10],
    fontSize: 20,
  });
  Object.values(bins).forEach((bin, i) => {
    const panelPosition = [i * FACTOR_WIDTH, index * FACTOR_HEIGHT]
    const path = new paper.Path.Rectangle(
      panelPosition,
      [width, height]
    );
    path.closed = true;
    path.strokeColor = "black";
    path.strokeWidth = 2;


    bin.items.forEach((item, i) => {
      if (!item.item.name) return
      const rectangle = new paper.Path.Rectangle(
        [item.x / 4 + panelPosition[0], item.y / 4 + panelPosition[1]],
        [item.width / 4, item.height / 4]
      );
      rectangle.center = [width / 4 / 2, height / 4 / 2];
      rectangle.strokeColor = "black";
      rectangle.fillColor = randomHex();
      // const text = `${item.x}-${item.y}\n${item.width}-${item.height}\n${item.item?.name}`;
      // new paper.PointText({
      //   content: text,
      //   point: [item.x / 4, item.y / 4],
      // });
    });
  });
});

paper.view.draw();
