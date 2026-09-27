import { createContext } from './store-context';
export const EngineContext = createContext({ status: 'idle', progress: 0, generate: async () => '' });
