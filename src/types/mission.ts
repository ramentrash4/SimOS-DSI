export type MessageAttachment = 
  | { type: 'apk'; fileName: string; fileSize: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'report'; title: string };

export interface PlayerDecision {
  id: string;
  stepIndex: number;
  stepTitle: string;
  prompt: string;
  chosenText: string;
  points: number;
  nodeId: string;
  targetApp?: 'home' | 'chat' | 'gallery' | 'notes' | 'browser' | 'instapic' | 'messages';
  targetView?: string;
  alternatives: { text: string; points: number }[];
  timestamp: Date;
  causalityAnalysis?: {
    riskLevel: 'Rendah' | 'Sedang' | 'Kritis' | 'Aman';
    mechanism: string;
    consequence: string;
    bestPracticeRecommendation: string;
  };
}

export interface DebriefTheoryCard {
  status: 'BERHASIL' | 'BERHASIL PARSIAL' | 'GAGAL' | 'BERHASIL SEMPURNA';
  stars: 1 | 2 | 3;
  topicTitle: string;
  summary: string;
  keyTerms: { term: string; definition: string }[];
  legalBasis: {
    law: string;
    description: string;
  };
  moralMessage: string;
  pedagogicalObjectives?: string[];
  whatIfScenarios?: {
    choiceTitle: string;
    description: string;
    outcomeSummary: string;
    riskLevel: 'Rendah' | 'Sedang' | 'Kritis' | 'Aman';
  }[];
}

export type MessageNode = {
  type: 'message';
  sender: 'player' | 'npc' | 'system';
  npcName?: string;
  avatarSeed?: string;
  channelId?: string;
  text: string;
  attachment?: MessageAttachment;
  delay?: number; // Delay in ms before message arrives
  nextNodeId: string | null;
};

export type ChoiceOption = {
  text: string;
  points: number; // 0 = fatal/fail, 1-3 points
  nextNodeId: string | null;
  isForwardAction?: boolean;
  targetApp?: 'home' | 'chat' | 'gallery' | 'notes' | 'browser' | 'instapic' | 'messages';
  targetView?: string;
};

export type ChoiceNode = {
  type: 'choice';
  prompt?: string;
  options: ChoiceOption[];
};

export type GameOverNode = {
  type: 'gameover';
  reason: string;
  debriefCard: DebriefTheoryCard;
};

export type SuccessNode = {
  type: 'success';
  message?: string;
  debriefCard: DebriefTheoryCard;
};

export type PartialNode = {
  type: 'partial';
  message?: string;
  debriefCard: DebriefTheoryCard;
};

export type MissionNode = MessageNode | ChoiceNode | GameOverNode | SuccessNode | PartialNode;

export interface MissionScript {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  channelName: string;
  isGroup: boolean;
  memberCount?: number;
  avatarSeed: string;
  startNodeId: string;
  nodes: Record<string, MissionNode>;
}
