// 非通用 NPR 渲染：色阶量化 + 边缘光。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::mesh_view_bindings::view;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct ToonParams {
    base: vec4<f32>,
    shade: vec4<f32>,
    rim: vec4<f32>,
    steps: f32,
    padding: vec3<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: ToonParams;

const LIGHT_DIRECTION: vec3<f32> = vec3(0.4, 0.8, 0.4);
const SPECULAR_STRENGTH: f32 = 0.6;
const SPECULAR_EXPONENT: f32 = 32.0;

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);
    let world_from_local = mesh_functions::get_world_from_local(vertex_in.instance_index);
    out.world_position = mesh_functions::mesh_position_local_to_world(
        world_from_local, vec4(vertex.position, 1.0)
    );
    out.position = position_world_to_clip(out.world_position.xyz);
    out.world_normal = mesh_functions::mesh_normal_local_to_world(
        vertex.normal, vertex_in.instance_index
    );
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let normal = normalize(mesh.world_normal);
    let light_direction = normalize(LIGHT_DIRECTION);
    // 视角向量取引擎提供的**真实相机世界位置**，相机轨道旋转/缩放后仍然正确。
    let view_direction = normalize(view.world_position - mesh.world_position.xyz);

    // 色阶量化：把连续明暗压成有限档位。
    let lambert = max(dot(normal, light_direction), 0.0);
    let band = floor(lambert * params.steps) / params.steps;
    let tone = mix(params.shade.rgb, params.base.rgb, band);

    // 边缘光。
    let rim = pow(1.0 - max(dot(normal, view_direction), 0.0), 3.0);

    // 镜面高光（视角相关）。
    let half_direction = normalize(light_direction + view_direction);
    let specular = pow(max(dot(normal, half_direction), 0.0), SPECULAR_EXPONENT) * SPECULAR_STRENGTH;

    return vec4(tone + params.rim.rgb * rim + vec3(specular), 1.0);
}
