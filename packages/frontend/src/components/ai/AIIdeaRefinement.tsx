import React, { useState } from "react";
import { useRefineIdea } from "../../hooks/useAI";
import ApiKeyWarning from "../common/ApiKeyWarning";
import { Idea } from "@ai-brainstorm/types";

interface AIIdeaRefinementProps {
  sessionId: string;
  idea: Idea;
  onIdeaRefined?: (idea: Idea) => void;
}

const REFINEMENT_PROMPTS = [
  "Make it more specific and actionable",
  "Improve clarity and conciseness",
  "Add more creative elements",
  "Make it more practical and feasible",
  "Consider potential challenges and address them",
  "Make it more innovative and unique",
  "Simplify the concept for easier implementation",
];

const AIIdeaRefinement: React.FC<AIIdeaRefinementProps> = ({
  sessionId,
  idea,
  onIdeaRefined,
}) => {
  const [instructions, setInstructions] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const refineIdeaMutation = useRefineIdea({
    onSuccess: (refinedIdea) => {
      console.log("Refined idea:", refinedIdea);
      if (onIdeaRefined) {
        onIdeaRefined(refinedIdea);
      }
      setInstructions("");
      setSelectedPrompt("");
    },
    onError: (error) => {
      console.error("Error refining idea:", error);
    },
  });

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setInstructions(prompt);
  };

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) return;

    refineIdeaMutation.mutate({
      ideaId: idea.id,
      sessionId,
      idea: idea.content,
      instructions,
    });
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Refine This Idea</h2>

        <ApiKeyWarning message="To refine ideas with AI, you need to provide an API key." />

        <div className="p-4 bg-base-300 rounded-lg mb-4">
          <p className="font-medium">Selected Idea:</p>
          <p className="mt-1">{idea.content}</p>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Refinement Prompts:</p>
          <div className="flex flex-wrap gap-2">
            {REFINEMENT_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className={`btn btn-sm ${
                  selectedPrompt === prompt ? "btn-accent" : "btn-outline"
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRefine}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Refinement Instructions</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="How would you like to improve this idea?"
              className="textarea textarea-bordered h-32"
              required
            />
            <label className="label">
              <span className="label-text-alt">
                Be specific about how the idea should be refined
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`btn btn-primary ${
                refineIdeaMutation.isPending ? "loading" : ""
              }`}
              disabled={!instructions.trim() || refineIdeaMutation.isPending}
            >
              {refineIdeaMutation.isPending ? "Refining..." : "Refine Idea"}
            </button>
          </div>
        </form>

        {refineIdeaMutation.isError && (
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
              <span>Error: {refineIdeaMutation.error.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIIdeaRefinement;
