import { IRetsClientOptions, IRetsRequestConfig, RetsAction, RetsClientActions } from 'types'
import { getLoginAction } from './getLoginAction'
import { getLogoutAction } from './getLogoutAction'
import { getMetadataAction } from './getMetadataAction'
import { getSearchAction } from './getSearchAction'

type GetClientCallback = (actions: RetsClientActions) => void

export const getClient = async (
  options: IRetsClientOptions,
  callback: GetClientCallback,
): Promise<void> => {
  let actions: Record<string, IRetsRequestConfig> = {}
  try {
    const login = getLoginAction(options)
    // login and get the allowed actions
    actions = await login()

    const search = getSearchAction(actions[RetsAction.Search])
    const getMetadata = getMetadataAction(actions[RetsAction.GetMetadata])
    // const getObjects = getObjectsAction(options)
    await callback({ search, getMetadata })
  } catch (e) {
    console.error('ERROR::', e)
  } finally {
    const logout = getLogoutAction(actions[RetsAction.Logout])
    await logout()
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
