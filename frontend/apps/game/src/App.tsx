import { useCallback, useEffect, useRef } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { BrowserGameLoop, Entity, GameApplication, Scene, Vector3 } from "@realmix/engine";

function App() {

  const appRef = useRef<GameApplication>(null);

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {

    const scene = new Scene();

    const entity = new Entity("abc");
    entity.transform.position = new Vector3(1, 0.5, 10);
    entity.transform.rotationY = 1;

    scene.addEntity(entity);

    const loop = new BrowserGameLoop();
    const app = new GameApplication(loop, scene);

    app.start(canvas);
    appRef.current = app;

  }, [appRef]);

  useEffect(() => {

    return () => appRef.current?.dispose();
  }, []);


  return (
    <div className="h-screen w-screen flex">
      <GameCanvas onCanvasInit={onCanvasInit}/>
    </div>
  )
}

export default App
