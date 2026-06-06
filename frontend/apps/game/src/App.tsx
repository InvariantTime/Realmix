import { useCallback, useEffect, useRef } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { BrowserGameLoop, GameApplication, GameEntity, GameWorld } from "@realmix/engine";

function App() {

  const appRef = useRef<GameApplication>(null);

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {

    const world = new GameWorld();
    world.addEntity(new GameEntity("abc", {x: 0, y: 0.5, z: 10}, 1));

    const loop = new BrowserGameLoop();
    const app = new GameApplication(loop, world);

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
