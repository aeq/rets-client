import { IRetsClientOptions, IRetsRequestConfig, RetsAction, RetsClientActions } from '../types'
import { getLoginAction } from './getLoginAction'
import { getLogoutAction } from './getLogoutAction'
import { getMetadataAction } from './getMetadataAction'
import { getSearchAction } from './getSearchAction'
import { getObjectAction } from './getObjectAction'
import { getDataMapAction } from './getDataMapAction'

type GetClientCallback = (actions: RetsClientActions) => void

export const getClient = async (
  options: IRetsClientOptions,
  callback: GetClientCallback,
): Promise<void> => {
  let actions: Record<string, IRetsRequestConfig> = {}
  try {
    const login = getLoginAction(options)
    // login and get the supported actions

    actions = await login()

    // console.log('actions', actions)

    const search = getSearchAction(actions[RetsAction.Search])
    const getMetadata = getMetadataAction(actions[RetsAction.GetMetadata])
    const getDataMap = getDataMapAction(getMetadata)
    const getObject = getObjectAction(actions[RetsAction.GetObject])

    await callback({ search, getMetadata, getDataMap, getObject })
  } catch (e) {
    console.error('ERROR::', e)
  } finally {
    // const logout = getLogoutAction(actions[RetsAction.Logout])
    // await logout()
  }
}

// function(settings, handler) {
//   return Promise["try"](function() {
//     var client;
//     client = new Client(settings);
//     return client.login().then(function() {
//       return Promise["try"](function() {
//         return handler(client);
//       })["finally"](function() {
//         return client.logout();
//       });
//     });
//   });
// };
