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
    drawConnections();
  };

  mouseUp = () => {
    if (!this.dragged) {
      //hasn't been moved - indicated click to link
      console.log(this, "wants to connect");
      if (!from) {
        from = this;
      }

      if (!to && this !== from) {
        to = this;
        if (from && to) {
          buildConnection();
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

    this.element.classList.add("battery");

    let hline1 = document.createElement("div");
    hline1.classList.add("battery-hline");

    let vlineTall1 = document.createElement("div");
    vlineTall1.classList.add("battery-vline-tall");

    let vlineShort1 = document.createElement("div");
    vlineShort1.classList.add("battery-vline-short");

    let hline2 = document.createElement("div");
    hline2.classList.add("battery-hline");

    let vlineTall2 = document.createElement("div");
    vlineTall2.classList.add("battery-vline-tall");

    let vlineShort2 = document.createElement("div");
    vlineShort2.classList.add("battery-vline-short");
    vlineShort2.style.marginRight = "0px"

    this.element.appendChild(hline1);
    this.element.appendChild(vlineTall1);
    this.element.appendChild(vlineShort1);
    this.element.appendChild(vlineTall2);
    this.element.appendChild(vlineShort2);
    this.element.appendChild(hline2);
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

drawConnections = () => {
  //Finds everything with the class of line.
  let oldLines = document.querySelectorAll(".line");
  //Goes through the list returned and removes them all.
  oldLines.forEach((line) => line.remove());

  //Goes through the connections and creates a line for each
  circuit.connections.forEach(([comp1, comp2]) => {
    //Create a new "Box" to act as a the line
    let line = document.createElement("div");
    //Applies the line class - sets things like absolute position, thickness of 2px, black fill
    line.classList.add("line");

    //Finds the co-ordinates of the two components being joined - offset by 25 for half node size
    let startX = comp1.x + 25;
    let startY = comp1.y + 25;
    let endX = comp2.x + 25;
    let endY = comp2.y + 25;

    //Work out the difference in terms of x and y between the components
    let a = endX - startX;
    let b = endY - startY;
    //bit of pythag to work out the length the line needs to be
    let lineLength = Math.hypot(a, b);
    //Works out the rotation of the angle in RADIANS
    let rotation = Math.atan2(b, a);

    //places the line at the start x and y
    line.style.left = startX + "px";
    line.style.top = startY + "px";
    //Sets the width of the line to be the calculated line length.
    line.style.width = lineLength + "px";

    //Applies the transformation in radians
    line.style.transform = `rotate(${rotation}rad)`;
    //places the line into the circuit space
    circuitSpace.appendChild(line);
  });
};

//program code
let from = null;
let to = null;
const circuitSpace = document.getElementById("circuit-space");
const circuit = new Circuit();
