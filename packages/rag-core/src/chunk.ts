export function chunkMarkdown(text: string, maxChars = 1200): string[] {
  const lines = text.split('\n');
  const chunks: string[] = [];
  let current = '';
  let currentHeading = '';

  for (const line of lines) {
    if (/^#{1,4}\s/.test(line)) {
      if (current.trim().length > 80) {
        chunks.push(current.trim());
        current = '';
      }
      currentHeading = line.trim();
      current = `${currentHeading}\n`;
      continue;
    }

    const next = current + line + '\n';
    if (next.length > maxChars && current.trim().length > 0) {
      chunks.push(current.trim());
      current = currentHeading ? `${currentHeading}\n${line}\n` : `${line}\n`;
    } else {
      current = next;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  if (chunks.length === 0 && text.trim()) {
    for (let i = 0; i < text.length; i += maxChars) {
      chunks.push(text.slice(i, i + maxChars).trim());
    }
  }

  return chunks.filter((c) => c.length > 40);
}
