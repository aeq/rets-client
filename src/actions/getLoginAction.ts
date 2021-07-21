import { IRetsClientOptions, IRetsRequestConfig, RetsRequestMethod } from '../types'
import { executeCall } from '../utils'
import { LoginParser } from '../stream'

export const getLoginAction =
  (actionConfig: IRetsClientOptions) => async (): Promise<Record<string, IRetsRequestConfig>> => {
    const { username, password } = actionConfig
    const baseAction = {
      ...actionConfig,
      method: RetsRequestMethod.Get,
      auth: {
        username,
        password,
      },
    }

    const loginParser = new LoginParser(baseAction)

    const { stream } = await executeCall(baseAction)

    stream.pipe(loginParser)

    await new Promise((fulfill) => loginParser.on('close', fulfill))

    return loginParser.actions
  }
