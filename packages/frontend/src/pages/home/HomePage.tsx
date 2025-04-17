import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Layout from "../../components/layout/Layout"; // Layout wraps at App level
// import Header from "../../components/layout/Header"; // Removed unused Header
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

// Mock data for recent sessions - replace with actual API calls later
const mockRecentSessions = [
  {
    id: "1",
    title: "Product Roadmap 2023",
    updatedAt: "2023-08-15",
    ideaCount: 12,
  },
  {
    id: "2",
    title: "Marketing Campaign Brainstorm",
    updatedAt: "2023-08-10",
    ideaCount: 8,
  },
  {
    id: "3",
    title: "App Feature Ideas",
    updatedAt: "2023-08-05",
    ideaCount: 15,
  },
];

const HomePage: React.FC = () => {
  const [recentSessions /* setRecentSessions */] = useState(mockRecentSessions); // Removed unused setRecentSessions
  const [
    ,/* isLoading */
    /* setIsLoading */
  ] = useState(false); // Removed unused isLoading and setIsLoading

  // Here you would fetch actual sessions from API
  useEffect(() => {
    // Future implementation:
    // const fetchRecentSessions = async () => {
    //   setIsLoading(true); // Keep this if needed for future fetch logic
    //   try {
    //     const response = await fetch('/api/v1/sessions?limit=3&sort=updatedAt');
    //     const data = await response.json();
    //     setRecentSessions(data.sessions); // Keep this if needed for future fetch logic
    //   } catch (error) {
    //     console.error('Failed to fetch recent sessions:', error);
    //   } finally {
    //     setIsLoading(false); // Keep this if needed for future fetch logic
    //   }
    // };
    //
    // fetchRecentSessions();
  }, []);

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
              <Link to="/sessions/new">
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

            {/* Change condition to check recentSessions directly */}
            {recentSessions.length > 0 ? (
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
                    <div className="text-sm  mb-4">
                      {session.ideaCount} ideas
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
                <Link to="/sessions/new">
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
              <Link to="/sessions/new">
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
