import { initSync } from "./library-of-fantasia-client.js";

let sharedImports = undefined;
function getSharedImports() {
    if (sharedImports === undefined) {
        sharedImports = { __wasm_split: {  } };
        const { __wasm_split_shared0, memory, __indirect_function_table,  } = initSync(undefined, undefined);
        Object.assign(sharedImports.__wasm_split, { __wasm_split_shared0, memory, __indirect_function_table,  });
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
/* view_14477661759848338679, view_735209403358085205 */
const __chunk_5 = makeLoad(() => {
    const src = fetch(new URL("./chunk_5.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_14477661759848338679, view_735209403358085205, view_8351225962510183632 */
const __chunk_6 = makeLoad(() => {
    const src = fetch(new URL("./chunk_6.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_14477661759848338679, view_8351225962510183632 */
const __chunk_7 = makeLoad(() => {
    const src = fetch(new URL("./chunk_7.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_14477661759848338679, view_8351225962510183632, view_8579273900466201256 */
const __chunk_8 = makeLoad(() => {
    const src = fetch(new URL("./chunk_8.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_14477661759848338679, view_8579273900466201256 */
const __chunk_9 = makeLoad(() => {
    const src = fetch(new URL("./chunk_9.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_735209403358085205, view_8351225962510183632 */
const __chunk_10 = makeLoad(() => {
    const src = fetch(new URL("./chunk_10.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_735209403358085205, view_8351225962510183632, view_8579273900466201256 */
const __chunk_11 = makeLoad(() => {
    const src = fetch(new URL("./chunk_11.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_735209403358085205, view_8579273900466201256 */
const __chunk_12 = makeLoad(() => {
    const src = fetch(new URL("./chunk_12.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_8351225962510183632, view_8579273900466201256 */
const __chunk_13 = makeLoad(() => {
    const src = fetch(new URL("./chunk_13.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
export const __wasm_split_load_view_8579273900466201256 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_8579273900466201256.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_8, __chunk_9, __chunk_11, __chunk_12, __chunk_13]));
export const __wasm_split_load_view_8351225962510183632 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_8351225962510183632.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_6, __chunk_7, __chunk_8, __chunk_10, __chunk_11, __chunk_13]));
export const __wasm_split_load_view_735209403358085205 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_735209403358085205.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_5, __chunk_6, __chunk_10, __chunk_11, __chunk_12]));
export const __wasm_split_load_view_14477661759848338679 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_14477661759848338679.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_5, __chunk_6, __chunk_7, __chunk_8, __chunk_9]));
