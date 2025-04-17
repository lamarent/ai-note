import { create, StateCreator } from "zustand";

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  createSession: (sessionData: CreateSession) => Promise<boolean>;
  // TODO: Add getSession, updateSession, deleteSession actions
}

// Define the store creator with explicit types
const sessionStoreCreator: StateCreator<SessionState> = (set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      console.log("Fetching sessions...");
      // const response = await fetch('/api/sessions');
      // if (!response.ok) throw new Error('Failed to fetch sessions');
      // const data = await response.json();
      // set({ sessions: data, isLoading: false });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  createSession: async (sessionData: CreateSession) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Creating session:", sessionData);
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to create session (status: ${response.status})`
        );
      }

      const newSession = (await response.json()) as Session;
      set((state: SessionState) => ({
        sessions: [...state.sessions, newSession],
        isLoading: false,
      }));
      console.log("Session created:", newSession);
      return true; // Return success
    } catch (error) {
      console.error("Create session error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unknown error occurred during creation",
        isLoading: false,
      });
      return false; // Return failure
    }
  },
});

export const useSessionStore = create<SessionState>(sessionStoreCreator);
