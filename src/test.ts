import dotenv from 'dotenv'
import { promises as fs, createWriteStream } from 'fs'
import { Transform, Writable, Readable } from 'stream'
import { RetsMetadataType, ReturnType } from './types'
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

  onResponse: async ({ response, action }: { response: any; action: string }) => {
    const date = dateToString(new Date())
    await fs.writeFile(`response-${date}-${action}.raw`, response.data)
  },
  onParse: async ({ response, action }: { response: any; action: string }) => {
    const date = dateToString(new Date())
    await fs.writeFile(`response-parsed-${date}-${action}.json`, response.data)
  },
  // writeResponseToFile: true,
  // writeRawResponseToFile: true,
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
      limit: 2,
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
    let avgPrice = 0
    let count = 0

    const searchStream = (
      (await search({
        // query: '(Status=A)',
        query: '(timestamp_sql=2021-06-01T00:00:00+)',
        limit: 2,
        searchType: TREBResources.Property,
        className: TREBClass.ResidentialProperty,
        returnType: ReturnType.Stream,
      })) as Readable
    )
      .pipe(
        new Transform({
          objectMode: true,
          transform: (data, _, done) => {
            const orig = parseFloat(data.Orig_dol)
            avgPrice = (avgPrice * count + (Number.isNaN(orig) ? 0 : orig)) / (count + 1)
            count += Number.isNaN(orig) ? 0 : 1
            done(null, data)
          },
        }),
      )
      .pipe(
        new Writable({
          objectMode: true,
          write: (data, _, done) => {
            console.log('Store to DB!', data.Ml_num)
            done()
          },
        }),
      )
    // wait for the stream to finish
    await new Promise((fulfill) => searchStream.on('close', fulfill))
    console.log('avgPrice', avgPrice, ' out of ', count)
  })
}

const testMetadata = async () => {
  console.log('>> testMetada')
  await getClient(config, async ({ getMetadata }) => {
    const resources = await getMetadata({
      type: RetsMetadataType.Resource,
    })
    console.log('getMetadata.Resource', resources)
    // const classes = await getMetadata({
    //   type: RetsMetadataType.Class,
    // })
    // console.log('getMetadata.Class', classes)
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
    // const objects = await getMetadata({
    //   type: RetsMetadataType.Objects,
    // })
    // console.log('getMetadata.Class', objects)
  })
}

const testDataMap = async () => {
  console.log('>> testDataMap')
  await getClient(config, async ({ getDataMap }) => {
    const dataMap = await getDataMap()
    console.log('getDataMap', dataMap)
  })
}

// const testObject = async () => {
//   await client.login()
//   const listing = await client.search({
//     format: RetsFormat.StandardXml,
//     query: '...',
//     searchType: '...',
//     class: '...',
//     culture: DdfCulture.EN_CA
//   })
//   await client.logout()
// }

const main = async () => {
  console.log('Start!')
  // await testLogin()
  // await testMetadata()
  // await testDataMap()
  // await testSearch()
  await testStreamSearch()

  console.log('Finish!')
}

try {
  console.log('Begin!')
  main()
} catch (e) {
  console.log('ERROR:: ', e)
}
