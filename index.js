import { Struct, Storage, Float64, Uint8 } from "./struct.js"

const PointStruct = Struct({
    x: Float64,
    y: Float64,
    id: Uint8,
})

const p1 = PointStruct()
const p2 = PointStruct()

const storage = Storage(p1.size + p2.size)
storage.alloc(p1)
storage.alloc(p2)

p2.store({ x: 5.029, y: 9.23, id: 255 })

console.log(storage.buffer) // Byte representation of the struct

console.log(p2.load()) // Object, parsed from buffer


