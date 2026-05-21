# 3D model

Place your exported car model here as **`car.glb`**.

The garage viewer (`assets/js/garage.js`) checks for this file on load. If it exists, the primitive placeholder car is replaced automatically.

## Export tips (Fusion 360)

1. Export as GLB or GLTF from Fusion / Blender.
2. Keep scale consistent (roughly 2–3 units long in the scene).
3. Name is fixed: `car.glb` (or update the path in `garage.js`).

## Without a model

The built-in primitive F1 silhouette is shown until you add `car.glb`.
