export interface StoryChapter {
  id: number;
  title: string;
  text: string;
  cameraPosition: [number, number, number];
  colorTheme: string; // Hex for ambient light/fog
  animationType: 'dance' | 'meet' | 'scare' | 'love' | 'proposal' | 'party';
}

export type AnimationState = {
  currentChapter: number;
  direction: number;
}