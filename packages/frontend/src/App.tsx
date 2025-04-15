import { useState } from "react";
import { CreateSessionButton } from "./components/CreateSessionButton";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">AI Brainstorm</h1>
      <div className="mb-4">
        <CreateSessionButton />
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Hello Vite + React!</h2>
          <p>Testing Tailwind and DaisyUI setup.</p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>
          </div>
          <p className="mt-4 text-sm text-base-content/70">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
      <p className="read-the-docs mt-8 text-base-content/50">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
