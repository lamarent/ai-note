import React, { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../forms/Input";
import { useGenerateIdeas, useExpandIdea } from "../../hooks";
import { Idea } from "@ai-brainstorm/types";

// Define the available brainstorming techniques
const BRAINSTORMING_TECHNIQUES = [
  { id: "general", name: "General Brainstorming" },
  { id: "scamper", name: "SCAMPER" },
  { id: "lateralThinking", name: "Lateral Thinking" },
  { id: "sixHats", name: "Six Thinking Hats" },
  { id: "5w1h", name: "5W1H Questions" },
];

interface AIGenerationPanelProps {
  sessionId: string;
  sessionTitle: string;
  selectedIdea?: Idea;
}

const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  sessionId,
  sessionTitle,
  selectedIdea,
}) => {
  // State for the generation form
  const [prompt, setPrompt] = useState("");
  const [technique, setTechnique] = useState("general");
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<"generate" | "expand">("generate");

  // Mutations for AI generation
  const generateIdeas = useGenerateIdeas({
    onSuccess: () => {
      setPrompt("");
    },
  });

  const expandIdea = useExpandIdea({
    onSuccess: () => {
      // Reset or update UI as needed after success
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "generate") {
      generateIdeas.mutate({
        sessionId,
        prompt,
        technique,
        count,
      });
    } else if (mode === "expand" && selectedIdea) {
      expandIdea.mutate({
        sessionId,
        ideaId: selectedIdea.id,
        depth: 1,
        idea: selectedIdea.content,
      });
    }
  };

  // Determine if form can be submitted
  const canSubmit = mode === "generate" ? !!prompt.trim() : !!selectedIdea;

  // Check if currently loading
  const isLoading = generateIdeas.isPending || expandIdea.isPending;

  // Handle any errors
  const error = generateIdeas.error?.message || expandIdea.error?.message;

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium mb-4">AI-Powered Idea Generation</h3>

        {/* Mode selection */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={mode === "generate" ? "primary" : "secondary"}
            onClick={() => setMode("generate")}
            size="sm"
          >
            Generate New Ideas
          </Button>
          <Button
            variant={mode === "expand" ? "primary" : "secondary"}
            onClick={() => setMode("expand")}
            size="sm"
            disabled={!selectedIdea}
          >
            Expand Selected Idea
          </Button>
        </div>

        {/* Generation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "generate" && (
            <>
              <Input
                label="Prompt"
                placeholder={`What ideas do you want for "${sessionTitle}"?`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Technique
                  </label>
                  <select
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    {BRAINSTORMING_TECHNIQUES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Ideas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </>
          )}

          {mode === "expand" && (
            <div className="bg-base-200 p-4 rounded-md">
              {selectedIdea ? (
                <div>
                  <p className="font-medium mb-2">Expanding idea:</p>
                  <p>{selectedIdea.content}</p>
                </div>
              ) : (
                <p className="italic">Select an idea to expand</p>
              )}
            </div>
          )}

          {error && <div className="text-error text-sm">{error}</div>}

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!canSubmit || isLoading}
            >
              {mode === "generate" ? "Generate Ideas" : "Expand Idea"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Description of techniques */}
      <Card>
        <h3 className="text-md font-medium mb-2">
          About Brainstorming Techniques
        </h3>
        <div className="text-sm opacity-70">
          <p className="mb-2">
            <strong>General Brainstorming:</strong> Open-ended idea generation
            without specific constraints.
          </p>
          <p className="mb-2">
            <strong>SCAMPER:</strong> Substitute, Combine, Adapt, Modify, Put to
            another use, Eliminate, Reverse.
          </p>
          <p className="mb-2">
            <strong>Lateral Thinking:</strong> Approach problems from unexpected
            angles to generate creative solutions.
          </p>
          <p className="mb-2">
            <strong>Six Thinking Hats:</strong> Look at problems from different
            perspectives (facts, emotions, caution, etc).
          </p>
          <p>
            <strong>5W1H Questions:</strong> Who, What, When, Where, Why, and
            How to explore a topic thoroughly.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIGenerationPanel;
