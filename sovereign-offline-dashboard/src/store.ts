export interface AppState {
  activeTab: string;
  conversations: any[];
  modelStatus: 'idle' | 'loading' | 'ready' | 'error';
  modelProgress: number;
}
export function createStore(): AppState {
  return { activeTab: 'chat', conversations: [], modelStatus: 'idle', modelProgress: 0 };
}
