import bpy, math, json, os
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
scene=bpy.data.scenes['Engineering Specimen']
bpy.context.window.scene=scene
scene.cycles.samples=48
scene.view_settings.exposure=.5
blue=bpy.data.materials['Specimen / cobalt enamel'].node_tree.nodes['Principled BSDF']
blue.inputs['Roughness'].default_value=.4
blue.inputs['Metallic'].default_value=.12
bpy.data.materials['Specimen / aluminium'].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.34
camera=scene.camera
camera.data.ortho_scale=5.35
scene.render.resolution_x=960;scene.render.resolution_y=720
out=Path.cwd()/'public/specimen'
out.mkdir(parents=True,exist_ok=True)
frames=[]
for index,degree in enumerate([-18,-12,-6,0,6,12,18]):
    angle=math.radians(degree)
    camera.location=(4.6*math.sin(angle),-4.6*math.cos(angle),7.8)
    camera.rotation_euler=(Vector((0,0,.12))-camera.location).to_track_quat('-Z','Y').to_euler()
    bpy.context.view_layer.update()
    nodes=[]
    for i in range(1,5):
        p=world_to_camera_view(scene,camera,bpy.data.objects['C4 vertex %d'%i].location)
        nodes.append([round(p.x*720,2),round((1-p.y)*540,2)])
    scene.render.image_settings.file_format='WEBP';scene.render.image_settings.quality=86
    scene.render.filepath=str(out/('c4-%d.webp'%index))
    bpy.ops.render.render(write_still=True)
    frames.append({'file':'/specimen/c4-%d.webp'%index,'degrees':degree,'vertices':nodes})
(out/'frames.json').write_text(json.dumps(frames,indent=2))
(Path.cwd()/'src/data').mkdir(parents=True, exist_ok=True)
(Path.cwd()/'src/data/specimen-frames.json').write_text(json.dumps(frames,indent=2))
scene.render.image_settings.file_format='PNG'
output=Path(os.environ.get('SPECIMEN_OUTPUT', str(Path.cwd()/'renders')))
output.mkdir(parents=True, exist_ok=True)
scene.render.filepath=str(output/'engineering-specimen-v2.png')
camera.location=(0,-4.6,7.8)
camera.rotation_euler=(Vector((0,0,.12))-camera.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(output/'engineering-specimen.blend'))
print('Refined and rendered',len(frames),'interactive views')
