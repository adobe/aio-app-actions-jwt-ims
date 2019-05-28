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
const auth = require('@adobe/jwt-auth');

/**
 + * The entry point for the action.
 + * @param params Input object
 + * @returns {Promise}
 + */
function main(params) {
  return new Promise((resolve,reject)=>{
    if (_fail_on_missing(["jwt_client_id","jwt_client_secret","technical_account_id","org_id","meta_scopes","private_key"], params, reject) ) return

    const config = {
      clientId: params.jwt_client_id,
      clientSecret: params.jwt_client_secret,
      technicalAccountId: params.technical_account_id,
      orgId: params.org_id,
      metaScopes: params.meta_scopes,
      privateKey: params.private_key
    };
    if(typeof(config.privateKey) !== "object")
      reject({"message":"Invalid format of private_key"})
    config.privateKey = config.privateKey.join('\n');

    auth(config)
      .then(response => {
        if(response.access_token)
          resolve(formatResponse(response, params))
        else
          reject(response)
      })
      .catch(error => reject(error));
  });
}

function formatResponse(jwtResponse, params) {
  let res = {
      accessToken: jwtResponse.access_token,
      accessTokenExpiry: jwtResponse.expires_in
  }
  if(params.persistence && params.persistence === 'true'){
    res.provider = params.provider || "adobe"
    res.profileID = params.jwt_client_id
    res.refreshToken = "NA"
  }
  return res
}

function _fail_on_missing(param_names, params, reject) {
 for(let param_name of param_names)
   if (params[param_name] == null || typeof(params[param_name]) == "undefined") {
     reject({
       "message": "Parameter " + param_name + " is required."
     });
     return true
   }
 return false
}
export default main;
