export const bufferSplit = (buffer: Buffer, splitter: Buffer): Buffer[] => {
  const nextPosition = buffer.indexOf(splitter)
  if (nextPosition >= 0) {
    const before = Buffer.alloc(nextPosition)
    buffer.copy(before, undefined, 0, nextPosition)

    return [
      ...(before.length > 0 ? [before] : []),
      ...bufferSplit(buffer.slice(nextPosition + splitter.length), splitter),
    ]
  }
  return [buffer]
}
