import { useCallback } from "react";
import { GameCanvas } from "./components/GameCanvas";

function App() {

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {

    alert("canvas inited");

  }, []);


  return (
    <div className="h-screen w-screen flex">
      <GameCanvas onCanvasInit={onCanvasInit}/>
    </div>
  )
}

export default App
