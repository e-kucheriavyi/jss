# JS Struct experiment

This is an experimental code to store JavaScript objects in bytes array.
The only use case at this point is to send data to server efficiently.
Should work well with WebSockets and something like that.

## Usage

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

console.log(storage.buffer) // Byte representation of data

console.log(p2.load()) // Object, parsed from buffer

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

