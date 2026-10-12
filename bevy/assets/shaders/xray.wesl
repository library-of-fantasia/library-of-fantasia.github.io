// 蒙版透视：关闭深度测试的发光符文，可穿过遮挡物被看见。
//
// 深度测试的关闭由宿主材质在 `specialize` 中把管线的深度模板状态置空实现，
// 着色器只负责程序化遮罩图案，与 Godot `xray.gdshader` 的图案公式一致。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::mesh_functions;
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct XrayParams {
    color: vec4<f32>,
    /// x 时间、y 环形频率、z 备用。
    timing: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: XrayParams;

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
    let radius = length(mesh.uv - vec2(0.5));
    let rings = 0.5 + 0.5 * sin(radius * params.timing.y - params.timing.x * 2.0);
    let mask = smoothstep(0.5, 0.35, radius) * rings;
    return vec4(params.color.rgb, mask * params.color.a);
}
