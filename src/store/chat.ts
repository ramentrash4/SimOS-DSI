import { create } from 'zustand';
import type { MissionScript, MessageAttachment, DebriefTheoryCard, PlayerDecision } from '@/types/mission';
import { useSimOSStore } from '@/store/simos';
import { sfx } from '@/utils/audio';

export type Message = {
  id: string;
  nodeId?: string;
  sender: 'npc' | 'player' | 'system';
  npcName?: string;
  avatarSeed?: string;
  text: string;
  attachment?: MessageAttachment;
  timestamp: Date;
};

interface ChatState {
  messages: Message[];
  isNpcTyping: boolean;
  script: MissionScript | null;
  currentNodeId: string | null;
  choices: { text: string; points: number; nextNodeId: string | null }[] | null;
  status: 'playing' | 'gameover' | 'partial' | 'success';
  stars: number;
  reason: string | null;
  debriefCard: DebriefTheoryCard | null;
  isDebriefCardOpen: boolean;
  activeSessionId: number;
  isProcessingStep: boolean;
  decisionHistory: PlayerDecision[];
  highlightedDecisionNodeId: string | null;
  
  // Actions
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  setNpcTyping: (status: boolean) => void;
  setHighlightedDecisionNodeId: (nodeId: string | null) => void;
  startMission: (script: MissionScript) => void;
  advanceNode: (nodeId: string, runSessionId?: number) => Promise<void>;
  chooseOption: (optionIndex: number) => void;
  recordDecision: (decision: Omit<PlayerDecision, 'id' | 'timestamp' | 'stepIndex'>) => void;
  openDebriefCard: () => void;
  closeDebriefCard: () => void;
  resetMission: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isNpcTyping: false,
  script: null,
  currentNodeId: null,
  choices: null,
  status: 'playing',
  stars: 0,
  reason: null,
  debriefCard: null,
  isDebriefCardOpen: false,
  activeSessionId: 0,
  isProcessingStep: false,
  decisionHistory: [],
  highlightedDecisionNodeId: null,

  addMessage: (msg) => {
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date()
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setNpcTyping: (status) => set({ isNpcTyping: status }),
  setHighlightedDecisionNodeId: (nodeId) => set({ highlightedDecisionNodeId: nodeId }),

  startMission: (script) => {
    const newSessionId = Date.now();
    useSimOSStore.getState().resetOS();
    set({
      activeSessionId: newSessionId,
      isProcessingStep: false,
      script,
      messages: [],
      currentNodeId: script.startNodeId,
      choices: null,
      status: 'playing',
      stars: 0,
      reason: null,
      debriefCard: null,
      isDebriefCardOpen: false,
      decisionHistory: [],
      highlightedDecisionNodeId: null,
    });
    get().advanceNode(script.startNodeId, newSessionId);
  },

  resetMission: () => {
    const { script } = get();
    if (script) {
      get().startMission(script);
    }
  },

  openDebriefCard: () => set({ isDebriefCardOpen: true }),
  closeDebriefCard: () => set({ isDebriefCardOpen: false }),

  advanceNode: async (nodeId, runSessionId) => {
    const currentSessionId = runSessionId ?? get().activeSessionId;
    if (currentSessionId !== get().activeSessionId) return;

    const { script, addMessage, setNpcTyping } = get();
    if (!script) return;

    const node = script.nodes[nodeId];
    if (!node) return;

    if (node.type !== 'choice') {
      set({ currentNodeId: nodeId, isProcessingStep: true, choices: null });
    } else {
      set({ currentNodeId: nodeId, isProcessingStep: true });
    }

    if (node.type === 'message') {
      // Dynamic tempo: short messages appear quickly (500ms), longer messages scale up to 1.8s
      const calculatedDelay = Math.min(1800, Math.max(500, Math.round(node.text.length * 16) + (node.delay ? Math.min(node.delay, 300) : 0)));

      if (node.sender === 'npc') {
        setNpcTyping(true);
        await new Promise((r) => setTimeout(r, calculatedDelay));
        if (get().activeSessionId !== currentSessionId) return;
        setNpcTyping(false);
      } else if (node.delay) {
        await new Promise((r) => setTimeout(r, Math.min(450, node.delay ?? 300)));
        if (get().activeSessionId !== currentSessionId) return;
      }

      // Check system actions in message text
      const rawText = node.text;

      // [SYSTEM_ACTION:openApp:app] -> Dynamic screen transition (e.g. viral IG post in Level 2, SMS alerts)
      const appMatch = rawText.match(/\[SYSTEM_ACTION:openApp:([^\]]+)\]/);
      if (appMatch) {
        const targetApp = appMatch[1] as any;
        useSimOSStore.getState().openApp(targetApp);
      }

      // [SYSTEM_ACTION:suggestApp:app:Sender:Text]
      const suggestMatch = rawText.match(/\[SYSTEM_ACTION:suggestApp:([^:]+):([^:]+):([^\]]+)\]/);
      if (suggestMatch) {
        useSimOSStore.getState().showBanner({
          app: suggestMatch[1] as any,
          sender: suggestMatch[2],
          text: suggestMatch[3],
          isHint: true
        });
      }

      // [SYSTEM_ACTION:glitch:level]
      const glitchMatch = rawText.match(/\[SYSTEM_ACTION:glitch:([^\]]+)\]/);
      if (glitchMatch) {
        const level = parseInt(glitchMatch[1], 10);
        useSimOSStore.getState().setGlitchLevel(level);
        if (level > 0) sfx.playGlitch();
      }

