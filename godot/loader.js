// 幻想图书馆 3D 原型 · Godot 游戏包启动脚本。
//
// 宿主注入本模块脚本后：先加载 Godot Web 运行时（index.js），再启动独立打包的 .pck，
// 并把画面与输入绑定到页面中约定 id 的 canvas 上。

const RUNTIME_URL = "/godot/index.js";
const EXECUTABLE = "/godot/index";
const CANVAS_ID = "library-of-fantasia-godot-canvas";

await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RUNTIME_URL;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Godot 运行时加载失败：${RUNTIME_URL}`));
    document.head.append(script);
});

const canvas = document.getElementById(CANVAS_ID);
// 画布分辨率由宿主决定：把 CSS 盒尺寸写入 backbuffer，并让引擎不做自适应
// （canvasResizePolicy 为 0），避免 Godot 用默认的 300x150 渲染。
canvas.width = canvas.clientWidth || canvas.width;
canvas.height = canvas.clientHeight || canvas.height;

// 安全上下文外（如以 HTTP 访问局域网 IP）AudioWorklet 不存在，Godot 的 WebAudio 驱动
// 会在初始化时调用 audioWorklet.addModule 抛错导致黑屏。此时临时隐藏 AudioContext，
// 让 Godot 判定音频不可用并回退到空音频驱动；启动后恢复以免影响页面其他功能。
const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
// 用 `in` 判断，避免触碰需要实例的 getter（安全上下文下直接访问原型属性会抛 Illegal invocation）。
const audioWorkletAvailable = "audioWorklet" in AudioContextCtor.prototype;
if (!audioWorkletAvailable) {
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;
}

console.info("幻想图书馆 · Godot 游戏包启动中");
try {
    const engine = new Engine({ executable: EXECUTABLE, canvasResizePolicy: 0 });
    await engine.startGame({ canvas });
    console.info("幻想图书馆 · Godot 游戏包已启动", canvas.width, canvas.height);
} catch (error) {
    console.error("幻想图书馆 · Godot 游戏包启动失败", error);
} finally {
    if (!audioWorkletAvailable) {
        window.AudioContext = AudioContextCtor;
        window.webkitAudioContext = AudioContextCtor;
    }
}
