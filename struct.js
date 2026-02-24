function typedef(name, size) {
	return Object.freeze({
		name,
		size,
		readFn: `get${name}`,
		writeFn: `set${name}`,
	})
}

export const Uint8     = typedef("Uint8", 1)
export const Bool      = Uint8
export const Int8      = typedef("Int8", 1)
export const Uint16    = typedef("Uint16", 2)
export const Unt16     = typedef("Int16", 2)
export const Uint32    = typedef("Uint32", 4)
export const Unt32     = typedef("Int32", 4)
export const Uint64    = typedef("Uint64", 8)
export const Int64     = typedef("Int64", 8)
export const Float16   = typedef("Float16", 2)
export const Float32   = typedef("Float32", 4)
export const Float64   = typedef("Float64", 8)
export const BigInt64  = typedef("BigInt64", 16)
export const BigUint64 = typedef("BigUint64", 16)


export function Struct(scheme) {
	return () => {
		const s = {}

		const keys = Object.keys(scheme)

		let offset = 0

		let _view = null
		let _baseOffset = 0
		let _allocated = false

		const fields = {}

		for (const key of keys) {
			const field = scheme[key]
			const o = offset
			const f = {
				type: field.name,
				size: field.size,
				offset: o,
				read: () => {
					if (!_allocated) {
						throw "cannot read value, because stuct was not allocated"
					}
					return _view[field.readFn](_baseOffset + o)
				},
				write: (value) => {
					if (!_allocated) {
						throw "cannot write value, because stuct was not allocated"
					}
					return _view[field.writeFn](_baseOffset + o, value)
				},
			}
			fields[key] = f
			offset += field.size
		}

		s.fields = fields

		/**
		 * Saves passed object to {DataView}
		 * @param {object}
		 */
		const store = (obj) => {
			if (!_allocated) {
				throw "cannot store object, because stuct was not allocated"
			}
			for (const [key, value] of Object.entries(obj)) {
				s.fields[key].write(value)
			}
		}

		/**
		 * @returns {object} parsed object from {DataView}
		 */
		const load = () => {
			if (!_allocated) {
				throw "cannot load object, because stuct was not allocated"
			}
			const obj = {}
			for (const key of keys) {
				obj[key] = s.fields[key].read()
			}
			return obj
		}

		s.offset = _baseOffset
		s.size = offset
		s.store = store
		s.load = load

		/**
		 * @param view {DataView}
		 * @param baseOffset {number} - starting offset for the allocation inside view
		 * @returns {number} baseOffset for the next element
		*/
		const alloc = (view, baseOffset) => {
			if (_allocated) {
				throw "struct was already allocated"
			}
			_view = view
			_baseOffset = baseOffset
			_allocated = true
			return baseOffset + s.size
		}

		s.alloc = alloc

		return s
	}
}

export function Storage(size) {
	const buffer = new ArrayBuffer(size)
	const view = new DataView(buffer)

	let offset = 0

	const alloc = (s) => {
		offset = s.alloc(view, offset)
	}

	return {
		buffer,
		view,
		alloc,
	}
}

