import React, { useState } from "react";
import { useAlternativePerspectives } from "../../hooks/useAI";
import ApiKeyWarning from "../common/ApiKeyWarning";
import { Idea } from "@ai-brainstorm/types";

interface AIAlternativePerspectivesProps {
  sessionId: string;
  idea: Idea;
  onIdeasGenerated?: (ideas: Idea[]) => void;
}

const AIAlternativePerspectives: React.FC<AIAlternativePerspectivesProps> = ({
  sessionId,
  idea,
  onIdeasGenerated,
}) => {
  const [count, setCount] = useState(3);

  const alternativePerspectivesMutation = useAlternativePerspectives({
    onSuccess: (ideas) => {
      console.log("Generated perspectives:", ideas);
      if (onIdeasGenerated) {
        onIdeasGenerated(ideas);
      }
    },
    onError: (error) => {
      console.error("Error generating perspectives:", error);
    },
  });

  const handleGeneratePerspectives = () => {
    alternativePerspectivesMutation.mutate({
      ideaId: idea.id,
      sessionId,
      idea: idea.content,
      count,
    });
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Alternative Perspectives</h2>

        <ApiKeyWarning message="To generate alternative perspectives, you need to provide an API key." />

        <div className="p-4 bg-base-300 rounded-lg mb-4">
          <p className="font-medium">Selected Idea:</p>
          <p className="mt-1">{idea.content}</p>
        </div>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Number of Perspectives</span>
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="select select-bordered w-full max-w-xs"
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt">
              How many different viewpoints to generate
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={handleGeneratePerspectives}
            className={`btn btn-primary ${alternativePerspectivesMutation.isPending ? "loading" : ""}`}
            disabled={alternativePerspectivesMutation.isPending}
          >
            {alternativePerspectivesMutation.isPending
              ? "Generating..."
              : "Generate Alternative Perspectives"}
          </button>
        </div>

        {alternativePerspectivesMutation.isError && (
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
              <span>
                Error: {alternativePerspectivesMutation.error.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAlternativePerspectives;
