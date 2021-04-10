import { suggestCreateScript } from "./fetcher";
import { Script } from "./types";
import { Deferred, showErrMsg } from "./utils";

// This Module Provide Script Executor.

export class Executor {
    deactivators: Record<string, () => void> = {};
    constructor(public deferContext: Deferred<ExtensionContext>) { }

    runScript(filepath: string): any {
        try {
            const { activate, deactivate } = require(filepath);
            if (typeof activate == 'function')
                this.deferContext.then(activate).catch(showErrMsg)

            if (typeof deactivate == 'function')
                this.deactivators[filepath] = deactivate;

        } catch (error) {
            if (error?.code == "ENOENT" || error?.code == "MODULE_NOT_FOUND")
                return "NOT_FOUND"
            else
                showErrMsg(error);
        }
    }
    
    async revaluate({ filepath, name }: Script) {
        try {
            await this.deactivators[filepath]?.();
            delete this.deactivators[filepath];
            delete require.cache[filepath];
            const error = this.runScript(filepath);

            if (error == "NOT_FOUND") {
                await suggestCreateScript({ filepath, name });
            }
        } catch (error) {
            showErrMsg(error);
        }
    }

    disposeAll() {
        for (const deactivator of Object.values(this.deactivators)) {
            Promise.resolve().then(() => deactivator()).catch(showErrMsg);
        }
    }
}