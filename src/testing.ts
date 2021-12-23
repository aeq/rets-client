import dotenv from 'dotenv'
import { promises as fs, createWriteStream } from 'fs'
import { createHash } from 'crypto'
import { Transform, Writable, Readable, PassThrough } from 'stream'
import { unescape } from 'querystring'
import {
  IRetsClientOptions,
  RetsMetadataType,
  ReturnType,
  IRetsRequestConfig,
  RetsObject,
} from './types'
import { DdfCulture, getClient, IRetsMetadataOptions } from '.'
// const { RetsClient, RetsVersion, RetsFormat, DdfCulture, RetsRequestMethod } = require('./src')

dotenv.config()

const dateToString = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`

const config = {
  url: process.env.RETS_TEST_URL || '',
  username: process.env.RETS_TEST_USERNAME || '',
  password: process.env.RETS_TEST_PASSWORD || '',

  // debugResponseFilename: ({ method, url }: IRetsRequestConfig) => {
  //   const now = new Date()
  //   const hash = createHash('md5')
  //   // build hash name
  //   hash.update(url.toString())

  //   return `tests/${now.toISOString()}-${hash.digest('hex').toString()}.raw`
  // },
}

/// /// TREB Specifics //////
enum TREBClass {
  CondoProperty = 'CondoProperty',
  DeletedProperty = 'DeletedProperty',
  ResidentialProperty = 'ResidentialProperty',
  CommercialProperty = 'CommercialProperty',
}

enum TREBResources {
  Property = 'Property',
}

enum TREBObjects {
  Photo = 'Photo',
}

/// //// Testers /////

const testLogin = async () => {
  console.log('>> testLogin')
  await getClient(config, async () => {
    console.log('Logged In!')
  })
}

const testSearch = async () => {
  console.log('>> testSearch')
  await getClient(config, async ({ search }) => {
    const listings = (await search({
      // query: '(Status=A)',
      query: '(timestamp_sql=2021-06-01T00:00:00+)',
      limit: 4,
      searchType: TREBResources.Property,
      className: TREBClass.ResidentialProperty,
    })) as Record<string, string>[]

    console.log(
      'listings',
      listings.map((item) => item.Ml_num),
    )
  })
}
const testStreamSearch = async () => {
  console.log('>> testStreamSearch')
  await getClient(config, async ({ search }) => {
    const avgPrice = 0
    let count = 0

    const saveToFile = new PassThrough({
      objectMode: true,
    })

    const searchStream = (
      (await search({
        // query: '(Status=A)',
        query: '(timestamp_sql=2021-07-15T00:00:00+)',
        // query: '(ml_num=E5230190)',
        limit: 3,
        searchType: TREBResources.Property,
        className: TREBClass.ResidentialProperty,
        returnType: ReturnType.Stream,
        processText: (text: string) => unescape(text),
      })) as Readable
    )
      // .pipe(
      //   new Transform({
      //     objectMode: true,
      //     transform: (data, _, done) => {
      //       const orig = parseFloat(data.Orig_dol)
      //       avgPrice = (avgPrice * count + (Number.isNaN(orig) ? 0 : orig)) / (count + 1)
      //       count += Number.isNaN(orig) ? 0 : 1
      //       done(null, data)
      //     },
      //   }),
      // )
      .pipe(saveToFile)
      .pipe(
        new Writable({
          objectMode: true,
          write: (data, _, done) => {
            count += 1
            if (!data.Ml_num.match(/^[A-Z]\d{7}$/)) {
              console.log('Invalid!!!!', count, data.Ml_num)
            }
            done()
          },
        }),
      )
    saveToFile.pipe(
      new Writable({
        objectMode: true,
        write: (data, _, done) => {
          const saveData = async (save: Buffer) => {
            await fs.appendFile('test.json', JSON.stringify(save))
            done()
          }
          saveData(data)
        },
      }),
    )

    // wait for the stream to finish
    await new Promise((fulfill) => searchStream.on('close', fulfill))
    console.log('avgPrice', avgPrice, ' out of ', count)
  })
}

const testObjects = async () => {
  console.log('>> testObjects')
  await getClient(config, async ({ getObject }) => {
    const objects = await getObject({
      resource: TREBResources.Property,
      type: TREBObjects.Photo,
      contentId: 'N5280350',
    })

    console.log('objects', objects)
    const dir = 'tests'
    fs.mkdir(dir, { recursive: true })
    console.log(`saveToFiles in directory [${dir}]`)
    objects.forEach((obj) => {
      if (obj.contentType === 'image/jpeg') {
        fs.writeFile(`${dir}/${obj.objectId}.jpg`, obj.data)
      }
    })
  })
}

const testMetadata = async () => {
  console.log('>> testMetada')
  await getClient(config, async ({ getMetadata }) => {
    const resources = await getMetadata({
      type: RetsMetadataType.Resource,
    })
    console.log('getMetadata.Resource', resources)
    const classes = await getMetadata({
      type: RetsMetadataType.Class,
    })
    console.log('getMetadata.Class', classes)
    // const tables = await getMetadata({
    //   type: RetsMetadataType.Table,
    //   classType: 'CommercialProperty',
    //   id: 'Property',
    // })
    // await fs.writeFile(
    //   'tables.json',
    //   JSON.stringify(
    //     {
    //       tables,
    //     },
    //     undefined,
    //     2,
    //   ),
    // )
    // console.log('getMetadata.Table', tables)
    const objects = await getMetadata({
      type: RetsMetadataType.Objects,
    })
    console.log('getMetadata.Class', objects)
  })
}

const testDataMap = async () => {
  console.log('>> testDataMap')
  await getClient(config, async ({ getDataMap }) => {
    const dataMap = await getDataMap()
    console.log('getDataMap', dataMap)
  })
}

const main = async () => {
  console.log('Start!')
  // await testLogin()
  // await testMetadata()
  // await testDataMap()
  // await testSearch()
  // await testObjects()
  await testStreamSearch()

  console.log('Finish!')
}

try {
  console.log('Begin!')
  main()
} catch (e) {
  console.log('ERROR:: ', e)
}
