import { Writable } from 'stream'

export class StreamToString extends Writable {
  parts: Array<any>

  constructor(options = {}) {
    super({
      ...options,
      write: (chunk: any, _, done: () => void) => {
        // console.log('add chunk', chunk)
        this.parts.push(chunk)
        done()
      },
    })

    this.parts = []
  }

  toBuffer(): Buffer {
    return Buffer.concat(this.parts)
  }

  toString(): string {
    return Buffer.concat(this.parts).toString()
  }
}
