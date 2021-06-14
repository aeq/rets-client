import { Writable, Transform } from 'stream'

export class ObjectCollector extends Writable {
  objects: Array<Record<string, any>>

  constructor(options = {}) {
    super({
      ...options,
      objectMode: true,
      // transform: (item: any, _, done: () => void) => {
      //   // console.log('Receive Item', item.Ml_num) // , this.data)
      //   this.objects.push(item)
      //   done()
      // },
      write: (item: any, _, done: () => void) => {
        // console.log('Receive Item', item.Ml_num) // , this.data)
        this.objects.push(item)
        done()
      },
      // writev: (items: any[], done: () => void) => {
      //   console.log(
      //     'Receive Items',
      //     items.map((item) => item.Ml_num),
      //   ) // , this.data)
      //   items.forEach((item) => this.objects.push(item))
      //   done()
      // },
      // destroy: () => {
      //   this.objects = []
      // },
    })

    this.objects = []
  }
}
