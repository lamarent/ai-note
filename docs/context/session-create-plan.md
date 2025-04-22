# Session Creation UI Planning

## Context

- We're designing the flow for creating a new brainstorming session in the AI Brainstorm App.
- Aim: guide users to define their brainstorming topic, leverage AI to generate starter ideas, and refine through feedback.

## Goals

- Help users articulate what they want to brainstorm via hints and templates.
- Present AI-generated initial ideas.
- Allow users to select or reject ideas, providing a feedback loop for refinement.
- Seamlessly transition to the Session Detail view with the approved ideas.

## Proposed Workflow

1. **Topic Definition**

   - Show an input field with placeholder: "What would you like to brainstorm?"
   - Display a **TemplateSelector**: common brainstorming templates (e.g., "Product Names", "Article Topics", "Marketing Campaigns").
   - Provide an **AIHintPanel**: dynamically suggest topics based on partial input.

2. **Initial AI Ideas**

   - After topic/template selection, call AI to generate 5–10 sample ideas.
   - Display ideas in **InitialIdeasList** with **IdeaCard** components.
   - Add selection controls (thumbs up/down or checkbox) on each card.

3. **Feedback Loop**

   - User selects which ideas to keep or rejects ones to discard.
   - Offer optional feedback notes per idea.
   - On submission, send feedback to AI to refine or expand ideas.
   - Update **InitialIdeasList** with new suggestions in-place.

4. **Confirmation & Creation**
   - Provide a summary of approved ideas.
   - User confirms to create the session.
   - Navigate to **Session Detail** screen pre-populated with chosen ideas.

## Key Components

- **NewSessionStepper**: multi-step wizard container.
- **TopicInput**: text input with placeholder and live AI hints.
- **TemplateSelector**: dropdown or chip list of templates.
- **AIHintPanel**: displays AI-suggested topics.
- **InitialIdeasList**: list view of generated ideas.
- **IdeaCard**: shows idea content, select/deselect, feedback options.
- **FeedbackControls**: thumbs up/down and note input.
- **ConfirmationPanel**: shows final selected ideas.

## AI Interaction Patterns

- **Live Topic Suggestions**: AI generates hints as user types.
- **Batch Idea Generation**: AI generates initial idea set.
- **On-Demand Refinement**: regenerate based on feedback.

## Technical Considerations

- Use **DaisyUI** + **TailwindCSS** for UI.
- Implement multi-step flow in **React** + **TypeScript**.
- Manage state across steps via **Zustand** or **React Context**.
- Store temporary new session data locally until confirmation.
- Integrate AI API calls with retry and loading indicators.

## Next Steps

1. Scaffold **NewSessionStepper** component.
2. Implement **TopicInput** with live hint fetch.
3. Build **TemplateSelector** UI.
4. Integrate **AIHintPanel** for topic suggestions.
5. Hook up initial idea generation and **InitialIdeasList**.
6. Develop **FeedbackControls** and refine logic.
7. Implement **ConfirmationPanel** and navigation to Session Detail.
