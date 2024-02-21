# Structure

- base-source
  - entity
  - enum
  - error
  - mock
    - entity
    - providers
- src
  - account
    - gift: /gift
  - market: /
    - product: /product
    - store: /store
  - common
    - data
    - image: /image

# Dependencies

```sh
npm i @nestjs/config @nestjs/serve-static @nestjs/swagger @nestjs/typeorm typeorm pg multer uuid class-transformer class-validator ethers
npm i -D @types/multer @types/uuid
```
