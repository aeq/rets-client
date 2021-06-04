import dotenv from 'dotenv'
import { promises as fs } from 'fs'
import { RetsMetadataType } from 'types'
import { DdfCulture, getClient, IRetsMetadataOptions } from '.'
// const { RetsClient, RetsVersion, RetsFormat, DdfCulture, RetsRequestMethod } = require('./src')

dotenv.config()

const config = {
  url: process.env.RETS_TEST_URL || '',
  username: process.env.RETS_TEST_USERNAME || '',
  password: process.env.RETS_TEST_PASSWORD || '',
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
    const listing = await search({
      // query: '(Status=A)',
      query: '(timestamp_sql=2021-04-01T00:00:00+)',
      limit: 2,
      searchType: TREBResources.Property,
      className: TREBClass.ResidentialProperty,
      culture: DdfCulture.EN_CA,
    })
    console.log('listing', listing)
  })
}

const testMetadata = async () => {
  console.log('>> testMetada')
  await getClient(config, async ({ getMetadata }) => {
    // const resources = await getMetadata({
    //   type: RetsMetadataType.Resource,
    // })
    // console.log('getMetadata.Resource', resources)

    // const classes = await getMetadata({
    //   type: RetsMetadataType.Class,
    // })
    // console.log('getMetadata.Class', classes)

    const tables = await getMetadata({
      type: RetsMetadataType.Table,
      classType: 'CommercialProperty',
      id: 'Property',
    })
    console.log('getMetadata.Table', tables)

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
    // const condoKeys: Array<string> = dataMap?.Property?.CondoProperty
    // const residentialKeys: Array<string> = dataMap?.Property?.ResidentialProperty
    // const commercialKeys: Array<string> = dataMap?.Property?.CommercialProperty
    // const inCondoNotResidential = condoKeys.filter((x) => !residentialKeys.includes(x))
    // const inResidentialNotCondo = residentialKeys.filter((x) => !condoKeys.includes(x))
    // const inCondoAndResidential = condoKeys.filter((x) => residentialKeys.includes(x))
    // const inCondoAndResidentialAndCommercial = inCondoAndResidential.filter((x) =>
    //   commercialKeys.includes(x),
    // )

    // console.log('inCondoRes', inCondoAndRes)
    // console.log('inResNotCondo', inResNotCondo)
    // console.log('inCondoNotRes', inCondoNotRes)
    // console.log('inCondoAndResAndCom', inCondoAndResAndCom)

    // await fs.writeFile(
    //   'columns.json',
    //   JSON.stringify(
    //     {
    //       condoKeys,
    //       residentialKeys,
    //       commercialKeys,
    //       inCondoNotResidential,
    //       inResidentialNotCondo,
    //       inCondoAndResidential,
    //       inCondoAndResidentialAndCommercial,
    //     },
    //     undefined,
    //     2,
    //   ),
    // )
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
  // await testMetadata()
  await testDataMap()

  console.log('Finish!')
}

try {
  console.log('Begin!')
  main()
} catch (e) {
  console.log('ERROR:: ', e)
}
