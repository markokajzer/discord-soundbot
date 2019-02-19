import LocaleService from '@util/i18n/LocaleService';

export default class MessageChunker {
  private readonly MAX_MESSAGE_LENGTH = 2000;
  private readonly CODE_MARKER_LENGTH = '```'.length * 2;

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

    let totalLength = 0;
    let temp: string[] = [];

    for (const element of input) {
      if (this.isChunkSizeAcceptable(totalLength, temp.length, element.length)) {
        result.push(temp);
        temp = [element];
        totalLength = element.length;
        continue;
      }

      temp.push(element);
      totalLength += element.length;
    }

    result.push(temp);
    return result;
  }

  private isChunkSizeAcceptable(numberOfChars: number,
                                numberOfElements: number,
                                lengthOfCurrentElement: number) {
    const currentChunkSize = numberOfChars + (numberOfElements - 1) + lengthOfCurrentElement;
    return currentChunkSize + this.CODE_MARKER_LENGTH > this.MAX_MESSAGE_LENGTH;
  }

  private specificChunk(chunk: string[], page: number, totalPages: number) {
    return [
      this.localeService.t('helpers.messageChunker.page', { current: page, totalPages }),
      ['```', ...chunk, '```'].join('\n')
    ];
  }
}
