import { initSync } from "./library-of-fantasia-client.js";

let sharedImports = undefined;
function getSharedImports() {
    if (sharedImports === undefined) {
        sharedImports = { __wasm_split: {  } };
        const { memory, __wasm_split_shared0, __indirect_function_table,  } = initSync(undefined, undefined);
        Object.assign(sharedImports.__wasm_split, { memory, __wasm_split_shared0, __indirect_function_table,  });
    }
    return sharedImports;
}
function wrapAsyncCb(callee) {
    return async (callbackIndex, callbackData) => {
        let success;
        try {
            await callee();
            success = true;
        } catch (e) {
            console.error(e);
            success = false;
        } finally {
            const sharedImports = getSharedImports();
            sharedImports.__wasm_split.__indirect_function_table.get(callbackIndex)(callbackData, success);
        }
    }
}
function makeLoad(fetcher, deps) {
    const loader = async () => {
        const parallelStuff = deps.map(d => d());
        const instantiate = fetcher();
        await Promise.all(parallelStuff);
        const imports = getSharedImports();
        return instantiate(imports);
    };
    let loadingModule = undefined;
    return () => {
        if (loadingModule === undefined) {
            const thisLoad = loader();
            // Memoize successes only: a rejected load must not be cached for
            // the lifetime of the session, or one transient network failure
            // permanently breaks the module. Clearing on rejection lets the
            // next call (e.g. the Rust side re-invoking load after a failed
            // callback) start a fresh attempt.
            thisLoad.catch(() => {
                if (loadingModule === thisLoad) loadingModule = undefined;
            });
            loadingModule = thisLoad;
        }
        return loadingModule;
    }
}
/* view_1097951492173525700, view_12059873471287290810 */
const __chunk_7 = makeLoad(() => {
    const src = fetch(new URL("./chunk_7.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_17894234732417943423 */
const __chunk_8 = makeLoad(() => {
    const src = fetch(new URL("./chunk_8.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_17894234732417943423, view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_9 = makeLoad(() => {
    const src = fetch(new URL("./chunk_9.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_17894234732417943423, view_6070360983244184799, view_7568811022274912575 */
const __chunk_10 = makeLoad(() => {
    const src = fetch(new URL("./chunk_10.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_18013159487573230677 */
const __chunk_11 = makeLoad(() => {
    const src = fetch(new URL("./chunk_11.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_12 = makeLoad(() => {
    const src = fetch(new URL("./chunk_12.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_6070360983244184799 */
const __chunk_13 = makeLoad(() => {
    const src = fetch(new URL("./chunk_13.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_6070360983244184799, view_7568811022274912575 */
const __chunk_14 = makeLoad(() => {
    const src = fetch(new URL("./chunk_14.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_12059873471287290810, view_7568811022274912575 */
const __chunk_15 = makeLoad(() => {
    const src = fetch(new URL("./chunk_15.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_17894234732417943423 */
const __chunk_16 = makeLoad(() => {
    const src = fetch(new URL("./chunk_16.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_17894234732417943423, view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_17 = makeLoad(() => {
    const src = fetch(new URL("./chunk_17.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_17894234732417943423, view_6070360983244184799, view_7568811022274912575 */
const __chunk_18 = makeLoad(() => {
    const src = fetch(new URL("./chunk_18.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_18013159487573230677 */
const __chunk_19 = makeLoad(() => {
    const src = fetch(new URL("./chunk_19.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_18013159487573230677, view_6070360983244184799 */
const __chunk_20 = makeLoad(() => {
    const src = fetch(new URL("./chunk_20.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_21 = makeLoad(() => {
    const src = fetch(new URL("./chunk_21.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_6070360983244184799 */
const __chunk_22 = makeLoad(() => {
    const src = fetch(new URL("./chunk_22.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_6070360983244184799, view_7568811022274912575 */
const __chunk_23 = makeLoad(() => {
    const src = fetch(new URL("./chunk_23.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_1097951492173525700, view_7568811022274912575 */
const __chunk_24 = makeLoad(() => {
    const src = fetch(new URL("./chunk_24.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_17894234732417943423 */
const __chunk_25 = makeLoad(() => {
    const src = fetch(new URL("./chunk_25.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_17894234732417943423, view_18013159487573230677, view_6070360983244184799 */
const __chunk_26 = makeLoad(() => {
    const src = fetch(new URL("./chunk_26.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_17894234732417943423, view_6070360983244184799 */
const __chunk_27 = makeLoad(() => {
    const src = fetch(new URL("./chunk_27.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_18013159487573230677 */
const __chunk_28 = makeLoad(() => {
    const src = fetch(new URL("./chunk_28.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_18013159487573230677, view_6070360983244184799 */
const __chunk_29 = makeLoad(() => {
    const src = fetch(new URL("./chunk_29.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_30 = makeLoad(() => {
    const src = fetch(new URL("./chunk_30.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_18013159487573230677, view_7568811022274912575 */
const __chunk_31 = makeLoad(() => {
    const src = fetch(new URL("./chunk_31.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_6070360983244184799 */
const __chunk_32 = makeLoad(() => {
    const src = fetch(new URL("./chunk_32.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_6070360983244184799, view_7568811022274912575 */
const __chunk_33 = makeLoad(() => {
    const src = fetch(new URL("./chunk_33.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_12059873471287290810, view_7568811022274912575 */
const __chunk_34 = makeLoad(() => {
    const src = fetch(new URL("./chunk_34.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_17894234732417943423, view_6070360983244184799 */
const __chunk_35 = makeLoad(() => {
    const src = fetch(new URL("./chunk_35.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_18013159487573230677, view_6070360983244184799 */
const __chunk_36 = makeLoad(() => {
    const src = fetch(new URL("./chunk_36.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_18013159487573230677, view_6070360983244184799, view_7568811022274912575 */
const __chunk_37 = makeLoad(() => {
    const src = fetch(new URL("./chunk_37.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_6070360983244184799, view_7568811022274912575 */
const __chunk_38 = makeLoad(() => {
    const src = fetch(new URL("./chunk_38.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
export const __wasm_split_load_view_7568811022274912575 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_7568811022274912575.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_9, __chunk_10, __chunk_12, __chunk_14, __chunk_15, __chunk_17, __chunk_18, __chunk_21, __chunk_23, __chunk_24, __chunk_30, __chunk_31, __chunk_33, __chunk_34, __chunk_37, __chunk_38]));
export const __wasm_split_load_view_6070360983244184799 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_6070360983244184799.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_9, __chunk_10, __chunk_12, __chunk_13, __chunk_14, __chunk_17, __chunk_18, __chunk_20, __chunk_21, __chunk_22, __chunk_23, __chunk_26, __chunk_27, __chunk_29, __chunk_30, __chunk_32, __chunk_33, __chunk_35, __chunk_36, __chunk_37, __chunk_38]));
export const __wasm_split_load_view_18013159487573230677 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_18013159487573230677.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_9, __chunk_11, __chunk_12, __chunk_17, __chunk_19, __chunk_20, __chunk_21, __chunk_26, __chunk_28, __chunk_29, __chunk_30, __chunk_31, __chunk_36, __chunk_37]));
export const __wasm_split_load_view_17894234732417943423 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_17894234732417943423.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_8, __chunk_9, __chunk_10, __chunk_16, __chunk_17, __chunk_18, __chunk_25, __chunk_26, __chunk_27, __chunk_35]));
export const __wasm_split_load_view_12059873471287290810 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_12059873471287290810.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_7, __chunk_8, __chunk_9, __chunk_10, __chunk_11, __chunk_12, __chunk_13, __chunk_14, __chunk_15, __chunk_25, __chunk_26, __chunk_27, __chunk_28, __chunk_29, __chunk_30, __chunk_31, __chunk_32, __chunk_33, __chunk_34]));
export const __wasm_split_load_view_1097951492173525700 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_1097951492173525700.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_7, __chunk_8, __chunk_9, __chunk_10, __chunk_11, __chunk_12, __chunk_13, __chunk_14, __chunk_15, __chunk_16, __chunk_17, __chunk_18, __chunk_19, __chunk_20, __chunk_21, __chunk_22, __chunk_23, __chunk_24]));
