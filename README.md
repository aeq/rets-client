# Typescript RETS Client

A RETS (Real Estate Transaction Standard) Client written in Typescript.

# Install

if using yarn: ```yarn add @aequilibrium/rets-client```

if using npm: ```npm i @aequilibrium/rets-client```

# Usage

```typescript

import { getClient, RetsMetadataType, ReturnType } from '@aequilibrium/rets-client';

const config = {
  url: 'my-rets-url',
  username: 'my-rets-username',
  password: 'my-rets-password',
}

await getClient(config, async ({ search, getMetadata, getDataMap }) => {

  // Figure out the data structure
  const resources = await getMetadata({
    type: RetsMetadataType.Resource,
  })
  console.log('getMetadata.Resource', resources)

  const classes = await getMetadata({
    type: RetsMetadataType.Class,
  })
  console.log('getMetadata.Class', classes)

  // Build a Datamap of the RETS Data Structure
  const dataMap = await getDataMap()
  console.log('getDataMap', dataMap)


  // Search for data 
  const listings = await search({
    query: '(Status=A)',
    limit: 5,
    searchType: 'Property',
    className: 'ResidentialProperty',
    culture: DdfCulture.EN_CA,
  })
  console.log('listing', listings)

  // search for data using streams
  let count = 0
  const searchStream = (
    (await search({
      query: '(Status=A)',
      limit: 5,
      searchType: 'Property',
      className: 'ResidentialProperty',
      culture: DdfCulture.EN_CA,
      returnType: ReturnType.Stream,
    })) as Readable
  )
    .pipe(
      new Writable({
        objectMode: true,
        write: (data, _, done) => {
          count += 1
          done()
        },
      }),
    )
  // wait for the stream to finish
  await new Promise((fulfill) => searchStream.on('close', fulfill))
  console.log('final Count', count)

  // retrieve some objects/images
})



```

# Development/Configuration

If you're developing this app you can use the test file by setting up the user configuration by adding the following ot your ```.env``` file.

```env
RETS_TEST_URL=http://www...
RETS_TEST_USERNAME=...
RETS_TEST_PASSWORD=...
```

and then run the test file by running: ```yarn start```

# Acknowledgements

Inspired by:

* <https://github.com/WinUP/rets-client>
* <https://github.com/zacronos/rets-client>
