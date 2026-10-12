// 风格化草地：顶点风摆 + 指针交互压弯。
//
// 与 Godot 的 `grass.gdshader` 共用同一套风向、频率与交互公式，便于横向对比。
// 叶尖（uv.y 越大）摆动越强，形成自然的锥形弯曲。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct GrassParams {
    base: vec4<f32>,
    tip: vec4<f32>,
    /// xy 风向、z 强度、w 动画时间（秒）。
    wind: vec4<f32>,
    /// xy 交互点世界坐标（xz）、z 作用半径、w 压弯强度。
    pointer: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: GrassParams;

const LIGHT_DIRECTION: vec3<f32> = vec3(0.4, 0.8, 0.4);

const WIND_FREQUENCY: f32 = 1.4;

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);
    var world_position = mesh_functions::mesh_position_local_to_world(
        world_from_local, vec4(vertex.position, 1.0)
    );

    // Rectangle 的 uv.y 自上而下为 0→1，故叶尖高度取 `1.0 - uv.y`。
    let height = 1.0 - vertex.uv.y;
    let bend = height * height;

    let sway = sin(params.wind.w * WIND_FREQUENCY + world_position.x * 1.3 + world_position.z * 1.1);
    let wind_offset = params.wind.xy * params.wind.z * bend * (0.5 + 0.5 * sway);

    let delta = world_position.xz - params.pointer.xy;
    let distance = length(delta);
    let direction = select(normalize(delta + vec2(1e-4)), vec2(0.0, 1.0), distance <= 1e-4);
    let push = (1.0 - smoothstep(0.0, params.pointer.z, distance)) * params.pointer.w * bend;

    let offset = wind_offset + direction * push;
    world_position.x += offset.x;
    world_position.z += offset.y;
    out.world_position = world_position;
    out.position = position_world_to_clip(world_position.xyz);
    out.world_normal = vec3(0.0, 1.0, 0.0);
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let lambert = max(dot(vec3(0.0, 1.0, 0.0), normalize(LIGHT_DIRECTION)), 0.0);
    let tone = mix(params.base.rgb, params.tip.rgb, 1.0 - mesh.uv.y);
    return vec4(tone * (0.5 + 0.5 * lambert), 1.0);
}
