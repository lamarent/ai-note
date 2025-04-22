import React, { useState, useEffect } from "react";
import Input from "../forms/Input";
import Button from "../common/Button";
import { useGenerateIdeas, useCreateSession, useCreateIdea } from "../../hooks";
import { Idea } from "@ai-brainstorm/types";
import { useNavigate } from "react-router-dom";
import IdeaCard from "../ideas/IdeaCard";

const NewSessionStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [isSavingIdeas, setIsSavingIdeas] = useState(false);
  const navigate = useNavigate();

  // Hooks for creating session and generating AI ideas
  const createSession = useCreateSession();
  const generateIdeas = useGenerateIdeas({
    onSuccess: (data) => setGeneratedIdeas(data),
  });
  const createIdea = useCreateIdea();

  // When entering step 2, trigger AI idea generation
  useEffect(() => {
    if (step === 2 && sessionId) {
      generateIdeas.mutate({ sessionId, prompt: topic, count: 5 });
    }
  }, [step, sessionId, topic, generateIdeas]);

  // Create session on first step completion
  const handleNextFromTopic = async () => {
    const ownerId = "00000000-0000-0000-0000-000000000000";
    const newSession = await createSession.mutateAsync({
      title: topic,
      ownerId,
      isPublic: false,
    });
    setSessionId(newSession.id);
    setStep(2);
  };

  // Save selected AI ideas as actual ideas then navigate
  const handleConfirm = async () => {
    if (!sessionId) return;
    setIsSavingIdeas(true);
    for (const idx of Array.from(selectedIndexes)) {
      const idea = generatedIdeas[idx];
      await createIdea.mutateAsync({
        sessionId,
        content: idea.content,
        isAiGenerated: true,
      });
    }
    setIsSavingIdeas(false);
    navigate(`/sessions/${sessionId}`);
  };

  // Toggle selection of AI-generated ideas
  const handleToggleIdea = (idx: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="What would you like to brainstorm?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter brainstorming topic"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleNextFromTopic}
                disabled={!topic || createSession.isPending}
                isLoading={createSession.isPending}
              >
                Next
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="steps">
              <div className="step step-primary">Topic</div>
              <div className="step step-primary">Initial Ideas</div>
              <div className="step">Confirm</div>
            </div>
            <p className="mt-4">
              Generating ideas for <strong>{topic}</strong>...
            </p>
            {generateIdeas.isPending && (
              <div className="text-center py-4">Loading ideas...</div>
            )}
            {!generateIdeas.isPending && generatedIdeas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {generatedIdeas.map((idea, idx) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onClick={() => handleToggleIdea(idx)}
                    isSelectable
                  />
                ))}
              </div>
            )}
            {generateIdeas.isError && (
              <div className="text-red-600">
                Error: {generateIdeas.error?.message}
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={generateIdeas.isPending}
              >
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="steps">
              <div className="step step-primary">Topic</div>
              <div className="step step-primary">Initial Ideas</div>
              <div className="step step-primary">Confirm</div>
            </div>
            <h2 className="text-xl font-bold mt-4">Review and Confirm</h2>
            <p>
              Session titled: <strong>{topic}</strong>
            </p>
            <h3 className="font-medium">Selected Ideas:</h3>
            <ul className="list-disc list-inside">
              {Array.from(selectedIndexes).map((idx) => (
                <li key={idx}>{generatedIdeas[idx]?.content}</li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={isSavingIdeas}>
                {isSavingIdeas ? "Saving..." : "Create Session"}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
};

export default NewSessionStepper;
