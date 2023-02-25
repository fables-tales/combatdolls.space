let scene, camera, renderer, stars, starGeo;

function init(root) {
  scene = new THREE.Scene();

  let rect = root.getBoundingClientRect();
  camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(rect.width, rect.height);
  renderer.domElement.style.top = `${rect.top}px`;
  renderer.domElement.style.left = `${rect.left}px`;

  starGeo = new THREE.Geometry();
  for (let i = 0; i < 6000; i++) {
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAABlklEQVRYw8WYT06DQBTGWVgvIGkjutWkHqbWVZvo2qS71qQu9AzKwnoV6R1KkKWmV7BNCkrUNHy+yURR0+IA88bvbQgz8Aszw/tnweI3tWl1dODCwwNmeCWb0ZVHdzo0ogGyhQEmSLFOKY0OaFZpyDau8AwVveAGTnHIBoaIUUQxPVErAtlDgDK6x4Eq5BALlFWMtgrkFEtU0ZLe8AekBx3q5UFaFb8i+5rWOkiz4HnK35vmKkgNIXQqzA50BhlCt85/QxyNS5UtmfMTMgKHbr9DbCQskITe/AXpg0v9DOKzQSafkHpOvKiqVGy+gHTBqWMJcVkhroR4rJA7CZmyQqYSErFCIgnhlgHIm4nlejK48UaOsJGfkdetnEhIw4SD5HT1vomgdWY4/FoU8tkTCUMpkZHkTqSpgVZEsCpNFfXVQhsiwv4/lg6GiiBD5ZywdqXC9Ii7xA7VS2xhm7go6GoSXNJThdseO7hWbnuMsFu+gWNjQO46r4Hj0wxbRyuqQdHTxRiPmOOdbE5XY7rTpRFt/a6K9gF5ZsQukkJl8QAAAABJRU5ErkJggg=="
  );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  root.appendChild(renderer.domElement);
  root.style.background = "none";

  window.addEventListener(
    "resize",
    () => {
      let rect = root.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
      renderer.domElement.style.top = `${rect.top}px`;
      renderer.domElement.style.left = `${rect.left}px`;
    },
    false
  );

  animate();
}

function animate() {
  starGeo.vertices.forEach((p) => {
    p.velocity += p.acceleration;
    p.y -= p.velocity;

    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let elem = document.getElementsByTagName("cd-warp")[0];
if (elem) {
  init(elem);
}
