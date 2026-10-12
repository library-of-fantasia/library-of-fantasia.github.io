// 拖尾轨迹：一条带状网格，顶点着色器按解析路径回溯时间生成轨迹点。
//
// 幽灵（发光体）沿解析圆轨道游荡，轨迹即该路径在过去 `span` 秒内的采样，
// 与 Godot 的 `trail.gdshader` 使用同一路径公式与参数。

import bevy_pbr::render::forward_io::{Vertex, VertexOutput, decompress_vertex};
import bevy_pbr::render::view_transformations::position_world_to_clip;

struct TrailParams {
    color: vec4<f32>,
    /// x 时间、y 轨迹跨度（秒）、z 半宽、w 备用。
    timing: vec4<f32>,
    /// xy 轨道中心（xz）、z 半径、w 角速度。
    path: vec4<f32>,
    /// x 基准高度、y 上下浮动幅度、z 浮动角速度、w 备用。
    height: vec4<f32>,
}

@group(constants::MATERIAL_BIND_GROUP) @binding(0) var<uniform> params: TrailParams;

/// 幽灵在时刻 `t` 的世界位置。
fn path_point(t: f32) -> vec3<f32> {
    let angle = t * params.path.w;
    return vec3(
        params.path.x + cos(angle) * params.path.z,
        params.height.x + sin(t * params.height.z) * params.height.y,
        params.path.y + sin(angle) * params.path.z,
    );
}

@vertex
fn vertex(vertex_in: Vertex) -> VertexOutput {
    var out: VertexOutput;
    let vertex = decompress_vertex(vertex_in, vertex_in.instance_index);

    let lag = vertex.uv.x;
    let edge = vertex.uv.y * 2.0 - 1.0;
    let t = params.timing.x - lag * params.timing.y;

    let point = path_point(t);
    let tangent = normalize(path_point(t + 0.05) - point);
    let side = normalize(cross(vec3(0.0, 1.0, 0.0), tangent));
    let world = point + side * edge * params.timing.z * (1.0 - lag);

    out.world_position = vec4(world, 1.0);
    out.position = position_world_to_clip(world);
    out.world_normal = vec3(0.0, 1.0, 0.0);
    out.uv = vertex.uv;
    return out;
}

@fragment
fn fragment(mesh: VertexOutput) -> @location(0) vec4<f32> {
    let lag = mesh.uv.x;
    let edge_fade = 1.0 - abs(mesh.uv.y * 2.0 - 1.0);
    let alpha = (1.0 - lag) * edge_fade * params.color.a;
    return vec4(params.color.rgb * alpha, alpha);
}
