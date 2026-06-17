import { useState, useEffect } from "react";

export default function RenderProps() {
  return (
    <div className="main-container">
      <MouseTracker
        render={({ x, y }) => (
          <div className="bordered-container">
            <h2 className="text-lg font-bold mb-3">Render Props Example</h2>
            <p className="text-gray-700 mb-4">
              Move your mouse anywhere in the window!
            </p>

            <div className="flex justify-center gap-4 text-xl font-mono">
              <span>X: {x}</span>
              <span>Y: {y}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}

/* -------------------------------------------------------
   Render Props Component
-------------------------------------------------------- */

type MouseTrackerRender = (coords: { x: number; y: number }) => JSX.Element;

type MouseTrackerProps = {
  render: MouseTrackerRender;
};

function MouseTracker({ render }: MouseTrackerProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return render(coords);
}
