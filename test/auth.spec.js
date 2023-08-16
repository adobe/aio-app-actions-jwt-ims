/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const action = require('../src/auth.js')
const auth = require('@adobe/jwt-auth')

jest.mock('@adobe/jwt-auth')

const commonParams = {
  jwt_client_id: 'a70b86e38a324b9d87cab8c074ecf69a',
  jwt_client_secret: 'dummysecret',
  technical_account_id: 'dummy@techacct.adobe.com',
  org_id: 'dummy@AdobeOrg',
  meta_scopes: ['ent_analytics_bulk_ingest_sdk', 'ent_campaign_sdk'],
  private_key: [
    '-----BEGIN RSA PRIVATE KEY-----',
    'aEnmX2RwnWCUTt3W6FIlajR/yJHR7mpetqbVjgwhnxDgbi5tyHI=',
    '-----END RSA PRIVATE KEY-----',
    ],
  persistence: 'true'
}

beforeEach(() => {
  jest.resetModules()
  auth.mockReset()
})

describe('ims-jwt', () => {
  describe('with all values and mocked jwt-auth library', () => {
    test('should work', async () => {
      auth.mockReturnValueOnce({
        access_token: 'access_token'
      })

      const params = commonParams
      const result = await action(params)
      expect(result).toEqual(
        {
          accessToken: 'access_token',
          accessTokenExpiry: undefined,
          provider: 'adobe',
          profileID: 'a70b86e38a324b9d87cab8c074ecf69a',
          refreshToken: 'NA'
        })
    })

    test('meta_scopes is a string (array)', async () => {
      auth.mockReturnValueOnce({
        access_token: 'access_token'
      })

      const params = {
        ...commonParams,
        meta_scopes: JSON.stringify([ 'some', 'value', 'here'])
      }
      const result = await action(params)
      expect(result).toEqual(
        {
          accessToken: 'access_token',
          accessTokenExpiry: undefined,
          provider: 'adobe',
          profileID: 'a70b86e38a324b9d87cab8c074ecf69a',
          refreshToken: 'NA'
        })
    })


    test('private_key is a string (array)', async () => {
      auth.mockReturnValueOnce({
        access_token: 'access_token'
      })

      const params = {
        ...commonParams,
        private_key: JSON.stringify([ 'some', 'value', 'here'])
      }
      const result = await action(params)
      expect(result).toEqual(
        {
          accessToken: 'access_token',
          accessTokenExpiry: undefined,
          provider: 'adobe',
          profileID: 'a70b86e38a324b9d87cab8c074ecf69a',
          refreshToken: 'NA'
        })
    })

    test('persistence not set (false)', async () => {
      auth.mockReturnValueOnce({
        access_token: 'access_token'
      })

      const params = { ...commonParams, persistence: null }
      const result = await action(params)
      expect(result).toEqual(
        {
          accessToken: 'access_token',
          accessTokenExpiry: undefined
        })
    })

    test('no access_token property returned from response', async () => {
      const response = {
        some_field: 'some value'
      }
      auth.mockReturnValueOnce(response)

      const params = commonParams
      const result = action(params)
      await expect(result).rejects.toThrow('access_token not found in response')
    })
  })

  describe('with all values but invalid and no mock', () => {
    test('should fail', async () => {
      const params = commonParams
      const actionActual = jest.requireActual('../src/auth')

      let e
      const unexpectedError = new Error('should not be thrown')
      try {
        await actionActual(params)
        e = unexpectedError
      } catch (err) {
        e = err
      }

      expect(e).not.toEqual(unexpectedError)
    })
  })
  
  describe('with invalid secret', () => {
    test('should fail', async () => {
      const params = commonParams
      params.private_key = ''
      const result = action(params)
      await expect(result).rejects.toThrow('Invalid format of private_key')
    })
  })

  describe('with no values', () => {
    test('should fail', async () => {
      const params = {}
      const result = action(params)
      return expect(result).rejects.toThrow('Parameters required: jwt_client_id,jwt_client_secret,technical_account_id,org_id,meta_scopes,private_key')
    })
  })
})
