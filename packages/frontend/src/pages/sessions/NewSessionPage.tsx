import React from "react";
import NewSessionStepper from "../../components/sessions/NewSessionStepper";

const NewSessionPage: React.FC = () => (
  <div className="container mx-auto px-4 py-6">
    <h1 className="text-3xl font-bold mb-4">Create New Session</h1>
    <NewSessionStepper />
  </div>
);

export default NewSessionPage;
