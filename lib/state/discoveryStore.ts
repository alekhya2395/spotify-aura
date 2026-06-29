"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  DiscoveryContext,
  DiscoverySession,
  Utterance,
  ExtractedIntent,
  TrackRecommendation,
  FeedbackAction,
  DiscoveryResponse,
} from "@/lib/utils/types";

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const initialContext: DiscoveryContext = {
  mood: null,
  activity: null,
  energy: 0.5,
  exploration: 0.5,
  discoveryIntent: [],
  personalityTags: [],
  avoidArtists: [],
  preferredGenres: [],
  freeText: "",
};

interface DiscoveryStore {
  session: DiscoverySession;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;

  // Context setters
  setMood: (mood: string | null) => void;
  setActivity: (activity: string | null) => void;
  setEnergy: (energy: number) => void;
  setExploration: (exploration: number) => void;
  setFreeText: (text: string) => void;

  // Array-based context
  toggleDiscoveryIntent: (intent: string) => void;
  togglePersonalityTag: (tag: string) => void;
  addAvoidArtist: (artist: { id: string; name: string }) => void;
  removeAvoidArtist: (artistId: string) => void;
  togglePreferredGenre: (genre: string) => void;

  // Session actions
  addUtterance: (utterance: Utterance) => void;
  setIntent: (intent: ExtractedIntent) => void;
  setRecommendations: (tracks: TrackRecommendation[]) => void;
  setDiscoveryResult: (
    discovery: DiscoveryResponse,
    tracks: TrackRecommendation[],
    source?: "spotify" | "mock"
  ) => void;
  addToHistory: (trackIds: string[]) => void;

  // Loading/error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Feedback
  applyFeedback: (action: FeedbackAction, trackId?: string) => void;

  // Reset
  resetSession: () => void;
  resetContext: () => void;

  // Hydration
  setHydrated: () => void;
}

export const useDiscoveryStore = create<DiscoveryStore>()(
  persist(
    (set, get) => ({
      session: {
        context: initialContext,
        utterances: [],
        lastIntent: null,
        discoveryMeta: null,
        recommendations: [],
        history: [],
        sessionId: generateSessionId(),
      },
      isLoading: false,
      error: null,
      isHydrated: false,

      // Context setters
      setMood: (mood) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, mood },
          },
        })),

      setActivity: (activity) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, activity },
          },
        })),

      setEnergy: (energy) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, energy },
          },
        })),

      setExploration: (exploration) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, exploration },
          },
        })),

      setFreeText: (freeText) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, freeText },
          },
        })),

      // Toggle arrays (add if missing, remove if present)
      toggleDiscoveryIntent: (intent) =>
        set((state) => {
          const current = state.session.context.discoveryIntent;
          const updated = current.includes(intent)
            ? current.filter((i) => i !== intent)
            : current.length < 5
              ? [...current, intent]
              : current;
          return {
            session: {
              ...state.session,
              context: { ...state.session.context, discoveryIntent: updated },
            },
          };
        }),

      togglePersonalityTag: (tag) =>
        set((state) => {
          const current = state.session.context.personalityTags;
          const updated = current.includes(tag)
            ? current.filter((t) => t !== tag)
            : current.length < 5
              ? [...current, tag]
              : current;
          return {
            session: {
              ...state.session,
              context: { ...state.session.context, personalityTags: updated },
            },
          };
        }),

      addAvoidArtist: (artist) =>
        set((state) => {
          const current = state.session.context.avoidArtists;
          if (current.length >= 10) return state;
          if (current.some((a) => a.id === artist.id)) return state;
          return {
            session: {
              ...state.session,
              context: {
                ...state.session.context,
                avoidArtists: [...current, artist],
              },
            },
          };
        }),

      removeAvoidArtist: (artistId) =>
        set((state) => ({
          session: {
            ...state.session,
            context: {
              ...state.session.context,
              avoidArtists: state.session.context.avoidArtists.filter(
                (a) => a.id !== artistId
              ),
            },
          },
        })),

      togglePreferredGenre: (genre) =>
        set((state) => {
          const current = state.session.context.preferredGenres;
          const updated = current.includes(genre)
            ? current.filter((g) => g !== genre)
            : current.length < 5
              ? [...current, genre]
              : current;
          return {
            session: {
              ...state.session,
              context: { ...state.session.context, preferredGenres: updated },
            },
          };
        }),

      // Session actions
      addUtterance: (utterance) =>
        set((state) => ({
          session: {
            ...state.session,
            utterances: [...state.session.utterances.slice(-5), utterance],
          },
        })),

      setIntent: (intent) =>
        set((state) => ({
          session: { ...state.session, lastIntent: intent },
        })),

      setRecommendations: (tracks) =>
        set((state) => ({
          session: { ...state.session, recommendations: tracks },
        })),

      setDiscoveryResult: (discovery, tracks, source) =>
        set((state) => ({
          session: {
            ...state.session,
            lastIntent: discovery.intent,
            discoveryMeta: {
              strategy: discovery.strategy,
              noveltyScore: discovery.noveltyScore,
              diversityScore: discovery.diversityScore,
              explanation: discovery.explanation,
              recommendedGenres: discovery.recommendedGenres,
              recommendationSource: source,
            },
            recommendations: tracks,
          },
        })),

      addToHistory: (trackIds) =>
        set((state) => ({
          session: {
            ...state.session,
            history: [...new Set([...state.session.history, ...trackIds])],
          },
        })),

      // Loading/error
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Feedback
      applyFeedback: (action, trackId) => {
        const state = get();
        const track = state.session.recommendations.find(
          (t) => t.id === trackId
        );

        switch (action) {
          case "more_adventurous":
            set((s) => ({
              session: {
                ...s.session,
                context: {
                  ...s.session.context,
                  exploration: Math.min(1, s.session.context.exploration + 0.2),
                },
              },
            }));
            break;
          case "less_similar":
            if (track) {
              set((s) => ({
                session: {
                  ...s.session,
                  context: {
                    ...s.session.context,
                    avoidArtists: [
                      ...s.session.context.avoidArtists,
                      { id: track.artistId, name: track.artist },
                    ].slice(0, 10),
                  },
                },
              }));
            }
            break;
          case "change_mood":
            set((s) => ({
              session: {
                ...s.session,
                context: { ...s.session.context, mood: null },
                lastIntent: null,
              },
            }));
            break;
          default:
            break;
        }
      },

      // Reset
      resetSession: () =>
        set({
          session: {
            context: initialContext,
            utterances: [],
            lastIntent: null,
            discoveryMeta: null,
            recommendations: [],
            history: [],
            sessionId: generateSessionId(),
          },
          isLoading: false,
          error: null,
        }),

      resetContext: () =>
        set((state) => ({
          session: { ...state.session, context: initialContext },
        })),

      // Hydration
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "aura-discovery-session",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return sessionStorage;
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.session && state.session.discoveryMeta === undefined) {
          state.session.discoveryMeta = null;
        }
        state?.setHydrated();
      },
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);
