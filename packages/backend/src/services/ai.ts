import { Idea, CreateIdea } from "@ai-brainstorm/types";

interface AIServiceOptions {
  apiKey: string;
  apiUrl: string;
  model?: string;
}

interface GenerateIdeasParams {
  sessionId: string;
  prompt: string;
  context?: string;
  technique?: string;
  count?: number;
}

interface ExpandIdeaParams {
  ideaId: string;
  sessionId: string;
  idea: string;
  depth?: number;
}

interface AlternativePerspectivesParams {
  ideaId: string;
  sessionId: string;
  idea: string;
  count?: number;
}

interface RefineIdeaParams {
  ideaId: string;
  sessionId: string;
  idea: string;
  instructions: string;
}

// Structure for AI-generated idea that includes a description field
interface AIGeneratedIdeaResult {
  content: string;
  description: string;
  position?: { x: number; y: number };
  categoryId?: string;
}

export class AIService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(options: AIServiceOptions) {
    this.apiKey = options.apiKey;
    this.apiUrl = options.apiUrl;
    this.model = options.model || "gpt-3.5-turbo";
  }

  /**
   * Generate new ideas based on a prompt
   */
  async generateIdeas({
    sessionId,
    prompt,
    context = "",
    technique = "general",
    count = 3,
  }: GenerateIdeasParams): Promise<CreateIdea[]> {
    // Create prompt based on technique
    const systemPrompt = this.getTechniquePrompt(technique);

    // Format user prompt
    const userPrompt = `Generate ${count} creative ideas for the following brainstorming topic: "${prompt}".
${context ? `Additional context: ${context}` : ""}
Each idea should be unique and innovative. Format your response as a JSON array where each object has:
- content: The idea text (short title)
- description: A brief explanation or expansion of the idea
- position: { x: 0, y: 0 } (This is just a placeholder)`;

    // Make API call to OpenAI
    const completion = await this.callOpenAI(systemPrompt, userPrompt);

    // Parse result and return ideas
    try {
      const aiIdeas = JSON.parse(completion) as AIGeneratedIdeaResult[];

      // Convert AI-generated ideas to match the CreateIdea type
      return aiIdeas.map((idea) => ({
        sessionId,
        content: `${idea.content}\n\n${idea.description}`, // Combine title and description
        position: idea.position || { x: 0, y: 0 },
        categoryId: idea.categoryId,
        isAiGenerated: true,
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Fallback in case parsing fails
      return [
        {
          content: "AI suggestion failed. Please try again.",
          sessionId,
          position: { x: 0, y: 0 },
          isAiGenerated: true,
        },
      ];
    }
  }

  /**
   * Expand an existing idea to generate related ideas
   */
  async expandIdea({
    ideaId,
    sessionId,
    idea,
    depth = 1,
  }: ExpandIdeaParams): Promise<CreateIdea[]> {
    const systemPrompt = `You are a creative brainstorming assistant helping to expand on an existing idea. Generate ${depth > 1 ? "deep" : "related"} ideas that branch off from the main concept. Be specific and creative.`;

    const userPrompt = `Take this idea: "${idea}"
    
Generate ${3 * depth} new ideas that expand on this concept. Each new idea should introduce a variation, enhancement, or related concept.
Format your response as a JSON array where each object has:
- content: The expanded idea (short title)
- description: A brief explanation of how this expands on the original idea
- position: { x: 0, y: 0 } (This is just a placeholder)`;

    // Make API call to OpenAI
    const completion = await this.callOpenAI(systemPrompt, userPrompt);

    // Parse result and return ideas
    try {
      const aiIdeas = JSON.parse(completion) as AIGeneratedIdeaResult[];

      // Convert AI-generated ideas to match the CreateIdea type
      return aiIdeas.map((idea) => ({
        sessionId,
        content: `${idea.content}\n\n${idea.description}`, // Combine title and description
        position: idea.position || { x: 0, y: 0 },
        categoryId: idea.categoryId,
        isAiGenerated: true,
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Fallback in case parsing fails
      return [
        {
          content:
            "AI expansion failed. There was an error expanding this idea. Please try again.",
          sessionId,
          position: { x: 0, y: 0 },
          isAiGenerated: true,
        },
      ];
    }
  }

  /**
   * Generate alternative perspectives on an existing idea
   */
  async getAlternativePerspectives({
    ideaId,
    sessionId,
    idea,
    count = 3,
  }: AlternativePerspectivesParams): Promise<CreateIdea[]> {
    const systemPrompt = `You are a creative thinking assistant who can view ideas from different perspectives, like Edward de Bono's Six Thinking Hats. Consider analytical, emotional, critical, optimistic, creative, and process-oriented viewpoints.`;

    const userPrompt = `Consider this idea: "${idea}"
    
Generate ${count} alternative perspectives on this idea. Each perspective should offer a unique viewpoint or critique.
Format your response as a JSON array where each object has:
- content: A brief title for this perspective
- description: An explanation of this perspective on the idea
- position: { x: 0, y: 0 } (This is just a placeholder)`;

    // Make API call to OpenAI
    const completion = await this.callOpenAI(systemPrompt, userPrompt);

    // Parse result and return ideas
    try {
      const aiIdeas = JSON.parse(completion) as AIGeneratedIdeaResult[];

      // Convert AI-generated ideas to match the CreateIdea type
      return aiIdeas.map((idea) => ({
        sessionId,
        content: `${idea.content}\n\n${idea.description}`, // Combine title and description
        position: idea.position || { x: 0, y: 0 },
        categoryId: idea.categoryId,
        isAiGenerated: true,
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Fallback in case parsing fails
      return [
        {
          content:
            "AI perspective generation failed. There was an error generating perspectives. Please try again.",
          sessionId,
          position: { x: 0, y: 0 },
          isAiGenerated: true,
        },
      ];
    }
  }

  /**
   * Refine or improve an existing idea
   */
  async refineIdea({
    ideaId,
    sessionId,
    idea,
    instructions,
  }: RefineIdeaParams): Promise<CreateIdea> {
    const systemPrompt = `You are an expert at refining and improving ideas. Your goal is to take an existing idea and enhance it according to specific instructions.`;

    const userPrompt = `Here is an idea to refine: "${idea}"
    
Instructions for refinement: ${instructions}

Provide a refined version of this idea. Format your response as a JSON object with:
- content: The refined idea (short title)
- description: An explanation of how you've refined the idea and why these changes improve it`;

    // Make API call to OpenAI
    const completion = await this.callOpenAI(systemPrompt, userPrompt);

    // Parse result and return refined idea
    try {
      const refinedIdea = JSON.parse(completion) as AIGeneratedIdeaResult;

      // Convert AI-generated idea to match the CreateIdea type
      return {
        sessionId,
        content: `${refinedIdea.content}\n\n${refinedIdea.description}`, // Combine title and description
        position: refinedIdea.position || { x: 0, y: 0 },
        categoryId: refinedIdea.categoryId,
        isAiGenerated: true,
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Fallback in case parsing fails
      return {
        content:
          "AI refinement failed. There was an error refining this idea. Please try again.",
        sessionId,
        position: { x: 0, y: 0 },
        isAiGenerated: true,
      };
    }
  }

  /**
   * Make API call to OpenAI
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const url = `${this.apiUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as {
        error?: { message?: string };
      };
      console.error("OpenAI API error:", errorData);
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return data.choices[0].message.content;
  }

  /**
   * Get prompt for specific brainstorming technique
   */
  private getTechniquePrompt(technique: string): string {
    const techniques: Record<string, string> = {
      general:
        "You are a creative brainstorming assistant. Generate diverse, innovative ideas that are specific, actionable, and insightful.",

      scamper:
        "You are a brainstorming assistant using the SCAMPER technique. For each idea, apply one of these approaches: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, or Reverse.",

      lateralThinking:
        "You are a lateral thinking assistant who approaches problems from unexpected angles. Generate ideas that challenge assumptions, use provocation, and make novel connections.",

      sixHats:
        "You are a brainstorming assistant using the Six Thinking Hats method. Generate ideas from different perspectives: facts (white), feelings (red), caution (black), benefits (yellow), creativity (green), and process (blue).",

      "5w1h":
        "You are a brainstorming assistant using the 5W1H questioning technique. Generate ideas by exploring Who, What, When, Where, Why, and How aspects of the topic.",
    };

    return techniques[technique] || techniques.general;
  }
}
