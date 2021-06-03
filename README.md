# NodeJS Typescript RETS Client

A RETS (Real Estate Transaction Standard) Client written in Typescript.

Inspired by <https://github.com/WinUP/rets-client> and <https://github.com/zacronos/rets-client>

# Install

if using yarn: ```yarn add @aeq/rets-client```

if using npm: ```npm i @aeq/rets-client```

# Usage

```typescript

import { getClient, RetsMetadataType } from '@aeq/rets-client';

const config = {
  url: 'my-rets-url',
  username: 'my-rets-username',
  password: 'my-rets-password',
}

await getClient(config, async ({ search }) => {

  // Figure out the data structure
  const resources = await getMetadata({
    type: RetsMetadataType.Resource,
  })
  console.log('getMetadata.Resource', resources)

  const classes = await getMetadata({
    type: RetsMetadataType.Class,
  })
  console.log('getMetadata.Class', classes)

  // Search for data
  const listings = await search({
    query: '(Status=A)',
    limit: 5,
    searchType: 'Property',
    className: 'ResidentialProperty',
    culture: DdfCulture.EN_CA,
  })
  console.log('listing', listings)

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
