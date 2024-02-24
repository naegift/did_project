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
  - market: /
    - product: /product
    - store: /store

# Dependencies

```sh
npm i @nestjs/config @nestjs/serve-static @nestjs/swagger @nestjs/typeorm typeorm pg multer uuid class-transformer class-validator ethers@5
npm i -D @types/multer @types/uuid
```
