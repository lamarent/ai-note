import React, { useState } from "react";
import { Idea } from "@ai-brainstorm/types";
import AIGenerationPanel from "./AIGenerationPanel";
import AIIdeaExpander from "./AIIdeaExpander";
import AIAlternativePerspectives from "./AIAlternativePerspectives";
import AIIdeaRefinement from "./AIIdeaRefinement";

interface AIToolsPanelProps {
  sessionId: string;
  selectedIdea?: Idea | null;
  onIdeasGenerated?: (ideas: Idea[]) => void;
  onIdeaRefined?: (idea: Idea) => void;
}

type TabType = "generate" | "expand" | "perspectives" | "refine";

const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  sessionId,
  selectedIdea,
  onIdeasGenerated,
  onIdeaRefined,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("generate");

  // Handle changing tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Determine if idea-specific tools should be disabled
  const ideaToolsDisabled = !selectedIdea;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">AI Tools</h2>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-4">
          <button
            className={`tab ${activeTab === "generate" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("generate")}
          >
            Generate Ideas
          </button>
          <button
            className={`tab ${activeTab === "expand" ? "tab-active" : ""} ${
              ideaToolsDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !ideaToolsDisabled && handleTabChange("expand")}
            disabled={ideaToolsDisabled}
          >
            Expand Idea
          </button>
          <button
            className={`tab ${activeTab === "perspectives" ? "tab-active" : ""} ${
              ideaToolsDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              !ideaToolsDisabled && handleTabChange("perspectives")
            }
            disabled={ideaToolsDisabled}
          >
            New Perspectives
          </button>
          <button
            className={`tab ${activeTab === "refine" ? "tab-active" : ""} ${
              ideaToolsDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !ideaToolsDisabled && handleTabChange("refine")}
            disabled={ideaToolsDisabled}
          >
            Refine Idea
          </button>
        </div>

        {/* No idea selected warning for idea-specific tabs */}
        {ideaToolsDisabled && activeTab !== "generate" && (
          <div className="alert alert-info mb-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Please select an idea first to use this tool.</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === "generate" && (
            <AIGenerationPanel
              sessionId={sessionId}
              onIdeasGenerated={onIdeasGenerated}
            />
          )}

          {activeTab === "expand" && selectedIdea && (
            <AIIdeaExpander
              sessionId={sessionId}
              idea={selectedIdea}
              onIdeasGenerated={onIdeasGenerated}
            />
          )}

          {activeTab === "perspectives" && selectedIdea && (
            <AIAlternativePerspectives
              sessionId={sessionId}
              idea={selectedIdea}
              onIdeasGenerated={onIdeasGenerated}
            />
          )}

          {activeTab === "refine" && selectedIdea && (
            <AIIdeaRefinement
              sessionId={sessionId}
              idea={selectedIdea}
              onIdeaRefined={onIdeaRefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIToolsPanel;
