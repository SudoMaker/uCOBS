/**
 * !!!IMPORTANT!!!
 * This d.ts is generated by GPT-4, though checked manually, it might still contain errors and might be incorrect.
 * Send a PR if you find any part of it inapporiate.
 */

/**
 * Creates a COBS (Consistent Overhead Byte Stuffing) stream encoder.
 * This encoder is used to encode data streams using the COBS method, which is useful for packet-based communication where delimiter bytes are needed to mark packet boundaries.
 *
 * @param emit A function that is called to emit the encoded data chunks. It receives a Uint8Array and a boolean indicating if it's the end of the stream.
 * @param handleErr An optional error handling function that receives an Error object.
 * @param bufferSize An optional size for the internal buffer, defaulting to 0x200 (512 in decimal).
 * @returns A tuple of two functions: the first to push data for encoding, and the second to signal the end of the stream.
 */
export function createStreamEncoder(
    emit: (buffer: Uint8Array, end: boolean) => void,
    handleErr?: (error: Error) => void,
    bufferSize?: number
): [(data: Uint8Array) => void, () => void];

/**
 * Creates a COBS (Consistent Overhead Byte Stuffing) stream decoder.
 * This decoder is used to decode data streams that have been encoded using the COBS method.
 *
 * @param emit A function that is called to emit the decoded data chunks. It receives a Uint8Array and a boolean indicating if it's the end of the stream.
 * @param handleErr An optional error handling function that receives an Error object.
 * @param bufferSize An optional size for the internal buffer, defaulting to 0x200 (512 in decimal).
 * @returns A function that takes a Uint8Array to push data for decoding.
 */
export function createStreamDecoder(
    emit: (buffer: Uint8Array, end: boolean) => void,
    handleErr?: (error: Error) => void,
    bufferSize?: number
): (data: Uint8Array) => void;

/**
 * Creates a COBS (Consistent Overhead Byte Stuffing) block encoder.
 * This function is a utility wrapper over the stream encoder for situations where the entire data block is available at once rather than in a stream.
 *
 * @param onEncode A function that is called with the encoded data once the encoding of a block is complete.
 * @param handleErr An optional error handling function that receives an Error object.
 * @returns A function that takes a Uint8Array to encode a block of data.
 */
export function createBlockEncoder(
    onEncode: (data: Uint8Array) => void,
    handleErr?: (error: Error) => void
): (data: Uint8Array) => void;

/**
 * Creates a COBS (Consistent Overhead Byte Stuffing) block decoder.
 * This function is a utility wrapper over the stream decoder for situations where the entire data block is available at once rather than in a stream.
 *
 * @param onDecode A function that is called with the decoded data once the decoding of a block is complete.
 * @param handleErr An optional error handling function that receives an Error object.
 * @returns A function that takes a Uint8Array to decode a block of data.
 */
export function createBlockDecoder(
    onDecode: (data: Uint8Array) => void,
    handleErr?: (error: Error) => void
): (data: Uint8Array) => void;