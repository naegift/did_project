# Structure

- base-source
  - entity
  - enum
- src
  - account
    - gift: /gift
  - market: /
    - product: /product
    - store: /store
  - common
    - image: /image

# Dependencies

```sh
npm i @nestjs/config @nestjs/swagger @nestjs/typeorm typeorm pg multer uuid class-transformer class-validator
npm i -D @types/multer
```
