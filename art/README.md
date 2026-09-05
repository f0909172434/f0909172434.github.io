# Engineering Specimen

The portfolio opens on a physical model of the four-cycle C₄: four cobalt joints,
four aluminium edges, layered paper and a graphite tray. Selecting a joint shows
its degree and keeps that selection when the visitor switches to the diagram.
The object makes the same counterexample inspectable in two representations.

All geometry and materials are constructed in `specimen.py`. No downloaded models,
textures, generated bitmap assets or client-side 3D library are required. The
Blender sources and rendered assets are maintained with this portfolio.

## Reproduce

Use Blender **4.5.9 LTS**. From the repository root:

```sh
blender --background --factory-startup --python art/specimen.py --python art/export_views.py
```

Replace `blender` with its application executable if it is not on PATH. Set the
optional `SPECIMEN_OUTPUT` environment variable to choose where the PNG previews
and `.blend` file go; otherwise they go in `renders/`.

The first script creates its own `Engineering Specimen` scene. The second softens
the materials, moves the camera closer to a top view, and renders seven angles
from −18° to +18°. It writes:

- `public/specimen/c4-0.webp` through `c4-6.webp`;
- `public/specimen/frames.json` and `src/data/specimen-frames.json`, containing
  camera-projected joint coordinates in the SVG's 720 × 540 coordinate space;
- two PNG previews and the final `.blend` scene in the output directory.

Rendering may differ slightly across devices or Blender versions. The checked-in
WebP frames are the deployment assets; a normal website build does not run Blender.

## Design and verification

The first render was too reflective and oblique for reading the graph. The second
iteration reduced the metallic sheen, changed the camera and cropped excess
vertical space. The website interpolates adjacent frames and their projected
hotspots, using about 120 KB of image assets for the entire rotation.

Text and controls remain native HTML/SVG. The range input supports keyboard and
touch. Each joint supports Enter and Space. Static reading and reduced motion fix
the viewing angle while preserving inspection. If a frame cannot load, an SVG
cycle retains the same interaction.
