import { useEffect, useRef } from "react"

interface Props {
    onCanvasInit: (canvas: HTMLCanvasElement) => void
}


export const GameCanvas = ({ onCanvasInit: onInitCanvas } : Props) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    useEffect(() => {
        
        if (canvasRef.current) {
            onInitCanvas(canvasRef.current);
            canvasRef.current?.requestFullscreen();
        }

    }, []);

    return (
        <>
            <canvas className="fixed inset-0 w-full h-full"
                ref={canvasRef}/>
        </>
    )
}