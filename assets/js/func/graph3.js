/*
.. Assumes importmap is already done.
.. If not paste this in your html file
    <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/"
      }
    }
    </script>
*/

/* Importing ES module */
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function graph3 (data, element, caption)
{

  const xmin = Math.min(...data.nodes.map(d => d.x));
  const xmax = Math.max(...data.nodes.map(d => d.x));

  const ymin = Math.min(...data.nodes.map(d => d.y));
  const ymax = Math.max(...data.nodes.map(d => d.y));

  const zmin = Math.min(...data.nodes.map(d => d.z));
  const zmax = Math.max(...data.nodes.map(d => d.z));

  const xsize = xmax - xmin;
  const ysize = ymax - ymin;
  const zsize = zmax - zmin;

  const xcenter = (xmin + xmax) / 2;
  const ycenter = (ymin + ymax) / 2;
  const zcenter = (zmin + zmax) / 2;

  const maxSize = Math.max(
    xsize,
    ysize,
    zsize,
    1e-6
  );

  const width = document.querySelector(".content").clientWidth/3;
  const aspect = xsize / Math.max (ysize, 1e-6);
  let height = (aspect >= 1) ? width / aspect : width;
  height = Math.max(height, 200);

  /* "scene" */
  const scene = new THREE.Scene();

  /* light scene background */
  scene.background = new THREE.Color(0xeeeeee);

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(
    xcenter + maxSize,
    ycenter + maxSize,
    zcenter + maxSize
  );
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  /* "camera" */
  const camera = new THREE.PerspectiveCamera(
    45,
    width/height,
    0.1,
    1000
  );

  /* Put camera along diagonal direction */

  const distance = 2.5 * maxSize;
  camera.position.set(
    xcenter + distance,
    ycenter + distance,
    zcenter + distance
  );

  /* look at graph centre */
  camera.lookAt(
    xcenter,
    ycenter,
    zcenter
  );

  /* "renderer" : gl renderer & add it to the dom element*/
  const renderer = new THREE.WebGLRenderer ({antialias : true});
  renderer.setPixelRatio (window.devicePixelRatio);
  renderer.setSize (width, height);
  renderer.shadowMap.enabled = true;

  /* Adding render & caption to the element */
  element.appendChild(renderer.domElement);
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = caption;
  element.appendChild(figcaption);

  /* "controls" : Mouse controls */
  const controls = new OrbitControls (camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1.5;  /* zoom in limit  */
  controls.maxDistance = 8.0;  /* zoom out limit */

  /* Add nodes */
  const nodeGeometry = new THREE.SphereGeometry(0.08);
  const nodeMaterial = new THREE.MeshLambertMaterial ({ color: 0xff0000});
  data.nodes.forEach ( ({id, x, y, z}) => {
    const sphere = new THREE.Mesh (nodeGeometry, nodeMaterial );
    sphere.position.set (x, y, z);
    sphere.castShadow = true;
    scene.add (sphere);
  });

  /* Add edges */

  /* Use mapping for O(1) searches */
  const nodeMap = new Map();
  data.nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  const edgeMaterial = new THREE.LineBasicMaterial({color: 0x000000});
  data.links.forEach ( ({source, target}) => {

    const a = nodeMap.get(source);
    const b = nodeMap.get(target);

    if (!a || !b)
        return;

    const geometry =
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(a.x, a.y, a.z),
            new THREE.Vector3(b.x, b.y, b.z)
        ]);
    const line = new THREE.Line (geometry, edgeMaterial);
    scene.add (line);
  });

  //console.log (window.innerWidth);
  //console.log (document.querySelector(".container").clientWidth);

  /* Animation */
  function animate()
  {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render( scene, camera );
  }

  animate();
}
