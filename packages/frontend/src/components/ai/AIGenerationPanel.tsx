import React, { useState } from "react";
import { useGenerateIdeas } from "../../hooks/useAI";
import ApiKeyWarning from "../common/ApiKeyWarning";
import { Idea } from "@ai-brainstorm/types";

interface AIGenerationPanelProps {
  sessionId: string;
  onIdeasGenerated?: (ideas: Idea[]) => void;
}

const BRAINSTORMING_TECHNIQUES = [
  { id: "general", name: "General" },
  { id: "scamper", name: "SCAMPER" },
  { id: "lateralThinking", name: "Lateral Thinking" },
  { id: "sixHats", name: "Six Thinking Hats" },
  { id: "5w1h", name: "5W1H" },
];

const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  sessionId,
  onIdeasGenerated,
}) => {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [technique, setTechnique] = useState("general");
  const [count, setCount] = useState(3);

  const generateIdeasMutation = useGenerateIdeas({
    onSuccess: (ideas) => {
      console.log("Generated ideas:", ideas);
      if (onIdeasGenerated) {
        onIdeasGenerated(ideas);
      }
      setPrompt("");
      setContext("");
    },
    onError: (error) => {
      console.error("Error generating ideas:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    generateIdeasMutation.mutate({
      sessionId,
      prompt,
      context: context || undefined,
      technique,
      count,
    });
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">AI Idea Generation</h2>

        <ApiKeyWarning message="To generate AI-powered ideas, you need to provide an API key." />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Prompt</span>
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What should the AI brainstorm about?"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Additional Context (Optional)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Any additional information or constraints..."
              className="textarea textarea-bordered h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Technique</span>
              </label>
              <select
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                className="select select-bordered w-full"
              >
                {BRAINSTORMING_TECHNIQUES.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Number of Ideas</span>
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="select select-bordered w-full"
              >
                {[1, 2, 3, 5, 7, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`btn btn-primary ${generateIdeasMutation.isPending ? "loading" : ""}`}
              disabled={!prompt.trim() || generateIdeasMutation.isPending}
            >
              {generateIdeasMutation.isPending
                ? "Generating..."
                : "Generate Ideas"}
            </button>
          </div>
        </form>

        {generateIdeasMutation.isError && (
          <div className="alert alert-error mt-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {generateIdeasMutation.error.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerationPanel;
