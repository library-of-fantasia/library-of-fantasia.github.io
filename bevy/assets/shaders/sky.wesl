// 程序化夜空：天穹内表面上的渐变 + 星点。
//
// Web 后端无计算着色器，Bevy 的 `Atmosphere` 不会加载，故改用自写天穹着色器，
// 与 Godot 的 `sky.gdshader` 共用同一渐变与星点公式。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::mesh_view_bindings::view;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct SkyParams {
    top: vec4<f32>,
    horizon: vec4<f32>,
    star: vec4<f32>,
    /// x 星点密度、y 星点半径、z 星点阈值、w 备用。
    tuning: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: SkyParams;

fn hash(seed: vec3<f32>) -> f32 {
    return fract(sin(dot(seed, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

/// 以方向向量做体素化星场：每个格子最多一颗星。
fn star_field(direction: vec3<f32>) -> f32 {
    let scaled = direction * params.tuning.x;
    let cell = floor(scaled);
    if hash(cell) < params.tuning.z {
        return 0.0;
    }
    let center = cell + vec3(hash(cell + 1.0), hash(cell + 2.0), hash(cell + 3.0));
    let distance = length(scaled - center);
    return smoothstep(params.tuning.y, 0.0, distance);
}

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);
    out.world_position = mesh_functions::mesh_position_local_to_world(
        world_from_local, vec4(vertex.position, 1.0)
    );
    out.position = position_world_to_clip(out.world_position.xyz);
    out.world_normal = vec3(0.0, 1.0, 0.0);
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let direction = normalize(mesh.world_position.xyz - view.world_position);
    let height = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);
    var color = mix(params.horizon.rgb, params.top.rgb, pow(height, 0.8));
    color += params.star.rgb * star_field(direction) * params.star.a;
    return vec4(color, 1.0);
}
