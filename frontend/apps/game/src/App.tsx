import { useCallback, useEffect, useRef } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { BrowserGameLoop, GameApplication, GameWorld } from "@realmix/engine";

function App() {

  const appRef = useRef<GameApplication>(null);

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {

    const loop = new BrowserGameLoop();
    const app = new GameApplication(loop, new GameWorld());

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
