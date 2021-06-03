import { loginHandler, searchHandler, metadataHandler } from 'handlers'
import { executeCall } from 'utils'
import {
  IRetsClientOptions,
  RetsAction,
  IRetsMetadataOptions,
  IRetsSearchOptions,
  IRetsRequestConfig,
  RetsQueryType,
  RetsQueryStandardNamesType,
  RetsFormat,
  RetsQueryCountType,
  RetsRequestMethod,
} from 'types'
import { URL } from 'url'

export class RetsClient {
  public readonly options: IRetsRequestConfig

  constructor(options: IRetsClientOptions) {
    const { url, username, password } = options

    this.options = {
      method: RetsRequestMethod.Get,
      // baseURL,
      url,
    }

    // initialize the default Login action
    this.actions = {
      [RetsAction.Login]: {
        ...this.options,
        auth: {
          username,
          password,
        },
      },
    }
  }

  public readonly actions: { [action: string]: IRetsRequestConfig } = {}

  /**
   * Login Handler
   */
  public async login(): Promise<void> {
    const response = await executeCall(this.actions[RetsAction.Login])

    const { url: baseUrl } = this.actions[RetsAction.Login]
    const features = await loginHandler(response)

    Object.keys(features).forEach((key) => {
      if (Object.keys(RetsAction).includes(key)) {
        const parsedURL = new URL(baseUrl)
        parsedURL.pathname = features[key]
        const url = parsedURL.toString()

        this.actions[key] = {
          ...this.options,
          url,
        }
      }
    })
  }

  public async logout(): Promise<void> {
    const response = this.actions[RetsAction.Logout]
      ? await executeCall(this.actions[RetsAction.Logout])
      : null
    // do something with logout?
  }

  public async search(userOptions: IRetsSearchOptions): Promise<any> {
    const {
      queryType,
      restrictedIndicator,
      standardNames,
      format,
      offset,
      count,
      limit,
      query,
      searchType,
      className,
      culture,
      select,
    } = userOptions
    const data = {
      Query: query,
      SearchType: searchType,
      Class: className,
      QueryType: queryType || RetsQueryType.DMQL2,
      RestrictedIndicator: restrictedIndicator || '***',
      StandardNames: standardNames || RetsQueryStandardNamesType.UseSystemName,
      Format: format || RetsFormat.CompactDecoded,
      Offset: offset || 1,
      Count: count || RetsQueryCountType.OnlyRecord,
      Limit: limit || 'NONE',
      Culture: culture,
      Select: select ? select.join(',') : undefined,
    }
    const response = this.actions[RetsAction.Search]
      ? await executeCall(this.actions[RetsAction.Search], data)
      : null

    const results = searchHandler(response)

    return results
  }

  public async getMetadata(userOptions: IRetsMetadataOptions): Promise<any> {
    const { type, id, format, classType } = userOptions
    const data = {
      Type: type,
      ID: classType && id ? `${id}:${classType}` : id || '0',
      Format: format || RetsFormat.Compact,
    }

    const response = this.actions[RetsAction.GetMetadata]
      ? await executeCall(this.actions[RetsAction.GetMetadata], data)
      : null

    const results = await metadataHandler(response)

    return results[type] || null
  }
}
