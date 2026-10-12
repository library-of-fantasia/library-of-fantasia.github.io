// 低多边形海面：顶点着色器驱动的正弦波位移 + 解析法线 + 菲涅尔边缘光。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_bindings::mesh;
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::mesh_view_bindings::view;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct WaterParams {
    deep: vec4<f32>,
    crest: vec4<f32>,
    time: f32,
    /// xy 涟漪中心（世界 xz）、z 涟漪半径、w 涟漪强度。
    ripple: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: WaterParams;

const WAVE_AMPLITUDE: f32 = 0.16;
const WAVE_FREQUENCY: f32 = 0.6;
const WAVE_SPEED: f32 = 1.1;

/// 波形高度。
fn wave_height(plane: vec2<f32>, time: f32) -> f32 {
    let a = sin(plane.x * WAVE_FREQUENCY + time * WAVE_SPEED);
    let b = cos(plane.y * WAVE_FREQUENCY * 0.8 + time * WAVE_SPEED * 1.3);
    return WAVE_AMPLITUDE * a * b;
}

/// 由波形解析求得法线。
fn wave_normal(plane: vec2<f32>, time: f32) -> vec3<f32> {
    let dx = WAVE_AMPLITUDE * WAVE_FREQUENCY * cos(plane.x * WAVE_FREQUENCY + time * WAVE_SPEED)
        * cos(plane.y * WAVE_FREQUENCY * 0.8 + time * WAVE_SPEED * 1.3);
    let dz = -WAVE_AMPLITUDE * WAVE_FREQUENCY * 0.8
        * sin(plane.x * WAVE_FREQUENCY + time * WAVE_SPEED)
        * sin(plane.y * WAVE_FREQUENCY * 0.8 + time * WAVE_SPEED * 1.3);
    return normalize(vec3(-dx, 1.0, -dz));
}

/// 交互涟漪强度：以 `ripple.z` 为半径的环形冲击，随距离衰减。
fn ripple_ring(plane: vec2<f32>) -> f32 {
    let distance = abs(length(plane - params.ripple.xy) - params.ripple.z);
    return exp(-distance * 4.0) * params.ripple.w;
}

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);
    var world_position = mesh_functions::mesh_position_local_to_world(
        world_from_local, vec4(vertex.position, 1.0)
    );
    world_position.y += wave_height(world_position.xz, params.time) + ripple_ring(world_position.xz) * 0.3;
    out.world_position = world_position;
    out.position = position_world_to_clip(world_position.xyz);
    out.world_normal = wave_normal(world_position.xz, params.time);
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let normal = normalize(mesh.world_normal);
    let light_direction = normalize(vec3(0.4, 0.8, 0.4));
    let lambert = max(dot(normal, light_direction), 0.0);
    // 视角向量取引擎提供的**真实相机世界位置**，相机轨道旋转/缩放后仍然正确。
    let view_direction = normalize(view.world_position - mesh.world_position.xyz);
    let fresnel = pow(1.0 - max(dot(normal, view_direction), 0.0), 3.0);
    let color = mix(params.deep.rgb, params.crest.rgb, lambert) + vec3(fresnel * 0.15)
        + vec3(ripple_ring(mesh.world_position.xz) * 0.2);
    return vec4(color, 1.0);
}
