import { Transform, pipeline, Readable } from 'stream'
import { Parser } from '@aequilibrium/xmlr'

import { RetsKeys } from '../types'

enum Mode {
  Waiting = '',
  Columns = 'columns',
  Data = 'data',
}

const DATA_SPLIT = '\t'

export const getSearchItemStream = (
  xmlStream: Readable | null,
  processText = (text: string) => text,
) => {
  const transformer = new Transform({
    objectMode: true,
    transform(data, _, callback) {
      // console.log('transformer received data', data.Ml_num)
      this.push(data)
      callback()
    },
    flush(callback) {
      callback()
    },
  })
  const searchParser = new Parser() // new Parser('UTF-8')

  let columns: string[] = []
  let mode = Mode.Waiting
  let delimiter: string | null = null
  let content = ''

  const onStartElement = (name: string, attrs: Record<string, string>) => {
    // console.log('startElement', name, attrs)
    switch (name) {
      case RetsKeys.Rets:
        if (attrs?.ReplyCode && attrs?.ReplyCode !== '0') {
          throw new Error(`Error during login [${JSON.stringify(attrs)}]`)
        }
        break

      case RetsKeys.Columns:
        mode = Mode.Columns
        break

      case RetsKeys.Data:
        mode = Mode.Data
        break

      case RetsKeys.Delimiter:
        delimiter = attrs.value
        // console.log('delim', this.delimiter)
        break

      default:
        throw new Error(`Unexpected Element: [${name}] [${JSON.stringify(attrs)}]`)
    }
    content = ''
  }

  const onEndElement = (name: string) => {
    const data = content.split(DATA_SPLIT)

    if (name === RetsKeys.Rets) {
      transformer.end()
    }

    switch (mode) {
      case Mode.Columns:
        if (name === RetsKeys.Columns) {
          columns = data
        }
        break

      case Mode.Data:
        if (name === RetsKeys.Data) {
          transformer.write(
            columns.reduce(
              (result, key, index) => (key !== '' ? { ...result, [key]: data[index] } : result),
              {},
            ),
          )
        }
        break

      default:
        break
    }
    mode = Mode.Waiting
  }

  const onText = (text: string) => {
    content += processText(text)
  }

  const onEnd = () => {
    // console.log('ending stream!')
    // transformer.end()
  }
  const onClose = () => {
    // console.log('onClose!')
    // transformer.end()
  }

  // convert the data events to a stream of events
  searchParser
    .on('startElement', onStartElement)
    .on('endElement', onEndElement)
    .on('text', onText)
    .on('end', onEnd)
    .on('close', onClose)

  // pipeline([xmlStream, searchParser], (err, val) => {
  //   console.log('pipeline finished', err, val)
  // })
  if (xmlStream !== null) {
    xmlStream.pipe(searchParser)
  }

  return transformer
}
