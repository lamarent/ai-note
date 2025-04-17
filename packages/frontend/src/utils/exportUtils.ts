import { Session, Idea } from "@ai-brainstorm/types";

/**
 * Exports a session as a formatted Markdown document
 */
export const exportSessionAsMarkdown = (
  session: Session,
  ideas: Idea[]
): string => {
  const now = new Date().toLocaleString();

  // Format the main header
  let markdown = `# ${session.title}\n\n`;

  // Add description if available
  if (session.description) {
    markdown += `${session.description}\n\n`;
  }

  // Add metadata
  markdown += `*Exported on: ${now}*\n\n`;
  markdown += `---\n\n`;

  // Group ideas by category if possible
  const categorizedIdeas: Record<string, Idea[]> = {};

  ideas.forEach((idea) => {
    const category = idea.categoryId || "Uncategorized";
    if (!categorizedIdeas[category]) {
      categorizedIdeas[category] = [];
    }
    categorizedIdeas[category].push(idea);
  });

  // Add ideas
  markdown += `## Ideas (${ideas.length})\n\n`;

  // Output each category and its ideas
  Object.entries(categorizedIdeas).forEach(([category, categoryIdeas]) => {
    markdown += `### ${category}\n\n`;

    categoryIdeas.forEach((idea) => {
      // Use bullet points for ideas
      markdown += `- ${idea.content}\n`;

      // Add AI generated note if applicable
      if (idea.isAiGenerated) {
        markdown += `  *(AI generated)*\n`;
      }

      markdown += "\n";
    });
  });

  return markdown;
};

/**
 * Exports a session as JSON
 */
export const exportSessionAsJSON = (
  session: Session,
  ideas: Idea[]
): string => {
  const exportObject = {
    session: {
      ...session,
      exportDate: new Date().toISOString(),
    },
    ideas,
  };

  return JSON.stringify(exportObject, null, 2);
};

/**
 * Creates a downloadable file from content
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  // Create a blob with the content
  const blob = new Blob([content], { type: mimeType });

  // Create a download URL for the blob
  const url = URL.createObjectURL(blob);

  // Create and configure a temporary anchor element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @returns Promise that resolves when the text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
};
