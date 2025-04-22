import React from "react";
import Timeline, { TimelineItem } from "../../components/common/Timeline";

const RoadmapPage: React.FC = () => {
  const timelineItems: TimelineItem[] = [
    { content: "Brainstorming Session Management", variant: "completed" },
    { content: "Idea Management", variant: "completed" },
    { content: "AI-Powered Idea Generation", variant: "completed" },
    { content: "Export and Sharing", variant: "completed" },
    { content: "User Interface", variant: "completed" },
    { content: "Authentication and User Management", variant: "pending" },
    { content: "Collaboration", variant: "pending" },
    { content: "Advanced AI Features", variant: "pending" },
    { content: "Advanced Visualization", variant: "pending" },
    { content: "Integration", variant: "pending" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Roadmap</h1>
      <Timeline items={timelineItems} />
    </div>
  );
};

export default RoadmapPage;
