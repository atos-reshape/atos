export function removeBomFromBuffer(buffer: Buffer): Buffer {
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return buffer.slice(3);
  }

  return buffer;
}
