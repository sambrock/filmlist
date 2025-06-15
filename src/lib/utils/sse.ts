export const readEventStream = async <T extends Record<string, (data: string) => void>>(
  response: Response,
  callback: T
) => {
  const decoder = new TextDecoder();
  const reader = response.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split('\n');

    const event = lines.shift()!.replace('event:', '').trim();
    const data = lines.reduce((acc, line) => {
      if (line.startsWith('data:')) {
        return acc + line.replace('data:', '').trim();
      }
      return acc;
    }, '');

    callback[event](data);
  }
};
