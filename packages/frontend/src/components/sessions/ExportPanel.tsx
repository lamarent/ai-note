import React, { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import {
  exportSessionAsMarkdown,
  exportSessionAsJSON,
  downloadFile,
  copyToClipboard,
} from "../../utils/exportUtils";
import { Session, Idea } from "@ai-brainstorm/types";

interface ExportPanelProps {
  session: Session;
  ideas: Idea[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ session, ideas }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Show success message for a short period
  const showTemporarySuccess = (message: string) => {
    setCopySuccess(message);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  // Handle exporting as Markdown
  const handleExportMarkdown = () => {
    const markdown = exportSessionAsMarkdown(session, ideas);
    const fileName = `${session.title.replace(/\s+/g, "-").toLowerCase()}-${
      session.id
    }.md`;

    downloadFile(markdown, fileName, "text/markdown");
    showTemporarySuccess("Markdown file downloaded");
  };

  // Handle exporting as JSON
  const handleExportJSON = () => {
    const json = exportSessionAsJSON(session, ideas);
    const fileName = `${session.title.replace(/\s+/g, "-").toLowerCase()}-${
      session.id
    }.json`;

    downloadFile(json, fileName, "application/json");
    showTemporarySuccess("JSON file downloaded");
  };

  // Handle copying to clipboard
  const handleCopyToClipboard = async () => {
    const markdown = exportSessionAsMarkdown(session, ideas);
    const success = await copyToClipboard(markdown);

    if (success) {
      showTemporarySuccess("Copied to clipboard");
    } else {
      setCopySuccess("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium mb-4">Export Options</h3>

        <div className="space-y-4">
          <div>
            <p className="mb-2">
              Export your session and ideas for use in other applications.
            </p>

            {copySuccess && (
              <div className="alert alert-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{copySuccess}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="secondary"
              onClick={handleExportMarkdown}
              className="w-full"
            >
              Export as Markdown
            </Button>

            <Button
              variant="secondary"
              onClick={handleExportJSON}
              className="w-full"
            >
              Export as JSON
            </Button>

            <Button
              variant="secondary"
              onClick={handleCopyToClipboard}
              className="w-full"
            >
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-md font-medium mb-2">Export Preview</h3>
        <div className="bg-base-200 p-4 rounded-md text-sm font-mono overflow-x-auto max-h-60 overflow-y-auto">
          <pre>
            {exportSessionAsMarkdown(session, ideas).substring(0, 500)}...
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default ExportPanel;
