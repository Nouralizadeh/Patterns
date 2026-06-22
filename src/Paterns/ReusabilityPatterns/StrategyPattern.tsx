import { useState } from "react";

// ============================================================================
// 1. Define the Strategies (Small, Single-Responsibility Components)
// ============================================================================
function CardPaymentStrategy() {
  return (
    <div className="space-y-3 animate-fadeIn">
      <input
        type="text"
        placeholder="16-Digit Card Number"
        className="input-standard text-left"
        maxLength={16}
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="CVV2"
          className="input-standard text-center w-1/2"
          maxLength={4}
        />
        <input
          type="text"
          placeholder="Expiry (MM/YY)"
          className="input-standard text-center w-1/2"
          maxLength={5}
        />
      </div>
    </div>
  );
}

function WalletStrategy() {
  return (
    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-center animate-fadeIn">
      <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
        Wallet Balance: <span className="font-bold">$245.00</span>
      </p>
      <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500 mt-1">
        Funds will be deducted immediately from your secure digital wallet.
      </p>
    </div>
  );
}

function GatewayStrategy() {
  return (
    <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center animate-fadeIn">
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Direct Secure Bank Gateway Connection
      </p>
      <p className="text-[10px] text-slate-400 mt-1">
        Please ensure your proxy/VPN is disabled before proceeding to checkout.
      </p>
    </div>
  );
}

// ============================================================================
// 2. The Strategy Map (The Dictionary)
// ============================================================================
type PaymentMethod = "CARD" | "WALLET" | "GATEWAY";

const PAYMENT_STRATEGIES: Record<PaymentMethod, () => JSX.Element> = {
  CARD: CardPaymentStrategy,
  WALLET: WalletStrategy,
  GATEWAY: GatewayStrategy,
};

// ============================================================================
// 3. Main Orchestrator Component
// ============================================================================
export default function StrategyPattern() {
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const SelectedStrategyComponent = PAYMENT_STRATEGIES[method];

  const handlePaymentSubmit = () => {
    setPaymentSuccess(true);
    // Auto-hide the message after 3 seconds
    setTimeout(() => setPaymentSuccess(false), 3000);
  };
  return (
    <div className="elevated-container max-w-md">
      <h2 className="title">Select Payment Method 💳</h2>
      <p className="label1 text-xs mb-6">
        Refactoring heavy conditional layout rendering using an object map
        schema.
      </p>

      <div className="w-full space-y-4">
        {/* Step 1: Strategy Selectors */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
          {(Object.keys(PAYMENT_STRATEGIES) as PaymentMethod[]).map((type) => (
            <button
              key={type}
              onClick={() => setMethod(type)}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all m-0 border-none ${
                method === type
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-transparent"
              }`}
            >
              {type === "CARD"
                ? "Credit Card"
                : type === "WALLET"
                  ? "Digital Wallet"
                  : "Bank Gateway"}
            </button>
          ))}
        </div>

        {/* Step 2: Dynamic Render (Clean architectural execution) */}
        <div className="dashed-border-container min-h-[120px] flex flex-col justify-center bg-white dark:bg-slate-900">
          <SelectedStrategyComponent />
        </div>

        {paymentSuccess && (
          <div className="succsess text-xs text-center font-semibold animate-fadeIn">
            🎉 Payment processed successfully via{" "}
            <span className="uppercase">{method}</span>!
          </div>
        )}

        {/* Updated Action Button */}
        <button
          onClick={handlePaymentSubmit}
          className="btn-primary w-full m-0 text-xs py-2"
        >
          {method === "WALLET"
            ? "Confirm & Pay Instantly"
            : "Proceed to Next Step"}
        </button>
      </div>
    </div>
  );
}
