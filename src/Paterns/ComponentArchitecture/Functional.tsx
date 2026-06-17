import React, { useState } from "react";

function Functional() {
  return <Counter />;
}

export default Functional;

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="bordered-container">
      <h1 className="title">Counter</h1>
      <p className="text-9xl">{count}</p>
      <div className="flex">
        <button className="btn-accept" onClick={() => setCount((p) => p + 1)}>
          Inc
        </button>
        <button className="btn-denied" onClick={() => setCount((p) => p - 1)}>
          Dec
        </button>
      </div>
    </div>
  );
}
