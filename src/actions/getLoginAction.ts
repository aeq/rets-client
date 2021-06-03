import { URL } from 'url'

import { IRetsClientOptions, IRetsRequestConfig, RetsAction, RetsRequestMethod } from 'types'
import { executeCall } from 'utils'
import { loginHandler } from 'handlers'

export const getLoginAction =
  (actionConfig: IRetsClientOptions) => async (): Promise<Record<string, IRetsRequestConfig>> => {
    const { url: baseUrl, username, password } = actionConfig
    const response = await executeCall({
      ...actionConfig,
      method: RetsRequestMethod.Get,
      auth: {
        username,
        password,
      },
    })
    const parsedUrl = new URL(baseUrl)

    const features = await loginHandler(response)

    return Object.keys(features).reduce((actions, key) => {
      parsedUrl.pathname = features[key]
      const isAction = Object.keys(RetsAction).includes(key)
      const url = isAction ? parsedUrl.toString() : ''
      return {
        ...actions,
        ...(isAction
          ? {
              [key]: {
                ...actionConfig,
                url,
                method: RetsRequestMethod.Get,
                auth: {
                  username,
                  password,
                },
                withCredentials: true,
              },
            }
          : {}),
      }
    }, {})
  }

// Object.keys(features).forEach((key) => {
//   if (Object.keys(RetsAction).includes(key)) {
//     const parsedURL = new URL(baseUrl)
//     parsedURL.pathname = features[key]
//     const url = parsedURL.toString()

//     this.actions[key] = {
//       ...this.options,
//       url,
//     }
//   }
// })
