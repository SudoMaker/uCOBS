const createStreamEncoder = (emit, handleErr, bufferSize = 0x200) => {
	let buffer = null
	let bufferPos = null
	let zeroPos = null

	const reservedPos = bufferSize - 0x100

	const resetBuffer = () => {
		buffer = new Uint8Array(bufferSize)
		bufferPos = 1
		zeroPos = 0
	}

	const pushBuffer = (byte) => {
		buffer[bufferPos] = byte
		bufferPos += 1
	}

	const flush = (end = false) => {
		try {
			emit(buffer.subarray(0, bufferPos), end)
		} catch (e) {
			if (handleErr) handleErr(e)
		} finally {
			resetBuffer()
		}
	}

	const push = (data) => {
		for (let byte of data) {
			if (bufferPos - zeroPos >= 0xFE) {
				buffer[zeroPos] = 0xFF
				pushBuffer(byte)
				zeroPos = bufferPos
				if (zeroPos >= reservedPos) flush()
			} else if (byte === 0x00) {
				buffer[zeroPos] = bufferPos - zeroPos
				zeroPos = bufferPos
				if (zeroPos < reservedPos) pushBuffer(byte)
				else flush()
			} else {
				pushBuffer(byte)
			}
		}
	}

	const end = () => {
		buffer[zeroPos] = bufferPos - zeroPos
		buffer[bufferPos] = 0x00
		bufferPos += 1
		flush(true)
	}

	resetBuffer()

	return [push, end]
}

const createStreamDecoder = (emit, handleErr, bufferSize = 0x200) => {
	let buffer = null
	let bufferPos = null
	let offset = null
	let chunk = null

	const resetBuffer = () => {
		buffer = new Uint8Array(bufferSize)
		bufferPos = 0
	}

	const resetChunk = () => {
		resetBuffer()
		offset = 1
		chunk = true
	}

	const pushBuffer = (byte) => {
		buffer[bufferPos] = byte
		bufferPos += 1

		if (bufferPos >= bufferSize) {
			try {
				emit(buffer, false)
			} catch (e) {
				if (handleErr) handleErr(e)
			} finally {
				resetBuffer()
			}
		}
	}

	const push = (data) => {
		for (let byte of data) {
			offset -= 1
			if (byte === 0x00) {
				try {
					emit(buffer.subarray(0, bufferPos), true)
				} catch (e) {
					if (handleErr) handleErr(e)
				} finally {
					resetChunk()
				}
			} else if (offset) {
				pushBuffer(byte)
			} else {
				if (!chunk) pushBuffer(0x00)
				offset = byte
				chunk = offset === 0xFF
			}
		}
	}

	resetChunk()

	return push
}

const createBlockEncoder = (onEncode, handleErr) => {
	let bufferArr = []
	const [pushData, endBlock] = createStreamEncoder((chunk, end) => {
		bufferArr.push(...chunk)
		if (end) {
			try {
				onEncode(new Uint8Array(bufferArr))
			} catch (e) {
				if (handleErr) handleErr(e)
			} finally {
				bufferArr = []
			}
		}
	}, handleErr)

	const encode = (data) => {
		pushData(data)
		endBlock()
	}

	return encode
}

const createBlockDecoder = (onDecode, handleErr) => {
	let bufferArr = []
	return createStreamDecoder((chunk, end) => {
		bufferArr.push(...chunk)
		if (end) {
			try {
				onDecode(new Uint8Array(bufferArr))
			} catch (e) {
				if (handleErr) handleErr(e)
			} finally {
				bufferArr = []
			}
		}
	}, handleErr)
}

export {
	createStreamEncoder,
	createStreamDecoder,
	createBlockEncoder,
	createBlockDecoder
}
