# Structure

- base-source
  - abi
  - entity
  - enum
  - error
  - mock
    - entity
    - providers
- src
  - account
    - gift: /gift
  - common
    - data
    - image: /image
    - vc: /vc
  - market: /
    - product: /product
    - store: /store

# Dependencies

```sh
npm i @nestjs/config @nestjs/serve-static @nestjs/swagger @nestjs/typeorm typeorm pg multer uuid class-transformer class-validator ethers@5
npm i @veramo/core @veramo/credential-w3c @veramo/data-store @veramo/did-manager @veramo/did-provider-ethr @veramo/did-resolver @veramo/key-manager @veramo/kms-local ethr-did-resolver web-did-resolver did-resolver sqlite3 typeorm tsimportlib
npm i -D @types/multer @types/uuid
```
