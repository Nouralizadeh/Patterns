import { useRef, useState, useCallback } from "react";

export function CustomHook() {
  const emailRef = useRef<HTMLInputElement>(null);

  const { isLoading, error, success, submitForm } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      submitForm(emailRef.current.value);
    }
  };

  return (
    <div className="borderd-elevated">
      <h2 className="title">Join the Newsletter 🚀</h2>

      <form onSubmit={handleSubmit} className="items-center space-y-4">
        <div>
          <input
            ref={emailRef}
            type="text"
            placeholder="shadi@example.com"
            disabled={isLoading}
            className="input-standard"
          />
          {error && <p className="error">{error}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Sending..." : "Subscribe Now"}
        </button>
      </form>

      {success && (
        <div className="succsess">Welcome aboard! Check your email.</div>
      )}
    </div>
  );
}

//-------------------------------------
//------------------Hook---------------
//-------------------------------------

// --- Types ---
interface SignupState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// --- The Hook ---
export function useSignup() {
  const [state, setState] = useState<SignupState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const submitForm = useCallback(async (email: string) => {
    // Validation Simple
    if (!email.includes("@")) {
      setState((prev) => ({ ...prev, error: "Invalid email" }));
      return;
    }

    setState({ isLoading: true, error: null, success: false });

    try {
      // Simulation API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setState({ isLoading: false, error: null, success: true });
    } catch (err) {
      setState({ isLoading: false, error: "Error occured!", success: false });
    }
  }, []);

  return { ...state, submitForm };
}
