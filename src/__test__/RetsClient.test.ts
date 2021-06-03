import axios from 'axios'
import { RetsAction } from 'types/RetsAction'
import { RetsClient } from '../RetsClient'

import { loginSuccess } from './login.samples'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('integration test', () => {
  const clientOptions = {
    url: 'xx',
    username: 'test',
    password: 'test',
  }

  it('can be created', () => {
    const client = new RetsClient(clientOptions)

    expect(client).toBeTruthy()
  })

  it('logs in', () => {
    const client = new RetsClient(clientOptions)
    mockedAxios.get.mockResolvedValue(loginSuccess)
    client.login()

    expect(client.actions[RetsAction.Logout]).toBeTruthy()
  })

  // it('log in failure', () => {
  //   const client = new RetsClient(clientOptions)
  //   mockedAxios.get.mockResolvedValue(loginSuccess)
  //   client.login()
  // })
})