      // [SYSTEM_ACTION:sms:Sender:Text]
      const smsMatch = rawText.match(/\[SYSTEM_ACTION:sms:([^:]+):([^\]]+)\]/);
      if (smsMatch) {
        useSimOSStore.getState().showBanner({
          app: 'messages',
          sender: smsMatch[1],
          text: smsMatch[2]
        });
      }

      // [SYSTEM_ACTION:banner:Sender:Text]
      const bannerMatch = rawText.match(/\[SYSTEM_ACTION:banner:([^:]+):([^\]]+)\]/);
      if (bannerMatch) {
        useSimOSStore.getState().showBanner({
          app: 'chat',
          sender: bannerMatch[1],
          text: bannerMatch[2]
        });
      }

      const cleanText = rawText.replace(/\[SYSTEM_ACTION:[^\]]+\]/g, '').trim();

      addMessage({
        nodeId,
        sender: node.sender,
        text: cleanText,
        npcName: node.npcName,
        avatarSeed: node.avatarSeed,
        attachment: node.attachment
      });

      if (node.sender === 'npc') {
        sfx.playNotification();
        // Check if user is not in the active chat room, show push notification
        const simState = useSimOSStore.getState();
        if (simState.currentApp !== 'chat' || simState.activeContactId !== 'active') {
          simState.showBanner({
            app: 'chat',
            sender: node.npcName || script.channelName || 'Chatter',
            text: cleanText,
            avatar: node.avatarSeed
          });
        }
      }

      set({ isProcessingStep: false });

      if (node.nextNodeId) {
        // Natural reading delay scaled to sentence length (650ms - 1.3s)
        const readingDelay = Math.min(1300, Math.max(650, Math.round(cleanText.length * 9)));
        setTimeout(() => {
          if (get().activeSessionId === currentSessionId) {
            get().advanceNode(node.nextNodeId!, currentSessionId);
          }
        }, readingDelay);
      }
    } else if (node.type === 'choice') {
      set({ choices: null, isProcessingStep: true });
      setTimeout(() => {
        if (get().activeSessionId === currentSessionId) {
          set({ choices: node.options, isProcessingStep: false });
        }
      }, 400);
    } else if (node.type === 'gameover') {
      sfx.playGlitch();
      set({
        choices: null,
        status: 'gameover',
        reason: node.reason,
        stars: 1, // Minimum 1 star for participating
        debriefCard: node.debriefCard,
        isDebriefCardOpen: true,
        isProcessingStep: false
      });
    } else if (node.type === 'partial') {
      set({
        choices: null,
        status: 'partial',
        reason: node.message || 'Misi Selesai dengan Catatan Evaluasi',
        stars: 2,
        debriefCard: node.debriefCard,
        isDebriefCardOpen: true,
        isProcessingStep: false
      });
    } else if (node.type === 'success') {
      sfx.playSuccess();
      set({
        choices: null,
        status: 'success',
        reason: node.message || 'Sempurna! Kamu berhasil menyelesaikan simulasi!',
        stars: 3,
        debriefCard: node.debriefCard,
        isDebriefCardOpen: true,
        isProcessingStep: false
      });
    }
  },

  chooseOption: (optionIndex) => {
    const { choices, addMessage, advanceNode, stars, isProcessingStep, activeSessionId, script, currentNodeId, decisionHistory } = get();
    if (!choices || isProcessingStep) return;

    const option = choices[optionIndex];
    if (!option) return;

    // Immediately clear choices to prevent spam clicking
    set({ choices: null, isProcessingStep: true });
    if (useSimOSStore.getState().hasProofScreenshot) {
      useSimOSStore.getState().setHasProofScreenshot(false);
    }

    sfx.playSend();

    addMessage({
      nodeId: currentNodeId || '',
      sender: 'player',
      text: option.text
    });

    const newStars = Math.max(stars, option.points);

    // Compute causality analysis metadata
    const currentNode = script?.nodes[currentNodeId || ''];
    const promptText = (currentNode && currentNode.type === 'choice' && currentNode.prompt)
      ? currentNode.prompt
      : 'Pilihan Sikap Digital';

    const riskLevel: 'Kritis' | 'Sedang' | 'Aman' = option.points === 0 ? 'Kritis' : option.points < 3 ? 'Sedang' : 'Aman';

    const decision: PlayerDecision = {
      id: Math.random().toString(36).substring(7),
      stepIndex: decisionHistory.length + 1,
      stepTitle: `Keputusan #${decisionHistory.length + 1}`,
      prompt: promptText,
      chosenText: option.text,
      points: option.points,
      nodeId: currentNodeId || '',
      alternatives: choices.map((c) => ({ text: c.text, points: c.points })),
      timestamp: new Date(),
      causalityAnalysis: {
        riskLevel,
        mechanism: option.points === 0 
          ? 'Memilih opsi impulsif tanpa jeda kritis atau verifikasi mendalam.' 
          : option.points < 3 
          ? 'Mengambil langkah aman namun belum optimal secara etika digital.' 
          : 'Menerapkan jeda kritis (Critical Thinking Pause) dan verifikasi bukti sahih.',
        consequence: option.points === 0 
          ? 'Memicu eskalasi risiko, kebocoran data, sengketa hukum, atau trauma sosial.' 
          : option.points < 3 
          ? 'Situasi terkendali namun menyisakan catatan evaluasi atau hasil kompromi.' 
          : 'Menyelesaikan krisis secara elegan, melindungi diri & orang lain tanpa jejak toksik.',
        bestPracticeRecommendation: 'Selalu terapkan prinsip 5 Detik Jeda Kritis, verifikasi lateral, dan empati sebelum bertindak di ruang digital.'
      }
    };

    set({ 
      stars: newStars,
      decisionHistory: [...decisionHistory, decision] 
    });

    if (option.nextNodeId) {
      setTimeout(() => {
        if (get().activeSessionId === activeSessionId) {
          advanceNode(option.nextNodeId!, activeSessionId);
        }
      }, 350);
    } else {
      set({ isProcessingStep: false });
    }
  },

  recordDecision: (decisionData) => {
    const { decisionHistory } = get();
    const newDecision: PlayerDecision = {
      ...decisionData,
      id: Math.random().toString(36).substring(7),
      stepIndex: decisionHistory.length + 1,
      timestamp: new Date()
    };
    set({ decisionHistory: [...decisionHistory, newDecision] });
  }
}));
