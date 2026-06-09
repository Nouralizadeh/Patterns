import { useState } from "react";

// --- Child 1: Temperature Input ---
type TempInputProps = {
  temp: number;
  onTempChange: (newTemp: number) => void;
};

function TemperatureInput({ temp, onTempChange }: TempInputProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="label1">
        Current Temp: <b className="label2">{temp}°C</b>
      </span>
      <div className="flex gap-2">
        <button onClick={() => onTempChange(temp + 1)} className="btn-accept">
          + Increase
        </button>
        <button onClick={() => onTempChange(temp - 1)} className="btn-denied">
          - Decrease
        </button>
      </div>
    </div>
  );
}

// --- Child 2: Boiler Status ---
function BoilerStatus({ temp }: { temp: number }) {
  const isTooCold = temp < 18;
  return (
    <div
      className={`main-container rounded-xl flex-col ${isTooCold ? "bg-orange-100" : "bg-slate-100"}`}
    >
      <p className={isTooCold ? "error animate-none" : "label1"}>
        Boiler Status: {isTooCold ? "🔥 Heating..." : "💤 Standby"}
      </p>

      {isTooCold && (
        <span className="success border-none mt-2">
          It's freezing! Boosting the system.
        </span>
      )}
    </div>
  );
}

// --- Parent: The Holder of State (Lifting State Up) ---
export function LiftingStateUp() {
  // Using state
  const [temperature, setTemperature] = useState(20);

  return (
    <div className="borderd-elevated">
      <h2 className="title">Smart Home System</h2>

      <TemperatureInput temp={temperature} onTempChange={setTemperature} />

      <hr className="w-full my-6 border-slate-100" />

      <BoilerStatus temp={temperature} />

      <button
        onClick={() => setTemperature(20)}
        className="reset w-full text-center mt-4"
      >
        Reset to Default
      </button>
    </div>
  );
}
