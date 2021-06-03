import { IRetsMetadataOptions } from 'types'
import dotenv from 'dotenv'
import { RetsClient, RetsFormat, DdfCulture, RetsMetadataType } from '.'
// const { RetsClient, RetsVersion, RetsFormat, DdfCulture, RetsRequestMethod } = require('./src')

dotenv.config()

const client = new RetsClient({
  url: process.env.RETS_TEST_URL || '',
  username: process.env.RETS_TEST_USERNAME || '',
  password: process.env.RETS_TEST_PASSWORD || '',
})

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

const testLogin = async () => {
  console.log('> testLogin')
  await client.login()
  console.log('>> Login:: success')
  await client.logout()
  console.log('>> Logout:: success')
}

const testSearch = async () => {
  await client.login()
  const listing = await client.search({
    // query: '(Status=A)',
    query: '(timestamp_sql=2021-04-01T00:00:00+)',
    limit: 2,
    searchType: TREBResources.Property,
    className: TREBClass.ResidentialProperty,
    culture: DdfCulture.EN_CA,
  })
  console.log('listing', listing)
  await client.logout()
}

const testMetadata = async () => {
  await client.login()
  console.log('>>Login success!')
  const metadata = await client.getMetadata({
    type: RetsMetadataType.Resource,
  })
  console.log('>> Metadata success!', metadata)
  const metadata2 = await client.getMetadata({
    type: RetsMetadataType.Class,
    // classType: 'CommercialProperty',
  })
  console.log('>> Metadata2 success!', metadata2)

  // // gets fields for a class type
  // const metadata3 = await client.getMetadata({
  //   type: RetsMetadataType.Table,
  //   classType: TREBClass.ResidentialProperty,
  // })
  // console.log('>> Metadata3 success!', metadata3)

  // const metadata4 = await client.getMetadata({
  //   type: RetsMetadataType.Objects,
  //   // classType: 'CommercialProperty',
  // })
  // console.log('>> Metadata4 success!', metadata4)
  // await client.logout()
}

// const testAutologout = async () => {
//   getAutologoutClient(config, (client) => {
//     await client.serach({})
//   })
// }

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
  await testSearch()

  console.log('Finish!')
}

try {
  console.log('Begin!')
  main()
} catch (e) {
  console.log('ERROR:: ', e)
}
