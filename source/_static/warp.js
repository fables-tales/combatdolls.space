import dom from "./htmdom.js";

/// Get the bounding rect relative to the document
function getRect(elem) {
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = elem.ownerDocument.body;
  var docEl = elem.ownerDocument.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left),
    width: box.width,
    height: box.height,
  };
}

class CDWarpElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    this.canvas = dom`<canvas is=cd-starfield></canvas>`;
    shadow.appendChild(dom`
      <style>
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: -9999;
        }
      </style>
      <slot></slot>
      ${this.canvas}
    `);
    this.style.transition = "background-color 1s linear";
    this.style.background = "none";

    const ro = new ResizeObserver(() => {
      const rect = getRect(this);
      this.canvas.setRendererSize(rect);
      this.canvas.style.top = `${rect.top}px`;
      this.canvas.style.left = `${rect.left}px`;
    });
    ro.observe(this);
  }
}

customElements.define("cd-warp", CDWarpElement);

class CDStarfield extends HTMLCanvasElement {
  constructor() {
    super();
    this.scene = new THREE.Scene();

    let rect = getRect(this);
    this.camera = new THREE.PerspectiveCamera(
      60,
      rect.width / rect.height,
      1,
      1000
    );
    this.camera.position.z = 1;
    this.camera.rotation.x = Math.PI / 2;

    this.renderer = new THREE.WebGLRenderer({ canvas: this });
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.domElement.style.top = `${rect.top}px`;
    this.renderer.domElement.style.left = `${rect.left}px`;

    this.starGeo = new THREE.Geometry();
    for (let i = 0; i < 6000; i++) {
      let star = new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300
      );
      star.velocity = 0;
      star.acceleration = 0.02;
      this.starGeo.vertices.push(star);
    }

    let sprite = new THREE.TextureLoader().load(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAABlklEQVRYw8WYT06DQBTGWVgvIGkjutWkHqbWVZvo2qS71qQu9AzKwnoV6R1KkKWmV7BNCkrUNHy+yURR0+IA88bvbQgz8Aszw/tnweI3tWl1dODCwwNmeCWb0ZVHdzo0ogGyhQEmSLFOKY0OaFZpyDau8AwVveAGTnHIBoaIUUQxPVErAtlDgDK6x4Eq5BALlFWMtgrkFEtU0ZLe8AekBx3q5UFaFb8i+5rWOkiz4HnK35vmKkgNIXQqzA50BhlCt85/QxyNS5UtmfMTMgKHbr9DbCQskITe/AXpg0v9DOKzQSafkHpOvKiqVGy+gHTBqWMJcVkhroR4rJA7CZmyQqYSErFCIgnhlgHIm4nlejK48UaOsJGfkdetnEhIw4SD5HT1vomgdWY4/FoU8tkTCUMpkZHkTqSpgVZEsCpNFfXVQhsiwv4/lg6GiiBD5ZywdqXC9Ii7xA7VS2xhm7go6GoSXNJThdseO7hWbnuMsFu+gWNjQO46r4Hj0wxbRyuqQdHTxRiPmOOdbE5XY7rTpRFt/a6K9gF5ZsQukkJl8QAAAABJRU5ErkJggg=="
    );
    let starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.7,
      map: sprite,
    });

    this.stars = new THREE.Points(this.starGeo, starMaterial);
    this.scene.add(this.stars);
  }

  animate() {
    this.starGeo.vertices.forEach((p) => {
      p.velocity += p.acceleration;
      p.y -= p.velocity;

      if (p.y < -200) {
        p.y = 200;
        p.velocity = 0;
      }
    });
    this.starGeo.verticesNeedUpdate = true;
    this.stars.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
    this.next_frame = requestAnimationFrame(this.animate.bind(this));
  }

  connectedCallback() {
    this.next_frame = requestAnimationFrame(this.animate.bind(this));
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.next_frame);
  }

  setRendererSize(rect) {
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
  }
}

customElements.define("cd-starfield", CDStarfield, { extends: "canvas" });
