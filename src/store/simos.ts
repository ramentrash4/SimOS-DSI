import { create } from 'zustand';

export type AppName = 'home' | 'chat' | 'gallery' | 'notes' | 'browser' | 'instapic' | 'messages';

export interface PushBanner {
  id: string;
  app: AppName;
  sender: string;
  text: string;
  avatar?: string;
  timestamp?: Date;
  isHint?: boolean;
}

interface SimOSState {
  isBooting: boolean;
  currentApp: AppName;
  openApps: AppName[];
  unreadMessages: number;
  glitchLevel: number;
  isMuted: boolean;
  isDarkMode: boolean;
  isControlCenterOpen: boolean;
  isNotificationCenterOpen: boolean;
  isAppSwitcherOpen: boolean;
  activeBanner: PushBanner | null;
  notifications: PushBanner[];
  activeContactId: string | null;
  hasProofScreenshot: boolean;
  readContacts: Record<string, boolean>;
  
  // Actions
  setBooting: (status: boolean) => void;
  openApp: (app: AppName) => void;
  closeApp: (app: AppName) => void;
  setActiveContactId: (id: string | null) => void;
  setHasProofScreenshot: (status: boolean) => void;
  markContactAsRead: (contactId: string) => void;
  setUnreadMessages: (count: number) => void;
  setGlitchLevel: (level: number) => void;
  toggleMute: () => void;
  toggleDarkMode: () => void;
  setControlCenterOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
  setAppSwitcherOpen: (open: boolean) => void;
  showBanner: (banner: Omit<PushBanner, 'id' | 'timestamp'>) => void;
  clearBanner: () => void;
  clearNotifications: () => void;
  resetOS: () => void;
}

export const useSimOSStore = create<SimOSState>((set) => ({
  isBooting: true,
  currentApp: 'home',
  openApps: ['home', 'chat'],
  unreadMessages: 1,
  glitchLevel: 0,
  isMuted: false,
  isDarkMode: false,
  isControlCenterOpen: false,
  isNotificationCenterOpen: false,
  isAppSwitcherOpen: false,
  activeBanner: null,
  notifications: [],
  activeContactId: null,
  hasProofScreenshot: false,
  readContacts: {},

  setBooting: (status) => set({ isBooting: status }),
  setActiveContactId: (id) => set((state) => ({ 
    activeContactId: id,
    readContacts: id ? { ...state.readContacts, [id]: true } : state.readContacts
  })),
  markContactAsRead: (contactId) => set((state) => ({
    readContacts: { ...state.readContacts, [contactId]: true }
  })),
  setHasProofScreenshot: (status) => set({ hasProofScreenshot: status }),
  openApp: (app) => set((state) => {
    const exists = state.openApps.includes(app);
    return {
      currentApp: app,
      openApps: exists ? state.openApps : [...state.openApps, app],
      isAppSwitcherOpen: false,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
    };
  }),
  closeApp: (app) => set((state) => {
    const filtered = state.openApps.filter((a) => a !== app);
    const nextApp = state.currentApp === app ? (filtered[filtered.length - 1] || 'home') : state.currentApp;
    return {
      openApps: filtered.length > 0 ? filtered : ['home'],
      currentApp: nextApp,
    };
  }),
  setUnreadMessages: (count) => set({ unreadMessages: count }),
  setGlitchLevel: (level) => set({ glitchLevel: level }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setControlCenterOpen: (open) => set({ isControlCenterOpen: open, isNotificationCenterOpen: false, isAppSwitcherOpen: false }),
  setNotificationCenterOpen: (open) => set({ isNotificationCenterOpen: open, isControlCenterOpen: false, isAppSwitcherOpen: false }),
  setAppSwitcherOpen: (open) => set({ isAppSwitcherOpen: open, isControlCenterOpen: false, isNotificationCenterOpen: false }),
  showBanner: (banner) => {
    const id = Math.random().toString(36).substring(7);
    const newBanner: PushBanner = { ...banner, id, timestamp: new Date() };
    set((state) => ({
      activeBanner: newBanner,
      notifications: [newBanner, ...state.notifications],
    }));
  },
  clearBanner: () => set({ activeBanner: null }),
  clearNotifications: () => set({ notifications: [] }),
  resetOS: () => set({
    isBooting: false,
    currentApp: 'home',
    openApps: ['home', 'chat'],
    unreadMessages: 1,
    glitchLevel: 0,
    activeBanner: null,
    notifications: [],
    activeContactId: null,
    hasProofScreenshot: false,
    readContacts: {},
    isControlCenterOpen: false,
    isNotificationCenterOpen: false,
    isAppSwitcherOpen: false,
  }),
}));

