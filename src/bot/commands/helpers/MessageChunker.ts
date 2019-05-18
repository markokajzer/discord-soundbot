import LocaleService from '@util/i18n/LocaleService';

export default class MessageChunker {
  private readonly MAX_MESSAGE_LENGTH = 2000;
  private readonly NEWLINE_LENGTH = '\n'.length;
  private readonly CODE_MARKER_LENGTH = '```'.length * 2 + this.NEWLINE_LENGTH;

  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public chunkedMessages(toChunk: string[], page = 0): string[] {
    const chunks = this.chunkArray(toChunk);

    const index = page - 1;
    if (index >= 0 && index < chunks.length) {
      return this.specificChunk(chunks[index], page, chunks.length);
    }

    return chunks.map(chunk => ['```', ...chunk, '```'].join('\n'));
  }

  private chunkArray(input: string[]): string[][] {
    const result: string[][] = [];

    let currentChunkSize = this.CODE_MARKER_LENGTH;
    let currentChunk: string[] = [];

    input.forEach(element => {
      if (this.isChunkSizeAcceptable(currentChunkSize, element)) {
        currentChunk.push(element);
        currentChunkSize += this.NEWLINE_LENGTH + element.length;
      } else {
        result.push(currentChunk);
        currentChunk = [element];
        currentChunkSize = this.CODE_MARKER_LENGTH + this.NEWLINE_LENGTH + element.length;
      }
    });

    result.push(currentChunk);
    return result;
  }

  private isChunkSizeAcceptable(
    currentChunkSize: number,
    newElement: string
  ) {
    return currentChunkSize + this.NEWLINE_LENGTH + newElement.length <= this.MAX_MESSAGE_LENGTH;
  }

  private specificChunk(chunk: string[], page: number, totalPages: number) {
    return [
      this.localeService.t('helpers.messageChunker.page', { current: page, totalPages }),
      ['```', ...chunk, '```'].join('\n')
    ];
  }
}
