import React from "react";
import { Link } from "react-router-dom";
// import Layout from "../../components/layout/Layout"; // Layout wraps at App level
// import Header from "../../components/layout/Header"; // Removed unused Header
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useGetSessions } from "../../hooks/useSessions";
import LoadingFallback from "../../components/common/LoadingFallback";

// Removed mock data; using live API

const HomePage: React.FC = () => {
  const { data: sessions = [], isLoading, isError, error } = useGetSessions();
  const recentSessions = React.useMemo(
    () =>
      [...sessions]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3),
    [sessions]
  );

  // Use React Query to fetch sessions

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {" "}
        {/* Add padding consistent with old Layout main area */}
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold  mb-4">
              Welcome to AI Brainstorm
            </h1>
            <p className="text-xl  mb-6">
              A powerful tool for organizing your ideas and enhancing creative
              thinking with AI
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/sessions">
                <Button size="lg" variant="primary">
                  Create New Session
                </Button>
              </Link>
              <Link to="/sessions">
                <Button size="lg" variant="secondary">
                  Browse Sessions
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card title="Create & Organize">
              <p className=" mb-4">
                Create brainstorming sessions with customizable titles and
                descriptions. Organize your ideas into categories.
              </p>
            </Card>

            <Card title="AI-Powered Suggestions">
              <p className=" mb-4">
                Leverage AI to generate fresh ideas, expand on existing
                concepts, or explore alternative perspectives.
              </p>
            </Card>

            <Card title="Export & Share">
              <p className=" mb-4">
                Export your brainstorming sessions in various formats like
                Markdown or JSON for easy sharing and collaboration.
              </p>
            </Card>
          </div>

          {/* Recent Sessions Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  ">Recent Sessions</h2>
              <Link to="/sessions">
                <Button variant="text">View All</Button>
              </Link>
            </div>

            {isLoading ? (
              <LoadingFallback />
            ) : isError ? (
              <Card className="bg-red-50 border border-red-200 mb-6">
                <div className="text-red-600">
                  <p>
                    Error loading sessions: {error?.message || "Unknown error"}
                  </p>
                </div>
              </Card>
            ) : recentSessions.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {recentSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2 truncate">
                      {session.title}
                    </h3>
                    <div className="text-sm  mb-3">
                      Last updated:{" "}
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                    <Link to={`/sessions/${session.id}`}>
                      <Button fullWidth variant="secondary">
                        Open Session
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <p className=" mb-4">You don't have any sessions yet.</p>
                <Link to="/sessions">
                  <Button>Create Your First Session</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Get Started CTA */}
          <Card className="text-center p-8 bg-base-200">
            <h2 className="text-2xl font-bold  mb-4">
              Ready to boost your creativity?
            </h2>
            <p className=" mb-6">
              Start a new brainstorming session and tap into the power of
              AI-assisted ideation today!
            </p>
            <div className="flex justify-center">
              <Link to="/sessions">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
