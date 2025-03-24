class Circuit {
  constructor() {
    this.connections = [];
  }
}

class Component {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.width = 50;
    this.height = 50;

    this.element = document.createElement("div");
    this.element.classList.add("component");

    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.addEventListener("mousedown", (event) =>
      this.handleClick(event)
    );

    circuitSpace.appendChild(this.element);
  }

  handleClick = (event) => {
    this.offsetX = event.clientX - this.x;
    this.offsetY = event.clientY - this.y;
    this.dragged = false;

    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.mouseUp);
  };

  drag = (event) => {
    this.isConnecting = false;
    this.dragged = true;
    this.activeComponent = null;
    let newX = event.clientX - this.offsetX;
    let newY = event.clientY - this.offsetY;

    this.x = newX;
    this.y = newY;

    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    drawConnections()
  };

  mouseUp = () => {
    if (!this.dragged){
      //hasn't been moved - indicated click to link
      console.log(this, "wants to connect")
      if (!from) {
        from = this
      } 

      if (!to && this !== from) {
        to = this
        if (from && to){
          buildConnection()
        }
      }
    }

    document.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.mouseUp);
  };
}

class Battery extends Component {
  constructor() {
    super();
    this.element.innerHTML = "B";
  }
}

function createComponent(componentType) {
  let newComponent;
  if (componentType === "battery") {
    newComponent = new Battery();
  }
}

buildConnection = () => {
  //check to see if connected to self
  if (to === from) {
    //connecting to self
    alert("can't connect to self");
    from = null;
    to = null;
    return;
  }

  //check to see if already exists
  for (let pair of circuit.connections) {
    if (pair.includes(to) && pair.includes(from)) {
      alert("connection already exists");
      from = null;
      to = null;
      return;
    }
  }

  circuit.connections.push([from, to]);
  from = null;
  to = null;
  drawConnections();
};

// handleMove = (event) => {
//   if (activeComponent) {
//     drawPotentialConnection(event);
//   }
// };

drawConnections = () => {
  let oldLines = document.querySelectorAll(".new-line");
  oldLines.forEach((line) => line.remove());

  let rect = circuitSpace.getBoundingClientRect();
  circuit.connections.forEach(([comp1, comp2]) => {
    let line = document.createElement("div");
    line.classList.add("line");

    let x1 = comp1.x + comp1.width / 2;
    let y1 = comp1.y + comp1.height / 2;
    let x2 = comp2.x + comp2.width / 2;
    let y2 = comp2.y + comp2.height / 2;

    let length = Math.hypot(x2 - x1, y2 - y1);
    let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = length + "px";
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";

    circuitSpace.appendChild(line);
  });
};

// drawPotentialConnection = (event) => {
//   let oldLine = document.getElementById("new-line");
//   if (oldLine) oldLine.remove();

//   // Get circuitSpace's position relative to the viewport
//   let rect = circuitSpace.getBoundingClientRect();

//   let startX = Math.min(event.clientX - rect.left, activeComponent.x);
//   let startY = Math.min(event.clientY - rect.top, activeComponent.y);
//   let width = Math.abs(event.clientX - rect.left - activeComponent.x);
//   let height = Math.abs(event.clientY - rect.top - activeComponent.y);

//   let newLine = document.createElement("div");
//   newLine.id = "new-line";
//   newLine.classList.add("line");

//   newLine.style.left = startX + 25 + "px";
//   newLine.style.top = startY + 25 + "px";
//   newLine.style.width = width + "px";
//   newLine.style.height = height + "px";

//   circuitSpace.appendChild(newLine);
// };

//program code
let from = null;
let to = null;
const circuitSpace = document.getElementById("circuit-space");
const circuit = new Circuit();

// document.addEventListener("mousemove", handleMove);
