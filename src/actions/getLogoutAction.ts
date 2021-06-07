import { IRetsRequestConfig } from '../types'
import { executeCall } from '../utils'

export const getLogoutAction = (actionConfig: IRetsRequestConfig) => async () => {
  const response = actionConfig ? await executeCall(actionConfig) : null
}
