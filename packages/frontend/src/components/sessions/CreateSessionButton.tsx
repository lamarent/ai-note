import React from "react";
import { useSessionStore } from "../stores/sessionStore";
import { CreateSession } from "@ai-brainstorm/types";

interface CreateSessionButtonProps {
  onSessionCreated?: () => void;
}

export const CreateSessionButton: React.FC<CreateSessionButtonProps> = ({
  onSessionCreated,
}) => {
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

    const success = await createSession(sessionData);

    // Call the callback if provided and the session was created successfully
    if (success && onSessionCreated) {
      onSessionCreated();
    }
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
