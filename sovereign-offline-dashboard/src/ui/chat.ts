import { generate } from '../webllm/engine';
export async function sendMessage(text: string): Promise<string> {
  return generate(text);
}
