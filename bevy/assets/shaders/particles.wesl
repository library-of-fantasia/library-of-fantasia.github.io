// 顶点驱动的网格粒子：单片网格内所有粒子共享一个材质，顶点着色器按时间与
// 每粒子种子计算位移，再以相机右/上向量做面向相机的公告板展开。
//
// Web 后端无计算着色器，故粒子一律走顶点驱动路径（与 Godot 的 CPUParticles3D 对比）。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::mesh_view_bindings::view;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct ParticleParams {
    color: vec4<f32>,
    /// x 时间、y 粒子尺寸、z 漂移幅度、w 漂移速度。
    motion: vec4<f32>,
    /// x 下落速度（0 表示浮游）、y 下落循环高度、z 备用。
    drift: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: ParticleParams;

/// 由粒子本地中心求稳定随机数。
fn hash(seed: vec3<f32>) -> f32 {
    return fract(sin(dot(seed, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);
    var center = mesh_functions::mesh_position_local_to_world(
        world_from_local, vec4(vertex.position, 1.0)
    );

    let seed = hash(vertex.position);
    let phase = seed * 6.2831853;

    center.x += cos(params.motion.w * 0.7 + phase * 1.3) * params.motion.z;
    center.z += sin(params.motion.w * 0.6 + phase * 0.7) * params.motion.z;
    let bob = sin(params.motion.w + phase) * params.motion.z;
    // 下落粒子沿 y 循环；浮游粒子上下浮动。
    let fall = fract((seed + params.motion.w * params.drift.x) / params.drift.y) * params.drift.y;
    center.y += select(bob, -fall, params.drift.x > 0.0);

    let corner = vertex.uv - vec2(0.5);
    let world = center.xyz
        + view.world_from_view[0].xyz * corner.x * params.motion.y
        + view.world_from_view[1].xyz * corner.y * params.motion.y;

    out.world_position = vec4(world, 1.0);
    out.position = position_world_to_clip(world);
    out.world_normal = -view.world_from_view[2].xyz;
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let distance = length(mesh.uv - vec2(0.5)) * 2.0;
    let falloff = clamp(1.0 - distance, 0.0, 1.0);
    let glow = falloff * falloff * params.color.a;
    return vec4(params.color.rgb * glow, glow);
}
