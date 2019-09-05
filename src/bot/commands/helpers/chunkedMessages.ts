import localize from '@util/i18n/localize';

const MAX_MESSAGE_LENGTH = 2000;
const NEWLINE_LENGTH = '\n'.length;
const CODE_MARKER_LENGTH = '```'.length * 2 + NEWLINE_LENGTH;

const isChunkSizeAcceptable = (currentChunkSize: number, newElement: string) =>
  currentChunkSize + NEWLINE_LENGTH + newElement.length <= MAX_MESSAGE_LENGTH;

const chunkArray = (input: string[]): string[][] => {
  const result: string[][] = [];

  let currentChunkSize = CODE_MARKER_LENGTH;
  let currentChunk: string[] = [];

  input.forEach(element => {
    if (isChunkSizeAcceptable(currentChunkSize, element)) {
      currentChunk.push(element);
      currentChunkSize += NEWLINE_LENGTH + element.length;
    } else {
      result.push(currentChunk);
      currentChunk = [element];
      currentChunkSize = CODE_MARKER_LENGTH + NEWLINE_LENGTH + element.length;
    }
  });

  result.push(currentChunk);
  return result;
};

const specificChunk = (chunk: string[], page: number, total: number) => [
  localize.t('helpers.messageChunker.page', { current: page, total }),
  ['```', ...chunk, '```'].join('\n')
];

const chunkedMessages = (toChunk: string[], page = 0): string[] => {
  const chunks = chunkArray(toChunk);

  const index = page - 1;
  if (index >= 0 && index < chunks.length) {
    return specificChunk(chunks[index], page, chunks.length);
  }

  return chunks.map(chunk => ['```', ...chunk, '```'].join('\n'));
};

export default chunkedMessages;
