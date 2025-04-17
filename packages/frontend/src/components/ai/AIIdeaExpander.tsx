import React, { useState } from "react";
import { useExpandIdea } from "../../hooks/useAI";
import ApiKeyWarning from "../common/ApiKeyWarning";
import { Idea } from "@ai-brainstorm/types";

interface AIIdeaExpanderProps {
  sessionId: string;
  idea: Idea;
  onIdeasGenerated?: (ideas: Idea[]) => void;
}

const AIIdeaExpander: React.FC<AIIdeaExpanderProps> = ({
  sessionId,
  idea,
  onIdeasGenerated,
}) => {
  const [depth, setDepth] = useState(1);

  const expandIdeaMutation = useExpandIdea({
    onSuccess: (ideas) => {
      console.log("Expanded ideas:", ideas);
      if (onIdeasGenerated) {
        onIdeasGenerated(ideas);
      }
    },
    onError: (error) => {
      console.error("Error expanding idea:", error);
    },
  });

  const handleExpand = () => {
    expandIdeaMutation.mutate({
      ideaId: idea.id,
      sessionId,
      idea: idea.content,
      depth,
    });
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">AI Idea Expansion</h2>

        <ApiKeyWarning message="To expand ideas with AI, you need to provide an API key." />

        <div className="p-4 bg-base-300 rounded-lg mb-4">
          <p className="font-medium">Selected Idea:</p>
          <p className="mt-1">{idea.content}</p>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Expansion Depth</span>
          </label>
          <select
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="select select-bordered w-full max-w-xs"
          >
            <option value={1}>Light (related ideas)</option>
            <option value={2}>Medium (deeper exploration)</option>
            <option value={3}>Deep (comprehensive exploration)</option>
          </select>
          <label className="label">
            <span className="label-text-alt">
              Higher depth generates more detailed branches
            </span>
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleExpand}
            className={`btn btn-primary ${expandIdeaMutation.isPending ? "loading" : ""}`}
            disabled={expandIdeaMutation.isPending}
          >
            {expandIdeaMutation.isPending ? "Expanding..." : "Expand This Idea"}
          </button>
        </div>

        {expandIdeaMutation.isError && (
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
              <span>Error: {expandIdeaMutation.error.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIIdeaExpander;
