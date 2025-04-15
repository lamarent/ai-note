# AI-Assisted Development Context Tracking

This directory contains files and documentation to support AI-assisted development for the AI Brainstorm application. The context tracking system provides a structured way to maintain project context, track development progress, and share knowledge between human developers and AI assistants.

## Purpose

1. **Maintain Continuity**: Preserve context across development sessions
2. **Track Progress**: Document completed work and remaining tasks
3. **Share Knowledge**: Create a knowledge base that both humans and AI can reference
4. **Support Decisions**: Document decisions and their rationales
5. **Enhance Collaboration**: Facilitate smoother handoffs between different developers and AI assistants

## Directory Structure

```
docs/context/
├── README.md                 # This file
├── development-log.md        # Chronological log of development activities
├── knowledge-base/           # Specific knowledge related to the project
│   ├── architecture.md       # Architecture notes beyond formal documentation
│   ├── code-patterns.md      # Common patterns used in the codebase
│   ├── decisions.md          # Quick decisions that don't warrant full ADRs
│   └── troubleshooting.md    # Common issues and their solutions
├── state/                    # Current state of the project
│   ├── current-focus.md      # What's currently being worked on
│   ├── blockers.md           # Current blockers and challenges
│   └── next-steps.md         # Planned next steps
└── references/               # Important reference points
    ├── key-files.md          # List of critical files with descriptions
    └── external-resources.md # External resources related to the project
```

## How to Use

### For Human Developers

1. After each development session, update the `development-log.md` with a summary
2. Keep `current-focus.md` updated with what you're working on
3. Document decisions in `decisions.md` or create formal ADRs for significant ones
4. Add any reusable knowledge to the knowledge base files

### For AI Assistants

1. Review the context files to understand the current state of the project
2. Reference the development log to understand history and progress
3. Check current focus and blockers to provide relevant assistance
4. Update relevant files after implementing significant changes

## Guidelines

1. **Be Concise**: Keep entries brief but informative
2. **Be Specific**: Include specific file paths, function names, etc.
3. **Be Chronological**: Add new entries at the top of log files
4. **Be Actionable**: Include enough context for the next person/AI to take action
5. **Be Mindful**: Don't duplicate information already in formal documentation

## Integration with Development Workflow

This context tracking system complements the formal documentation and code. While formal documentation describes how things should work and code shows how they do work, the context tracking focuses on the development process itself and knowledge that doesn't fit neatly into either category.

Use this system alongside:
- ADRs for important architectural decisions
- GitHub issues for task tracking
- Pull requests for code reviews
- Formal documentation for stable information 