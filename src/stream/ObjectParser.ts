import { Writable } from 'stream'

import { bufferSplit, readRetsObject } from '../utils'
import { RetsObject } from '../types'

// Content-Type: image/jpeg
// Content-ID: N5280350
// Object-ID: 7
// Description:

export class ObjectParser extends Writable {
  objects: Array<RetsObject>

  chunks: Array<any>

  boundary: Buffer

  boundaryPrefix: Buffer

  constructor(options = { boundaryPrefix: Buffer.from('--'), boundary: Buffer.from('') }) {
    super({
      ...options,
      write: (chunk: any, _, done: () => void) => {
        // console.log('add chunk', chunk)
        this.chunks.push(chunk)
        done()
      },
    })

    const { boundaryPrefix, boundary } = options

    this.on('close', this.onClose)

    this.boundaryPrefix = boundaryPrefix
    this.boundary = boundary
    this.objects = []
    this.chunks = []
  }

  onClose() {
    // convert chunks to buffer
    const fullBuffer = Buffer.concat(this.chunks)
    this.chunks = []

    const fullBoundary = Buffer.from(this.boundaryPrefix.toString() + this.boundary.toString())

    // begin parsing buffer
    const bufferedObjects = bufferSplit(fullBuffer, fullBoundary)

    this.objects = bufferedObjects
      .map((obj) => readRetsObject(obj))
      .filter((obj) => obj !== undefined) as RetsObject[]
  }
}
