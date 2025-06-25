export const readEventStream = async (response: Response, onData: (data: string) => void) => {
  const decoder = new TextDecoder();
  const reader = response.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.trim() === '' || line.startsWith(':') || line.startsWith('event:')) {
        continue;
      }

      const data = line.replace(/^data:\s*/, '').trim();
      onData(data);
    }
  }
};
