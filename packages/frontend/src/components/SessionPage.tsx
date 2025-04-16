import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IdeaList from "./IdeaList";
import AddIdeaForm from "./AddIdeaForm";

interface Session {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError("Session ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Session not found");
          }
          throw new Error(`Failed to fetch session: ${response.statusText}`);
        }

        const data = await response.json();
        setSession(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch session"
        );
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleIdeaAdded = () => {
    // Trigger a refresh of the idea list
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center p-8">Loading session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <button
          onClick={handleBackClick}
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back to sessions
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center p-8">Session not found</div>
        <button
          onClick={handleBackClick}
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back to sessions
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button
        onClick={handleBackClick}
        className="text-blue-500 hover:text-blue-700 mb-4"
      >
        &larr; Back to sessions
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
        <p className="text-gray-600 mb-4">{session.description}</p>
        <div className="text-sm text-gray-500">
          Created on {new Date(session.createdAt).toLocaleString()}
        </div>
      </div>

      <AddIdeaForm sessionId={session.id} onIdeaAdded={handleIdeaAdded} />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ideas</h2>
        <IdeaList sessionId={session.id} key={refreshTrigger} />
      </div>
    </div>
  );
};

export default SessionPage;
