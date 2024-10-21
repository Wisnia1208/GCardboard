document.addEventListener("DOMContentLoaded", function () {
  var boks = document.getElementById("boks");
  var sphere = document.querySelector("a-sphere");
  var cylinder = document.querySelector("a-cylinder");

  function losowyKolorHex() {
    const kolor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + "0".repeat(6 - kolor.length) + kolor;
  }

  function wykonajCoSekunde() {
    // Ustaw kolor boksu na losowy kolor
    boks.setAttribute("color", losowyKolorHex());

    // Zmieniaj rozmiar sfery co sekundę
    sphere.setAttribute("radius", Math.random() * 0.5 + 0.1);

    // Obracaj cylindra co sekundę
    cylinder.setAttribute("rotation", {
      x: cylinder.getAttribute("rotation").x + 7,
      y: cylinder.getAttribute("rotation").y,
      z: cylinder.getAttribute("rotation").z - 6,
    });
  }
  var camera = document.querySelector("a-camera");
  function obracajKamere() {
    // Obracaj kamerę dookoła sceny
    camera.setAttribute("position", {
      x: Math.sin(Date.now() / 1000) * 5, // Ruch w osi X (jak wcześniej)
      y: camera.getAttribute("position").y, // Pozostawiamy stałą pozycję Y
      z: Math.cos(Date.now() / 1000) * 5, // Ruch w osi Z (nowy ruch)
    });
  }

  setInterval(wykonajCoSekunde, 1000);
  setInterval(obracajKamere, 50);
});

AFRAME.registerComponent("modify-materials", {
  init: function () {
    // Wait for model to load.
    this.el.addEventListener("model-loaded", () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D("mesh");
      // Go over the submeshes and modify materials we want.
      obj.traverse((node) => {
        if (node.name.indexOf("ship") !== -1) {
          node.material.color.set("red");
        }
      });
    });
  },
});

AFRAME.registerComponent("box", {
  schema: {
    width: { type: "number", default: 1 },
    height: { type: "number", default: 1 },
    depth: { type: "number", default: 1 },
    color: { type: "color", default: "#00bb00" },
    rotationSpeed: { type: "number", default: 1 },
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    this.geometry = new THREE.BoxGeometry(data.width, data.height, data.depth);
    this.material = new THREE.MeshStandardMaterial({ color: data.color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    el.setObject3D("mesh", this.mesh);
  },

  tick: function (time, timeDelta) {
    // Rotate the box around its Y-axis
    this.el.object3D.rotation.y += this.data.rotationSpeed * (timeDelta / 1000);
  },

  /**
   * Update the mesh in response to property updates.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) {
      return;
    }

    // Geometry-related properties changed. Update the geometry.
    if (
      data.width !== oldData.width ||
      data.height !== oldData.height ||
      data.depth !== oldData.depth
    ) {
      el.getObject3D("mesh").geometry = new THREE.BoxGeometry(
        data.width,
        data.height,
        data.depth
      );
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D("mesh").material.color = new THREE.Color(data.color);
    }
  },
});

AFRAME.registerComponent("follow", {
  schema: {
    target: { type: "selector" },
    speed: { type: "number" },
  },

  init: function () {
    this.directionVec3 = new THREE.Vector3();
  },

  tick: function (time, timeDelta) {
    var directionVec3 = this.directionVec3;

    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.data.target.object3D.position;
    var currentPosition = this.el.object3D.position;

    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();

    // Don't go any closer if a close proximity has been reached.
    if (distance < 1) {
      return;
    }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.data.speed / distance;
    ["x", "y", "z"].forEach(function (axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // Translate the entity in the direction towards the target.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z,
    });
  },
});

document.addEventListener("DOMContentLoaded", function () {
  var boks = document.getElementById("boks");
  var sphere = document.querySelector("a-sphere");
  var cylinder = document.querySelector("a-cylinder");

  function losowyKolorHex() {
    const kolor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + "0".repeat(6 - kolor.length) + kolor;
  }

  function wykonajCoSekunde() {
    // Ustaw kolor boksu na losowy kolor
    boks.setAttribute("color", losowyKolorHex());

    // Zmieniaj rozmiar sfery co sekundę
    sphere.setAttribute("radius", Math.random() * 0.5 + 0.1);

    // Obracaj cylindra co sekundę
    cylinder.setAttribute("rotation", {
      x: cylinder.getAttribute("rotation").x + 7,
      y: cylinder.getAttribute("rotation").y,
      z: cylinder.getAttribute("rotation").z - 6,
    });
  }

  setInterval(wykonajCoSekunde, 500);
});
