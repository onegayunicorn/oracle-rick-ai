import { getDB } from '../db';
export async function cacheModel(modelId: string, meta: any) {
  return getDB().put('model-cache', { modelId, ...meta });
}
export async function getCachedModel(modelId: string) {
  return getDB().get('model-cache', modelId);
}
