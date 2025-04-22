import React from "react";

export interface TimelineItem {
  content: React.ReactNode;
  variant?: "completed" | "pending";
}

interface TimelineProps {
  items: TimelineItem[];
}

const doneIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="text-primary h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const pendingIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <ul className="timeline timeline-vertical">
      {items.map((item, index) => {
        const position = index % 2 === 0 ? "start" : "end";
        const hrClass = item.variant === "completed" ? "bg-primary" : "";
        return (
          <li key={index}>
            {index > 0 && <hr className={hrClass} />}
            {position === "start" && (
              <div className="timeline-start timeline-box">{item.content}</div>
            )}
            <div className="timeline-middle">
              {item.variant === "completed" ? doneIcon : pendingIcon}
            </div>
            {position === "end" && (
              <div className="timeline-end timeline-box">{item.content}</div>
            )}
            {index < items.length - 1 && <hr className={hrClass} />}
          </li>
        );
      })}
    </ul>
  );
};

export default Timeline;
