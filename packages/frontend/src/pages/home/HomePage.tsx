import React from "react";
import { Link } from "react-router-dom";
// import Layout from "../../components/layout/Layout"; // Layout wraps at App level
import Header from "../../components/layout/Header"; // Import Header
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const HomePage: React.FC = () => {
  return (
    <>
      <Header title="AI Brainstorm - Home" /> {/* Add Header */}
      <div className="container mx-auto px-4 py-6">
        {" "}
        {/* Add padding consistent with old Layout main area */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to AI Brainstorm
            </h1>
            <p className="text-xl text-gray-600">
              A powerful tool for organizing your ideas and collaborative
              brainstorming sessions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card title="Create Sessions">
              <p className="text-gray-600 mb-4">
                Create brainstorming sessions to organize your ideas. Add a
                title, description, and choose privacy settings.
              </p>
              <Link to="/sessions">
                <Button fullWidth>View Sessions</Button>
              </Link>
            </Card>

            <Card title="Manage Ideas">
              <p className="text-gray-600 mb-4">
                Add, edit, and organize ideas within your sessions. Group
                related ideas into categories.
              </p>
              <Link to="/sessions">
                <Button variant="secondary" fullWidth>
                  Get Started
                </Button>
              </Link>
            </Card>
          </div>

          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to start brainstorming?
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first session and begin organizing your ideas today!
            </p>
            <div className="flex justify-center">
              <Link to="/sessions">
                <Button size="lg">Go to Sessions</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
