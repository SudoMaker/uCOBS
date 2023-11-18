# uCOBS
Fast and Tiny COBS Encoder and Decoder

## Introduction
uCOBS (micro-COBS) is a highly efficient implementation of the [Consistent Overhead Byte Stuffing (COBS)](https://en.wikipedia.org/wiki/Consistent_Overhead_Byte_Stuffing) algorithm. Designed for environments where both speed and minimal memory footprint are crucial, uCOBS is an ideal solution for packet-based communication in embedded systems, IoT devices, and other performance-sensitive applications.

## Installation

### Via NPM
To install uCOBS in your JS project, use the following command:
```sh
npm install ucobs
```

### In the Browser
Include uCOBS directly in your HTML:
```html
<script src="main.js" type="module"></script>
```

main.js
```js
import * as uCOBS from 'path/to/ucobs' // For example: https://esm.run/ucobs
```

## Usage

### Encoding Data
To encode a data block using uCOBS:
```javascript
import { createBlockEncoder } from 'ucobs';

const encode = createBlockEncoder((encodedData) => {
  // Handle the encoded data here
});

encode(new Uint8Array([/* Your data here */]));
```

### Decoding Data
To decode a previously encoded data block:
```javascript
import { createBlockDecoder } from 'ucobs';

const decode = createBlockDecoder((decodedData) => {
  // Handle the decoded data here
});

decode(new Uint8Array([/* Your encoded data here */]));
```

### Stream Encoding Example
```javascript
import { createStreamEncoder } from 'ucobs';

const [push, end] = createStreamEncoder((chunk, isEnd) => {
  // Process each chunk of encoded data here.
  // 'isEnd' indicates if this is the final chunk.
}, error => {
  // Handle any errors here.
});

// Push data to be encoded in chunks.
push(new Uint8Array([/* Part of your data */]));
push(new Uint8Array([/* Another part of your data */]));

// Signal the end of the data stream.
end();
```

### Stream Decoding Example
```javascript
import { createStreamDecoder } from 'ucobs';

const decodeStream = createStreamDecoder((chunk, isEnd) => {
  // Process each chunk of decoded data here.
  // 'isEnd' indicates if this is the final chunk.
}, error => {
  // Handle any errors here.
});

// Push encoded data to be decoded in chunks.
decodeStream(new Uint8Array([/* Part of your encoded data */]));
decodeStream(new Uint8Array([/* Another part of your encoded data */]));
```

## API Documentation

uCOBS provides four primary functions, each with specific parameters:

1. **`createStreamEncoder(emit, handleErr?, bufferSize?)`**:
   - `emit`: Function that handles emitted encoded data chunks.
     - `buffer`: Uint8Array containing the encoded chunk.
     - `end`: Boolean indicating if this is the final chunk.
   - `handleErr?`: Optional function for error handling.
     - `error`: Error object representing the encountered error.
   - `bufferSize?`: Optional number specifying the internal buffer size (default: 512).
   - **Description**: Encodes data streams using the COBS method.

2. **`createStreamDecoder(emit, handleErr?, bufferSize?)`**:
   - `emit`: Function that handles emitted decoded data chunks.
     - `buffer`: Uint8Array containing the decoded chunk.
     - `end`: Boolean indicating if this is the final chunk.
   - `handleErr?`: Optional function for error handling.
     - `error`: Error object representing the encountered error.
   - `bufferSize?`: Optional number specifying the internal buffer size (default: 512).
   - **Description**: Decodes COBS-encoded data streams.

3. **`createBlockEncoder(onEncode, handleErr?)`**:
   - `onEncode`: Function invoked with the encoded data block.
     - `data`: Uint8Array containing the entire encoded block.
   - `handleErr?`: Optional function for error handling.
     - `error`: Error object representing the encountered error.
   - **Description**: Encodes an entire data block at once, wrapping the stream encoder for convenience.

4. **`createBlockDecoder(onDecode, handleErr?)`**:
   - `onDecode`: Function invoked with the decoded data block.
     - `data`: Uint8Array containing the entire decoded block.
   - `handleErr?`: Optional function for error handling.
     - `error`: Error object representing the encountered error.
   - **Description**: Decodes an entire COBS-encoded data block at once, wrapping the stream decoder for convenience.

## License
This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.
