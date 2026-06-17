import { useState } from "react";

export default function HOC() {
  const EnhancedCounter = withCounter(CounterButton);

  return (
    <div className="bordered-container">
      <h2 className="title2">HOC Example</h2>

      <EnhancedCounter />
    </div>
  );
}

/* -------------------------------------------------------
   HOC: یک تابع که کامپوننت را می‌گیرد و کامپوننت جدید می‌سازد
-------------------------------------------------------- */

type InjectedProps = {
  count: number;
  increase: () => void;
  decrease: () => void;
};

function withCounter<P>(Wrapped: React.ComponentType<P & InjectedProps>) {
  return function HOCComponent(props: P) {
    const [count, setCount] = useState<number>(0);

    const increase = () => setCount((c) => c + 1);
    const decrease = () => setCount((c) => c - 1);

    return (
      <Wrapped
        {...props}
        count={count}
        increase={increase}
        decrease={decrease}
      />
    );
  };
}

/* -------------------------------------------------------
   Presenter Component که قرار است توسط HOC تقویت شود
-------------------------------------------------------- */

function CounterButton({ count, increase, decrease }: InjectedProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-9xl">{count}</p>

      <div className="flex gap-3">
        <button onClick={decrease} className="btn-denied">
          - Decrease
        </button>

        <button onClick={increase} className="btn-accept">
          + Increase
        </button>
      </div>
    </div>
  );
}
