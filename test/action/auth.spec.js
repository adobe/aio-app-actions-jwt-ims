/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import chai from 'chai';
import {
  expect
} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import action from '../../src/auth.js';
import { AssertionError } from 'assert';

chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.should();

const commonParams = {
  "jwt_client_id": "a70b86e38a324b9d87cab8c074ecf69a",
  "jwt_client_secret": "fb0b9824-9edd-442d-aa98-3a1ff0eb1b41",
  "technical_account_id": "A46F3D7B5C0F4B5C0A495EE9@techacct.adobe.com",
  "org_id": "BA3E5257595416580A495C6D@AdobeOrg",
  "meta_scopes": ["ent_analytics_bulk_ingest_sdk","ent_campaign_sdk"],
  "private_key": [
                  "-----BEGIN RSA PRIVATE KEY-----",
                  "aEnmX2RwnWCUTt3W6FIlajR/yJHR7mpetqbVjgwhnxDgbi5tyHI=",
                  "-----END RSA PRIVATE KEY-----",
                  ],
  "persistence":'true'
};

beforeEach(() => {
  jest.resetModules();
});

describe('ims-jwt', () => {
  describe('with all values and mocked jwt-auth library', () => {
    test('should work', async () => {
      let params = commonParams
      let result = await action(params)
      result.should
            .deep.equal({"accessToken":"access_token",
                        "accessTokenExpiry":undefined,
                        "provider": 'adobe',
                        "profileID": 'a70b86e38a324b9d87cab8c074ecf69a',
                        "refreshToken": 'NA'})
    });
  });
  describe('with all values but invalid and no mock', () => {
    test('should fail', async () => {
      jest.unmock("@adobe/jwt-auth")
      let params = commonParams
      const actionActual = require.requireActual("../../src/auth").default
      try{
        let result = await actionActual(params)
      }catch(e){
        expect(e).not.equal(undefined)
      }
    })
  });
  describe('with invalid secret', () => {
    test('should fail', (done) => {
      let params = commonParams
      params.private_key = ""
      let result = action(params)
      result.should.be.rejected
            .eventually.have.property("message","Invalid format of private_key")
            .notify(done)
    });
  });
  describe('with no values', () => {
    test('should fail', (done) => {
      let params = {}
      let result = action(params)
      result.should.be.rejected.and
            .eventually.have.property("message","Parameter jwt_client_id is required.")
            .notify(done)
    });
  });
});
