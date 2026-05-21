import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.getElementById("garage-canvas");
if (!canvas) {
  /* not on garage page */
} else {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121110);
  scene.fog = new THREE.Fog(0x121110, 12, 28);

  const camera = new THREE.PerspectiveCamera(
    42,
    1,
    0.1,
    100
  );
  camera.position.set(4, 2.2, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 3;
  controls.maxDistance = 14;
  controls.target.set(0, 0.35, 0);

  /* Lighting */
  const ambient = new THREE.AmbientLight(0xf4efe6, 0.35);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(5, 8, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xb8c4d0, 0.35);
  fillLight.position.set(-4, 3, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xd72638, 0.25);
  rimLight.position.set(0, 2, -6);
  scene.add(rimLight);

  /* Floor grid */
  const gridHelper = new THREE.GridHelper(14, 28, 0x2a2826, 0x1e1c1a);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  const floorGeo = new THREE.PlaneGeometry(14, 14);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1917,
    roughness: 0.9,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const accentColor = 0xd72638;
  const bodyMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.6,
    metalness: 0.15,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.55,
    metalness: 0.2,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1917,
    roughness: 0.7,
    metalness: 0.1,
  });

  const carGroup = new THREE.Group();
  const partMeshes = {};

  function addPart(name, mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.partName = name;
    partMeshes[name] = mesh;
    carGroup.add(mesh);
  }

  /* Chassis */
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.22, 0.55),
    bodyMat
  );
  chassis.position.set(0, 0.35, 0);
  addPart("chassis", chassis);

  /* Nose */
  const nose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.2, 0.9, 12),
    bodyMat
  );
  nose.rotation.z = Math.PI / 2;
  nose.position.set(1.75, 0.32, 0);
  addPart("nose", nose);

  /* Halo */
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.03, 8, 24, Math.PI),
    darkMat
  );
  halo.rotation.x = Math.PI / 2;
  halo.rotation.z = Math.PI;
  halo.position.set(0.1, 0.55, 0);
  addPart("halo", halo);

  /* Side pods */
  [-1, 1].forEach((side) => {
    const pod = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.12, 0.35),
      bodyMat
    );
    pod.position.set(-0.2, 0.28, side * 0.42);
    addPart(side < 0 ? "sidepodL" : "sidepodR", pod);
  });

  /* Front wing */
  const frontWing = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.04, 1.1),
    darkMat
  );
  frontWing.position.set(2.15, 0.18, 0);
  addPart("frontWing", frontWing);

  [-1, 1].forEach((side) => {
    const ep = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.2, 0.04),
      darkMat
    );
    ep.position.set(2.12, 0.22, side * 0.52);
    addPart(side < 0 ? "frontEpL" : "frontEpR", ep);
  });

  /* Rear wing */
  const rearWing = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.35, 0.95),
    darkMat
  );
  rearWing.position.set(-1.35, 0.55, 0);
  addPart("rearWing", rearWing);

  const rearSupport = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.25, 0.08),
    darkMat
  );
  rearSupport.position.set(-1.2, 0.42, 0);
  addPart("rearSupport", rearSupport);

  /* Wheels */
  const wheelPositions = [
    [1.1, 0.12, 0.48],
    [1.1, 0.12, -0.48],
    [-1.0, 0.12, 0.48],
    [-1.0, 0.12, -0.48],
  ];
  wheelPositions.forEach((pos, i) => {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.12, 20),
      wheelMat
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(...pos);
    addPart(`wheel${i}`, wheel);
  });

  scene.add(carGroup);

  /* Camera presets */
  const presets = {
    front: { pos: [0, 1.2, 7], target: [0, 0.35, 0] },
    side: { pos: [7, 1.5, 0], target: [0, 0.35, 0] },
    top: { pos: [0.5, 8, 0.5], target: [0, 0, 0] },
    iso: { pos: [4, 2.2, 5], target: [0, 0.35, 0] },
  };

  let camAnim = null;
  const camFrom = new THREE.Vector3();
  const camTo = new THREE.Vector3();
  const tgtFrom = new THREE.Vector3();
  const tgtTo = new THREE.Vector3();
  let animStart = 0;
  const ANIM_MS = 600;

  function goToPreset(name) {
    const p = presets[name];
    if (!p) return;
    camFrom.copy(camera.position);
    camTo.set(...p.pos);
    tgtFrom.copy(controls.target);
    tgtTo.set(...p.target);
    animStart = performance.now();
    camAnim = name;
    document.querySelectorAll(".btn-preset").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.view === name);
    });
  }

  document.querySelectorAll(".btn-preset").forEach((btn) => {
    btn.addEventListener("click", () => goToPreset(btn.dataset.view));
  });
  goToPreset("iso");

  let wireframeOn = false;
  let autoRotate = false;

  document.getElementById("btn-wireframe")?.addEventListener("click", (e) => {
    wireframeOn = !wireframeOn;
    e.currentTarget.classList.toggle("is-on", wireframeOn);
    carGroup.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.material.wireframe = wireframeOn;
      }
    });
  });

  document.getElementById("btn-autorotate")?.addEventListener("click", (e) => {
    autoRotate = !autoRotate;
    e.currentTarget.classList.toggle("is-on", autoRotate);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
  });

  /* Part callouts */
  const calloutMap = {
    nose: "Nose",
    frontWing: "Front wing",
    halo: "Halo",
    sidepodL: "Side pod",
    sidepodR: "Side pod",
    rearWing: "Rear wing",
    wheel0: "Wheels",
    wheel1: "Wheels",
    wheel2: "Wheels",
    wheel3: "Wheels",
  };

  const calloutList = document.getElementById("callout-list");
  const uniqueLabels = [...new Set(Object.values(calloutMap))];

  if (calloutList) {
    uniqueLabels.forEach((label) => {
      const li = document.createElement("span");
      li.className = "callout-item";
      li.textContent = label;
      li.dataset.label = label;
      calloutList.appendChild(li);
    });

    calloutList.addEventListener("mouseover", (e) => {
      const item = e.target.closest(".callout-item");
      if (!item) return;
      highlightPart(item.dataset.label);
    });
    calloutList.addEventListener("mouseout", () => clearHighlight());
  }

  function highlightPart(label) {
    clearHighlight();
    calloutList
      ?.querySelectorAll(".callout-item")
      .forEach((el) => el.classList.toggle("is-highlight", el.dataset.label === label));
    Object.entries(partMeshes).forEach(([key, mesh]) => {
      if (calloutMap[key] === label && mesh.material) {
        mesh.material.emissive.setHex(accentColor);
        mesh.material.emissiveIntensity = 0.35;
      }
    });
  }

  function clearHighlight() {
    calloutList?.querySelectorAll(".callout-item").forEach((el) => {
      el.classList.remove("is-highlight");
    });
    carGroup.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.material.emissive.setHex(0x000000);
        obj.material.emissiveIntensity = 0;
      }
    });
  }

  /* Resize */
  function resize() {
    const wrap = canvas.parentElement;
    const w = wrap.clientWidth;
    const h = Math.max(wrap.clientHeight, 480);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener("resize", resize);
  resize();

  /* Optional GLB */
  async function tryLoadGlb() {
    const url = "assets/models/car.glb";
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) return;
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          while (carGroup.children.length) carGroup.remove(carGroup.children[0]);
          const model = gltf.scene;
          model.traverse((c) => {
            if (c.isMesh) {
              c.castShadow = true;
              c.receiveShadow = true;
            }
          });
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.8 / maxDim;
          model.scale.setScalar(scale);
          box.setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.position.y += 0.35 - box.min.y * scale;
          carGroup.add(model);
        },
        undefined,
        () => {}
      );
    } catch {
      /* keep primitives */
    }
  }
  tryLoadGlb();

  function animate(now) {
    requestAnimationFrame(animate);
    if (camAnim) {
      const t = Math.min((now - animStart) / ANIM_MS, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(camFrom, camTo, ease);
      controls.target.lerpVectors(tgtFrom, tgtTo, ease);
      if (t >= 1) camAnim = null;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate(0);
}
