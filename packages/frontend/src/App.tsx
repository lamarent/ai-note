import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CreateSessionButton } from "./components/CreateSessionButton";
import SessionPage from "./components/SessionPage";

const HomePage: React.FC = () => {
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Brainstorming Sessions</h1>

      <div className="mb-6">
        <CreateSessionButton
          onSessionCreated={() => {
            // Refresh the sessions list
            setLoading(true);
            fetch("/api/sessions")
              .then((res) => res.json())
              .then((data) => {
                setSessions(data);
                setLoading(false);
              })
              .catch((err) => {
                console.error("Error refreshing sessions:", err);
                setLoading(false);
              });
          }}
        />
      </div>

      {loading ? (
        <p className="text-center p-4">Loading sessions...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-center p-4">
          No sessions found. Create your first session!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{session.title}</h2>
              <p className="text-gray-600 mb-4">{session.description}</p>
              <Link
                to={`/sessions/${session.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Session &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <Link to="/" className="text-xl font-bold">
              AI Brainstorm
            </Link>
          </div>
        </header>

        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sessions/:sessionId" element={<SessionPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-200 p-4 text-center text-gray-600">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} AI Brainstorm</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
