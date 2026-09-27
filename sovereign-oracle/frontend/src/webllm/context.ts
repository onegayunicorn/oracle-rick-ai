import { createContext } from 'react';
export interface WebLLMContextValue {
  status: 'idle' | 'loading' | 'ready' | 'error';
  progress: number;
  generate: (prompt: string) => Promise<string>;
}
export const WebLLMContext = createContext<WebLLMContextValue>({
  status: 'idle',
  progress: 0,
  generate: async () => '',
});
