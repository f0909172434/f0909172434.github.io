"""Rebuild the portfolio's C4 specimen with Blender 4.5, using native geometry only."""
import bpy
import math
import os
from mathutils import Vector
from pathlib import Path

# This script targets its own named scene, preserving any other open Blender scene.
name = 'Engineering Specimen'
scene = bpy.data.scenes.get(name) or bpy.data.scenes.new(name)
bpy.context.window.scene = scene
for obj in list(scene.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

def material(name, color, metal=0, rough=.4):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    return mat

paper = material('Specimen / warm paper', (.80,.78,.71), rough=.72)
ink = material('Specimen / graphite', (.022,.027,.032), metal=.45, rough=.3)
blue = material('Specimen / cobalt enamel', (.017,.045,.50), metal=.24, rough=.28)
aluminium = material('Specimen / aluminium', (.55,.59,.65), metal=.85, rough=.25)

def box(name, location, scale, mat, bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new('Machined edge', 'BEVEL')
        mod.width = bevel
        mod.segments = 4
        ob.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return ob

box('Archive tray', (0,0,-.05), (3.6,3.3,.15), ink, .055)
for i in range(7):
    ob=box('Paper layer %02d'%i, (.01*i,.006*i,.041+i*.012), (3.38,3.08,.009), paper, .007)
    ob.rotation_euler.z = -.012+i*.002
points=[(-.94,-.9,.44),(.94,-.9,.44),(.94,.9,.44),(-.94,.9,.44)]
for i,p in enumerate(points):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=.18, location=p)
    ob=bpy.context.object; ob.name='C4 vertex %d'%(i+1); ob.data.materials.append(blue)
    for face in ob.data.polygons: face.use_smooth=True
for i in range(4):
    a,b=Vector(points[i]),Vector(points[(i+1)%4]); vector=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=.045,depth=vector.length,location=(a+b)/2)
    ob=bpy.context.object; ob.name='C4 edge %d'%(i+1)
    ob.rotation_euler=vector.to_track_quat('Z','Y').to_euler()
    ob.data.materials.append(aluminium)
    for face in ob.data.polygons: face.use_smooth=True
box('Ground', (0,0,-.18),(200,200,.1),paper,0)

def aim(ob,at): ob.rotation_euler=(Vector(at)-ob.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3.7,-5.5,7.3))
camera=bpy.context.object; camera.name='Specimen camera'; aim(camera,(0,0,.2))
camera.data.type='ORTHO';camera.data.ortho_scale=5.5;scene.camera=camera
bpy.ops.object.light_add(type='AREA',location=(-3,-4,7))
key=bpy.context.object;key.name='Large softbox';key.data.energy=650;key.data.shape='DISK';key.data.size=5;aim(key,(0,0,0))
bpy.ops.object.light_add(type='AREA',location=(4,1,5))
fill=bpy.context.object;fill.name='Edge reflection';fill.data.energy=200;fill.data.size=4;aim(fill,(0,0,0))
scene.world=bpy.data.worlds.new('Specimen World');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.8,.8,.8,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.render.engine='CYCLES';scene.cycles.samples=40;scene.cycles.use_denoising=True
scene.render.resolution_x=1200;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG'
output=Path(os.environ.get('SPECIMEN_OUTPUT', str(Path.cwd()/'renders')))
output.mkdir(parents=True, exist_ok=True)
scene.render.filepath=str(output/'engineering-specimen-v1.png')
bpy.ops.wm.save_as_mainfile(filepath=str(output/'engineering-specimen.blend'))
bpy.ops.render.render(write_still=True)
print('RENDERED',scene.render.filepath,'vertices',4,'edges',4)
