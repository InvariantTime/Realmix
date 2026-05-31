import { EngineApplication, IVisualProvider } from "./EngineApplication";

export * from "./EngineApplication"



export function createEngine(visual: IVisualProvider) {

    var app = new EngineApplication(visual.canvas);
    return app;
}