import { URL } from 'url'
import { Parser } from 'node-expat'

import { IRetsRequestConfig, RetsAction, RetsKeys } from 'types'

enum Status {
  Waiting = '',
  CollectingActions = 'actions',
}

const KEY_SPLIT = /=(.*)$/

export class LoginParser extends Parser {
  actions: Record<string, IRetsRequestConfig>

  status: Status

  baseAction: IRetsRequestConfig

  constructor(baseAction: IRetsRequestConfig) {
    super('UTF-8')
    this.actions = {}
    this.status = Status.Waiting
    this.baseAction = baseAction

    this.on('startElement', this.startElement)
    this.on('text', this.text)
  }

  startElement(name: string, attrs: any): void {
    switch (name) {
      case RetsKeys.Rets:
        if (attrs?.ReplyCode && attrs?.ReplyCode !== '0') {
          this.emit('error', new Error(`Error during login [${JSON.stringify(attrs)}]`))
        }
        break

      case RetsKeys.Response:
        this.status = Status.CollectingActions
        break

      default:
        throw new Error(`Unexpected Element: [${name}] [${JSON.stringify(attrs)}]`)
    }
  }

  text(text: string): void {
    if (this.status === Status.CollectingActions) {
      const [key, value] = text.split(KEY_SPLIT)

      if (Object.keys(RetsAction).includes(key)) {
        const { url: baseUrl } = this.baseAction
        const parsedURL = new URL(baseUrl)
        parsedURL.pathname = value
        const url = parsedURL.toString()

        this.actions[key] = {
          ...this.baseAction,
          url,
        }
      }
    }
  }
}
