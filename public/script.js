const DOMPARSER = new DOMParser();

/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("drawingCanvas");
const lineDrawingsContainer = document.querySelector(".line-drawings")
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentLine = [];

// Set initial canvas properties
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "black";
ctx.lineWidth = 10;

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  currentLine = [{ x: lastX, y: lastY }];
}

function drawToMouse(e) {
  if (!isDrawing) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  currentLine.push({
    x: currentX,
    y: currentY,
  });

  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
  if (currentLine.length > 1) {
    const hash = getHash(currentLine)
    const svg = pointsToSVG(currentLine, canvas.width, canvas.height, ctx.lineWidth, 1/6);
    const measures = getMeasuresForLine(currentLine);
    svg.title = JSON.stringify({...measures, hash});
    svg.classList.add("line-drawing");
    /** @type {HTMLElement} */
    let bucket = lineDrawingsContainer.querySelector(`[data-hash="${hash}"]`)
    if (!bucket) {
      bucket = document.createElement("div")
      bucket.classList.add("line-drawing-bucket")
      bucket.dataset.hash = hash.toString();
      lineDrawingsContainer.appendChild(bucket)
    }
    bucket.appendChild(svg);
    currentLine = [];
  }
  clearCanvas();
}

function getMeasuresForLine(line) {
  let totalLength = 0;
  for (let i = 1; i < line.length; i++) {
    const point = line[i];
    const prevPoint = line[i - 1];
    const x = prevPoint.x - point.x;
    const y = prevPoint.y - point.y;
    const { sqrt, pow } = Math;
    const length = sqrt(pow(x, 2) + pow(y, 2));
    totalLength += length;
  }
  return { length: totalLength };
}

function getHash(line) {
  const measures = getMeasuresForLine(line);
  return Math.floor(measures.length / 80);
}

// Convert array of points to SVG polyline with auto-scaling
function pointsToSVG(points, boundX, boundY, stroke, scale) {

  const width = boundX * scale;
  const height = boundY * scale;
  const strokeWidth = stroke * scale;

  if (points.length === 0) {
    return null;
  }

  // Convert scaled points to polyline points string
  const pointsString = points.map((point) => `${point.x * scale},${point.y * scale}`)
    .join(" ");

  const svgString =
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${pointsString}" stroke="#000" stroke-width="${strokeWidth}" fill="none"/>
    </svg>`;
  const svgDoc = DOMPARSER.parseFromString(svgString, "image/svg+xml");
  return svgDoc.documentElement;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawToMouse);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
