const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentLine = []

// Set initial canvas properties
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "black";
ctx.lineWidth = 10;

function startDrawing(e) {
  isDrawing = true;
  currentLine = []
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
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
    x0: lastX,
    y0: lastY,
    x1: currentX,
    y1: currentY
  })

  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
  if (currentLine.length > 1) {
    const measures = getMeasuresForLine(currentLine);
    currentLine = []
    const dataURL = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.title = JSON.stringify(measures)
    img.src = dataURL
    img.classList.add("line-drawing")
    document.body.appendChild(img)
    console.log(img)
  }
  clearCanvas()
}

function getMeasuresForLine(line) {
  let totalLength = 0;
  for (const lineSection of line) {
    const { x0, y0, x1, y1} = lineSection;
    const x = x1 - x0;
    const y = y1 - y0;
    const { sqrt, pow } = Math;
    const length = sqrt(pow(x, 2) + pow(y, 2))
    totalLength += length;
  }
  return {length: totalLength};
}

function hash(line) {
  const measures = getMeasuresForLine(line)
  return measures.length
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawToMouse);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
