import React from "react";
import { useSessionStore } from "../stores/sessionStore";
import { CreateSession } from "@ai-brainstorm/types";

export const CreateSessionButton: React.FC = () => {
  const createSession = useSessionStore((state) => state.createSession);
  const isLoading = useSessionStore((state) => state.isLoading);
  const error = useSessionStore((state) => state.error);

  const handleCreateSession = async () => {
    // TODO: Get title from user input (e.g., a modal or form)
    // TODO: Refine ownerId handling once authentication is implemented.
    //       The backend currently overwrites ownerId, but the type requires it.
    const sessionData: CreateSession = {
      title: `New Session ${Date.now()}`,
      ownerId: "00000000-0000-0000-0000-000000000000", // Valid UUID placeholder
      isPublic: false, // Required by type, defaults to false
    };
    await createSession(sessionData);
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={handleCreateSession}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create New Session"}
      </button>
      {error && <p className="text-error mt-2">Error: {error}</p>}
    </div>
  );
};
