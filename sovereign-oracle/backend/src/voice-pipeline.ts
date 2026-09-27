import axios from 'axios';

export interface AudioStreamEvent {
  chunkIndex: number;
  textChunk: string;
  pcmBuffer: Buffer;
  isFinal: boolean;
}

/** Sentence-boundary stream chunker + Piper synthesis worker. */
export class SentenceChunkerPipeline {
  private piperUrl: string;
  constructor(piperUrl: string = 'http://piper-tts:8000') {
    this.piperUrl = piperUrl;
  }

  public async *processLlmStreamToAudio(
    llmTokenStream: AsyncIterable<string>
  ): AsyncGenerator<AudioStreamEvent, void, unknown> {
    let sentenceBuffer = '';
    let chunkCounter = 0;
    const sentenceDelimiters = /[.!?\n]+/;
    for await (const token of llmTokenStream) {
      sentenceBuffer += token;
      const match = sentenceBuffer.match(sentenceDelimiters);
      if (match && match.index !== undefined) {
        const splitIndex = match.index + match[0].length;
        const completeSentence = sentenceBuffer.slice(0, splitIndex).trim();
        sentenceBuffer = sentenceBuffer.slice(splitIndex);
        if (completeSentence.length > 1) {
          const pcm = await this.synthesizeSentence(completeSentence);
          yield { chunkIndex: chunkCounter++, textChunk: completeSentence, pcmBuffer: pcm, isFinal: false };
        }
      }
    }
    if (sentenceBuffer.trim().length > 0) {
      const pcm = await this.synthesizeSentence(sentenceBuffer.trim());
      yield { chunkIndex: chunkCounter++, textChunk: sentenceBuffer.trim(), pcmBuffer: pcm, isFinal: true };
    }
  }

  private async synthesizeSentence(text: string): Promise<Buffer> {
    const cleanText = text.replace(/[*_#]/g, '').trim();
    const response = await axios.post(
      `${this.piperUrl}/v1/audio/speech`,
      { text: cleanText, length_scale: 1.05 },
      { responseType: 'arraybuffer', timeout: 5000 }
    );
    return Buffer.from(response.data);
  }
}
