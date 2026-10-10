import { initSync } from "./library-of-fantasia-client.js";

let sharedImports = undefined;
function getSharedImports() {
    if (sharedImports === undefined) {
        sharedImports = { __wasm_split: {  } };
        const { __wasm_split_shared0, __indirect_function_table, memory,  } = initSync(undefined, undefined);
        Object.assign(sharedImports.__wasm_split, { __wasm_split_shared0, __indirect_function_table, memory,  });
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
/* view_15007858233402742912, view_9335305258153469823 */
const __chunk_4 = makeLoad(() => {
    const src = fetch(new URL("./chunk_4.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
/* view_18370079428536271560, view_9335305258153469823 */
const __chunk_5 = makeLoad(() => {
    const src = fetch(new URL("./chunk_5.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, []);
export const __wasm_split_load_view_9335305258153469823 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_9335305258153469823.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_4, __chunk_5]));
export const __wasm_split_load_view_18370079428536271560 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_18370079428536271560.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_5]));
export const __wasm_split_load_view_15007858233402742912 = wrapAsyncCb(makeLoad(() => {
    const src = fetch(new URL("./split_view_15007858233402742912.wasm", import.meta.url));
    return async (imports) => (WebAssembly.instantiateStreaming(src, imports));
}
, [__chunk_4]));
