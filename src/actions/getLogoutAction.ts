import { IRetsRequestConfig } from '../types'
import { executeCall } from '../utils'

export const getLogoutAction = (actionConfig: IRetsRequestConfig) => async () => {
  const { stream } = actionConfig ? await executeCall(actionConfig) : null

  await new Promise((fulfill) => stream.on('close', fulfill))
}
