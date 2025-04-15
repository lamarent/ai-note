# Current Blockers and Challenges

This document tracks current blockers, challenges, and open questions for the AI Brainstorm project.

## Current Blockers

_No critical blockers at this time._

## Technical Challenges

1. **Cloudflare Workers Integration with Prisma**

   - Need to research best practices for using Prisma with Cloudflare Workers
   - Potential limitations due to serverless environment
   - Solution research: Look into connection pooling options and Edge-compatible ORM patterns

2. **AI Service Integration**
   - Need to determine optimal token limits for OpenAI API calls
   - Design effective prompts for brainstorming techniques
   - Implement cost-control mechanisms

## Open Questions

1. **Database Hosting**

   - What's the best PostgreSQL hosting option for this project?
   - Options: Supabase, Railway, Neon, self-hosted
   - Decision needed by: Before backend implementation

2. **Authentication Implementation**

   - When should we integrate Supabase Auth?
   - Should we design the system with auth in mind from the start, even if it's implemented later?
   - Decision needed by: During database schema definition

3. **Testing Strategy**
   - What testing approach should we use for AI-integrated features?
   - How to mock AI responses in tests?
   - Decision needed by: Before implementing core AI features

## Dependency Issues

_No dependency issues at this time._

## Resource Constraints

1. **OpenAI API Costs**
   - Need to implement caching and rate limiting to control costs
   - Consider implementing a development mode that uses cached responses

---

_Last updated: 2025-04-15_
