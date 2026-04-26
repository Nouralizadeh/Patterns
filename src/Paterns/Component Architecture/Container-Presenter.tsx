import { useState } from "react";

export default function ContainerPresenter() {
  return (
    <div className="main-container">
      <CounterContainer />
    </div>
  );
}

/* ---------------------- Container ---------------------- */

function CounterContainer() {
  const [count, setCount] = useState<number>(0);

  const increase = () => setCount((c) => c + 1);
  const decrease = () => setCount((c) => c - 1);

  return (
    <CounterPresenter
      count={count}
      onIncrease={increase}
      onDecrease={decrease}
    />
  );
}

/* ---------------------- Presenter ---------------------- */

type CounterPresenterProps = {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

function CounterPresenter({
  count,
  onIncrease,
  onDecrease,
}: CounterPresenterProps) {
  return (
    <div className="items-center flex flex-col">
      <h1 className="title">Counter</h1>
      <p className="text-9xl">{count}</p>
      <div className="flex">
        <button className="btn-accept" onClick={onIncrease}>
          Inc
        </button>
        <button className="btn-denied" onClick={onDecrease}>
          Dec
        </button>
      </div>
    </div>
  );
}
