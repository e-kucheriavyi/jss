# JS Struct experiment

This is an experimental code to store JavaScript objects in bytes array.
The only use case at this point is to send data to server efficiently.
Should work well with WebSockets and something like that.

## Usage

### Send data

```js
import { Struct, Storage, Uint8, Float64 } from "./struct.js"

const PointStruct = Struct({
    x: Float64,
    y: Float64,
    id: Uint8,
})

const p1 = PointStruct()
const p2 = PointStruct()

const storage = Storage(p1.size + p2.size)
// Allocate structs in ArrayBuffer
storage.alloc(p1)
storage.alloc(p2)

p2.store({ x: 5.029, y: 9.23, id: 255 })

// Byte representation of data
console.log(storage.buffer)

// Object, parsed from buffer
console.log(p2.load())

sendBinaryData(storage.buffer)

```

### Receive data

Receiving data is tricky for now. Probably, server will send you raw buffer
and you'll have to parse it somehow. The best way is having same structs
on both sides + same order of parsing (auto parsing will be considered in
future versions).

```js
import { Storage, Struct, Uint8, Float64 } from "./struct.js"
import { PointStruct } from "./shared-structs-definition.js"

const buffer = await getBinaryData()
const view = new DataView(buffer)

const p1 = PointStruct()
const p2 = PointStruct()

// This happens inside of Storage. But since we don't have it, we
// must do this manually
let offset = 0
offset = p1.alloc(view, offset)
offset = p2.alloc(view, offset)

console.log(p2.load())

```

## For more information

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

## Topics to think about

- Sending strings
- Byte marker of struct type
- Passing initial struct data

## Support

- https://kucheriavyi.ru/donate/

