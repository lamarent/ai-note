# UI Design - AI-Powered Brainstorming App

## Design Philosophy

The UI design for the brainstorming app focuses on:

1. **Simplicity**: Clean interface that doesn't distract from the creative process
2. **Intuitive Interactions**: Natural gestures and familiar patterns
3. **Focus on Content**: Ideas take center stage
4. **Accessibility**: Usable by people with diverse abilities

## Color Palette

- **Primary**: `#4A6FFF` - A calming blue that promotes creative thinking
- **Secondary**: `#FF6B6B` - An energetic accent for important actions
- **Background**: `#F8F9FA` - Light, neutral background that doesn't compete with content
- **Text**: `#2D3748` - Dark, readable text with sufficient contrast
- **Surface**: `#FFFFFF` - White card backgrounds for ideas
- **Success**: `#48BB78` - Green for success states
- **Warning**: `#ED8936` - Orange for warnings
- **Info**: `#4299E1` - Blue for informational elements

## Typography

- **Headings**: Inter, Sans-serif, 600 weight
- **Body**: Inter, Sans-serif, 400 weight
- **Accents**: Inter, Sans-serif, 500 weight
- **Base Size**: 16px with a 1.5 line height for optimal readability

## Core Components

### Navigation

The main navigation is a slim sidebar that provides access to:

- Dashboard
- Current brainstorming sessions
- Templates
- Settings
- Help/Documentation

### Brainstorming Canvas

The central workspace where ideas are created, displayed, and organized:

- Infinite canvas with zoom and pan capabilities
- Grid background for easy alignment
- Minimap for navigation on larger boards

### Idea Cards

The fundamental unit for representing ideas:

- Rectangular cards with slight shadow
- Title area at the top
- Content area in the middle
- Metadata and actions at the bottom
- Customizable color indicators
- Drag handle for moving

### AI Interaction Panel

A collapsible panel for AI interactions:

- Prompt input field
- AI response area
- Suggestion gallery
- Controls for adjusting AI parameters

### Collaboration Tools

Elements that support collaborative sessions:

- Participant list with status indicators
- Chat/comment panel
- Cursor indicators showing other users' positions
- Voting/reaction tools

## Key Screens

### 1. Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]    Dashboard                                  [User] │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                   │
│ Home    │  Recent Sessions                [+ New Session]   │
│ Sessions│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│ Templates│ │ Project X  │  │ Marketing  │  │ Personal   │   │
│         │  │ Yesterday  │  │ 3 days ago │  │ 1 week ago │   │
│ Settings │  └────────────┘  └────────────┘  └────────────┘   │
│         │                                                   │
│         │  Templates                      [Browse All]      │
│         │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│         │  │ Mind Map   │  │ SWOT       │  │ 5 Whys     │   │
│         │  └────────────┘  └────────────┘  └────────────┘   │
│         │                                                   │
└─────────┴───────────────────────────────────────────────────┘
```

### 2. Brainstorming Session

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]    Project Kickoff Ideas               [Share][User] │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                   │
│ Zoom    │                                    [AI Assistant] │
│ Undo/Redo│                 ┌────────────┐                    │
│         │                 │ Main Idea  │                    │
│ Tools   │      ┌──────────┼────────────┼──────────┐         │
│         │      │          │            │          │         │
│ Export  │ ┌────┴─────┐    │            │    ┌────┴─────┐    │
│         │ │  Idea 1  │    │            │    │  Idea 2  │    │
│         │ └────┬─────┘    │            │    └────┬─────┘    │
│ Chat    │      │          │            │          │         │
│         │ ┌────┴─────┐    │            │    ┌────┴─────┐    │
│         │ │ Sub-idea │    │            │    │ Sub-idea │    │
│         │ └──────────┘    │            │    └──────────┘    │
│         │                 └────────────┘                    │
└─────────┴───────────────────────────────────────────────────┘
```

### 3. AI Assistant Panel

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]    Project Kickoff Ideas               [Share][User] │
├─────────┬───────────────────────────────┬───────────────────┤
│         │                               │  AI Assistant     │
│ Zoom    │                               │                   │
│ Undo/Redo│                              │  Generate ideas   │
│         │         [Brainstorming        │  for:             │
│ Tools   │            Canvas with        │  [mobile app    ] │
│         │            Ideas]             │  [Generate]       │
│ Export  │                               │                   │
│         │                               │  Suggestions:     │
│         │                               │  ○ User profiles  │
│ Chat    │                               │  ○ Push notifs    │
│         │                               │  ○ Offline mode   │
│         │                               │  [Add All]        │
│         │                               │                   │
└─────────┴───────────────────────────────┴───────────────────┘
```

## Mobile Adaptation

The mobile version will:

1. Use a bottom navigation bar instead of the sidebar
2. Stack panels vertically instead of side-by-side
3. Optimize touch targets for finger interaction
4. Use swipe gestures for common actions
5. Simplify the canvas view for smaller screens

## Interaction Patterns

### Creating Ideas

- Click/tap the "+" button on the canvas
- Double-click/tap on empty canvas space
- Use keyboard shortcut (Ctrl/Cmd + N)

### Organizing Ideas

- Drag and drop ideas to position them
- Select multiple ideas with lasso tool or shift+click
- Group ideas by dragging one onto another
- Use smart layout options to automatically arrange ideas

### AI Interactions

- Type a topic and click "Generate" for new ideas
- Select an idea and click "Expand" to develop it further
- Drag AI suggestions directly onto the canvas
- Configure AI parameters through a settings panel

## Accessibility Considerations

- High contrast mode for visually impaired users
- Keyboard navigation for all core functions
- Screen reader compatibility
- Resizable text options
- Voice input for idea creation
