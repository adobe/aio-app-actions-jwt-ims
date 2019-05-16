[![Build Status](https://travis-ci.com/adobe/adobeio-cna-actions-jwt-ims.svg?branch=master)](https://travis-ci.com/adobe/adobeio-cna-actions-jwt-ims)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


# ims-jwt
This module helps in creating an IMS service token

## Usage
This can be used for both instant token generation and also to persist the tokens for later retrieval (in combination with a persistence action like https://git.corp.adobe.com/CNA/openwhisk-cache-dynamodb).
The mandatory parameters are
```
jwt_client_id
jwt_client_secret
technical_account_id
org_id
meta_scopes
private_key
```
The documentation on each of above parameters and example usage can be found at https://github.com/adobe/jwt-auth which is the base repo this module is built on.
In addition to those you can choose persistence of the tokens in which case this module will return the service token and other details required for the persistence action.
```
persistence=true
```

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
