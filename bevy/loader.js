// 幻想图书馆 3D 原型 · Bevy 游戏包启动脚本。
//
// 宿主注入本模块脚本后：先把画布尺寸交给 CSS 盒（组件）决定，再导入并启动游戏。
// winit 会把画布内联宽高写成固定像素，这里用带 `!important` 的样式表规则压住它，
// 使画布始终随父元素铺满，并由 winit 的 ResizeObserver 更新回退缓冲，
// 与 Godot 原型“宿主管理画布尺寸、引擎不介入”的做法一致。

const CANVAS_ID = "library-of-fantasia-bevy-canvas";

const style = document.createElement("style");
style.textContent = `#${CANVAS_ID}{display:block;width:100%!important;height:100%!important;}`;
document.head.append(style);

await (await import("./library-of-fantasia-client-bevy-game.js")).default();
