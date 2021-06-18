import { URL } from 'url'
import { Parser } from '@aequilibrium/xmlr'

import { IRetsRequestConfig, RetsAction, RetsKeys, RetsMetadataType } from '../types'

enum Status {
  Waiting = '',
  Resources = 'resources',
  Columns = 'columns',
  Data = 'data',
}

const DATA_SPLIT = '\t'

export class MetadataParser extends Parser {
  data: Record<string, any>

  resource: string

  columns: string[]

  status: Status

  constructor() {
    super()

    this.data = []
    this.resource = ''
    this.columns = []
    this.status = Status.Waiting

    this.on('startElement', this.startElement)
    // this.on('endElement', this.endElement)
    this.on('text', this.text)
  }

  startElement(name: string, attrs: any): void {
    // console.log('startElement', name, attrs)
    switch (name) {
      case RetsKeys.Rets:
        if (attrs?.ReplyCode && attrs?.ReplyCode !== '0') {
          this.emit('error', new Error(`Error during login [${JSON.stringify(attrs)}]`))
        }
        break

      case RetsKeys.Columns:
        this.status = Status.Columns
        break

      case RetsKeys.Data:
        this.status = Status.Data
        break

      default:
        if ((Object.values(RetsMetadataType) as string[]).includes(name)) {
          this.resource = name
          this.data[this.resource] = []
          // console.log('startElement is RetsMetadataType', this.data)
        } else throw new Error(`Unexpected Element: [${name}] [${JSON.stringify(attrs)}]`)
    }
  }

  // endElement(name: string): void {
  //   console.log('endElement', name)
  //   // this.status = Status.Waiting
  //   switch (name) {
  //     case RetsKeys.Columns:
  //       if (this.status === Status.CollectingActions) {
  //         this.status = Status.Waiting
  //       }
  //       break

  //     default:
  //       break
  //   }
  // }

  text(text: string): void {
    const trimmed = text.trim()
    if (trimmed.length === 0) return

    const data = text.split(DATA_SPLIT)
    switch (this.status) {
      case Status.Columns:
        this.columns = data
        // this.status = Status.Waiting
        break
      case Status.Data:
        this.data[this.resource].push(
          this.columns.reduce((result, key, index) => ({ ...result, [key]: data[index] }), {}),
        )
        // this.status = Status.Waiting
        break
      default:
        break
    }
  }
}
