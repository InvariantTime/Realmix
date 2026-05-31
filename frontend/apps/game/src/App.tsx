import { useCallback, useEffect, useRef } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { createEngine, EngineApplication } from "@realmix/engine";

function App() {

  const engineRef = useRef<EngineApplication>(null);

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {

    const engine = createEngine({canvas});
    engine.start();

    engineRef.current = engine;

  }, [engineRef]);

  useEffect(() => {

    return () => engineRef.current?.dispose();
  }, []);


  return (
    <div className="h-screen w-screen flex">
      <GameCanvas onCanvasInit={onCanvasInit}/>
    </div>
  )
}

export default App
