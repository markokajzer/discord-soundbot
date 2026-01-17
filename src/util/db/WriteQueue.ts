let isProcessing = false;
const writeQueue: Array<() => void> = [];

export const queuedWrite = async (writeFn: () => void): Promise<void> => {
  return new Promise((resolve) => {
    writeQueue.push(() => {
      writeFn();
      resolve();
    });

    processQueue();
  });
};

const processQueue = () => {
  if (isProcessing) return;

  isProcessing = true;

  while (writeQueue.length > 0) {
    const nextWrite = writeQueue.shift();
    if (nextWrite) nextWrite();
  }

  isProcessing = false;
};
