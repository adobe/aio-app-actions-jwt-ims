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
const auth = require('@adobe/jwt-auth')
const logger = require('@adobe/aio-lib-core-logging')('auth-jwt', { level: process.env.LOG_LEVEL })

/**
 + * The entry point for the action.
 + * @param params Input object
 + * @returns {Promise}
 + */
async function main(params) {
  _fail_on_missing(["jwt_client_id","jwt_client_secret","technical_account_id","org_id","meta_scopes","private_key"], params)

  const config = {
    clientId: params.jwt_client_id,
    clientSecret: params.jwt_client_secret,
    technicalAccountId: params.technical_account_id,
    orgId: params.org_id,
    metaScopes: typeof(params.meta_scopes)==="string" && params.meta_scopes.length > 0 ? JSON.parse(params.meta_scopes) : params.meta_scopes,
    privateKey: typeof(params.private_key)==="string" && params.private_key.length > 0 ? JSON.parse(params.private_key) : params.private_key
  }

  if(typeof(config.privateKey) !== "object"){
    logger.error("Invalid format of private_key")
    throw new Error("Invalid format of private_key")
  }

  config.privateKey = config.privateKey.join('\n')

  const response = await auth(config)
  if (response.access_token) {
    return (formatResponse(response, params))
  } else {
    throw new Error('access_token not found in response')
  }
}

function formatResponse(jwtResponse, params) {
  let res = {
      accessToken: jwtResponse.access_token,
      accessTokenExpiry: jwtResponse.expires_in
  }
  let persistence = (params.persistence || 'false').toString().toLowerCase()
  if(persistence === 'true'){
    res.provider = params.provider || "adobe"
    res.profileID = params.jwt_client_id
    res.refreshToken = "NA"
  }
  return res
}

function _fail_on_missing(param_names, params) {
 const errors = []
 for(let param_name of param_names) {
   if (params[param_name] == null || typeof(params[param_name]) == "undefined") {
     logger.error("Parameter " + param_name + " is required.")
     errors.push(param_name)
   }
  }
  if (errors.length > 0) {
    throw new Error(`Parameters required: ${errors.join(',')}`)
  }
}

module.exports = main
