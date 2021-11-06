/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/linebreak-next/node_modules/base64-js/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/linebreak-next/node_modules/base64-js/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/linebreak-next/src/classes.js":
/*!****************************************************!*\
  !*** ./node_modules/linebreak-next/src/classes.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

// The following break classes are handled by the pair table

exports.OP = 0;   // Opening punctuation
exports.CL = 1;   // Closing punctuation
exports.CP = 2;   // Closing parenthesis
exports.QU = 3;   // Ambiguous quotation
exports.GL = 4;   // Glue
exports.NS = 5;   // Non-starters
exports.EX = 6;   // Exclamation/Interrogation
exports.SY = 7;   // Symbols allowing break after
exports.IS = 8;   // Infix separator
exports.PR = 9;   // Prefix
exports.PO = 10;  // Postfix
exports.NU = 11;  // Numeric
exports.AL = 12;  // Alphabetic
exports.HL = 13;  // Hebrew Letter
exports.ID = 14;  // Ideographic
exports.IN = 15;  // Inseparable characters
exports.HY = 16;  // Hyphen
exports.BA = 17;  // Break after
exports.BB = 18;  // Break before
exports.B2 = 19;  // Break on either side (but not pair)
exports.ZW = 20;  // Zero-width space
exports.CM = 21;  // Combining marks
exports.WJ = 22;  // Word joiner
exports.H2 = 23;  // Hangul LV
exports.H3 = 24;  // Hangul LVT
exports.JL = 25;  // Hangul L Jamo
exports.JV = 26;  // Hangul V Jamo
exports.JT = 27;  // Hangul T Jamo
exports.RI = 28;  // Regional Indicator

// The following break classes are not handled by the pair table
exports.AI = 29;  // Ambiguous (Alphabetic or Ideograph)
exports.BK = 30;  // Break (mandatory)
exports.CB = 31;  // Contingent break
exports.CJ = 32;  // Conditional Japanese Starter
exports.CR = 33;  // Carriage return
exports.LF = 34;  // Line feed
exports.NL = 35;  // Next line
exports.SA = 36;  // South-East Asian
exports.SG = 37;  // Surrogates
exports.SP = 38;  // Space
exports.XX = 39;  // Unknown


/***/ }),

/***/ "./node_modules/linebreak-next/src/linebreaker-browser.js":
/*!****************************************************************!*\
  !*** ./node_modules/linebreak-next/src/linebreaker-browser.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const base64 = __webpack_require__(/*! base64-js */ "./node_modules/linebreak-next/node_modules/base64-js/index.js");
const UnicodeTrie = __webpack_require__(/*! unicode-trie */ "./node_modules/unicode-trie/index.js");

const { BK, CR, LF, NL, SG, WJ, CB, SP, BA, NS, AI, AL, CJ, ID, SA, XX } = __webpack_require__(/*! ./classes */ "./node_modules/linebreak-next/src/classes.js");
const { DI_BRK, IN_BRK, CI_BRK, CP_BRK, PR_BRK, pairTable } = __webpack_require__(/*! ./pairs */ "./node_modules/linebreak-next/src/pairs.js");

const data = base64.toByteArray("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");

const classTrie = new UnicodeTrie(data);

const mapClass = function (c) {
  switch (c) {
    case AI:
      return AL;

    case SA:
    case SG:
    case XX:
      return AL;

    case CJ:
      return NS;

    default:
      return c;
  }
};

const mapFirst = function (c) {
  switch (c) {
    case LF:
    case NL:
      return BK;

    case CB:
      return BA;

    case SP:
      return WJ;

    default:
      return c;
  }
};

class Break {
  constructor(position, required = false) {
    this.position = position;
    this.required = required;
  }
}

class LineBreaker {
  constructor(string) {
    this.string = string;
    this.pos = 0;
    this.lastPos = 0;
    this.curClass = null;
    this.nextClass = null;
  }

  nextCodePoint() {
    const code = this.string.charCodeAt(this.pos++);
    const next = this.string.charCodeAt(this.pos);

    // If a surrogate pair
    if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
      this.pos++;
      return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
    }

    return code;
  }

  nextCharClass() {
    return mapClass(classTrie.get(this.nextCodePoint()));
  }

  nextBreak() {
    // get the first char if we're at the beginning of the string
    if (this.curClass == null) {
      this.curClass = mapFirst(this.nextCharClass());
    }

    while (this.pos < this.string.length) {
      this.lastPos = this.pos;
      const lastClass = this.nextClass;
      this.nextClass = this.nextCharClass();

      // explicit newline
      if ((this.curClass === BK) || ((this.curClass === CR) && (this.nextClass !== LF))) {
        this.curClass = mapFirst(mapClass(this.nextClass));
        return new Break(this.lastPos, true);
      }

      // handle classes not handled by the pair table
      let cur;
      switch (this.nextClass) {
        case SP:
          cur = this.curClass;
          break;

        case BK:
        case LF:
        case NL:
          cur = BK;
          break;

        case CR:
          cur = CR;
          break;

        case CB:
          cur = BA;
          break;
      }

      if (cur != null) {
        this.curClass = cur;
        if (this.nextClass === CB) {
          return new Break(this.lastPos);
        }
        continue;
      }

      // if not handled already, use the pair table
      let shouldBreak = false;
      switch (pairTable[this.curClass][this.nextClass]) {
        case DI_BRK: // Direct break
          shouldBreak = true;
          break;

        case IN_BRK: // possible indirect break
          shouldBreak = lastClass === SP;
          break;

        case CI_BRK:
          shouldBreak = lastClass === SP;
          if (!shouldBreak) {
            continue;
          }
          break;

        case CP_BRK: // prohibited for combining marks
          if (lastClass !== SP) {
            continue;
          }
          break;
      }

      this.curClass = this.nextClass;
      if (shouldBreak) {
        return new Break(this.lastPos);
      }
    }

    if (this.pos >= this.string.length) {
      if (this.lastPos < this.string.length) {
        this.lastPos = this.string.length;
        return new Break(this.string.length);
      } else {
        return null;
      }
    }
  }
}

module.exports = LineBreaker;


/***/ }),

/***/ "./node_modules/linebreak-next/src/pairs.js":
/*!**************************************************!*\
  !*** ./node_modules/linebreak-next/src/pairs.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

let CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK;
exports.DI_BRK = (DI_BRK = 0); // Direct break opportunity
exports.IN_BRK = (IN_BRK = 1); // Indirect break opportunity
exports.CI_BRK = (CI_BRK = 2); // Indirect break opportunity for combining marks
exports.CP_BRK = (CP_BRK = 3); // Prohibited break for combining marks
exports.PR_BRK = (PR_BRK = 4); // Prohibited break

// table generated from http://www.unicode.org/reports/tr14/#Table2
exports.pairTable = [
  [PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, CP_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, PR_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK]
];

/***/ }),

/***/ "./node_modules/tiny-inflate/index.js":
/*!********************************************!*\
  !*** ./node_modules/tiny-inflate/index.js ***!
  \********************************************/
/***/ ((module) => {

var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) bits[i] = 0;
  for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) lt.table[i] = 0;

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
  for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
  for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
  for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) dt.table[i] = 0;

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) dt.trans[i] = i;
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) t.table[i] = 0;

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    return base;

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) lengths[i] = 0;

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    return TINF_DATA_ERROR;

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    d.dest[d.destLen++] = d.source[d.sourceIndex++];

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      throw new Error('Data error');

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      return d.dest.slice(0, d.destLen);
    else
      return d.dest.subarray(0, d.destLen);
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

module.exports = tinf_uncompress;


/***/ }),

/***/ "./public/src/editing.ts":
/*!*******************************!*\
  !*** ./public/src/editing.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newline": () => (/* binding */ newline),
/* harmony export */   "backspace": () => (/* binding */ backspace),
/* harmony export */   "itermize": () => (/* binding */ itermize),
/* harmony export */   "indentize": () => (/* binding */ indentize),
/* harmony export */   "insertText": () => (/* binding */ insertText),
/* harmony export */   "deleteSelectedText": () => (/* binding */ deleteSelectedText),
/* harmony export */   "changeSelectedTextStyle": () => (/* binding */ changeSelectedTextStyle)
/* harmony export */ });
/* harmony import */ var _linebreak__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linebreak */ "./public/src/linebreak.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./public/src/util.ts");



// handle return at the caret position, considering indentation, lines & pos will be mutated
// 1. if caret is eol, insert a empty new line, caret to the new line
// 2. if caret is at head, insert a empty new line, caret still remain
// 3. if caret is in the middle, cut current line, put postLine to the newLine 
// 4. if current line has indentation, new line should have inherit
function newline(lines, pos) {
    const curLine = lines[pos.lineIndex];
    if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(pos)) {
        // insert a new empty line
        const newLine = {
            runs: [],
            text: '',
        };
        if (curLine.textIndent) {
            newLine.textIndent = (0,_util__WEBPACK_IMPORTED_MODULE_2__.cloneObj)(curLine.textIndent);
        }
        lines.splice(pos.lineIndex + 1, 0, newLine);
        pos.lineIndex++;
    }
    else {
        // cut line into preLine and postLine, replace curLine->preLine, insert postLine as newLine, then set caret
        const preLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPreCutLine)(curLine, pos);
        const postLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPostCutLine)(curLine, pos);
        lines.splice(pos.lineIndex, 1, preLine);
        lines.splice(pos.lineIndex + 1, 0, postLine);
        // caret to the first run & char of the newLine
        pos.lineIndex++;
        pos.runIndex = 0;
        pos.charIndex = 0;
    }
}
// handle backspace at the caret position, considering indentation, lines & pos will be mutated
// 1. if caret is not head, back one character, line is not changed
// 2. if caret is head, append current line to previous line
// 3. if indent exists, update indent all lines after current line
function backspace(lines, pos) {
    const line = lines[pos.lineIndex];
    if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosHead)(pos)) {
        // append curLine to previous line, then remove current line, then update pos
        if (pos.lineIndex === 0)
            return;
        // prev line
        let prevLine = lines[pos.lineIndex - 1];
        const prevRunLength = prevLine.runs.length;
        const prevLineEnd = prevRunLength == 0 ? 0 : prevLine.runs[prevLine.runs.length - 1].range[1] + 1;
        if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isLineEmpty)(prevLine)) {
            lines.splice(pos.lineIndex - 1, 1);
            pos.lineIndex--;
        }
        else {
            lines[pos.lineIndex - 1] = (0,_util__WEBPACK_IMPORTED_MODULE_2__.mergeLine)(prevLine, line);
            lines.splice(pos.lineIndex, 1);
            pos.lineIndex--;
            pos.charIndex = prevLineEnd;
            pos.runIndex = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getRunIndexAtChar)(lines, pos.lineIndex, pos.charIndex);
        }
    }
    else {
        // erase one existing character
        if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(pos)) {
            if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isEmptyLine)(line)) {
                // remove empty line
                if (pos.lineIndex !== 0) {
                    lines.splice(pos.lineIndex, 1);
                    pos.lineIndex--;
                }
            }
            else {
                line.text = (0,_util__WEBPACK_IMPORTED_MODULE_2__.removeCharFromText)(line.text, line.text.length - 1);
                const run = line.runs[line.runs.length - 1];
                run.range[1]--;
                // may squash a run, pos move to last run
                if (run.range[0] > run.range[1]) {
                    line.runs.pop();
                    pos.runIndex--;
                    const lastRun = line.runs[line.runs.length - 1];
                    if (lastRun) {
                        pos.charIndex = lastRun.range[1];
                    }
                    else {
                        // already the last run, now the line is empty
                        pos.runIndex = pos.charIndex = 0;
                    }
                }
            }
        }
        else {
            const charIndex = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getCharIndexBeforePos)(line, pos);
            (0,_util__WEBPACK_IMPORTED_MODULE_2__.offsetRangeFromPos)(line.runs, -1, charIndex);
            line.text = (0,_util__WEBPACK_IMPORTED_MODULE_2__.removeCharFromText)(line.text, charIndex);
            const newPos = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPosIndexFromCharIndex)(line.runs, charIndex);
            if (newPos) {
                Object.assign(pos, newPos);
            }
        }
    }
}
// make current line itermized
function itermize(lines, pos, idt) {
}
// change indentation
function indentize(lines, pos, exindent) {
}
// insert text(may has \n inside) at certain position
function insertText(lines, pos, content) {
    // if no content, do nothing
    if (content === '')
        return pos;
    // fetch style and indent at inserting point
    const cutLine = lines[pos.lineIndex];
    const style = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getStyleAtPosition)(lines, pos);
    const indent = cutLine.textIndent;
    // break the content(>= 1) into lines, the first line will be append to preCut, the last string will be concat postCut
    const stringArray = (0,_linebreak__WEBPACK_IMPORTED_MODULE_0__.breakPlainTextIntoLines)(content);
    console.log(stringArray);
    // append firstStr to caret-landing line (cutLine)
    const preLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPreCutLine)(cutLine, pos);
    const postLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPostCutLine)(cutLine, pos);
    const firstNewLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getLogicLineFromString)(stringArray[0], style, indent);
    const mergedPreLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.mergeLine)(preLine, firstNewLine);
    lines.splice(pos.lineIndex, 1, mergedPreLine); // update in place
    // firstNewLine === lastNewLine, e.g. inserting a single line or char, then simply append postLine, early exit
    if (stringArray.length === 1) {
        const finalLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.mergeLine)(mergedPreLine, postLine);
        lines.splice(pos.lineIndex, 1, finalLine);
        // caret still reside in cutLine
        // if pos is EOL, pos.runIndex and pos.CharIndex is invalid, cannot simply offset
        if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(pos)) {
            return {
                lineIndex: pos.lineIndex,
                runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
                charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
                endOfLine: true,
            };
        }
        else {
            const charIndex = pos.charIndex + content.length;
            return {
                lineIndex: pos.lineIndex,
                runIndex: (0,_util__WEBPACK_IMPORTED_MODULE_2__.getRunIndexAtChar)(lines, pos.lineIndex, charIndex),
                charIndex,
            };
        }
    }
    // if has some middle lines, process them into logicLine and insert 
    if (stringArray.length > 2) {
        for (let i = 1; i < stringArray.length - 1; i++) {
            const li = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getLogicLineFromString)(stringArray[i], style, indent);
            lines.splice(pos.lineIndex + i, 0, li);
        }
    }
    const lastNewLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getLogicLineFromString)(stringArray[stringArray.length - 1], style, indent);
    const mergedPostLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.mergeLine)(lastNewLine, postLine);
    const postLineIndex = pos.lineIndex + stringArray.length - 1;
    lines.splice(postLineIndex, 1, mergedPostLine);
    // caret move to be behind lastNewLine's EOL
    if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(pos)) {
        return {
            lineIndex: postLineIndex,
            runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
            charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
            endOfLine: true,
        };
    }
    else {
        const charIndex = lastNewLine.text.length;
        return {
            lineIndex: postLineIndex,
            runIndex: (0,_util__WEBPACK_IMPORTED_MODULE_2__.getRunIndexAtChar)(lines, postLineIndex, charIndex),
            charIndex,
        };
    }
}
function deleteSelectedText(lines, selection) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.selectionIsEmpty)(selection))
        return _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_TEXT_POSITION;
    const { start, end } = selection;
    // fetch style and indent at start point
    const cutLineStart = lines[start.lineIndex];
    const style = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getStyleAtPosition)(lines, start);
    const indent = cutLineStart.textIndent;
    const cutLineEnd = lines[end.lineIndex];
    const totalLinesAffected = end.lineIndex - start.lineIndex + 1;
    // cut the starting line and ending line
    const preLineStart = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPreCutLine)(cutLineStart, start);
    const postLineEnd = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPostCutLine)(cutLineEnd, end);
    // stitch the two halfline back
    const mergedPreLine = (0,_util__WEBPACK_IMPORTED_MODULE_2__.mergeLine)(preLineStart, postLineEnd);
    if (start.lineIndex === end.lineIndex) {
        // if selected text is inside a single line
        lines.splice(start.lineIndex, 1, mergedPreLine);
    }
    else {
        //  selection spans multiple lines
        lines.splice(start.lineIndex, totalLinesAffected, mergedPreLine);
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isLineEmpty)(lines[start.lineIndex])) {
        return { lineIndex: start.lineIndex, runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, endOfLine: true };
    }
    else {
        // runIndex is the postLinEnd's range[0]
        if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.isEmptyLine)(postLineEnd))
            return { lineIndex: start.lineIndex, runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, endOfLine: true };
        else
            return { lineIndex: start.lineIndex, runIndex: preLineStart.runs.length, charIndex: start.charIndex };
    }
}
function changeSelectedTextStyle(lines, sel, newStyle) {
    const start = sel.start;
    const end = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getPreviousPosition)(lines, sel.end);
    const firstLine = lines[start.lineIndex];
    const lastLine = lines[end.lineIndex];
    const firstRun = (0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(start) ? undefined : firstLine.runs[start.runIndex];
    const lastRun = (0,_util__WEBPACK_IMPORTED_MODULE_2__.isPosTail)(end) ? undefined : lastLine.runs[end.runIndex];
    // re-style the first line
    if (firstRun) {
        // there is run behind this position
        (0,_util__WEBPACK_IMPORTED_MODULE_2__.changeRunStyle)(firstLine.runs, start.runIndex, [start.charIndex, firstRun.range[1]], newStyle);
    }
    // loop runs between firstRun and lastRun, update their style
    for (let i = firstRun ? start.lineIndex : start.lineIndex + 1; i <= end.lineIndex; i++) {
        const line = lines[i];
        // loop each run of line
        for (let j = 0; j < line.runs.length; j++) {
            const run = line.runs[j];
            if ((0,_util__WEBPACK_IMPORTED_MODULE_2__.positionLess)(start, { lineIndex: i, runIndex: j, charIndex: run.range[0] }) && (0,_util__WEBPACK_IMPORTED_MODULE_2__.positionLess)({ lineIndex: i, runIndex: j, charIndex: run.range[1] }, end)) {
                // if (run.range[0] > (firstRun ? firstRun?.range[1] : -1) && run.range[1] < (lastRun ? lastRun?.range[0] : -1)) {
                // this is a full run that will be re-styled
                (0,_util__WEBPACK_IMPORTED_MODULE_2__.changeRunStyle)(line.runs, j, line.runs[j].range, newStyle);
            }
        }
    }
    // re-style the last line
    // the last selected position is the left position of end
    if (lastRun) {
        (0,_util__WEBPACK_IMPORTED_MODULE_2__.changeRunStyle)(lastLine.runs, end.runIndex, [lastRun.range[0], end.charIndex], newStyle);
    }
    // as style has been changed, sel.runIndex could have changed 
    sel.start = (0,_util__WEBPACK_IMPORTED_MODULE_2__.updatePositionRunIndex)(lines, start);
    sel.end = (0,_util__WEBPACK_IMPORTED_MODULE_2__.updatePositionRunIndex)(lines, sel.end);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLEVBQTBFLE1BQU0sU0FBUyxDQUFDO0FBQzdJLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFFLHNCQUFzQixFQUFFLHdCQUF3QixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFalgsNEZBQTRGO0FBQzVGLHFFQUFxRTtBQUNyRSxzRUFBc0U7QUFDdEUsK0VBQStFO0FBQy9FLG1FQUFtRTtBQUNuRSxNQUFNLFVBQVUsT0FBTyxDQUFDLEtBQWtCLEVBQUUsR0FBaUI7SUFDekQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNoQiwwQkFBMEI7UUFDMUIsTUFBTSxPQUFPLEdBQWM7WUFDdkIsSUFBSSxFQUFFLEVBQUU7WUFDUixJQUFJLEVBQUUsRUFBRTtTQUNYLENBQUM7UUFDRixJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDcEIsT0FBTyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUs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

/***/ }),

/***/ "./public/src/editor.ts":
/*!******************************!*\
  !*** ./public/src/editor.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Editor": () => (/* binding */ Editor)
/* harmony export */ });
/* harmony import */ var _fontManger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fontManger */ "./public/src/fontManger.ts");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout */ "./public/src/layout.ts");
// editor class, hold selection, caret, layout and others


class Editor {
    constructor(canvas, width, height) {
        this.caretPos = [0, 0];
        // size and context
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        // init objs
        this.fontManager = new _fontManger__WEBPACK_IMPORTED_MODULE_0__.FontManager();
        this.layout = new _layout__WEBPACK_IMPORTED_MODULE_1__.Layout(this.context, undefined);
        this.selection = undefined;
    }
    // handle resizing edit box
    resize(w, h) {
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2VkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5REFBeUQ7QUFFekQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWxDLE1BQU0sT0FBTyxNQUFNO0lBbUJmLFlBQVksTUFBeUIsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUxwRSxhQUFRLEdBQXFCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBTWhDLG1CQUFtQjtRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLFlBQVk7UUFDWixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFFRCwyQkFBMkI7SUFDM0IsTUFBTSxDQUFDLENBQVMsRUFBRSxDQUFTO0lBRTNCLENBQUM7Q0FNSiJ9

/***/ }),

/***/ "./public/src/fontManger.ts":
/*!**********************************!*\
  !*** ./public/src/fontManger.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FontManager": () => (/* binding */ FontManager)
/* harmony export */ });
// handle font loading and font metric fetching
class FontManager {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udE1hbmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mb250TWFuZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtDQUErQztBQUUvQyxNQUFNLE9BQU8sV0FBVztDQUV2QiJ9

/***/ }),

/***/ "./public/src/layout.ts":
/*!******************************!*\
  !*** ./public/src/layout.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Layout": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var _editing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editing */ "./public/src/editing.ts");
/* harmony import */ var _linebreak__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./linebreak */ "./public/src/linebreak.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./public/src/render.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./public/src/util.ts");





// Layout object persist result of layout, and provides query for selection and rendering
class Layout {
    constructor(ctx, input) {
        // shadow un-wrapped data
        this.lineSpacing = _types__WEBPACK_IMPORTED_MODULE_3__.LINE_SPACING.NORMAL;
        this.alignment = _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.LEFT;
        this.lines = [];
        this.showDebugRendering = true;
        // state data
        this.caret = { lineIndex: 0, runIndex: -1, charIndex: -1, endOfLine: true };
        this.lastStyle = _types__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_TEXT_STYLE;
        this.selection = undefined;
        // resultant data
        this.wrappedLines = [];
        this.lineBreakWidth = 800;
        if (!ctx) {
            console.error('error : null context!');
            return;
        }
        // init
        this.context = ctx;
        this.lineSpacing = input ? input.lineSpacing : _types__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_LINE_SPACING;
        this.alignment = input ? input.alignment : _types__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_ALIGNMENT;
        this.lines = input ? input.lines : [];
        this.wrappedLines = [];
        // fill wrappedLines by full layout
        this.calcLayout();
    }
    // only need to provide line metric except baseline
    wrapSingleEmptyLine(lineID) {
        // const defaultMetric = measureText(this.context!, 'abc', DEFAULT_TEXT_STYLE);
        const wline = {
            metric: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_METRIC,
            parentLine: lineID,
            index: 0,
            runParts: [],
            words: [],
        };
        this.wrappedLines.push(wline);
    }
    wrapSingleLine(logicLine, lineID, breakWidth, leadingSpace) {
        const words = (0,_linebreak__WEBPACK_IMPORTED_MODULE_1__.splitWords)(logicLine);
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.updateWordsMetric)(this.context, logicLine, words);
        const wrappedlines = (0,_util__WEBPACK_IMPORTED_MODULE_4__.linebreak)(words, breakWidth, leadingSpace);
        for (let j = 0; j < wrappedlines.length; j++) {
            const oneLineofWords = wrappedlines[j];
            const runParts = (0,_util__WEBPACK_IMPORTED_MODULE_4__.updateRunPartsFromWords)(this.context, logicLine, oneLineofWords);
            const lineMetric = (0,_util__WEBPACK_IMPORTED_MODULE_4__.aggregateWordMetric)(oneLineofWords);
            const wline = {
                metric: lineMetric,
                parentLine: lineID,
                index: j,
                runParts: runParts,
                words: oneLineofWords, // to change
            };
            this.wrappedLines.push(wline);
        }
    }
    // fill this.wrappedLines (layout result)
    wraplines(breakWidth) {
        if (this.lines.length === 0)
            return;
        for (let i = 0; i < this.lines.length; i++) {
            const logicLine = this.lines[i];
            if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isLineEmpty)(logicLine)) {
                this.wrapSingleEmptyLine(i);
            }
            else {
                // using the first style of run
                const style = logicLine.runs[0].style;
                const leadingSpace = logicLine.textIndent ? this.getIndentWidth(logicLine.textIndent, style) : 0;
                this.wrapSingleLine(logicLine, i, this.lineBreakWidth, leadingSpace);
            }
        }
        // calc empty lines' metric acc to its previous line
        const defaultMetrix = (0,_util__WEBPACK_IMPORTED_MODULE_4__.measureText)(this.context, '', _types__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_TEXT_STYLE);
        for (let i = 0; i < this.wrappedLines.length; i++) {
            const wline = this.wrappedLines[i];
            if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wline)) {
                if (i === 0) {
                    wline.metric = defaultMetrix;
                }
                else {
                    wline.metric = (0,_util__WEBPACK_IMPORTED_MODULE_4__.cloneObj)(this.wrappedLines[i - 1].metric);
                }
            }
        }
    }
    calcLayout() {
        if (!this.context) {
            console.error(`error: context is null!`);
        }
        this.wrappedLines = [];
        this.wraplines(this.lineBreakWidth);
        this.updateBaselines();
        this.render();
    }
    getCharWidth(char, style) {
        this.context.fillStyle = style.color;
        const adjustedFontSize = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getAdjustedFontSize)(style);
        this.context.font = adjustedFontSize + 'px ' + style.font;
        const w = this.context.measureText(char).width;
        return w;
    }
    getSymbolIndentWidth(textIndent, style) {
        if (!textIndent)
            return 0;
        const symbol = textIndent.symbol;
        if (symbol) {
            this.context.fillStyle = style.color;
            this.context.font = style.fontSize + 'px ' + style.font;
            const w = this.context.measureText(symbol).width;
            return w;
        }
        else {
            return 0;
        }
    }
    // indent width may have as many as 3 parts
    getIndentWidth(textIndent, style) {
        if (!textIndent)
            return 0;
        return textIndent.indent + this.getSymbolIndentWidth(textIndent, style) + _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT;
    }
    // once we have wrapped lines, from top to bottom, calc baseline based on line's content metric()
    updateBaselines() {
        // if layout has not been called, bail
        if (!this.wrappedLines || this.wrappedLines.length === 0 || !this.context)
            return;
        let y = _types__WEBPACK_IMPORTED_MODULE_3__.TOP_MARGIN; // baseline
        for (let i = 0; i < this.wrappedLines.length; i++) {
            const wrappedLine = this.wrappedLines[i];
            if (i === 0) {
                y += wrappedLine.metric.ascent;
            }
            else {
                const previousDescent = this.wrappedLines[i - 1].metric.descent;
                y += previousDescent;
                y += wrappedLine.metric.ascent;
            }
            // store: y is the baseline of current wrappedLine
            wrappedLine.metric.baseline = y;
            if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wrappedLine)) {
                continue;
            }
            const lineWidth = wrappedLine.metric.width;
            const logicLine = this.lines[wrappedLine.parentLine];
            const textIndent = logicLine.textIndent; // inherit parent's indent
            // a wline should have at least 1 runPart
            const firstRunPart = wrappedLine.runParts[0];
            const run = logicLine.runs[firstRunPart.runID];
            const indentStyle = run.style;
            let x = 0;
            if (this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.RIGHT || this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.CENTER) {
                let actualLineWidth = lineWidth;
                if (textIndent && textIndent.symbol) {
                    actualLineWidth += (this.getSymbolIndentWidth(textIndent, indentStyle) + _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT);
                }
                const leftMargin = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLeftMargin)(actualLineWidth, this.lineBreakWidth, this.alignment);
                x = leftMargin;
            }
            // store: x is the left starting of current wrappedLine?
            wrappedLine.metric.left = x;
            if (textIndent) {
                wrappedLine.metric.width += textIndent.indent;
                if (textIndent.symbol) {
                    wrappedLine.metric.width += (this.getSymbolIndentWidth(textIndent, indentStyle) + _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT);
                }
            }
            for (let j = 0; j < wrappedLine.runParts.length; j++) {
                const runPart = wrappedLine.runParts[j];
                if (!runPart.metric)
                    continue;
                // start a new wrapped line, need to handle indent
                if (j === 0) {
                    if (textIndent === null || textIndent === void 0 ? void 0 : textIndent.indent) {
                        if (this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.LEFT || this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.JUSTIFY) {
                            x += textIndent.indent;
                        }
                        // indent symbol
                        const symbol = textIndent.symbol;
                        if (symbol) {
                            // const style = runPart.run.style;
                            this.context.fillStyle = indentStyle.color;
                            this.context.font = indentStyle.fontSize + 'px ' + indentStyle.font;
                            const symbolWidth = this.getSymbolIndentWidth(textIndent, indentStyle);
                            if (wrappedLine.index === 0) {
                                this.context.fillText(symbol, x, y);
                            }
                            x += symbolWidth;
                            // once symbol is added, we need some extra space before start to draw real text
                            x += _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT;
                        }
                    }
                }
                // store: x is the starting pos for this runPart
                runPart.metric.left = x;
                // then draw the regular runPart
                // drawTextRunPart(this.context, logicLine.runs, runPart, x, y);
                x += runPart.metric.width;
            }
            y += (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineSpacing)(this.lineSpacing);
        }
    }
    isLayoutPositionValid(pos) {
        var _a;
        if (!this.wrappedLines || !this.wrappedLines.length)
            return false;
        if (pos.wlineIndex < 0 || pos.wlineIndex > ((_a = this.wrappedLines) === null || _a === void 0 ? void 0 : _a.length))
            return false;
        const wline = this.wrappedLines[pos.wlineIndex];
        if (pos.runPartIndex < 0 || pos.runPartIndex > wline.runParts.length)
            return false;
        const runPart = wline.runParts[pos.runPartIndex];
        if (pos.charIndex < runPart.range[0] || pos.charIndex > runPart.range[1])
            return false;
        return true;
    }
    getFirstCharPosition(wlineIndex) {
        const wline = this.wrappedLines[wlineIndex];
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wline)) {
            return { lineIndex: wline.parentLine, runIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE, endOfLine: true };
        }
        return {
            lineIndex: wline.parentLine,
            runIndex: wline.runParts[0].runID,
            charIndex: wline.runParts[0].range[0],
        };
    }
    getWordByPosition(pos) {
        const lPos = this.getLayoutTextPosition(pos);
        const wline = this.wrappedLines[lPos.wlineIndex];
        for (let i = 0; i < wline.words.length; i++) {
            const word = wline.words[i];
            if (word.runParts[0].range[0] <= pos.runIndex && pos.runIndex <= word.runParts[word.runParts.length - 1].range[1]) {
                return word;
            }
            return undefined;
        }
    }
    getWordSelection(pos) {
        const lPos = this.getLayoutTextPosition(pos);
        const wline = this.wrappedLines[lPos.wlineIndex];
        for (let i = 0; i < wline.words.length; i++) {
            const word = wline.words[i];
            if ((0,_linebreak__WEBPACK_IMPORTED_MODULE_1__.inRange)(pos.charIndex, [word.runParts[0].range[0], word.runParts[word.runParts.length - 1].range[1]])) {
                console.log(`word selected is : ${word.text}`);
                const endCharPosition = {
                    lineIndex: wline.parentLine,
                    runIndex: word.runParts[word.runParts.length - 1].runID,
                    charIndex: word.runParts[word.runParts.length - 1].range[1]
                };
                const nextPosition = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getNextPosition)(this.lines, endCharPosition);
                return {
                    start: {
                        lineIndex: wline.parentLine,
                        runIndex: word.runParts[0].runID,
                        charIndex: word.runParts[0].range[0]
                    },
                    end: nextPosition ? nextPosition : endCharPosition
                };
            }
        }
        console.log(`no word selected!`);
        return undefined;
    }
    // highlight should cover the char of endIndex
    renderSelection() {
        if (!this.context || !this.selection || (0,_util__WEBPACK_IMPORTED_MODULE_4__.selectionIsEmpty)(this.selection))
            return;
        const P0 = this.selection.start;
        const P1 = this.selection.end;
        const posInfo0 = this.getCoordInfo(P0);
        const posInfo1 = this.getCoordInfo(P1);
        const WP0 = this.getLayoutTextPosition(P0);
        const WP1 = this.getLayoutTextPosition(P1);
        this.context.save();
        this.context.fillStyle = 'rgba(0,100,200,0.3)';
        if (WP0.wlineIndex === WP1.wlineIndex) {
            // selection is inside a single wline
            this.context.fillRect(posInfo0.left, posInfo0.top, posInfo1.left - posInfo0.left, (0,_util__WEBPACK_IMPORTED_MODULE_4__.getWrappedLineHeight)(this.wrappedLines[WP0.wlineIndex]));
        }
        else {
            // on different lines
            this.context.fillRect(posInfo0.left, posInfo0.top, (0,_util__WEBPACK_IMPORTED_MODULE_4__.getWrappedLineWidth)(this.wrappedLines[WP0.wlineIndex]) - posInfo0.left, (0,_util__WEBPACK_IMPORTED_MODULE_4__.getWrappedLineHeight)(this.wrappedLines[WP0.wlineIndex]));
            // middle full lines
            if (WP1.wlineIndex - WP0.wlineIndex > 1) {
                for (let i = WP0.wlineIndex + 1; i < WP1.wlineIndex; i++) {
                    const middleLineMetric = this.wrappedLines[i].metric;
                    // get position of the first char of this wline
                    const { left, top, height } = this.getCoordInfo(this.getFirstCharPosition(i));
                    this.context.fillRect(left, top, middleLineMetric.width - left, height);
                }
            }
            const { left, top, height } = this.getCoordInfo(this.getFirstCharPosition(WP1.wlineIndex));
            // const endLineMetric = this.wrappedLines[WP1.wlineIndex].metric;
            this.context.fillRect(left, top, posInfo1.left - left, height);
        }
        this.context.restore();
    }
    clearSelection() {
        this.selection = undefined;
    }
    // render using stored metric in layout
    render() {
        if (!this.wrappedLines || this.wrappedLines.length === 0 || !this.context)
            return;
        // clear `screen`
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.renderSelection();
        for (let i = 0; i < this.wrappedLines.length; i++) {
            const wrappedLine = this.wrappedLines[i];
            if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wrappedLine)) {
                const textIndent = this.lines[wrappedLine.parentLine].textIndent;
                const indentStyle = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getStyleOfLine)(this.lines, wrappedLine.parentLine);
                if (textIndent === null || textIndent === void 0 ? void 0 : textIndent.indent) {
                    const symbol = textIndent.symbol;
                    if (symbol) {
                        this.context.fillStyle = indentStyle.color;
                        this.context.font = indentStyle.fontSize + 'px ' + indentStyle.font;
                        const symbolWidth = this.getSymbolIndentWidth(textIndent, indentStyle);
                        if (wrappedLine.index === 0) {
                            this.context.fillText(symbol, textIndent.indent, wrappedLine.metric.baseline);
                        }
                    }
                }
                continue;
            }
            const lineWidth = wrappedLine.metric.width;
            const y = wrappedLine.metric.baseline;
            if (this.showDebugRendering) {
                this.context.save();
                this.context.beginPath();
                // ascent
                this.context.strokeStyle = 'rgba(255, 0, 0, 1)';
                this.context.moveTo(0, y - wrappedLine.metric.ascent);
                this.context.lineTo(1000, y - wrappedLine.metric.ascent);
                // baseline
                this.context.strokeStyle = 'rgba(0, 255, 0, 1)';
                this.context.moveTo(0, y);
                this.context.lineTo(1000, y);
                // descent
                this.context.strokeStyle = 'rgba(0, 0, 255, 1)';
                this.context.moveTo(0, y + wrappedLine.metric.descent);
                this.context.lineTo(1000, y + wrappedLine.metric.descent);
                this.context.stroke();
                this.context.restore();
            }
            const logicLine = this.lines[wrappedLine.parentLine];
            const textIndent = logicLine.textIndent; // inherit parent's indent
            // a wline should have at least 1 runPart
            const firstRunPart = wrappedLine.runParts[0];
            const run = logicLine.runs[firstRunPart.runID];
            const indentStyle = run.style;
            // debug only: show the indentation
            if (this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.RIGHT || this.alignment === _types__WEBPACK_IMPORTED_MODULE_3__.TEXT_ALIGNMENT.CENTER) {
                let actualLineWidth = lineWidth;
                if (textIndent && textIndent.symbol) {
                    actualLineWidth += (this.getSymbolIndentWidth(textIndent, indentStyle) + _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT);
                }
                // left side of symbol
                const leftMargin = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLeftMargin)(actualLineWidth, this.lineBreakWidth, this.alignment);
                if (this.showDebugRendering) {
                    this.context.save();
                    this.context.fillStyle = 'rgba(0, 0, 255, 0.2)';
                    this.context.beginPath();
                    this.context.moveTo(0, y - 10);
                    this.context.lineTo(0, y);
                    this.context.lineTo(leftMargin, y);
                    this.context.lineTo(leftMargin, y - 10);
                    this.context.stroke();
                    this.context.restore();
                }
            }
            for (let j = 0; j < wrappedLine.runParts.length; j++) {
                const runPart = wrappedLine.runParts[j];
                if (!runPart.metric)
                    continue;
                const x = runPart.metric.left;
                // start a new wrapped line, need to handle indent
                if (j === 0) {
                    if (textIndent === null || textIndent === void 0 ? void 0 : textIndent.indent) {
                        const symbol = textIndent.symbol;
                        if (symbol) {
                            this.context.fillStyle = indentStyle.color;
                            this.context.font = indentStyle.fontSize + 'px ' + indentStyle.font;
                            const symbolWidth = this.getSymbolIndentWidth(textIndent, indentStyle);
                            if (wrappedLine.index === 0) {
                                this.context.fillText(symbol, x - symbolWidth - _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT, y);
                            }
                        }
                    }
                }
                // then draw the regular runPart
                (0,_render__WEBPACK_IMPORTED_MODULE_2__.drawTextRunPart)(this.context, logicLine, runPart, x, y);
                // debug only: show runPart bounds
                if (this.showDebugRendering) {
                    this.context.save();
                    this.context.fillStyle = j % 2 ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 0, 0.3)';
                    this.context.fillRect(x, y - runPart.metric.ascent, runPart.metric.width, runPart.metric.ascent + runPart.metric.descent);
                    this.context.strokeStyle = 'black';
                    this.context.strokeRect(x, y - runPart.metric.ascent, runPart.metric.width, runPart.metric.ascent + runPart.metric.descent);
                    this.context.restore();
                }
            }
        }
        // render line break width
        this.context.beginPath();
        this.context.moveTo(this.lineBreakWidth, -1);
        this.context.lineTo(this.lineBreakWidth, 2500);
        this.context.stroke();
        // render selection
        if (this.selection) {
            // draw all runParts in the selection  
        }
    }
    increaseLineBreakWidth() {
        this.lineBreakWidth += 10;
    }
    decreaseLineBreakWidth() {
        this.lineBreakWidth -= 10;
        if (this.lineBreakWidth < 0) {
            this.lineBreakWidth = 0;
        }
    }
    setLineBreakWidth(w) {
        this.lineBreakWidth = w;
    }
    // update caret by to the position (x, y)
    updateCaret(x, y) {
        const lpos = this.getTextPosition(x, y);
        if (lpos.lineIndex !== _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE) {
            this.caret = lpos;
        }
    }
    getCoordInfo(pos) {
        var _a, _b;
        const wpos = this.getLayoutTextPosition(pos);
        // find the position in layout space
        const wline = this.wrappedLines[wpos.wlineIndex];
        if (!wline) {
            console.error(`invalid wlineIndex when call getCoordInfo`);
        }
        const top = wline.metric.baseline - wline.metric.ascent;
        const height = wline.metric.ascent + wline.metric.descent;
        // empty line
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wline)) {
            const style = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getStyleOfLine)(this.lines, wline.parentLine);
            const textIndent = this.lines[wline.parentLine].textIndent;
            let left = textIndent ? textIndent.indent + this.getCharWidth(textIndent.symbol, style) + _types__WEBPACK_IMPORTED_MODULE_3__.EXTRA_SYMBOL_INDENT : 0;
            return { left, top, height };
        }
        // special case: caret is end of line for wpos, that means this is the last wline of the logic line
        if (wpos.endOfLine === true) {
            const runPart = wline.runParts[wline.runParts.length - 1];
            const left = ((_a = runPart.metric) === null || _a === void 0 ? void 0 : _a.left) + runPart.metric.width;
            return { left, top, height };
        }
        const runPart = wline.runParts[wpos.runPartIndex];
        // find the char position
        const logicLine = this.lines[wline.parentLine];
        const run = logicLine.runs[runPart.runID];
        let left = (_b = runPart.metric) === null || _b === void 0 ? void 0 : _b.left;
        for (let i = runPart.range[0]; i < wpos.charIndex; i++) {
            const char = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getSubText)(logicLine, [i, i]);
            const charWidth = this.getCharWidth(char, run.style);
            left += charWidth;
        }
        return { left, top, height };
    }
    // update caret to the (x, y) is pointing to
    getCursorInfo() {
        return this.getCoordInfo(this.caret);
    }
    getHeadTextPosition(wline) {
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wline)) {
            return (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineEndPosition)(wline);
        }
        // get the first runPart
        const runPart = wline.runParts[0];
        const runID = runPart.runID;
        return {
            lineIndex: wline.parentLine,
            runIndex: runID,
            charIndex: runPart.range[0],
        };
    }
    // tail of a wline is not necessarily a EOL
    getTailTextPosition(wline) {
        // if it's empty, definitely EOL
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(wline)) {
            return (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineEndPosition)(wline);
        }
        // get the last runPart of this wline
        const runPart = wline.runParts[wline.runParts.length - 1];
        const lastCharIndex = runPart.range[1];
        const logicLine = this.lines[wline.parentLine];
        if (lastCharIndex === logicLine.text.length - 1) {
            // EOL
            return (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineEndPosition)(wline);
        }
        // it's not EOL
        return {
            lineIndex: wline.parentLine,
            runIndex: runPart.runID,
            charIndex: lastCharIndex,
        };
    }
    // given a (x, y), calc the logic text position
    getTextPosition(x, y) {
        var _a;
        if (!this.wrappedLines || this.wrappedLines.length === 0) {
            console.error(`layout has not been called!`);
            return {
                lineIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                runIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                charIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
            };
        }
        // loop all wlines to locate  wline
        let lineIndex = _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE;
        let wlineIndex = _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE;
        const lineGap = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineSpacing)(this.lineSpacing);
        // round boundary values
        const firstWline = this.wrappedLines[0];
        const lastWline = this.wrappedLines[this.wrappedLines.length - 1];
        if (y < firstWline.metric.baseline - firstWline.metric.ascent) {
            lineIndex = firstWline.parentLine;
            wlineIndex = 0;
        }
        else if (y > lastWline.metric.baseline + lastWline.metric.descent) {
            lineIndex = lastWline.parentLine;
            wlineIndex = this.wrappedLines.length - 1;
        }
        else {
            for (let i = 0; i < this.wrappedLines.length; i++) {
                const wline = this.wrappedLines[i];
                const metric = wline.metric;
                if (metric.baseline - metric.ascent - 0.5 * lineGap <= y && y <= metric.baseline + metric.descent + 0.5 * lineGap) {
                    lineIndex = wline.parentLine;
                    wlineIndex = i;
                    break;
                }
            }
        }
        if (lineIndex === -1) {
            console.error('????????????');
        }
        // if (x, y) hit a empty line, only on position is valid
        if (wlineIndex !== _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE && (0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyWarppedLine)(this.wrappedLines[wlineIndex])) {
            return {
                lineIndex: this.wrappedLines[wlineIndex].parentLine,
                runIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                charIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                endOfLine: true,
            };
        }
        // loop each runPart of this wline to locate character
        let runIndex = _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE;
        let charIndex = _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE;
        if (lineIndex !== _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE) {
            // if x is left/right to the line, set to head/tail
            const lineMetric = this.wrappedLines[wlineIndex].metric;
            if (x < (lineMetric === null || lineMetric === void 0 ? void 0 : lineMetric.left)) {
                return this.getHeadTextPosition(this.wrappedLines[wlineIndex]);
            }
            else if (x > (lineMetric === null || lineMetric === void 0 ? void 0 : lineMetric.left) + (lineMetric === null || lineMetric === void 0 ? void 0 : lineMetric.width)) {
                return this.getTailTextPosition(this.wrappedLines[wlineIndex]);
            }
            else {
                // loop each runPart to locate (x,y)
                for (let i = 0; i < this.wrappedLines[wlineIndex].runParts.length; i++) {
                    const runPart = this.wrappedLines[wlineIndex].runParts[i];
                    runIndex = runPart.runID;
                    const logicLine = this.lines[lineIndex];
                    const run = logicLine.runs[runPart.runID];
                    let start = (_a = runPart.metric) === null || _a === void 0 ? void 0 : _a.left;
                    for (let j = runPart.range[0]; j <= runPart.range[1]; j++) {
                        // measure char width
                        // const runText = getSubText(logicLine, run.range);
                        const char = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getSubText)(logicLine, [j, j]);
                        const charWidth = this.getCharWidth(char, run.style);
                        if (x < start + charWidth * 0.5) {
                            // caret is front of first char: text[range[0]]
                            charIndex = j;
                            return { lineIndex, runIndex, charIndex };
                        }
                        else if (x >= start + charWidth * 0.5 && x <= start + charWidth) {
                            // if already is the last char of this runPart, push to next run
                            if (j === runPart.range[1]) {
                                if (runIndex !== logicLine.runs.length - 1) {
                                    return { lineIndex, runIndex: runIndex + 1, charIndex: logicLine.runs[runIndex + 1].range[0] };
                                }
                                else {
                                    return { lineIndex, runIndex: -1, charIndex: -1, endOfLine: true }; // ????
                                }
                            }
                            else {
                                charIndex = j + 1;
                                return { lineIndex, runIndex, charIndex };
                            }
                        }
                        else {
                            start += charWidth;
                        }
                    }
                }
            }
        }
        if (lineIndex === _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE || charIndex === _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE) {
            console.log(`invalid lineIndex or charIndex!`);
        }
        return {
            lineIndex,
            runIndex,
            charIndex,
        };
    }
    // map data position(logic position of a specific location in text) to layout position(logic position layout-ed text with metric)
    getLayoutTextPosition(textPos) {
        if (!this.wrappedLines)
            return _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_LAYOUT_TEXT_POSITION;
        // special case: if caret is at end of line, then it will map to wline's end of line, this is the only case a wline is eol
        if (textPos.endOfLine === true) {
            for (let i = this.wrappedLines.length - 1; i >= 0; i--) {
                const wline = this.wrappedLines[i];
                if (wline.parentLine === textPos.lineIndex) {
                    return {
                        wlineIndex: i,
                        runPartIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                        charIndex: _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_INDEX_VALUE,
                        endOfLine: true,
                    };
                }
            }
        }
        // calc wline        
        for (let i = 0; i < this.wrappedLines.length; i++) {
            const wline = this.wrappedLines[i];
            if (wline.parentLine !== textPos.lineIndex)
                continue;
            for (let j = 0; j < wline.runParts.length; j++) {
                const runPart = wline.runParts[j];
                if (runPart.runID === textPos.runIndex && textPos.charIndex >= runPart.range[0] && textPos.charIndex <= runPart.range[1]) {
                    return {
                        wlineIndex: i,
                        runPartIndex: j,
                        charIndex: textPos.charIndex,
                    };
                }
            }
        }
        // something went wrong
        console.error(`fail when call getLayoutTextPosition with textPos:`);
        console.log(textPos);
        return _types__WEBPACK_IMPORTED_MODULE_3__.INVALID_LAYOUT_TEXT_POSITION;
    }
    isCaretLineHead() {
        return (0,_util__WEBPACK_IMPORTED_MODULE_4__.isPosHead)(this.caret);
    }
    isCaretLineTail() {
        return (0,_util__WEBPACK_IMPORTED_MODULE_4__.isPosTail)(this.caret);
    }
    getCaretColor() {
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.isEmptyLine)(this.lines[this.caret.lineIndex]))
            return _types__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_CURSOR_COLOR;
        return (0,_util__WEBPACK_IMPORTED_MODULE_4__.getStyleAtPosition)(this.lines, this.caret).color;
    }
    insertTextAtCaret(content) {
        // move forward caret, should be computed by the insertion func
        this.caret = (0,_editing__WEBPACK_IMPORTED_MODULE_0__.insertText)(this.lines, this.caret, content);
        this.calcLayout();
    }
    newlineAtCaret() {
        (0,_editing__WEBPACK_IMPORTED_MODULE_0__.newline)(this.lines, this.caret);
        this.calcLayout();
    }
    backspaceAtCaret() {
        (0,_editing__WEBPACK_IMPORTED_MODULE_0__.backspace)(this.lines, this.caret);
        this.calcLayout();
    }
    // itermized with a new indent obj
    itermizeLineAtCaret(idt) {
        (0,_editing__WEBPACK_IMPORTED_MODULE_0__.itermize)(this.lines, this.caret, idt);
        this.calcLayout();
    }
    // change indentation
    indentLineAtCaret(indent) {
        (0,_editing__WEBPACK_IMPORTED_MODULE_0__.indentize)(this.lines, this.caret, indent);
        this.calcLayout();
    }
    // move caret by one character
    moveCaretLeft() {
        const pre = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getPreviousPosition)(this.lines, this.caret);
        if (pre) {
            this.caret = pre;
        }
    }
    moveCaretRight() {
        const next = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getNextPosition)(this.lines, this.caret);
        if (next) {
            this.caret = next;
        }
    }
    moveCaretUp() {
        const layoutPos = this.getLayoutTextPosition(this.caret);
        // already the first wline, no where to go up
        if (layoutPos.wlineIndex === 0)
            return;
        const { left, top } = this.getCursorInfo();
        this.updateCaret(left, top - (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineSpacing)(this.lineSpacing) - 1e-5);
    }
    moveCaretDown() {
        const layoutPos = this.getLayoutTextPosition(this.caret);
        // already the last wline, no down available
        if (layoutPos.wlineIndex === this.wrappedLines.length - 1)
            return;
        const { left, top } = this.getCursorInfo();
        const curLineMetric = this.wrappedLines[layoutPos.wlineIndex].metric;
        const curLineHeight = curLineMetric.ascent + curLineMetric.descent;
        this.updateCaret(left, top + (0,_util__WEBPACK_IMPORTED_MODULE_4__.getLineSpacing)(this.lineSpacing) + curLineHeight + 1e-5);
    }
    // move to current head of wline
    moveCaretToHead() {
        const layoutPos = this.getLayoutTextPosition(this.caret);
        const wline = this.wrappedLines[layoutPos.wlineIndex];
        this.caret = this.getHeadTextPosition(wline);
    }
    // move to the last position of wline
    moveCaretToTail() {
        const layoutPos = this.getLayoutTextPosition(this.caret);
        const wline = this.wrappedLines[layoutPos.wlineIndex];
        this.caret = this.getTailTextPosition(wline);
    }
    // delete selected content
    deleteSelected() {
        if (this.selection) {
            this.caret = (0,_editing__WEBPACK_IMPORTED_MODULE_0__.deleteSelectedText)(this.lines, this.selection);
            this.clearSelection();
            this.calcLayout();
        }
    }
    styleSelected(style) {
        if (!this.selection || !(0,_util__WEBPACK_IMPORTED_MODULE_4__.selectionIsEmpty)(this.selection)) {
            (0,_editing__WEBPACK_IMPORTED_MODULE_0__.changeSelectedTextStyle)(this.lines, this.selection, style);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xheW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM3SCxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSw0QkFBNEIsRUFBRSxjQUFjLEVBQXNCLFlBQVksRUFBd0YsY0FBYyxFQUFFLFVBQVUsRUFBcUIsTUFBTSxTQUFTLENBQUM7QUFDM1csT0FBTyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRTFaLHlGQUF5RjtBQUN6RixNQUFNLE9BQU8sTUFBTTtJQW9CZixZQUFZLEdBQW9DLEVBQUUsS0FBMkI7UUFoQjdFLHlCQUF5QjtRQUN6QixnQkFBVyxHQUFpQixZQUFZLENBQUMsTUFBTSxDQUFDO1FBQ2hELGNBQVMsR0FBbUIsY0FBYyxDQUFDLElBQUksQ0FBQztRQUNoRCxVQUFL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

/***/ }),

/***/ "./public/src/linebreak.ts":
/*!*********************************!*\
  !*** ./public/src/linebreak.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "segmentWordRanges": () => (/* binding */ segmentWordRanges),
/* harmony export */   "segmentWords": () => (/* binding */ segmentWords),
/* harmony export */   "breakPlainTextIntoLines": () => (/* binding */ breakPlainTextIntoLines),
/* harmony export */   "inRange": () => (/* binding */ inRange),
/* harmony export */   "getRunIndex": () => (/* binding */ getRunIndex),
/* harmony export */   "splitWords": () => (/* binding */ splitWords)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./public/src/util.ts");
// linebreak is very deep topic, currently we can only achieve character level linebreak using 3rd party
// libs implmenting http://www.unicode.org/reports/tr14/#SampleCode


// for more smart word segmentation, we probably need language specific libaries e.g. https://investigate.ai/text-analysis/splitting-words-in-east-asian-languages/
var LineBreaker = __webpack_require__(/*! ../../node_modules/linebreak-next */ "./node_modules/linebreak-next/src/linebreaker-browser.js");
function segmentWordRanges(str) {
    const ret = [];
    const breaker = new LineBreaker(str);
    let last = 0;
    let bk;
    while (bk = breaker.nextBreak()) {
        ret.push([last, bk.position - 1]);
        last = bk.position;
    }
    return ret;
}
function segmentWords(str) {
    const ret = [];
    const breaker = new LineBreaker(str);
    let last = 0;
    let bk;
    while (bk = breaker.nextBreak()) {
        // get the string between the last break and this one
        const word = str.slice(last, bk.position);
        //   console.log(word);
        ret.push(word);
        // you can also check bk.required to see if this was a required break...
        if (bk.required) {
            // console.log('\n\n');
            ret.push('\n\n');
        }
        last = bk.position;
    }
    return ret;
}
// break a large body of text by '\n'
function breakPlainTextIntoLines(paragraph) {
    const ret = [];
    let curLine = '';
    for (const char of paragraph) {
        if (char === '\n') {
            // end of a line
            ret.push(curLine.slice());
            curLine = '';
        }
        else {
            curLine += char;
        }
    }
    if (curLine.length) {
        ret.push(curLine);
    }
    return ret;
}
function charIsContent(char) {
    // current only works for english
    return char.length === 1 && char.match(/[0-9][a-z][_.-]/i);
}
function inRange(index, range) {
    return index >= range[0] && index <= range[1];
}
// return the runIndex where the index lands, linear search O(n)
function getRunIndex(index, runs) {
    for (let i = 0; i < runs.length; i++) {
        if (inRange(index, runs[i].range)) {
            return i;
        }
    }
    return _types__WEBPACK_IMPORTED_MODULE_0__.INVALID_INDEX_VALUE;
}
// given a single line of (styled)text, segment it into words
function splitWords(logicLine) {
    const lineText = logicLine.text;
    const runs = logicLine.runs;
    const wordRanges = segmentWordRanges(logicLine.text);
    const ret = [];
    // handle each word sequentially, generating new runs
    for (let i = 0; i < wordRanges.length; i++) {
        const range = wordRanges[i];
        const word = lineText.slice(range[0], range[1] + 1);
        let curParts = [];
        // word[0] start with [curRunIdx, curRunPartStart]
        let curRunIdx = getRunIndex(range[0], runs);
        let curRunPartStart = range[0];
        let curRunPartEnd = curRunPartStart;
        for (let j = range[0]; j <= range[1]; j++) {
            if (getRunIndex(j, runs) === curRunIdx) {
                curRunPartEnd = j;
                continue;
            }
            else {
                // encounter a new runPart, first push current runPart
                curParts.push({ runID: curRunIdx, range: [curRunPartStart, curRunPartEnd] });
                // then start a new runPart
                curRunIdx++;
                curRunPartStart = j;
                curRunPartEnd = curRunPartStart;
            }
        }
        // finished looping this word
        curParts.push({ runID: curRunIdx, range: [curRunPartStart, curRunPartEnd] });
        curRunPartStart = _types__WEBPACK_IMPORTED_MODULE_0__.INVALID_INDEX_VALUE;
        curRunPartEnd = _types__WEBPACK_IMPORTED_MODULE_0__.INVALID_INDEX_VALUE;
        // process this word
        ret.push({
            width: 0,
            height: 0,
            ascent: 0,
            descent: 0,
            baseline: 0,
            text: word,
            runParts: (0,_util__WEBPACK_IMPORTED_MODULE_1__.cloneObj)(curParts),
        });
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWJyZWFrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xpbmVicmVhay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3R0FBd0c7QUFDeEcsbUVBQW1FO0FBRW5FLE9BQU8sRUFBRSxtQkFBbUIsRUFBeUMsTUFBTSxTQUFTLENBQUM7QUFDckYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVsQyxtS0FBbUs7QUFDbkssSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFL0QsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEdBQVc7SUFDekMsTUFBTSxHQUFHLEdBQXVCLEVBQUUsQ0FBQztJQUNuQyxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixJQUFJLEVBQUUsQ0FBQztJQUNQLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRTtRQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUN0QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsR0FBVztJQUNwQyxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7SUFDekIsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxFQUFFLENBQUM7SUFFUCxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUU7UUFDN0IscURBQXFEO1FBQ3JELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFL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

/***/ }),

/***/ "./public/src/render.ts":
/*!******************************!*\
  !*** ./public/src/render.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "drawTextRunPart": () => (/* binding */ drawTextRunPart),
/* harmony export */   "drawHighlightedTextRunPart": () => (/* binding */ drawHighlightedTextRunPart),
/* harmony export */   "drawSelectionHeightlight": () => (/* binding */ drawSelectionHeightlight),
/* harmony export */   "drawBoundingBox": () => (/* binding */ drawBoundingBox),
/* harmony export */   "drawTextMetric": () => (/* binding */ drawTextMetric),
/* harmony export */   "drawWordBounds": () => (/* binding */ drawWordBounds)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./public/src/util.ts");
// pass in context, and use it to draw


// render each run
function drawTextRunPart(ctx, logicLine, runPart, x, y) {
    if (!ctx)
        return;
    const runs = logicLine.runs;
    const style = runs[runPart.runID].style;
    const textToDraw = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getSubText)(logicLine, runPart.range);
    // measure using canvas API, may later fetch metric from fontkit to handle more fonts
    const posInfo = runPart.metric;
    if (!posInfo)
        return;
    let baseline = y;
    if (style.script === _types__WEBPACK_IMPORTED_MODULE_0__.TEXT_SCRIPT.SUPER) {
        baseline -= (posInfo.ascent + posInfo.descent) / 2;
    }
    else if (style.script === _types__WEBPACK_IMPORTED_MODULE_0__.TEXT_SCRIPT.SUB) {
        baseline += posInfo.descent / 2;
    }
    ctx.fillStyle = style.color;
    ctx.font = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getStyleString)(style);
    ctx.fillText(textToDraw, x, baseline);
    if (style.decoration === _types__WEBPACK_IMPORTED_MODULE_0__.TEXT_DECORATION.UNDERLINE) {
        const thickness = style.fontSize / 10;
        ctx.fillRect(x, baseline, posInfo.width, thickness);
    }
    if (style.decoration === _types__WEBPACK_IMPORTED_MODULE_0__.TEXT_DECORATION.STRIKE) {
        const thickness = style.fontSize / 10;
        const offY = 10;
        ctx.fillRect(x, baseline - (posInfo.ascent / 2) + offY, posInfo.width, thickness);
    }
}
function drawHighlightedTextRunPart(ctx, runs, runPart, x, y) {
    if (!ctx)
        return;
    const posInfo = runPart.metric;
    if (!posInfo)
        return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,255, 0.2)';
    ctx.fillRect(x, y - posInfo.ascent, posInfo.width, posInfo.ascent + posInfo.descent);
    ctx.restore();
}
function drawSelectionHeightlight(ctx, selection) {
}
// render debugging bbox
function drawBoundingBox(ctx, left, top, right, bottom) {
}
// render debugging metric: baseline, ascent, descent
function drawTextMetric(ctx, baseline, ascent, descent) {
}
// draw debugging word bbox
function drawWordBounds(ctx, word) {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQ0FBc0M7QUFFdEMsT0FBTyxFQUFrRCxlQUFlLEVBQUUsV0FBVyxFQUFRLE1BQU0sU0FBUyxDQUFDO0FBQzdHLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRXBELGtCQUFrQjtBQUNsQixNQUFNLFVBQVUsZUFBZSxDQUFDLEdBQTZCLEVBQUUsU0FBb0IsRUFBRSxPQUFvQixFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzNILElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTztJQUNqQixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXhELHFGQUFxRjtJQUNyRixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTztJQUVyQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDakIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxLQUFLLEVBQUU7UUFDcEMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3REO1NBQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxHQUFHLEVBQUU7UUFDekMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ25DO0lBRUQsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV0QyxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssZUFBZSxDQUFDLFNBQVMsRUFBRTtRQUNoRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN2RDtJQUVELElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxlQUFlLENBQUMsTUFBTSxFQUFFO1FBQzdDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3JGO0FBQ0wsQ0FBQztBQUVELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxHQUE2QixFQUFFLElBQWUsRUFBRSxPQUFvQixFQUFFLENBQVMsRUFBRSxDQUFTO0lBQ2pJLElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTztJQUVqQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTztJQUVyQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckYsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxNQUFNLFVBQVUsd0JBQXdCLENBQUMsR0FBNkIsRUFBRSxTQUF3QjtBQUVoRyxDQUFDO0FBRUQsd0JBQXdCO0FBQ3hCLE1BQU0sVUFBVSxlQUFlLENBQUMsR0FBNkIsRUFBRSxJQUFZLEVBQUUsR0FBVyxFQUFFLEtBQWEsRUFBRSxNQUFjO0FBRXZILENBQUM7QUFFRCxxREFBcUQ7QUFDckQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxHQUE2QixFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUFFLE9BQWU7QUFDL0csQ0FBQztBQUVELDJCQUEyQjtBQUMzQixNQUFNLFVBQVUsY0FBYyxDQUFDLEdBQTZCLEVBQUUsSUFBVTtBQUV4RSxDQUFDIn0=

/***/ }),

/***/ "./public/src/types.ts":
/*!*****************************!*\
  !*** ./public/src/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LINE_SPACING": () => (/* binding */ LINE_SPACING),
/* harmony export */   "TEXT_VARIATION": () => (/* binding */ TEXT_VARIATION),
/* harmony export */   "TEXT_DECORATION": () => (/* binding */ TEXT_DECORATION),
/* harmony export */   "TEXT_ALIGNMENT": () => (/* binding */ TEXT_ALIGNMENT),
/* harmony export */   "TEXT_SCRIPT": () => (/* binding */ TEXT_SCRIPT),
/* harmony export */   "TOP_MARGIN": () => (/* binding */ TOP_MARGIN),
/* harmony export */   "DEFAULT_LINE_SPACING": () => (/* binding */ DEFAULT_LINE_SPACING),
/* harmony export */   "DEFAULT_ALIGNMENT": () => (/* binding */ DEFAULT_ALIGNMENT),
/* harmony export */   "SHOW_DEBUG_RENDERING": () => (/* binding */ SHOW_DEBUG_RENDERING),
/* harmony export */   "INVALID_INDEX_VALUE": () => (/* binding */ INVALID_INDEX_VALUE),
/* harmony export */   "DEFAULT_TEXT_STYLE": () => (/* binding */ DEFAULT_TEXT_STYLE),
/* harmony export */   "INVALID_METRIC": () => (/* binding */ INVALID_METRIC),
/* harmony export */   "DEFAULT_CURSOR_COLOR": () => (/* binding */ DEFAULT_CURSOR_COLOR),
/* harmony export */   "INVALID_TEXT_POSITION": () => (/* binding */ INVALID_TEXT_POSITION),
/* harmony export */   "INVALID_LAYOUT_TEXT_POSITION": () => (/* binding */ INVALID_LAYOUT_TEXT_POSITION),
/* harmony export */   "TEXT_BULLET_TYPE": () => (/* binding */ TEXT_BULLET_TYPE),
/* harmony export */   "EXTRA_SYMBOL_INDENT": () => (/* binding */ EXTRA_SYMBOL_INDENT)
/* harmony export */ });
var LINE_SPACING;
(function (LINE_SPACING) {
    LINE_SPACING["NORMAL"] = "normal";
    LINE_SPACING["HALF"] = "half";
    LINE_SPACING["DOUBLE"] = "double";
    LINE_SPACING["ONEANDHALF"] = "onehalf";
})(LINE_SPACING || (LINE_SPACING = {}));
var TEXT_VARIATION;
(function (TEXT_VARIATION) {
    TEXT_VARIATION["NORMAL"] = "normal";
    TEXT_VARIATION["BOLD"] = "bold";
    TEXT_VARIATION["ITALIC"] = "italic";
})(TEXT_VARIATION || (TEXT_VARIATION = {}));
var TEXT_DECORATION;
(function (TEXT_DECORATION) {
    TEXT_DECORATION["NONE"] = "none";
    TEXT_DECORATION["UNDERLINE"] = "underline";
    TEXT_DECORATION["STRIKE"] = "strike";
})(TEXT_DECORATION || (TEXT_DECORATION = {}));
var TEXT_ALIGNMENT;
(function (TEXT_ALIGNMENT) {
    TEXT_ALIGNMENT["LEFT"] = "left";
    TEXT_ALIGNMENT["RIGHT"] = "right";
    TEXT_ALIGNMENT["CENTER"] = "center";
    TEXT_ALIGNMENT["JUSTIFY"] = "justify";
})(TEXT_ALIGNMENT || (TEXT_ALIGNMENT = {}));
var TEXT_SCRIPT;
(function (TEXT_SCRIPT) {
    TEXT_SCRIPT["NONE"] = "none";
    TEXT_SCRIPT["SUPER"] = "super";
    TEXT_SCRIPT["SUB"] = "sub";
})(TEXT_SCRIPT || (TEXT_SCRIPT = {}));
const TOP_MARGIN = 0; // space between editor top and first line
const DEFAULT_LINE_SPACING = LINE_SPACING.NORMAL;
const DEFAULT_ALIGNMENT = TEXT_ALIGNMENT.LEFT;
const SHOW_DEBUG_RENDERING = true;
const INVALID_INDEX_VALUE = -1;
const DEFAULT_TEXT_STYLE = {
    font: "serif",
    fontSize: 50,
    color: "black",
    fontVariation: TEXT_VARIATION.NORMAL,
    decoration: TEXT_DECORATION.NONE,
    script: TEXT_SCRIPT.NONE,
};
const INVALID_METRIC = { baseline: INVALID_INDEX_VALUE, ascent: INVALID_INDEX_VALUE, descent: INVALID_INDEX_VALUE, width: INVALID_INDEX_VALUE };
const DEFAULT_CURSOR_COLOR = 'black';
const INVALID_TEXT_POSITION = { lineIndex: INVALID_INDEX_VALUE, runIndex: INVALID_INDEX_VALUE, charIndex: INVALID_INDEX_VALUE };
const INVALID_LAYOUT_TEXT_POSITION = { wlineIndex: INVALID_INDEX_VALUE, runPartIndex: INVALID_INDEX_VALUE, charIndex: INVALID_INDEX_VALUE };
// used for item list (bullet points)
var TEXT_BULLET_TYPE;
(function (TEXT_BULLET_TYPE) {
    TEXT_BULLET_TYPE["BULLET"] = "bullet";
    TEXT_BULLET_TYPE["DASH"] = "dash";
    TEXT_BULLET_TYPE["NUMBER"] = "number";
})(TEXT_BULLET_TYPE || (TEXT_BULLET_TYPE = {}));
const EXTRA_SYMBOL_INDENT = 20;
// caret index === char behind the caret's index
// the char at selection.end is also highlighted
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsTUFBTSxDQUFOLElBQVksWUFLWDtBQUxELFdBQVksWUFBWTtJQUN0QixpQ0FBaUIsQ0FBQTtJQUNqQiw2QkFBYSxDQUFBO0lBQ2IsaUNBQWlCLENBQUE7SUFDakIsc0NBQXNCLENBQUE7QUFDeEIsQ0FBQyxFQUxXLFlBQVksS0FBWixZQUFZLFFBS3ZCO0FBRUQsTUFBTSxDQUFOLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QixtQ0FBaUIsQ0FBQTtJQUNqQiwrQkFBYSxDQUFBO0lBQ2IsbUNBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLGNBQWMsS0FBZCxjQUFjLFFBSXpCO0FBRUQsTUFBTSxDQUFOLElBQVksZUFJWDtBQUpELFdBQVksZUFBZTtJQUN6QixnQ0FBYSxDQUFBO0lBQ2IsMENBQXVCLENBQUE7SUFDdkIsb0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLGVBQWUsS0FBZixlQUFlLFFBSTFCO0FBRUQsTUFBTSxDQUFOLElBQVksY0FLWDtBQUxELFdBQVksY0FBYztJQUN4QiwrQkFBYSxDQUFBO0lBQ2IsaUNBQWUsQ0FBQTtJQUNmLG1DQUFpQixDQUFBO0lBQ2pCLHFDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFMVyxjQUFjLEtBQWQsY0FBYyxRQUt6QjtBQUVELE1BQU0sQ0FBTixJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDckIsNEJBQWEsQ0FBQTtJQUNiLDhCQUFlLENBQUE7SUFDZiwwQkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQUpXLFdBQVcsS0FBWCxXQUFXLFFBSXRCO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFXLENBQUMsQ0FBQyxDQUFDLDBDQUEwQztBQUMvRSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBaUIsWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUN0RSxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBbUIsY0FBYyxDQUFDLElBQUksQ0FBQztBQUNyRSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBWSxJQUFJLENBQUM7QUFDbEQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQVcsQ0FBQyxDQUFDLENBQUM7QUFhOUMsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQWM7SUFDM0MsSUFBSSxFQUFFLE9BQU87SUFDYixRQUFRLEVBQUUsRUFBRTtJQUNaLEtBQUssRUFBRSxPQUFPO0lBQ2QsYUFBYSxFQUFFLGNBQWMsQ0FBQyxNQUFNO0lBQ3BDLFVBQVUsRUFBRSxlQUFlLENBQUMsSUFBSTtJQUNoQyxNQUFNLEVBQUUsV0FBVyxDQUFDLElBQUk7Q0FDekIsQ0FBQztBQVVGLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBVyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDO0FBQy9KLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFXLE9BQU8sQ0FBQztBQUNwRCxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBaUIsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDO0FBQ3JKLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUF1QixFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLENBQUM7QUFDdksscUNBQXFDO0FBQ3JDLE1BQU0sQ0FBTixJQUFZLGdCQUlYO0FBSkQsV0FBWSxnQkFBZ0I7SUFDMUIscUNBQWlCLENBQUE7SUFDakIsaUNBQWEsQ0FBQTtJQUNiLHFDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFKVyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBSTNCO0FBQ0QsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBaUd0QyxnREFBZ0Q7QUFDaEQsZ0RBQWdEIn0=

/***/ }),

/***/ "./public/src/util.ts":
/*!****************************!*\
  !*** ./public/src/util.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLineSpacing": () => (/* binding */ getLineSpacing),
/* harmony export */   "isRangeValid": () => (/* binding */ isRangeValid),
/* harmony export */   "getAdjustedFontSize": () => (/* binding */ getAdjustedFontSize),
/* harmony export */   "getStyleString": () => (/* binding */ getStyleString),
/* harmony export */   "measureText": () => (/* binding */ measureText),
/* harmony export */   "aggregateWordMetric": () => (/* binding */ aggregateWordMetric),
/* harmony export */   "updateWordsMetric": () => (/* binding */ updateWordsMetric),
/* harmony export */   "linebreak": () => (/* binding */ linebreak),
/* harmony export */   "updateRunPartsFromWords": () => (/* binding */ updateRunPartsFromWords),
/* harmony export */   "getJustifyGap": () => (/* binding */ getJustifyGap),
/* harmony export */   "getLeftMargin": () => (/* binding */ getLeftMargin),
/* harmony export */   "getSubText": () => (/* binding */ getSubText),
/* harmony export */   "isEqualTextPosition": () => (/* binding */ isEqualTextPosition),
/* harmony export */   "isSingleInsertionPoint": () => (/* binding */ isSingleInsertionPoint),
/* harmony export */   "getPreviousPositionInLine": () => (/* binding */ getPreviousPositionInLine),
/* harmony export */   "getNextPositionInLine": () => (/* binding */ getNextPositionInLine),
/* harmony export */   "cloneObj": () => (/* binding */ cloneObj),
/* harmony export */   "isEmptyLine": () => (/* binding */ isEmptyLine),
/* harmony export */   "isEmptyWarppedLine": () => (/* binding */ isEmptyWarppedLine),
/* harmony export */   "getFirstPosOfLine": () => (/* binding */ getFirstPosOfLine),
/* harmony export */   "getLastPosOfLine": () => (/* binding */ getLastPosOfLine),
/* harmony export */   "getPreviousPosition": () => (/* binding */ getPreviousPosition),
/* harmony export */   "getNextPosition": () => (/* binding */ getNextPosition),
/* harmony export */   "getLineEndPosition": () => (/* binding */ getLineEndPosition),
/* harmony export */   "getStyleOfLine": () => (/* binding */ getStyleOfLine),
/* harmony export */   "getStyleAtPosition": () => (/* binding */ getStyleAtPosition),
/* harmony export */   "isCharReturn": () => (/* binding */ isCharReturn),
/* harmony export */   "getPreCutLine": () => (/* binding */ getPreCutLine),
/* harmony export */   "getPostCutLine": () => (/* binding */ getPostCutLine),
/* harmony export */   "getCharIndexBeforePos": () => (/* binding */ getCharIndexBeforePos),
/* harmony export */   "getPosIndexFromCharIndex": () => (/* binding */ getPosIndexFromCharIndex),
/* harmony export */   "offsetRange": () => (/* binding */ offsetRange),
/* harmony export */   "positionLess": () => (/* binding */ positionLess),
/* harmony export */   "positionLessOrEqual": () => (/* binding */ positionLessOrEqual),
/* harmony export */   "selectionIsEmpty": () => (/* binding */ selectionIsEmpty),
/* harmony export */   "removeCharFromText": () => (/* binding */ removeCharFromText),
/* harmony export */   "offsetRangeFromPos": () => (/* binding */ offsetRangeFromPos),
/* harmony export */   "getWrappedLineWidth": () => (/* binding */ getWrappedLineWidth),
/* harmony export */   "getWrappedLineHeight": () => (/* binding */ getWrappedLineHeight),
/* harmony export */   "mergeLine": () => (/* binding */ mergeLine),
/* harmony export */   "deleteText": () => (/* binding */ deleteText),
/* harmony export */   "breakLineAtPosition": () => (/* binding */ breakLineAtPosition),
/* harmony export */   "isLineEmpty": () => (/* binding */ isLineEmpty),
/* harmony export */   "findBreakMetaChar": () => (/* binding */ findBreakMetaChar),
/* harmony export */   "isPosHead": () => (/* binding */ isPosHead),
/* harmony export */   "isPosTail": () => (/* binding */ isPosTail),
/* harmony export */   "getLogicLineFromString": () => (/* binding */ getLogicLineFromString),
/* harmony export */   "changeRunStyle": () => (/* binding */ changeRunStyle),
/* harmony export */   "isTextPosValid": () => (/* binding */ isTextPosValid),
/* harmony export */   "updatePositionRunIndex": () => (/* binding */ updatePositionRunIndex),
/* harmony export */   "getRunIndexAtChar": () => (/* binding */ getRunIndexAtChar)
/* harmony export */ });
/* harmony import */ var _linebreak__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linebreak */ "./public/src/linebreak.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");


function getLineSpacing(spacing) {
    switch (spacing) {
        case _types__WEBPACK_IMPORTED_MODULE_1__.LINE_SPACING.NORMAL:
            return 10;
        case _types__WEBPACK_IMPORTED_MODULE_1__.LINE_SPACING.HALF:
            return 5;
        case _types__WEBPACK_IMPORTED_MODULE_1__.LINE_SPACING.ONEANDHALF:
            return 15;
        case _types__WEBPACK_IMPORTED_MODULE_1__.LINE_SPACING.DOUBLE:
            return 20;
        default:
            return 0;
    }
}
function isRangeValid(range) {
    return range[0] >= 0 && range[0] <= range[1];
}
function getAdjustedFontSize(style) {
    return (style.script === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_SCRIPT.SUPER || style.script === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_SCRIPT.SUB) ? style.fontSize / 2 : style.fontSize;
}
function getStyleString(style) {
    const fontSize = getAdjustedFontSize(style);
    const variation = style.fontVariation === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_VARIATION.NORMAL ? '' : (style.fontVariation + ' ');
    return variation + fontSize + 'px ' + style.font;
}
function isStyleEqual(s1, s2) {
    return JSON.stringify(getFullStyle(s1)) === JSON.stringify(getFullStyle(s2));
}
function getFullStyle(style) {
    return Object.assign(Object.assign({}, _types__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_TEXT_STYLE), style);
}
function measureText(ctx, text, style, range) {
    ctx.save();
    ctx.font = getStyleString(style);
    const str = (range && isRangeValid(range)) ? text.substring(range[0], range[1] + 1) : text;
    const res = ctx.measureText(str);
    ctx.restore();
    return {
        width: res.width,
        baseline: 0,
        ascent: res.fontBoundingBoxAscent,
        descent: res.fontBoundingBoxDescent,
    };
}
// calculate line bounds
function aggregateWordMetric(words) {
    const metricArray = words.map(function (word) {
        return { baseline: word.baseline, ascent: word.ascent, descent: word.descent, width: word.width };
    });
    const agMetric = metricArray.reduce((pre, cur) => {
        return {
            baseline: 0,
            width: pre.width + cur.width,
            ascent: Math.max(pre.ascent, cur.ascent),
            descent: Math.max(pre.descent, cur.descent),
        };
    });
    return agMetric;
}
// calculate word metric and mutate words
function updateWordsMetric(ctx, logicLine, words) {
    const runs = logicLine.runs;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // measure each word part and aggregate 
        const metricArray = [];
        for (let j = 0; j < word.runParts.length; j++) {
            const runPart = word.runParts[j];
            const text = getSubText(logicLine, runPart.range);
            const metric = measureText(ctx, text, runs[runPart.runID].style);
            metricArray.push(metric);
        }
        // aggregates metric of this word
        const agMetric = metricArray.reduce((pre, cur) => {
            return {
                baseline: 0,
                width: pre.width + cur.width,
                ascent: Math.max(pre.ascent, cur.ascent),
                descent: Math.max(pre.descent, cur.descent),
            };
        });
        word.width = agMetric.width;
        word.height = agMetric.ascent + agMetric.descent;
        word.baseline = agMetric.baseline;
        word.ascent = agMetric.ascent;
        word.descent = agMetric.descent;
        // console.log(`${word.width} ${word.height}`);
    }
}
// given a line of words, return array of wrapped words
function linebreak(words, breakWidth, leadingSpace) {
    const ret = [];
    let curline = [];
    let curWidth = leadingSpace;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const w = word.width;
        if (curWidth + w < breakWidth || i === 0) {
            curWidth += w;
            curline.push(word);
        }
        else {
            ret.push(curline.slice());
            curline = [word];
            curWidth = leadingSpace + w;
        }
    }
    if (curline.length) {
        ret.push(curline.slice());
    }
    return ret;
}
// assembly runParts from styled words
function updateRunPartsFromWords(ctx, logicLine, words) {
    const ret = [];
    const runs = logicLine.runs;
    let curRunPartID = -1;
    let curRun = runs[0];
    let curRange = [curRun.range[0], curRun.range[1]];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        for (let j = 0; j < word.runParts.length; j++) {
            const rp = word.runParts[j];
            if (rp.runID !== curRunPartID) {
                // first wrap up existing runPart
                if (curRunPartID >= 0) {
                    const newRunPart = {
                        runID: curRunPartID,
                        range: curRange.slice(),
                        metric: measureText(ctx, getSubText(logicLine, curRange), curRun.style),
                    };
                    ret.push(newRunPart);
                }
                // then start a new runPart
                curRunPartID = rp.runID;
                curRun = runs[curRunPartID];
                curRange[0] = rp.range[0];
                curRange[1] = rp.range[1];
            }
            else {
                // update curRun's range[1] only
                curRange[1] = rp.range[1];
            }
        }
    }
    // push last runPart
    if (curRunPartID >= 0) {
        ret.push({
            runID: curRunPartID,
            range: curRange.slice(),
            metric: measureText(ctx, getSubText(logicLine, curRange), curRun.style),
        });
    }
    return ret;
}
// space between words to span the line across the editor width
function getJustifyGap(wline, editorWidth) {
    const lineWidth = wline.metric.width;
    return 0.5 * (lineWidth - editorWidth);
}
// where to start each line
function getLeftMargin(lineWidth, editorWidth, alignment) {
    if (alignment === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_ALIGNMENT.LEFT) {
        return 0;
    }
    else if (alignment === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_ALIGNMENT.RIGHT) {
        return Math.max(editorWidth - lineWidth, 0);
    }
    else if (alignment === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_ALIGNMENT.CENTER) {
        return Math.max((editorWidth - lineWidth) / 2, 0);
    }
    else if (alignment === _types__WEBPACK_IMPORTED_MODULE_1__.TEXT_ALIGNMENT.JUSTIFY) {
        return 0;
    }
    else {
        return 0;
    }
}
function getSubText(line, range) {
    return line.text.slice(range[0], range[1] + 1);
}
function isEqualTextPosition(p0, p1) {
    return (p0.lineIndex === p1.lineIndex && p0.runIndex === p1.runIndex && p0.charIndex === p1.charIndex && p0.endOfLine === p1.endOfLine);
}
function isSingleInsertionPoint(sel) {
    return isEqualTextPosition(sel.start, sel.end);
}
// get previous position inside a logic line, if already at begin, return undefined
function getPreviousPositionInLine(lines, pos) {
    // first char of this logic line, cannot move left anymore
    if (isPosHead(pos)) {
        return undefined;
    }
    const line = lines[pos.lineIndex];
    // behind the last char of this logic line, grab the last char
    if (pos.endOfLine === true) {
        // empty line
        if (line.runs.length === 0) {
            console.error(`should not query position on empty line!`);
            return undefined;
        }
        return {
            lineIndex: pos.lineIndex,
            runIndex: line.runs.length - 1,
            charIndex: line.text.length - 1,
        };
    }
    if (pos.charIndex === line.runs[pos.runIndex].range[0]) {
        // current at boundary of two runs(and also not the first run), change to previous run
        return {
            lineIndex: pos.lineIndex,
            runIndex: pos.runIndex - 1,
            charIndex: pos.charIndex - 1,
        };
    }
    else {
        // move left in current run
        return {
            lineIndex: pos.lineIndex,
            runIndex: pos.runIndex,
            charIndex: pos.charIndex - 1,
        };
    }
}
// get next position inside a logic line, if already at end of line, return undefined
function getNextPositionInLine(lines, pos) {
    const line = lines[pos.lineIndex];
    // empty line, stay 
    if (isEmptyLine(line)) {
        console.error(`should not query position on empty line!`);
        return pos;
    }
    const runs = line.runs;
    // if at last char logic line, return the end-of-line position
    if (pos.runIndex === runs.length - 1 && pos.charIndex === line.text.length - 1) {
        return {
            lineIndex: pos.lineIndex,
            runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
            charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE,
            endOfLine: true,
        };
    }
    // if at end of line position (back of last char), no way to next
    if (pos.endOfLine === true) {
        return undefined;
    }
    // normal case: has next in current logic line
    const curRun = runs[pos.runIndex];
    if (pos.charIndex === curRun.range[1]) {
        // reaching end of current run, jump to next run's beginning
        return {
            lineIndex: pos.lineIndex,
            runIndex: pos.runIndex + 1,
            charIndex: runs[pos.runIndex + 1].range[0],
        };
    }
    else {
        return {
            lineIndex: pos.lineIndex,
            runIndex: pos.runIndex,
            charIndex: pos.charIndex + 1,
        };
    }
}
function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isEmptyLine(line) {
    return line.runs.length === 0;
}
function isEmptyWarppedLine(line) {
    return line.runParts.length === 0;
}
function getFirstPosOfLine(lines, lineIndex) {
    // for empty line, position is still a valid position, although cannot query for content
    if (isEmptyLine(lines[lineIndex])) {
        return { lineIndex, runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, endOfLine: true };
    }
    // return first char of first run
    return {
        lineIndex,
        runIndex: 0,
        charIndex: 0,
    };
}
// return end-of-line position
function getLastPosOfLine(lines, lineIndex) {
    return { lineIndex, runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, endOfLine: true };
}
// query position inside the whole doc, not limited to one single logic line
function getPreviousPosition(lines, pos) {
    const line = lines[pos.lineIndex]; // lineIndex should always be valid, runIndex, charIndex may not
    // current line is an empty line
    if (isEmptyLine(line)) {
        // move to previous line's end
        if (pos.lineIndex === 0) {
            return pos;
        }
        else {
            return getLastPosOfLine(lines, pos.lineIndex - 1);
        }
    }
    const pre = getPreviousPositionInLine(lines, pos);
    if (pre) {
        // can jump to pre inside current line
        return pre;
    }
    // pre is undefined in two cases: 1. should jump to previous line, 2. no where to jump
    if (pos.lineIndex === 0) {
        // no where to jump
        return undefined;
    }
    else {
        // jump to previous line's end
        return getLastPosOfLine(lines, pos.lineIndex - 1);
    }
}
function getNextPosition(lines, pos) {
    const line = lines[pos.lineIndex]; // lineIndex should always be valid, runIndex, charIndex may not
    // current line is an empty line
    if (isEmptyLine(line)) {
        // move to next line's beginning
        if (pos.lineIndex === lines.length - 1) {
            return getFirstPosOfLine(lines, pos.lineIndex);
        }
        else {
            return getFirstPosOfLine(lines, pos.lineIndex + 1);
        }
    }
    const next = getNextPositionInLine(lines, pos);
    if (next) {
        return next;
    }
    // now pre is undefined in two cases: 1. need to jump to next line 2. no where to jump
    if (pos.lineIndex === lines.length - 1) {
        return undefined;
    }
    else {
        // jump to next line's beginning
        return getFirstPosOfLine(lines, pos.lineIndex + 1);
    }
}
function getLineEndPosition(wline) {
    return { lineIndex: wline.parentLine, runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, endOfLine: true };
}
function getStyleOfLine(lines, lineID) {
    if (isEmptyLine(lines[lineID])) {
        if (lineID === 0)
            return _types__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_TEXT_STYLE;
        return getStyleOfLine(lines, lineID - 1);
    }
    else {
        return lines[lineID].runs[0].style;
    }
}
// get style only target one specific logic line, a position is inside a run or on boundary of two runs
function getStyleAtPosition(lines, pos) {
    // normally fetch style from previous pos in current logic line, but if no previous pos for this line, use next pos, otherwise use default
    const line = lines[pos.lineIndex];
    // empty line: return default style
    if (isEmptyLine(line)) {
        return _types__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_TEXT_STYLE;
    }
    // position is end-of-line, return last run of current line
    if (pos.endOfLine === true) {
        return line.runs[line.runs.length - 1].style;
    }
    // position is in the middle of current line: 1. if is head, fetch current position, 2. fetch previous position's style
    if (isPosHead(pos)) {
        // fetch first run's style
        return line.runs[pos.runIndex].style;
    }
    else {
        // fetch previous char's style
        const pre = getPreviousPositionInLine(lines, pos);
        if (!pre) {
            console.error(`pre should not be undefined here!`);
        }
        return line.runs[pre.runIndex].style;
    }
}
function isCharReturn(char) {
    return Boolean(char.match(/\n/)) && char.length === 1;
}
// cut a line at pos, return the modified pre-cut line in place
function getPreCutLine(line, pos) {
    // head and tail position
    if (isPosHead(pos))
        return { runs: [], text: '', textIndent: line.textIndent };
    if (isPosTail(pos))
        return line;
    // remove chars after the cut position
    const cutRunIndex = pos.charIndex === line.runs[pos.runIndex].range[0] ? pos.runIndex - 1 : pos.runIndex;
    const preLine = cloneObj(line);
    // any full run behind it should be removed
    preLine.runs.splice(cutRunIndex + 1);
    // modify the cut run (now the last run), any char behind the caret will be removed
    const cutRun = preLine.runs[cutRunIndex];
    cutRun.range[1] = pos.charIndex === line.runs[pos.runIndex].range[0] ? cutRun.range[1] : pos.charIndex - 1;
    // update text
    preLine.text = preLine.text.slice(0, cutRun.range[1] + 1);
    return preLine;
}
// cut a line at pos, return the modified post-cut line in place
function getPostCutLine(line, pos) {
    // head and tail position
    if (isPosHead(pos))
        return line;
    if (isPosTail(pos))
        return { runs: [], text: '' };
    const postLine = cloneObj(line);
    // any run before cut position should be removed
    postLine.runs = postLine.runs.slice(pos.runIndex);
    // modify the cut run (now the first run) by removing chars before the cut
    const cutRun = postLine.runs[0];
    cutRun.range[0] = pos.charIndex;
    const startIdx = cutRun.range[0]; // old char index -> 0
    // every range after the cut should be updated
    for (let i = 0; i < postLine.runs.length; i++) {
        postLine.runs[i].range[0] -= startIdx;
        postLine.runs[i].range[1] -= startIdx;
    }
    // update text
    postLine.text = postLine.text.slice(startIdx);
    return postLine;
}
// return the index of char before the pos
function getCharIndexBeforePos(line, pos) {
    if (isPosTail(pos)) {
        return line.text.length - 1;
    }
    return pos.charIndex - 1;
}
function getPosIndexFromCharIndex(runs, index) {
    for (let i = 0; i < runs.length; i++) {
        if ((0,_linebreak__WEBPACK_IMPORTED_MODULE_0__.inRange)(index, runs[i].range)) {
            return {
                runIndex: i,
                charIndex: index,
            };
        }
    }
    return { runIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE, charIndex: _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE };
}
function offsetRange(runs, off) {
    runs.forEach(run => {
        run.range[0] += off;
        run.range[1] += off;
    });
}
function positionLess(p0, p1) {
    if (p0.lineIndex < p1.lineIndex) {
        return true;
    }
    else if (p0.lineIndex > p1.lineIndex) {
        return false;
    }
    else {
        // two positions are in same line
        if (p0.endOfLine === true && p1.endOfLine !== true) {
            return false;
        }
        else if (p0.endOfLine === true && p1.endOfLine === true) {
            return false;
        }
        else if (p0.endOfLine !== true && p1.endOfLine === true) {
            return true;
        }
        else {
            return p0.charIndex < p1.charIndex;
        }
    }
}
function positionLessOrEqual(p0, p1) {
    if (p0.lineIndex < p1.lineIndex) {
        return true;
    }
    else if (p0.lineIndex > p1.lineIndex) {
        return false;
    }
    else {
        if (p0.endOfLine === true && p1.endOfLine !== true) {
            return false;
        }
        else if (p0.endOfLine === true && p1.endOfLine === true) {
            return true;
        }
        else if (p0.endOfLine !== true && p1.endOfLine === true) {
            return true;
        }
        else {
            return p0.charIndex <= p1.charIndex;
        }
    }
}
function selectionIsEmpty(sel) {
    if (!sel)
        return true;
    return JSON.stringify(sel.start) === JSON.stringify(sel.end);
}
function removeCharFromText(str, index) {
    if (index < 0 || index >= str.length)
        console.error(`out of range removing char`);
    return str.slice(0, index) + str.slice(index + 1);
}
// shift all indices after certain pos
function offsetRangeFromPos(runs, off, start) {
    const i0 = getPosIndexFromCharIndex(runs, start).runIndex;
    for (let i = i0; i < runs.length; i++) {
        const run = runs[i];
        if (i !== i0) {
            run.range[0] += off;
        }
        run.range[1] += off;
    }
    // if runs[i0] been squashed, remove it
    if (runs[i0].range[0] > runs[i0].range[1]) {
        runs.splice(i0, 1);
    }
}
function getWrappedLineWidth(wline) {
    if (!wline.metric)
        return 0;
    return wline.metric.width;
}
function getWrappedLineHeight(wline) {
    if (!wline.metric)
        return 0;
    return wline.metric.ascent + wline.metric.descent;
}
// merge two lines into a single line without merging runs, won't overwrite lineA, lineB
function mergeLine(lineA, lineB) {
    var _a;
    if (isEmptyLine(lineB))
        return lineA;
    if (isEmptyLine(lineA))
        return lineB;
    const Aruns = lineA.runs.slice();
    const Bruns = lineB.runs.slice();
    const off = lineA.text.length;
    offsetRange(Bruns, off);
    const AlastRun = Aruns[Aruns.length - 1];
    const BfirstRun = Bruns[0];
    // see if we can merge boundary runs
    if (isStyleEqual(AlastRun.style, BfirstRun.style)) {
        AlastRun.range[1] = BfirstRun.range[1];
        Bruns.splice(0, 1);
    }
    const newLine = {
        textIndent: (_a = lineA.textIndent) !== null && _a !== void 0 ? _a : undefined,
        runs: Aruns.concat(Bruns),
        text: lineA.text + lineB.text,
    };
    return newLine;
}
// delete selected text, mutate logiclines, may return caret
function deleteText(lines, sel) {
    if (isSingleInsertionPoint(sel))
        return;
    // cut the start run
    const startCutLine = lines[sel.start.lineIndex];
    const preLine = getPreCutLine(startCutLine, sel.start);
    // cut the end run
    const endCutLine = lines[sel.end.lineIndex];
    const postLine = getPostCutLine(endCutLine, sel.end);
    // merge pre and post
    mergeLine(preLine, postLine);
}
// breakline may happen at begin, end or middle
function breakLineAtPosition(lines, pos) {
}
function isLineEmpty(line) {
    return line.runs.length === 0;
}
function findBreakMetaChar(str, char = '\n') {
    const ret = [];
    if (str.length === 0)
        return ret;
    let last = 0;
    let index = -1;
    while ((index = str.indexOf(char, last)) !== -1) {
        ret.push(index);
        last = index + 1;
    }
    return ret;
}
function isPosHead(pos) {
    return pos.runIndex === 0 && pos.charIndex === 0 && !pos.endOfLine;
}
function isPosTail(pos) {
    return pos.endOfLine === true;
}
// if string don't have line-break, we can create a logic line with single run
function getLogicLineFromString(str, style, textIndent) {
    const hasLineBreak = findBreakMetaChar(str, '\n').length > 0;
    if (hasLineBreak) {
        console.error(`str is empty or string has \\n when getLogicLineFromString`);
    }
    if (str === '') {
        return {
            textIndent,
            runs: [],
            text: '',
        };
    }
    return {
        textIndent,
        runs: [{
                style,
                range: [0, str.length - 1],
            }],
        text: str,
    };
}
// updating part of an existing run may break it into 1,2,3 parts, also need to recalc layiout
function changeRunStyle(runs, runID, changeRange, style) {
    if (!(0,_linebreak__WEBPACK_IMPORTED_MODULE_0__.inRange)(runID, [0, runs.length - 1]))
        console.error(`runID is out of range`);
    const run = runs[runID];
    const range = run.range;
    if (changeRange[0] < range[0] || changeRange[1] > range[1]) {
        console.error(`style changeRange is out of range`);
        return;
    }
    const oldStyle = run.style;
    const newStyle = Object.assign(Object.assign({}, run.style), style);
    if (changeRange[0] === range[0] && changeRange[1] === range[1]) {
        // no change to runs
        run.style = newStyle;
    }
    else if (changeRange[0] === range[0] && changeRange[1] < range[1]) {
        // update the former part
        const leftRun = {
            style: newStyle,
            range: [range[0], changeRange[1]],
        };
        run.range[0] = changeRange[1] + 1;
        runs.splice(runID, 0, leftRun);
    }
    else if (changeRange[0] > range[0] && changeRange[1] === range[1]) {
        // update the later part
        const rightRun = {
            style: newStyle,
            range: [changeRange[0], range[1]],
        };
        run.range[1] = changeRange[0] - 1;
        runs.splice(runID + 1, 0, rightRun);
    }
    else {
        // update the middle part
        const leftRun = {
            style: oldStyle,
            range: [range[0], changeRange[0] - 1],
        };
        const middleRun = {
            style: newStyle,
            range: changeRange,
        };
        const rightRun = {
            style: oldStyle,
            range: [changeRange[1] + 1, range[1]],
        };
        runs.splice(runID, 1, leftRun, middleRun, rightRun);
    }
}
function isTextPosValid(lines, pos) {
    if (isPosTail(pos))
        return true;
    return (0,_linebreak__WEBPACK_IMPORTED_MODULE_0__.inRange)(pos.charIndex, lines[pos.lineIndex].runs[pos.runIndex].range);
}
function updatePositionRunIndex(lines, pos) {
    if (isPosTail(pos))
        return pos;
    if (isTextPosValid(lines, pos))
        return pos;
    const runIndex = getRunIndexAtChar(lines, pos.lineIndex, pos.charIndex);
    if (runIndex !== _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE) {
        return { lineIndex: pos.lineIndex, runIndex, charIndex: pos.charIndex };
    }
    // something went wrong
    console.error(`TextPosition is invalid when call updatePositionRunIndex`);
    return _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_TEXT_POSITION;
}
// calc runIndex by the char position
function getRunIndexAtChar(lines, lineIndex, charIndex) {
    if (lineIndex === _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE || charIndex === _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE)
        return _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE;
    const line = lines[lineIndex];
    for (let i = 0; i < line.runs.length; i++) {
        const run = line.runs[i];
        if ((0,_linebreak__WEBPACK_IMPORTED_MODULE_0__.inRange)(charIndex, run.range)) {
            return i;
        }
    }
    // something went wrong
    console.error(`failed when call getRunIndexAtChar`);
    return _types__WEBPACK_IMPORTED_MODULE_1__.INVALID_INDEX_VALUE;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLFlBQVksRUFBK0YsY0FBYyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQXFCLE1BQU0sU0FBUyxDQUFDO0FBRXBRLE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBcUI7SUFDbEQsUUFBUSxPQUFPLEVBQUU7UUFDZixLQUFLLFlBQVksQ0FBQyxNQUFNO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1FBQ1osS0FBSyxZQUFZLENBQUMsSUFBSTtZQUNwQixPQUFPLENBQUMsQ0FBQztRQUNYLEtBQUssWUFBWSxDQUFDLFVBQVU7WUFDMUIsT0FBTyxFQUFFLENBQUM7UUFDWixLQUFLLFlBQVksQ0FBQyxNQUFNO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1FBQ1o7WUFDRSxPQUFPLENBQUMsQ0FBQztLQUNaO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsS0FBdUI7SUFDbEQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFnQjtJQUNsRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztBQUN4SCxDQUFDO0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FB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

/***/ }),

/***/ "./node_modules/unicode-trie/index.js":
/*!********************************************!*\
  !*** ./node_modules/unicode-trie/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const inflate = __webpack_require__(/*! tiny-inflate */ "./node_modules/tiny-inflate/index.js");

// Shift size for getting the index-1 table offset.
const SHIFT_1 = 6 + 5;

// Shift size for getting the index-2 table offset.
const SHIFT_2 = 5;

// Difference between the two shift sizes,
// for getting an index-1 offset from an index-2 offset. 6=11-5
const SHIFT_1_2 = SHIFT_1 - SHIFT_2;

// Number of index-1 entries for the BMP. 32=0x20
// This part of the index-1 table is omitted from the serialized form.
const OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> SHIFT_1;

// Number of entries in an index-2 block. 64=0x40
const INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;

// Mask for getting the lower bits for the in-index-2-block offset. */
const INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;

// Shift size for shifting left the index array values.
// Increases possible data size with 16-bit index values at the cost
// of compactability.
// This requires data blocks to be aligned by DATA_GRANULARITY.
const INDEX_SHIFT = 2;

// Number of entries in a data block. 32=0x20
const DATA_BLOCK_LENGTH = 1 << SHIFT_2;

// Mask for getting the lower bits for the in-data-block offset.
const DATA_MASK = DATA_BLOCK_LENGTH - 1;

// The part of the index-2 table for U+D800..U+DBFF stores values for
// lead surrogate code _units_ not code _points_.
// Values for lead surrogate code _points_ are indexed with this portion of the table.
// Length=32=0x20=0x400>>SHIFT_2. (There are 1024=0x400 lead surrogates.)
const LSCP_INDEX_2_OFFSET = 0x10000 >> SHIFT_2;
const LSCP_INDEX_2_LENGTH = 0x400 >> SHIFT_2;

// Count the lengths of both BMP pieces. 2080=0x820
const INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;

// The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.
// Length 32=0x20 for lead bytes C0..DF, regardless of SHIFT_2.
const UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;
const UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6;  // U+0800 is the first code point after 2-byte UTF-8

// The index-1 table, only used for supplementary code points, at offset 2112=0x840.
// Variable length, for code points up to highStart, where the last single-value range starts.
// Maximum length 512=0x200=0x100000>>SHIFT_1.
// (For 0x100000 supplementary code points U+10000..U+10ffff.)
//
// The part of the index-2 table for supplementary code points starts
// after this index-1 table.
//
// Both the index-1 table and the following part of the index-2 table
// are omitted completely if there is only BMP data.
const INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;

// The alignment size of a data block. Also the granularity for compaction.
const DATA_GRANULARITY = 1 << INDEX_SHIFT;

class UnicodeTrie {
  constructor(data) {
    const isBuffer = (typeof data.readUInt32BE === 'function') && (typeof data.slice === 'function');

    if (isBuffer || data instanceof Uint8Array) {
      // read binary format
      let uncompressedLength;
      if (isBuffer) {
        this.highStart = data.readUInt32BE(0);
        this.errorValue = data.readUInt32BE(4);
        uncompressedLength = data.readUInt32BE(8);
        data = data.slice(12);
      } else {
        const view = new DataView(data.buffer);
        this.highStart = view.getUint32(0);
        this.errorValue = view.getUint32(4);
        uncompressedLength = view.getUint32(8);
        data = data.subarray(12);
      }

      // double inflate the actual trie data
      data = inflate(data, new Uint8Array(uncompressedLength));
      data = inflate(data, new Uint8Array(uncompressedLength));
      this.data = new Uint32Array(data.buffer);

    } else {
      // pre-parsed data
      ({ data: this.data, highStart: this.highStart, errorValue: this.errorValue } = data);
    }
  }

  get(codePoint) {
    let index;
    if ((codePoint < 0) || (codePoint > 0x10ffff)) {
      return this.errorValue;
    }

    if ((codePoint < 0xd800) || ((codePoint > 0xdbff) && (codePoint <= 0xffff))) {
      // Ordinary BMP code point, excluding leading surrogates.
      // BMP uses a single level lookup.  BMP index starts at offset 0 in the index.
      // data is stored in the index array itself.
      index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    if (codePoint <= 0xffff) {
      // Lead Surrogate Code Point.  A Separate index section is stored for
      // lead surrogate code units and code points.
      //   The main index has the code unit data.
      //   For this function, we need the code point data.
      index = (this.data[LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    if (codePoint < this.highStart) {
      // Supplemental code point, use two-level lookup.
      index = this.data[(INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH) + (codePoint >> SHIFT_1)];
      index = this.data[index + ((codePoint >> SHIFT_2) & INDEX_2_MASK)];
      index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    return this.data[this.data.length - DATA_GRANULARITY];
  }
}

module.exports = UnicodeTrie;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./public/src/app.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editor */ "./public/src/editor.ts");
/* harmony import */ var _fontManger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fontManger */ "./public/src/fontManger.ts");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout */ "./public/src/layout.ts");
/* harmony import */ var _linebreak__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./linebreak */ "./public/src/linebreak.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render */ "./public/src/render.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ "./public/src/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./public/src/util.ts");







var LineBreaker = __webpack_require__(/*! ../../node_modules/linebreak-next */ "./node_modules/linebreak-next/src/linebreaker-browser.js");
// export consts, class, functions
function greet(str) {
    var breaker = new LineBreaker(str);
    var last = 0;
    var bk;
    while (bk = breaker.nextBreak()) {
        // get the string between the last break and this one
        var word = str.slice(last, bk.position);
        console.log(word);
        // you can also check bk.required to see if this was a required break...
        if (bk.required) {
            console.log('\n\n');
        }
        last = bk.position;
    }
}
var btex = {
    greet: greet,
    drawTextRunPart: _render__WEBPACK_IMPORTED_MODULE_4__.drawTextRunPart,
    splitWords: _linebreak__WEBPACK_IMPORTED_MODULE_3__.splitWords,
    updateWordsMetric: _util__WEBPACK_IMPORTED_MODULE_6__.updateWordsMetric,
    linebreak: _util__WEBPACK_IMPORTED_MODULE_6__.linebreak,
    aggregateWordMetric: _util__WEBPACK_IMPORTED_MODULE_6__.aggregateWordMetric,
    updateRunPartsFromWords: _util__WEBPACK_IMPORTED_MODULE_6__.updateRunPartsFromWords,
    getPreCutLine: _util__WEBPACK_IMPORTED_MODULE_6__.getPreCutLine,
    getPostCutLine: _util__WEBPACK_IMPORTED_MODULE_6__.getPostCutLine,
    mergeLine: _util__WEBPACK_IMPORTED_MODULE_6__.mergeLine,
    getStyleAtPosition: _util__WEBPACK_IMPORTED_MODULE_6__.getStyleAtPosition,
    positionLessOrEqual: _util__WEBPACK_IMPORTED_MODULE_6__.positionLessOrEqual,
    selectionIsEmpty: _util__WEBPACK_IMPORTED_MODULE_6__.selectionIsEmpty,
    // enums
    TEXT_VARIATION: _types__WEBPACK_IMPORTED_MODULE_5__.TEXT_VARIATION,
    TEXT_DECORATION: _types__WEBPACK_IMPORTED_MODULE_5__.TEXT_DECORATION,
    TEXT_ALIGNMENT: _types__WEBPACK_IMPORTED_MODULE_5__.TEXT_ALIGNMENT,
    TEXT_SCRIPT: _types__WEBPACK_IMPORTED_MODULE_5__.TEXT_SCRIPT,
    LINE_SPACING: _types__WEBPACK_IMPORTED_MODULE_5__.LINE_SPACING,
    FontManager: _fontManger__WEBPACK_IMPORTED_MODULE_1__.FontManager,
    Layout: _layout__WEBPACK_IMPORTED_MODULE_2__.Layout,
    Editor: _editor__WEBPACK_IMPORTED_MODULE_0__.Editor,
};
if (typeof window !== 'undefined' && window.document) {
    if (window.hasOwnProperty("btex")) {
        throw new Error('Something else is called btex!');
    }
}
window.btex = btex;
// greet('我这里还有，你要不要呢?\n这么的！');
// console.log(`segmentWords:`);
// const str = 'this is a Text\n\nbook in here!';
// const str = '\nabc TEXt de\n12 345';
// const str1 = 'A-b-c-d-g-g-h-j-k-k-lA-b-c-d-g-g-h-j-k-k-lA-b-c-d-g-g-h-j-k-k-l';
// console.log(segmentWords(str1));
// console.log(segmentWordRanges(str));
// console.log(`breakPlainTextIntoLines:`);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDckcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUN6TSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUUvRCxrQ0FBa0M7QUFDbEMsU0FBUyxLQUFLLENBQUMsR0FBVztJQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixJQUFJLEVBQUUsQ0FBQztJQUVQLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRTtRQUMvQixxREFBcUQ7UUFDckQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEIsd0VBQXdFO1FBQ3hFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckI7UUFFRCxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUNwQjtBQUNILENBQUM7QUFFRCxJQUFJLElBQUksR0FBRztJQUNULEtBQUssRUFBRSxLQUFLO0lBQ1osZUFBZTtJQUNmLFVBQVU7SUFDVixpQkFBaUI7SUFDakIsU0FBUztJQUNULG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsYUFBYTtJQUNiLGNBQWM7SUFDZCxTQUFTO0lBQ1Qsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFFaEIsUUFBUTtJQUNSLGNBQWM7SUFDZCxlQUFlO0lBQ2YsY0FBYztJQUNkLFdBQVc7SUFDWCxZQUFZO0lBQ1osV0FBVztJQUNYLE1BQU07SUFDTixNQUFNO0NBQ0EsQ0FBQztBQUVULElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDcEQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztLQUNuRDtDQUNGO0FBRUEsTUFBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFFNUIsK0JBQStCO0FBQy9CLGdDQUFnQztBQUNoQyxpREFBaUQ7QUFDakQsdUNBQXVDO0FBQ3ZDLGtGQUFrRjtBQUNsRixtQ0FBbUM7QUFDbkMsdUNBQXVDO0FBQ3ZDLDJDQUEyQyJ9
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2S0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQixjQUFjLGlCQUFpQjtBQUMvQixjQUFjLGlCQUFpQjtBQUMvQixjQUFjLGlCQUFpQjtBQUMvQixjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxTQUFTLG1EQUFPO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsK2xFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvLi9ub2RlX21vZHVsZXMvbGluZWJyZWFrLW5leHQvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC8uL25vZGVfbW9kdWxlcy9saW5lYnJlYWstbmV4dC9zcmMvY2xhc3Nlcy5qcyIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC8uL25vZGVfbW9kdWxlcy9saW5lYnJlYWstbmV4dC9zcmMvbGluZWJyZWFrZXItYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC8uL25vZGVfbW9kdWxlcy9saW5lYnJlYWstbmV4dC9zcmMvcGFpcnMuanMiLCJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvLi9ub2RlX21vZHVsZXMvdGlueS1pbmZsYXRlL2luZGV4LmpzIiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vcHVibGljL3NyYy9lZGl0aW5nLnRzIiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vcHVibGljL3NyYy9lZGl0b3IudHMiLCJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvLi9wdWJsaWMvc3JjL2ZvbnRNYW5nZXIudHMiLCJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvLi9wdWJsaWMvc3JjL2xheW91dC50cyIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC8uL3B1YmxpYy9zcmMvbGluZWJyZWFrLnRzIiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vcHVibGljL3NyYy9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvLi9wdWJsaWMvc3JjL3R5cGVzLnRzIiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vcHVibGljL3NyYy91dGlsLnRzIiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vbm9kZV9tb2R1bGVzL3VuaWNvZGUtdHJpZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmV0dGVyLXRleHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iZXR0ZXItdGV4dC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JldHRlci10ZXh0Ly4vcHVibGljL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgdmFyIGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8vIFRoZSBmb2xsb3dpbmcgYnJlYWsgY2xhc3NlcyBhcmUgaGFuZGxlZCBieSB0aGUgcGFpciB0YWJsZVxyXG5cclxuZXhwb3J0cy5PUCA9IDA7ICAgLy8gT3BlbmluZyBwdW5jdHVhdGlvblxyXG5leHBvcnRzLkNMID0gMTsgICAvLyBDbG9zaW5nIHB1bmN0dWF0aW9uXHJcbmV4cG9ydHMuQ1AgPSAyOyAgIC8vIENsb3NpbmcgcGFyZW50aGVzaXNcclxuZXhwb3J0cy5RVSA9IDM7ICAgLy8gQW1iaWd1b3VzIHF1b3RhdGlvblxyXG5leHBvcnRzLkdMID0gNDsgICAvLyBHbHVlXHJcbmV4cG9ydHMuTlMgPSA1OyAgIC8vIE5vbi1zdGFydGVyc1xyXG5leHBvcnRzLkVYID0gNjsgICAvLyBFeGNsYW1hdGlvbi9JbnRlcnJvZ2F0aW9uXHJcbmV4cG9ydHMuU1kgPSA3OyAgIC8vIFN5bWJvbHMgYWxsb3dpbmcgYnJlYWsgYWZ0ZXJcclxuZXhwb3J0cy5JUyA9IDg7ICAgLy8gSW5maXggc2VwYXJhdG9yXHJcbmV4cG9ydHMuUFIgPSA5OyAgIC8vIFByZWZpeFxyXG5leHBvcnRzLlBPID0gMTA7ICAvLyBQb3N0Zml4XHJcbmV4cG9ydHMuTlUgPSAxMTsgIC8vIE51bWVyaWNcclxuZXhwb3J0cy5BTCA9IDEyOyAgLy8gQWxwaGFiZXRpY1xyXG5leHBvcnRzLkhMID0gMTM7ICAvLyBIZWJyZXcgTGV0dGVyXHJcbmV4cG9ydHMuSUQgPSAxNDsgIC8vIElkZW9ncmFwaGljXHJcbmV4cG9ydHMuSU4gPSAxNTsgIC8vIEluc2VwYXJhYmxlIGNoYXJhY3RlcnNcclxuZXhwb3J0cy5IWSA9IDE2OyAgLy8gSHlwaGVuXHJcbmV4cG9ydHMuQkEgPSAxNzsgIC8vIEJyZWFrIGFmdGVyXHJcbmV4cG9ydHMuQkIgPSAxODsgIC8vIEJyZWFrIGJlZm9yZVxyXG5leHBvcnRzLkIyID0gMTk7ICAvLyBCcmVhayBvbiBlaXRoZXIgc2lkZSAoYnV0IG5vdCBwYWlyKVxyXG5leHBvcnRzLlpXID0gMjA7ICAvLyBaZXJvLXdpZHRoIHNwYWNlXHJcbmV4cG9ydHMuQ00gPSAyMTsgIC8vIENvbWJpbmluZyBtYXJrc1xyXG5leHBvcnRzLldKID0gMjI7ICAvLyBXb3JkIGpvaW5lclxyXG5leHBvcnRzLkgyID0gMjM7ICAvLyBIYW5ndWwgTFZcclxuZXhwb3J0cy5IMyA9IDI0OyAgLy8gSGFuZ3VsIExWVFxyXG5leHBvcnRzLkpMID0gMjU7ICAvLyBIYW5ndWwgTCBKYW1vXHJcbmV4cG9ydHMuSlYgPSAyNjsgIC8vIEhhbmd1bCBWIEphbW9cclxuZXhwb3J0cy5KVCA9IDI3OyAgLy8gSGFuZ3VsIFQgSmFtb1xyXG5leHBvcnRzLlJJID0gMjg7ICAvLyBSZWdpb25hbCBJbmRpY2F0b3JcclxuXHJcbi8vIFRoZSBmb2xsb3dpbmcgYnJlYWsgY2xhc3NlcyBhcmUgbm90IGhhbmRsZWQgYnkgdGhlIHBhaXIgdGFibGVcclxuZXhwb3J0cy5BSSA9IDI5OyAgLy8gQW1iaWd1b3VzIChBbHBoYWJldGljIG9yIElkZW9ncmFwaClcclxuZXhwb3J0cy5CSyA9IDMwOyAgLy8gQnJlYWsgKG1hbmRhdG9yeSlcclxuZXhwb3J0cy5DQiA9IDMxOyAgLy8gQ29udGluZ2VudCBicmVha1xyXG5leHBvcnRzLkNKID0gMzI7ICAvLyBDb25kaXRpb25hbCBKYXBhbmVzZSBTdGFydGVyXHJcbmV4cG9ydHMuQ1IgPSAzMzsgIC8vIENhcnJpYWdlIHJldHVyblxyXG5leHBvcnRzLkxGID0gMzQ7ICAvLyBMaW5lIGZlZWRcclxuZXhwb3J0cy5OTCA9IDM1OyAgLy8gTmV4dCBsaW5lXHJcbmV4cG9ydHMuU0EgPSAzNjsgIC8vIFNvdXRoLUVhc3QgQXNpYW5cclxuZXhwb3J0cy5TRyA9IDM3OyAgLy8gU3Vycm9nYXRlc1xyXG5leHBvcnRzLlNQID0gMzg7ICAvLyBTcGFjZVxyXG5leHBvcnRzLlhYID0gMzk7ICAvLyBVbmtub3duXHJcbiIsImNvbnN0IGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpO1xuY29uc3QgVW5pY29kZVRyaWUgPSByZXF1aXJlKCd1bmljb2RlLXRyaWUnKTtcclxuXHJcbmNvbnN0IHsgQkssIENSLCBMRiwgTkwsIFNHLCBXSiwgQ0IsIFNQLCBCQSwgTlMsIEFJLCBBTCwgQ0osIElELCBTQSwgWFggfSA9IHJlcXVpcmUoJy4vY2xhc3NlcycpO1xyXG5jb25zdCB7IERJX0JSSywgSU5fQlJLLCBDSV9CUkssIENQX0JSSywgUFJfQlJLLCBwYWlyVGFibGUgfSA9IHJlcXVpcmUoJy4vcGFpcnMnKTtcclxuXHJcbmNvbnN0IGRhdGEgPSBiYXNlNjQudG9CeXRlQXJyYXkoXCJBQTRJQUFBQUFBQUFBaHFnNVZWN05KdFp2ejdmVEM4elU1ZGVwbFVsTXJRb1dxbXFhaEQ1U28wYWlwWVdyVWhWRlNWQlExMGlTVHRVdFc2bktEVkY2azdkNzVlUWZFVWJGY1E5S2lGUzkwdFFFb2xjUDIzbnJMUG1PK2Vzci8rZjM5cnIvYTI5M3QvZTcvUDhubWZ2bHowTzZSdnJCSkFEdGJCTmFEODhJT0tUT21PckNxaHU5ekU3NzB2YzFwQlYveEw1ZHhqMlY3Wmo0RkdTb21GS1N0Q1dObFY3aEcxVmFiWmZaMUxhSGJGclJ3enpManpQb2kxVUhEbmxWL2xXYmhnSUlKdkxCcC9wdTdBSEVkUm5JWStST2RYeGc0Zk5wTWRUeFZubm0wOE9qb3plakFWc0Jxd3F6OGtkZEdSbFJ4c2Q4YzU1ZE5ab1B1ZXg2YTdEdDZMME5OYjAzc3FnVGxSMi9PVDdlVHQwWTBXbnBVWHhMc3A1U01BTmM0RHNtWDR6SlVCUXZ6bndleG05dHNNSCtDOXVSWU1QT2Q5NlpIQjI5TlpqQ0lNMm5mTzd0c21RdmVYM2wycjdmdDBONC9TUko3a082WThaQ2FldVVRNGdNVFo2N2NwN1RneHZsTkRzUGdPQmRaaTJZVGFtNVE3bTMrMDBsK1hHN1ByRGU2WW9QbUhnSyt5TGloN2ZBUjE2WkZDZUQ5V3ZPVnQrZ2ZOVy9LVDUvTTZyYi85S0VSdCtOMWxhZDVSbmVWanp4WEhzTG9mdVUrVHZyRXNyMysyNnNWejVXSmg2TC9zdm9QSzNxZXBGSDlieXNEbGpXdEQxRjdLcnh6VzFpOXIrZS9OTHhWL2FjdHM3enVvMzA0SjkrdDNQZDZZNnU4ZjNFQXF4TlJndjVEWmphSTN1bnl2a3ZIUHlhL3YzbVdWWU9DMzhxQnExMSt5SFoyYkF5UDFIYmtWOTJ2ZG5vN3IybHh6OVV3Q2RDSlZmZDE0TkxjcE8yQ2FkSFMvWFBKOWRvWGd6NXZMdi8xT0JWUzNnWDBEOW42TGlOSURmcGlsTzlSc0xnWjJXL3dJeThXL1JoOTNqZm96NHFtUlYyeEVsdjZwMmxSWFFkTzYvQ3Y4ZjVuR24zdTB3TFhqaG52Q2xhYkwxbys3eXZJcHZMZlQveHNLRzMweS9zVHZxMzBpYTlDenhwOWRyOXYvZTdZbi9PMFFKWHh4Qk9KbWNlUC9EQkZhMXExdjZvdWRuL2U2cWMvMzdkVW9Odm5ZTDRwbFE5T29uZVlPaC9yOGZPRm03eWw3RkVUSFk5ZFhkNUsybi9xRWM1M2RPRWUxVFRKY3ZDZnAxZHBUQzMzNGwwdnlhRkw2bXR0TkViRmp6TytaVjJtTGswcWMzQnJ4SjRkOWd3ZU1talJvcnhiN3ZpYzByU3E2RDR3ekF5RldhczFUcVBFMHNMSThYTEFyeUM4dFBDaGFOM0FMRVpTV210QjM0U3laY3hYWW4vRTRUZzBMZU1JUGhnUEtEOXp5SEdNeHhoeG5ERGloN2VJODZ4RUNUTTh6b2RVQ2RnZmZVbVJoNHJROHp5QTZvdy9BZWkrMDFhOE9NZnppUVErR0FFa2h3Ti9jcVVGWUFWekE5ZXg0bjZqZ3RzaU12WGY1QnRYeEVVNGhTcGh2eDN2OCs5YXU4ZUVla0VFcGtya25lL3pCMU0rSEFQdVhJejNwYXhLbGZlOGFETWZHV0FYNk1kNlB1dUFkS0hGVkgrK0VkNUxFamk5NFo1emVpSkl4Ym1XZU43cnIxL1pjYUJsNS9uaW1kSHNIZ0lIL3NzeUxVWFo0ZkRRNDZIbkJiK2hRcUc4eU5pS1JyWEwvYjFJUFlEVXN1M2RGS3RSTWNqcWxSdk9OZDR4QnZPdWZ4MmNVSHVrOHBtRzFEN1B5T1FtVW1sdWlzVkZTOU9XUzhmUEllOExpQ3Rqd0pLbkVDOWhyUzl1S21JU0kzV2E1K3ZkWFVHOWR0eWZyN2cvb0p2MndiemVaVTgzOEc2bUV2bnRVYjNTVlYvZkJaNkgvc0wrbEVsemVSckh5MlhiZTdVV1gxcTVzZ09RODFydisyYmFlajRmUDRtNU1mL0drb3hmRHRUMysrS1A3ZG85Sm4yNmFhNnhBaENmNUw5UlpWZmtXS0NjakkxZVlibTJwbHZURXFrRHhLQzQwMmJHelhDWWFHbnVBTEhhYkJUMWRGTHVPU0I3Um9yT1BFaFphaDFOalpJZ1IvVUZHZkszcDFFbFluZXZPTUJETFVSZHBJanJJK3FaazRzZmZHYlJGaVh1RW1kRmppQU9EbFFDSnZJYUIxclc2MUxqZzN5NGVTNExBY1NnRHh4WlFzMERZYTE1d0EwMzJaK2xHVWZwb3lPckZvM21nMXNSUXROL2ZISEN4M1RyTThlVHJsZE1iWWlzRExYYlVEb1hNTGVqU3EwZlVOdU8xbXVYMGdFYTh2Z3llZ2txaXFxYkMzVzBTNGNDOUttdDhNdVMvaEZPN1hlaTNmOHJTdklqZXZlTU03a3hqVWl4T3JsNmdKc2hlNEpVN1BoT0hwZnJSWXZ1N3lvQVpLYTNCdXlrMkorSzVXK25OVHoxbmhKRGhSVWZESkxpVVh4anhYQ0plZWFPZS9yN0hsQlAvdVVSYy81ZWZhWkVQeHI1NVFqMzlyZlRMa3VnVUd5TXJ3bzdIQWdsZkVqRHJpZWhGMWpYdHdKa1BvaVlrWVE1YW9YU0E3cWJDQkdLcTVod3R1MlZrcEk5eFZEb3AvMXhyQzUyZWlJdkNvUFd4NGxMbDQwam05dXB2eWNWUGZwYUg5L28yRDR4S1hwZU5qRTJIUFFSUyszUkZhWVRjNFR4dzdEdnE1WDZKQlJ3enM5bXZvQjQ5Qks2YitYZ3NaVkpZaUluVGxTWForNjJGVDE4bWtGVmNQS0NKc29GNWFoYjE5V2hlWkxVWXNTd2RyclZNM2FRMlhFNlN6VTJ4SERTNmlXa29kazVBRjZGOFdVTm1tdXNoaThhVnBNUHdpSWZFaVFXbzNDQXBPTkRSanJoRGlWbmthRnNhUDVyaklKa21zTjZWMjZsaTVMTk0zSnhHU3lLZ29ta25UeXlyaGNud3Y5UWNxYXE1dXRBaDQ0VzMwU1dvOFEwWEhLUjBnbFBGNGZXc3QxRlVDbmsyd29GcTNpeTlmQWJ6Y2pKOGZ2U2pnS1ZPZm4xNFJEcXlRdUlnYUdKWnVzd1R5d2RDRlNhODlTYWtNZjZmZSs5S2FRTVlRbEt4aUpCY3p1UFNobzR3bUJqZEErYWc2UVVPcjJHZHBjYlNsNTFBeTZraGhCdDVVWGRybnhjN1pHTXhDdno5NkE0b0xvY3hoMitweCsxemt5TGFjQ0dyeG5QelRSU2dyTEtwU3RGcEg1cHBLV203UGdNS1p0d2d5dEtMT2piR0NPUUxUbStLT293cWExc2R1dDlyYWoxQ1pGa1pEMGpiYUtOTHBKVWFyU0g1UWtueDFZaU94ZEE1TDZkNXNmSS91bm1rU0Y2NUljL0F2dFh0OThQbnJkd2w1dmdwcFEzZFl6V0Z3a25ac3k2eGgybGxtTHhwZWdGOGF5THduaWtubFhSSGlGNGh6enJnQjhqUTR3ZElxY2FIQ0VBeHlKd0NlR2tYUEJaWVNyckdhNHZNd1p2Tk45YUswRjRKQk9LOW1ROGc4RWpFYklRVnd2ZlMyRDhHdUNZc2Rxd3FTV2JRcmZXZFRSVUpNcW1wbldQYXg0WjdFMTM3STZickhidmpwUGxmTlpwRjFkN1BQN0hCL01QSGNIVktUTWhMTzRmM0NaY2FjY1pFT2lTMkRwS2lRQjVLWERKK09zcGN6NHFUUkNSeGdyS0VRSWdVa0tMVEtLd3NrZHgyRFdvM2JnM1BFb0I1aDJuQTI0b2x3ZktTUitRUjZUQXZFRGkvMGN6aFVUNTlSWm1PMU1HZUtHZUVmdU9TUFdmTCtYS21ocXBabU9WUjltSlZORFBLT1M0OUxxK1VtMTBZc0J5YnpETXRlbWxQQ09KRXRFOHphWGhzYXFFczlibmdTSkdobE9UVE1sQ1hseTlRdjVjUk4zUFZMSzd6b01wdHV0ZjdpaHV0clEvWGo3VnFlQ2RVd2xlVFRLa2xPSThXZXA5aDdmQ1kwa1Z0RHRJV0tudWJXQXZiTlp0c1JScU9ZbDgwMnZlYlBFa1pSU1pjNndYT2ZQdHBQdE41SEk2M0VVRmZzeTdVL1RMcjhOa0l6YVkzdng0QTI4eDc2NVhaTXpSWlRwTWs4MVlJTXV3SjUrL3pvQ3VaajF3R25hSE9ieGE1cnBLWmo0V2hUNjcwbWFSdzA0dzBlM2NaVzc0WjBhWmUybjA1aGpaYXhtNnVyZW56OEVmNU82WXUxSjJhcVlBbHFzQ1hzNVpCNW8xSko1bDN4a1RWcjhySlEwOU5Mc0JxUlJEVDJJSWpPUG1jSmE2eFExUjV5R1A5akFzajIzeFlEVGV6ZHlxRzhZV1o3dkpCSVdLNTZLK2lEZ2NIaW1pUU9USWFzTlN1YTFmT0J4c0tNTUVLZDE1anhUbCszQ3l2R0NSK1V5Und1U0kyWHV3UklQb05OY2xQaWhmSmhhcTJtS2tOaWp3WUxZNmZlcW9oa3R1a21JM0tEdk9wTjdJdENxSEhoTnVLbHhNZkJBRU81TGpXMlJLaDZsRTVIZDFkdEFPb3BhYy9aNEZkc05zak1oWHovdWc4SkdtYlZKVEErVk9CSlhkcll5SmNJbjUrT0Vlb0s4a1dFV0Yrd2RHOFp0WkhLU3F1V0R0RFZ5aEZQa1JWcWd1S0ZrTGtLQ3o0NmhjVTFTVVk5b0oyU2srZG1xMGtnbHFrNGtxS1QxQ1Y5SkRFTFBqSzFXc1dHa0VYRjg3ZzlQOThlNWZmMG1JdXBtL3c2dmMza0NlcTA0WDViZ0pRbGNNRlJqbEZXbVNrK2tzc1hDQVZpa2ZlQWxNdXpwVXZDU2RYaUcrZGM2S3JJaUx4eGhiRVZ1S2Y3dlc3S21EUUk5NWJaZTNIOW1OMy83N0Y2ZloyWXgvRjl5Q2xsbGo4Z1hwTFdMcGQ1K3Y5MGlPYUZhOXNkN1B2eDBsTmExbzErYmtpWjY5d0NpQzJ4OVVJYjYvYm9CQ3VOTUIvSFlSMFJDNitGRDlPZTVxcmdRbDZKYlh0a2FZbjB3a2ROaFJPTHF5aHY2Y0t2eU1qMUZ2czJvM09PS29NWVR1YkdFTkxmWTVGNkg5ZDh3WDFjbklOc3Z6K3daRlF1M3poV1Zsd0p2d0JFcDY5RHF1L1pua0JmM25JZmJ4NFRLN3pPVkpINXNHSlgrSU13a24xdlZCbjM4R2JwVGc5YkpuTWNUT2I1RjZDaTVnT245RmN5NlF6Y3UrRkw2bVlKSitmMlpaSkdkYTFWcXJ1WjBKUlhJdHA4WDBhVGpJY0pnemRhWGxoYTdxN2tWNGVick1zdW5mc1J5UmE5cVl1cnlCSEEwaGMxS1ZzS2RFK29JMGxqTG1TQXlNemU4bFdtYzUvbFExOHNseVRWQy92QURUYytTTk01KytnenRUQkx6NG0wYVZVS2NmZ09FRXh1S1ZvbUo3WFFEWnV6aU1Eakc2SlA5dGdSN0pYWlRlbzlSR2V0Vy9YbTkvVGdQSnBUZ0hBQ1BPR3ZteTJtRG05ZmwwOVdlTW05c1FVQVhQM1N1MnVBcGVDd0pWVDVpV0NYRGdtY3VUc0ZnVTlObTYvUHVzSnpTYkRRSU1mbDZJTlkvT0FFdlpSTjU0QlNTWFVDbE01MWltNlduOVZoVmFtS0ptek9hRkpFcmdKY3MwZXRGWjQwTElGM0VQa2pGVGpHbUFoc2QxNzRObk93Slc4VGRKMURqYStFNldhNkZWUzIySGFqMUREQTQ3NEVlc29NUDVuYnNwQVBKTFdKOHJZY1AxRHdDc2xobm4rZ1RGbStzUzl3WStVNlNvZ0FhOXRpd3BveHVhRmVxbTJPSyt1b3pSNlNmaUxDT1B6MzZMaURselhyNlVXZDdCcFk2bWxyTkFOa1RPZW1lNUVnbm5Ba1FSVEdvOVQ2aVl4YlVLZkdKY0k5Qit1YjJQY3lVT2dwd1hiT2YzYkhGV3R5Z0Q3RlliUmhiK3Zremk4N2RCMEplWGwvdkJwQlV6OTNWdHFaaTdBTDdDMVZvd1RGK3RHbXl1cnc3REJja3RjK1VNWTBFMTBKdzRVUm9qZjhOZGFOcE42RTFxNCtPeis0WWVQdE1MeThGUFJQXCIpO1xyXG5cclxuY29uc3QgY2xhc3NUcmllID0gbmV3IFVuaWNvZGVUcmllKGRhdGEpO1xyXG5cclxuY29uc3QgbWFwQ2xhc3MgPSBmdW5jdGlvbiAoYykge1xyXG4gIHN3aXRjaCAoYykge1xyXG4gICAgY2FzZSBBSTpcclxuICAgICAgcmV0dXJuIEFMO1xyXG5cclxuICAgIGNhc2UgU0E6XHJcbiAgICBjYXNlIFNHOlxyXG4gICAgY2FzZSBYWDpcclxuICAgICAgcmV0dXJuIEFMO1xyXG5cclxuICAgIGNhc2UgQ0o6XHJcbiAgICAgIHJldHVybiBOUztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gYztcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBtYXBGaXJzdCA9IGZ1bmN0aW9uIChjKSB7XHJcbiAgc3dpdGNoIChjKSB7XHJcbiAgICBjYXNlIExGOlxyXG4gICAgY2FzZSBOTDpcclxuICAgICAgcmV0dXJuIEJLO1xyXG5cclxuICAgIGNhc2UgQ0I6XHJcbiAgICAgIHJldHVybiBCQTtcclxuXHJcbiAgICBjYXNlIFNQOlxyXG4gICAgICByZXR1cm4gV0o7XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGM7XHJcbiAgfVxyXG59O1xyXG5cclxuY2xhc3MgQnJlYWsge1xyXG4gIGNvbnN0cnVjdG9yKHBvc2l0aW9uLCByZXF1aXJlZCA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLnJlcXVpcmVkID0gcmVxdWlyZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBMaW5lQnJlYWtlciB7XHJcbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XHJcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgIHRoaXMucG9zID0gMDtcclxuICAgIHRoaXMubGFzdFBvcyA9IDA7XHJcbiAgICB0aGlzLmN1ckNsYXNzID0gbnVsbDtcclxuICAgIHRoaXMubmV4dENsYXNzID0gbnVsbDtcclxuICB9XHJcblxyXG4gIG5leHRDb2RlUG9pbnQoKSB7XHJcbiAgICBjb25zdCBjb2RlID0gdGhpcy5zdHJpbmcuY2hhckNvZGVBdCh0aGlzLnBvcysrKTtcclxuICAgIGNvbnN0IG5leHQgPSB0aGlzLnN0cmluZy5jaGFyQ29kZUF0KHRoaXMucG9zKTtcclxuXHJcbiAgICAvLyBJZiBhIHN1cnJvZ2F0ZSBwYWlyXHJcbiAgICBpZiAoKDB4ZDgwMCA8PSBjb2RlICYmIGNvZGUgPD0gMHhkYmZmKSAmJiAoMHhkYzAwIDw9IG5leHQgJiYgbmV4dCA8PSAweGRmZmYpKSB7XHJcbiAgICAgIHRoaXMucG9zKys7XHJcbiAgICAgIHJldHVybiAoKGNvZGUgLSAweGQ4MDApICogMHg0MDApICsgKG5leHQgLSAweGRjMDApICsgMHgxMDAwMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY29kZTtcclxuICB9XHJcblxyXG4gIG5leHRDaGFyQ2xhc3MoKSB7XHJcbiAgICByZXR1cm4gbWFwQ2xhc3MoY2xhc3NUcmllLmdldCh0aGlzLm5leHRDb2RlUG9pbnQoKSkpO1xyXG4gIH1cclxuXHJcbiAgbmV4dEJyZWFrKCkge1xyXG4gICAgLy8gZ2V0IHRoZSBmaXJzdCBjaGFyIGlmIHdlJ3JlIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZ1xyXG4gICAgaWYgKHRoaXMuY3VyQ2xhc3MgPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmN1ckNsYXNzID0gbWFwRmlyc3QodGhpcy5uZXh0Q2hhckNsYXNzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMuc3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxhc3RQb3MgPSB0aGlzLnBvcztcclxuICAgICAgY29uc3QgbGFzdENsYXNzID0gdGhpcy5uZXh0Q2xhc3M7XHJcbiAgICAgIHRoaXMubmV4dENsYXNzID0gdGhpcy5uZXh0Q2hhckNsYXNzKCk7XHJcblxyXG4gICAgICAvLyBleHBsaWNpdCBuZXdsaW5lXHJcbiAgICAgIGlmICgodGhpcy5jdXJDbGFzcyA9PT0gQkspIHx8ICgodGhpcy5jdXJDbGFzcyA9PT0gQ1IpICYmICh0aGlzLm5leHRDbGFzcyAhPT0gTEYpKSkge1xyXG4gICAgICAgIHRoaXMuY3VyQ2xhc3MgPSBtYXBGaXJzdChtYXBDbGFzcyh0aGlzLm5leHRDbGFzcykpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQnJlYWsodGhpcy5sYXN0UG9zLCB0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaGFuZGxlIGNsYXNzZXMgbm90IGhhbmRsZWQgYnkgdGhlIHBhaXIgdGFibGVcclxuICAgICAgbGV0IGN1cjtcclxuICAgICAgc3dpdGNoICh0aGlzLm5leHRDbGFzcykge1xyXG4gICAgICAgIGNhc2UgU1A6XHJcbiAgICAgICAgICBjdXIgPSB0aGlzLmN1ckNsYXNzO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgQks6XHJcbiAgICAgICAgY2FzZSBMRjpcclxuICAgICAgICBjYXNlIE5MOlxyXG4gICAgICAgICAgY3VyID0gQks7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBDUjpcclxuICAgICAgICAgIGN1ciA9IENSO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgQ0I6XHJcbiAgICAgICAgICBjdXIgPSBCQTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VyICE9IG51bGwpIHtcclxuICAgICAgICB0aGlzLmN1ckNsYXNzID0gY3VyO1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRDbGFzcyA9PT0gQ0IpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgQnJlYWsodGhpcy5sYXN0UG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIG5vdCBoYW5kbGVkIGFscmVhZHksIHVzZSB0aGUgcGFpciB0YWJsZVxyXG4gICAgICBsZXQgc2hvdWxkQnJlYWsgPSBmYWxzZTtcclxuICAgICAgc3dpdGNoIChwYWlyVGFibGVbdGhpcy5jdXJDbGFzc11bdGhpcy5uZXh0Q2xhc3NdKSB7XHJcbiAgICAgICAgY2FzZSBESV9CUks6IC8vIERpcmVjdCBicmVha1xyXG4gICAgICAgICAgc2hvdWxkQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgSU5fQlJLOiAvLyBwb3NzaWJsZSBpbmRpcmVjdCBicmVha1xyXG4gICAgICAgICAgc2hvdWxkQnJlYWsgPSBsYXN0Q2xhc3MgPT09IFNQO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgQ0lfQlJLOlxyXG4gICAgICAgICAgc2hvdWxkQnJlYWsgPSBsYXN0Q2xhc3MgPT09IFNQO1xyXG4gICAgICAgICAgaWYgKCFzaG91bGRCcmVhaykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIENQX0JSSzogLy8gcHJvaGliaXRlZCBmb3IgY29tYmluaW5nIG1hcmtzXHJcbiAgICAgICAgICBpZiAobGFzdENsYXNzICE9PSBTUCkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmN1ckNsYXNzID0gdGhpcy5uZXh0Q2xhc3M7XHJcbiAgICAgIGlmIChzaG91bGRCcmVhaykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQnJlYWsodGhpcy5sYXN0UG9zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBvcyA+PSB0aGlzLnN0cmluZy5sZW5ndGgpIHtcclxuICAgICAgaWYgKHRoaXMubGFzdFBvcyA8IHRoaXMuc3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMubGFzdFBvcyA9IHRoaXMuc3RyaW5nLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gbmV3IEJyZWFrKHRoaXMuc3RyaW5nLmxlbmd0aCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGluZUJyZWFrZXI7XHJcbiIsImxldCBDSV9CUkssIENQX0JSSywgRElfQlJLLCBJTl9CUkssIFBSX0JSSztcclxuZXhwb3J0cy5ESV9CUksgPSAoRElfQlJLID0gMCk7IC8vIERpcmVjdCBicmVhayBvcHBvcnR1bml0eVxyXG5leHBvcnRzLklOX0JSSyA9IChJTl9CUksgPSAxKTsgLy8gSW5kaXJlY3QgYnJlYWsgb3Bwb3J0dW5pdHlcclxuZXhwb3J0cy5DSV9CUksgPSAoQ0lfQlJLID0gMik7IC8vIEluZGlyZWN0IGJyZWFrIG9wcG9ydHVuaXR5IGZvciBjb21iaW5pbmcgbWFya3NcclxuZXhwb3J0cy5DUF9CUksgPSAoQ1BfQlJLID0gMyk7IC8vIFByb2hpYml0ZWQgYnJlYWsgZm9yIGNvbWJpbmluZyBtYXJrc1xyXG5leHBvcnRzLlBSX0JSSyA9IChQUl9CUksgPSA0KTsgLy8gUHJvaGliaXRlZCBicmVha1xyXG5cclxuLy8gdGFibGUgZ2VuZXJhdGVkIGZyb20gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMTQvI1RhYmxlMlxyXG5leHBvcnRzLnBhaXJUYWJsZSA9IFtcclxuICBbUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgQ1BfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUktdLFxyXG4gIFtJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbRElfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUktdLFxyXG4gIFtJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0lOX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUktdLFxyXG4gIFtJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbRElfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIERJX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgRElfQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIFBSX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLXSxcclxuICBbSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUktdLFxyXG4gIFtJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLXSxcclxuICBbRElfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSS10sXHJcbiAgW0RJX0JSSywgUFJfQlJLLCBQUl9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIFBSX0JSSywgUFJfQlJLLCBQUl9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBQUl9CUkssIENJX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLXSxcclxuICBbRElfQlJLLCBQUl9CUkssIFBSX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgUFJfQlJLLCBQUl9CUkssIFBSX0JSSywgRElfQlJLLCBJTl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBJTl9CUkssIElOX0JSSywgRElfQlJLLCBESV9CUkssIFBSX0JSSywgQ0lfQlJLLCBQUl9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgSU5fQlJLLCBESV9CUktdLFxyXG4gIFtESV9CUkssIFBSX0JSSywgUFJfQlJLLCBJTl9CUkssIElOX0JSSywgSU5fQlJLLCBQUl9CUkssIFBSX0JSSywgUFJfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSSywgSU5fQlJLLCBESV9CUkssIERJX0JSSywgUFJfQlJLLCBDSV9CUkssIFBSX0JSSywgRElfQlJLLCBESV9CUkssIERJX0JSSywgRElfQlJLLCBESV9CUkssIElOX0JSS11cclxuXTsiLCJ2YXIgVElORl9PSyA9IDA7XG52YXIgVElORl9EQVRBX0VSUk9SID0gLTM7XG5cbmZ1bmN0aW9uIFRyZWUoKSB7XG4gIHRoaXMudGFibGUgPSBuZXcgVWludDE2QXJyYXkoMTYpOyAgIC8qIHRhYmxlIG9mIGNvZGUgbGVuZ3RoIGNvdW50cyAqL1xuICB0aGlzLnRyYW5zID0gbmV3IFVpbnQxNkFycmF5KDI4OCk7ICAvKiBjb2RlIC0+IHN5bWJvbCB0cmFuc2xhdGlvbiB0YWJsZSAqL1xufVxuXG5mdW5jdGlvbiBEYXRhKHNvdXJjZSwgZGVzdCkge1xuICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgdGhpcy5zb3VyY2VJbmRleCA9IDA7XG4gIHRoaXMudGFnID0gMDtcbiAgdGhpcy5iaXRjb3VudCA9IDA7XG4gIFxuICB0aGlzLmRlc3QgPSBkZXN0O1xuICB0aGlzLmRlc3RMZW4gPSAwO1xuICBcbiAgdGhpcy5sdHJlZSA9IG5ldyBUcmVlKCk7ICAvKiBkeW5hbWljIGxlbmd0aC9zeW1ib2wgdHJlZSAqL1xuICB0aGlzLmR0cmVlID0gbmV3IFRyZWUoKTsgIC8qIGR5bmFtaWMgZGlzdGFuY2UgdHJlZSAqL1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKlxuICogLS0gdW5pbml0aWFsaXplZCBnbG9iYWwgZGF0YSAoc3RhdGljIHN0cnVjdHVyZXMpIC0tICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgc2x0cmVlID0gbmV3IFRyZWUoKTtcbnZhciBzZHRyZWUgPSBuZXcgVHJlZSgpO1xuXG4vKiBleHRyYSBiaXRzIGFuZCBiYXNlIHRhYmxlcyBmb3IgbGVuZ3RoIGNvZGVzICovXG52YXIgbGVuZ3RoX2JpdHMgPSBuZXcgVWludDhBcnJheSgzMCk7XG52YXIgbGVuZ3RoX2Jhc2UgPSBuZXcgVWludDE2QXJyYXkoMzApO1xuXG4vKiBleHRyYSBiaXRzIGFuZCBiYXNlIHRhYmxlcyBmb3IgZGlzdGFuY2UgY29kZXMgKi9cbnZhciBkaXN0X2JpdHMgPSBuZXcgVWludDhBcnJheSgzMCk7XG52YXIgZGlzdF9iYXNlID0gbmV3IFVpbnQxNkFycmF5KDMwKTtcblxuLyogc3BlY2lhbCBvcmRlcmluZyBvZiBjb2RlIGxlbmd0aCBjb2RlcyAqL1xudmFyIGNsY2lkeCA9IG5ldyBVaW50OEFycmF5KFtcbiAgMTYsIDE3LCAxOCwgMCwgOCwgNywgOSwgNixcbiAgMTAsIDUsIDExLCA0LCAxMiwgMywgMTMsIDIsXG4gIDE0LCAxLCAxNVxuXSk7XG5cbi8qIHVzZWQgYnkgdGluZl9kZWNvZGVfdHJlZXMsIGF2b2lkcyBhbGxvY2F0aW9ucyBldmVyeSBjYWxsICovXG52YXIgY29kZV90cmVlID0gbmV3IFRyZWUoKTtcbnZhciBsZW5ndGhzID0gbmV3IFVpbnQ4QXJyYXkoMjg4ICsgMzIpO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG4gKiAtLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLSAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiBidWlsZCBleHRyYSBiaXRzIGFuZCBiYXNlIHRhYmxlcyAqL1xuZnVuY3Rpb24gdGluZl9idWlsZF9iaXRzX2Jhc2UoYml0cywgYmFzZSwgZGVsdGEsIGZpcnN0KSB7XG4gIHZhciBpLCBzdW07XG5cbiAgLyogYnVpbGQgYml0cyB0YWJsZSAqL1xuICBmb3IgKGkgPSAwOyBpIDwgZGVsdGE7ICsraSkgYml0c1tpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCAzMCAtIGRlbHRhOyArK2kpIGJpdHNbaSArIGRlbHRhXSA9IGkgLyBkZWx0YSB8IDA7XG5cbiAgLyogYnVpbGQgYmFzZSB0YWJsZSAqL1xuICBmb3IgKHN1bSA9IGZpcnN0LCBpID0gMDsgaSA8IDMwOyArK2kpIHtcbiAgICBiYXNlW2ldID0gc3VtO1xuICAgIHN1bSArPSAxIDw8IGJpdHNbaV07XG4gIH1cbn1cblxuLyogYnVpbGQgdGhlIGZpeGVkIGh1ZmZtYW4gdHJlZXMgKi9cbmZ1bmN0aW9uIHRpbmZfYnVpbGRfZml4ZWRfdHJlZXMobHQsIGR0KSB7XG4gIHZhciBpO1xuXG4gIC8qIGJ1aWxkIGZpeGVkIGxlbmd0aCB0cmVlICovXG4gIGZvciAoaSA9IDA7IGkgPCA3OyArK2kpIGx0LnRhYmxlW2ldID0gMDtcblxuICBsdC50YWJsZVs3XSA9IDI0O1xuICBsdC50YWJsZVs4XSA9IDE1MjtcbiAgbHQudGFibGVbOV0gPSAxMTI7XG5cbiAgZm9yIChpID0gMDsgaSA8IDI0OyArK2kpIGx0LnRyYW5zW2ldID0gMjU2ICsgaTtcbiAgZm9yIChpID0gMDsgaSA8IDE0NDsgKytpKSBsdC50cmFuc1syNCArIGldID0gaTtcbiAgZm9yIChpID0gMDsgaSA8IDg7ICsraSkgbHQudHJhbnNbMjQgKyAxNDQgKyBpXSA9IDI4MCArIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxMTI7ICsraSkgbHQudHJhbnNbMjQgKyAxNDQgKyA4ICsgaV0gPSAxNDQgKyBpO1xuXG4gIC8qIGJ1aWxkIGZpeGVkIGRpc3RhbmNlIHRyZWUgKi9cbiAgZm9yIChpID0gMDsgaSA8IDU7ICsraSkgZHQudGFibGVbaV0gPSAwO1xuXG4gIGR0LnRhYmxlWzVdID0gMzI7XG5cbiAgZm9yIChpID0gMDsgaSA8IDMyOyArK2kpIGR0LnRyYW5zW2ldID0gaTtcbn1cblxuLyogZ2l2ZW4gYW4gYXJyYXkgb2YgY29kZSBsZW5ndGhzLCBidWlsZCBhIHRyZWUgKi9cbnZhciBvZmZzID0gbmV3IFVpbnQxNkFycmF5KDE2KTtcblxuZnVuY3Rpb24gdGluZl9idWlsZF90cmVlKHQsIGxlbmd0aHMsIG9mZiwgbnVtKSB7XG4gIHZhciBpLCBzdW07XG5cbiAgLyogY2xlYXIgY29kZSBsZW5ndGggY291bnQgdGFibGUgKi9cbiAgZm9yIChpID0gMDsgaSA8IDE2OyArK2kpIHQudGFibGVbaV0gPSAwO1xuXG4gIC8qIHNjYW4gc3ltYm9sIGxlbmd0aHMsIGFuZCBzdW0gY29kZSBsZW5ndGggY291bnRzICovXG4gIGZvciAoaSA9IDA7IGkgPCBudW07ICsraSkgdC50YWJsZVtsZW5ndGhzW29mZiArIGldXSsrO1xuXG4gIHQudGFibGVbMF0gPSAwO1xuXG4gIC8qIGNvbXB1dGUgb2Zmc2V0IHRhYmxlIGZvciBkaXN0cmlidXRpb24gc29ydCAqL1xuICBmb3IgKHN1bSA9IDAsIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgIG9mZnNbaV0gPSBzdW07XG4gICAgc3VtICs9IHQudGFibGVbaV07XG4gIH1cblxuICAvKiBjcmVhdGUgY29kZS0+c3ltYm9sIHRyYW5zbGF0aW9uIHRhYmxlIChzeW1ib2xzIHNvcnRlZCBieSBjb2RlKSAqL1xuICBmb3IgKGkgPSAwOyBpIDwgbnVtOyArK2kpIHtcbiAgICBpZiAobGVuZ3Roc1tvZmYgKyBpXSkgdC50cmFuc1tvZmZzW2xlbmd0aHNbb2ZmICsgaV1dKytdID0gaTtcbiAgfVxufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcbiAqIC0tIGRlY29kZSBmdW5jdGlvbnMgLS0gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiBnZXQgb25lIGJpdCBmcm9tIHNvdXJjZSBzdHJlYW0gKi9cbmZ1bmN0aW9uIHRpbmZfZ2V0Yml0KGQpIHtcbiAgLyogY2hlY2sgaWYgdGFnIGlzIGVtcHR5ICovXG4gIGlmICghZC5iaXRjb3VudC0tKSB7XG4gICAgLyogbG9hZCBuZXh0IHRhZyAqL1xuICAgIGQudGFnID0gZC5zb3VyY2VbZC5zb3VyY2VJbmRleCsrXTtcbiAgICBkLmJpdGNvdW50ID0gNztcbiAgfVxuXG4gIC8qIHNoaWZ0IGJpdCBvdXQgb2YgdGFnICovXG4gIHZhciBiaXQgPSBkLnRhZyAmIDE7XG4gIGQudGFnID4+Pj0gMTtcblxuICByZXR1cm4gYml0O1xufVxuXG4vKiByZWFkIGEgbnVtIGJpdCB2YWx1ZSBmcm9tIGEgc3RyZWFtIGFuZCBhZGQgYmFzZSAqL1xuZnVuY3Rpb24gdGluZl9yZWFkX2JpdHMoZCwgbnVtLCBiYXNlKSB7XG4gIGlmICghbnVtKVxuICAgIHJldHVybiBiYXNlO1xuXG4gIHdoaWxlIChkLmJpdGNvdW50IDwgMjQpIHtcbiAgICBkLnRhZyB8PSBkLnNvdXJjZVtkLnNvdXJjZUluZGV4KytdIDw8IGQuYml0Y291bnQ7XG4gICAgZC5iaXRjb3VudCArPSA4O1xuICB9XG5cbiAgdmFyIHZhbCA9IGQudGFnICYgKDB4ZmZmZiA+Pj4gKDE2IC0gbnVtKSk7XG4gIGQudGFnID4+Pj0gbnVtO1xuICBkLmJpdGNvdW50IC09IG51bTtcbiAgcmV0dXJuIHZhbCArIGJhc2U7XG59XG5cbi8qIGdpdmVuIGEgZGF0YSBzdHJlYW0gYW5kIGEgdHJlZSwgZGVjb2RlIGEgc3ltYm9sICovXG5mdW5jdGlvbiB0aW5mX2RlY29kZV9zeW1ib2woZCwgdCkge1xuICB3aGlsZSAoZC5iaXRjb3VudCA8IDI0KSB7XG4gICAgZC50YWcgfD0gZC5zb3VyY2VbZC5zb3VyY2VJbmRleCsrXSA8PCBkLmJpdGNvdW50O1xuICAgIGQuYml0Y291bnQgKz0gODtcbiAgfVxuICBcbiAgdmFyIHN1bSA9IDAsIGN1ciA9IDAsIGxlbiA9IDA7XG4gIHZhciB0YWcgPSBkLnRhZztcblxuICAvKiBnZXQgbW9yZSBiaXRzIHdoaWxlIGNvZGUgdmFsdWUgaXMgYWJvdmUgc3VtICovXG4gIGRvIHtcbiAgICBjdXIgPSAyICogY3VyICsgKHRhZyAmIDEpO1xuICAgIHRhZyA+Pj49IDE7XG4gICAgKytsZW47XG5cbiAgICBzdW0gKz0gdC50YWJsZVtsZW5dO1xuICAgIGN1ciAtPSB0LnRhYmxlW2xlbl07XG4gIH0gd2hpbGUgKGN1ciA+PSAwKTtcbiAgXG4gIGQudGFnID0gdGFnO1xuICBkLmJpdGNvdW50IC09IGxlbjtcblxuICByZXR1cm4gdC50cmFuc1tzdW0gKyBjdXJdO1xufVxuXG4vKiBnaXZlbiBhIGRhdGEgc3RyZWFtLCBkZWNvZGUgZHluYW1pYyB0cmVlcyBmcm9tIGl0ICovXG5mdW5jdGlvbiB0aW5mX2RlY29kZV90cmVlcyhkLCBsdCwgZHQpIHtcbiAgdmFyIGhsaXQsIGhkaXN0LCBoY2xlbjtcbiAgdmFyIGksIG51bSwgbGVuZ3RoO1xuXG4gIC8qIGdldCA1IGJpdHMgSExJVCAoMjU3LTI4NikgKi9cbiAgaGxpdCA9IHRpbmZfcmVhZF9iaXRzKGQsIDUsIDI1Nyk7XG5cbiAgLyogZ2V0IDUgYml0cyBIRElTVCAoMS0zMikgKi9cbiAgaGRpc3QgPSB0aW5mX3JlYWRfYml0cyhkLCA1LCAxKTtcblxuICAvKiBnZXQgNCBiaXRzIEhDTEVOICg0LTE5KSAqL1xuICBoY2xlbiA9IHRpbmZfcmVhZF9iaXRzKGQsIDQsIDQpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCAxOTsgKytpKSBsZW5ndGhzW2ldID0gMDtcblxuICAvKiByZWFkIGNvZGUgbGVuZ3RocyBmb3IgY29kZSBsZW5ndGggYWxwaGFiZXQgKi9cbiAgZm9yIChpID0gMDsgaSA8IGhjbGVuOyArK2kpIHtcbiAgICAvKiBnZXQgMyBiaXRzIGNvZGUgbGVuZ3RoICgwLTcpICovXG4gICAgdmFyIGNsZW4gPSB0aW5mX3JlYWRfYml0cyhkLCAzLCAwKTtcbiAgICBsZW5ndGhzW2NsY2lkeFtpXV0gPSBjbGVuO1xuICB9XG5cbiAgLyogYnVpbGQgY29kZSBsZW5ndGggdHJlZSAqL1xuICB0aW5mX2J1aWxkX3RyZWUoY29kZV90cmVlLCBsZW5ndGhzLCAwLCAxOSk7XG5cbiAgLyogZGVjb2RlIGNvZGUgbGVuZ3RocyBmb3IgdGhlIGR5bmFtaWMgdHJlZXMgKi9cbiAgZm9yIChudW0gPSAwOyBudW0gPCBobGl0ICsgaGRpc3Q7KSB7XG4gICAgdmFyIHN5bSA9IHRpbmZfZGVjb2RlX3N5bWJvbChkLCBjb2RlX3RyZWUpO1xuXG4gICAgc3dpdGNoIChzeW0pIHtcbiAgICAgIGNhc2UgMTY6XG4gICAgICAgIC8qIGNvcHkgcHJldmlvdXMgY29kZSBsZW5ndGggMy02IHRpbWVzIChyZWFkIDIgYml0cykgKi9cbiAgICAgICAgdmFyIHByZXYgPSBsZW5ndGhzW251bSAtIDFdO1xuICAgICAgICBmb3IgKGxlbmd0aCA9IHRpbmZfcmVhZF9iaXRzKGQsIDIsIDMpOyBsZW5ndGg7IC0tbGVuZ3RoKSB7XG4gICAgICAgICAgbGVuZ3Roc1tudW0rK10gPSBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxNzpcbiAgICAgICAgLyogcmVwZWF0IGNvZGUgbGVuZ3RoIDAgZm9yIDMtMTAgdGltZXMgKHJlYWQgMyBiaXRzKSAqL1xuICAgICAgICBmb3IgKGxlbmd0aCA9IHRpbmZfcmVhZF9iaXRzKGQsIDMsIDMpOyBsZW5ndGg7IC0tbGVuZ3RoKSB7XG4gICAgICAgICAgbGVuZ3Roc1tudW0rK10gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxODpcbiAgICAgICAgLyogcmVwZWF0IGNvZGUgbGVuZ3RoIDAgZm9yIDExLTEzOCB0aW1lcyAocmVhZCA3IGJpdHMpICovXG4gICAgICAgIGZvciAobGVuZ3RoID0gdGluZl9yZWFkX2JpdHMoZCwgNywgMTEpOyBsZW5ndGg7IC0tbGVuZ3RoKSB7XG4gICAgICAgICAgbGVuZ3Roc1tudW0rK10gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLyogdmFsdWVzIDAtMTUgcmVwcmVzZW50IHRoZSBhY3R1YWwgY29kZSBsZW5ndGhzICovXG4gICAgICAgIGxlbmd0aHNbbnVtKytdID0gc3ltO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKiBidWlsZCBkeW5hbWljIHRyZWVzICovXG4gIHRpbmZfYnVpbGRfdHJlZShsdCwgbGVuZ3RocywgMCwgaGxpdCk7XG4gIHRpbmZfYnVpbGRfdHJlZShkdCwgbGVuZ3RocywgaGxpdCwgaGRpc3QpO1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG4gKiAtLSBibG9jayBpbmZsYXRlIGZ1bmN0aW9ucyAtLSAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiBnaXZlbiBhIHN0cmVhbSBhbmQgdHdvIHRyZWVzLCBpbmZsYXRlIGEgYmxvY2sgb2YgZGF0YSAqL1xuZnVuY3Rpb24gdGluZl9pbmZsYXRlX2Jsb2NrX2RhdGEoZCwgbHQsIGR0KSB7XG4gIHdoaWxlICgxKSB7XG4gICAgdmFyIHN5bSA9IHRpbmZfZGVjb2RlX3N5bWJvbChkLCBsdCk7XG5cbiAgICAvKiBjaGVjayBmb3IgZW5kIG9mIGJsb2NrICovXG4gICAgaWYgKHN5bSA9PT0gMjU2KSB7XG4gICAgICByZXR1cm4gVElORl9PSztcbiAgICB9XG5cbiAgICBpZiAoc3ltIDwgMjU2KSB7XG4gICAgICBkLmRlc3RbZC5kZXN0TGVuKytdID0gc3ltO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVuZ3RoLCBkaXN0LCBvZmZzO1xuICAgICAgdmFyIGk7XG5cbiAgICAgIHN5bSAtPSAyNTc7XG5cbiAgICAgIC8qIHBvc3NpYmx5IGdldCBtb3JlIGJpdHMgZnJvbSBsZW5ndGggY29kZSAqL1xuICAgICAgbGVuZ3RoID0gdGluZl9yZWFkX2JpdHMoZCwgbGVuZ3RoX2JpdHNbc3ltXSwgbGVuZ3RoX2Jhc2Vbc3ltXSk7XG5cbiAgICAgIGRpc3QgPSB0aW5mX2RlY29kZV9zeW1ib2woZCwgZHQpO1xuXG4gICAgICAvKiBwb3NzaWJseSBnZXQgbW9yZSBiaXRzIGZyb20gZGlzdGFuY2UgY29kZSAqL1xuICAgICAgb2ZmcyA9IGQuZGVzdExlbiAtIHRpbmZfcmVhZF9iaXRzKGQsIGRpc3RfYml0c1tkaXN0XSwgZGlzdF9iYXNlW2Rpc3RdKTtcblxuICAgICAgLyogY29weSBtYXRjaCAqL1xuICAgICAgZm9yIChpID0gb2ZmczsgaSA8IG9mZnMgKyBsZW5ndGg7ICsraSkge1xuICAgICAgICBkLmRlc3RbZC5kZXN0TGVuKytdID0gZC5kZXN0W2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiBpbmZsYXRlIGFuIHVuY29tcHJlc3NlZCBibG9jayBvZiBkYXRhICovXG5mdW5jdGlvbiB0aW5mX2luZmxhdGVfdW5jb21wcmVzc2VkX2Jsb2NrKGQpIHtcbiAgdmFyIGxlbmd0aCwgaW52bGVuZ3RoO1xuICB2YXIgaTtcbiAgXG4gIC8qIHVucmVhZCBmcm9tIGJpdGJ1ZmZlciAqL1xuICB3aGlsZSAoZC5iaXRjb3VudCA+IDgpIHtcbiAgICBkLnNvdXJjZUluZGV4LS07XG4gICAgZC5iaXRjb3VudCAtPSA4O1xuICB9XG5cbiAgLyogZ2V0IGxlbmd0aCAqL1xuICBsZW5ndGggPSBkLnNvdXJjZVtkLnNvdXJjZUluZGV4ICsgMV07XG4gIGxlbmd0aCA9IDI1NiAqIGxlbmd0aCArIGQuc291cmNlW2Quc291cmNlSW5kZXhdO1xuXG4gIC8qIGdldCBvbmUncyBjb21wbGVtZW50IG9mIGxlbmd0aCAqL1xuICBpbnZsZW5ndGggPSBkLnNvdXJjZVtkLnNvdXJjZUluZGV4ICsgM107XG4gIGludmxlbmd0aCA9IDI1NiAqIGludmxlbmd0aCArIGQuc291cmNlW2Quc291cmNlSW5kZXggKyAyXTtcblxuICAvKiBjaGVjayBsZW5ndGggKi9cbiAgaWYgKGxlbmd0aCAhPT0gKH5pbnZsZW5ndGggJiAweDAwMDBmZmZmKSlcbiAgICByZXR1cm4gVElORl9EQVRBX0VSUk9SO1xuXG4gIGQuc291cmNlSW5kZXggKz0gNDtcblxuICAvKiBjb3B5IGJsb2NrICovXG4gIGZvciAoaSA9IGxlbmd0aDsgaTsgLS1pKVxuICAgIGQuZGVzdFtkLmRlc3RMZW4rK10gPSBkLnNvdXJjZVtkLnNvdXJjZUluZGV4KytdO1xuXG4gIC8qIG1ha2Ugc3VyZSB3ZSBzdGFydCBuZXh0IGJsb2NrIG9uIGEgYnl0ZSBib3VuZGFyeSAqL1xuICBkLmJpdGNvdW50ID0gMDtcblxuICByZXR1cm4gVElORl9PSztcbn1cblxuLyogaW5mbGF0ZSBzdHJlYW0gZnJvbSBzb3VyY2UgdG8gZGVzdCAqL1xuZnVuY3Rpb24gdGluZl91bmNvbXByZXNzKHNvdXJjZSwgZGVzdCkge1xuICB2YXIgZCA9IG5ldyBEYXRhKHNvdXJjZSwgZGVzdCk7XG4gIHZhciBiZmluYWwsIGJ0eXBlLCByZXM7XG5cbiAgZG8ge1xuICAgIC8qIHJlYWQgZmluYWwgYmxvY2sgZmxhZyAqL1xuICAgIGJmaW5hbCA9IHRpbmZfZ2V0Yml0KGQpO1xuXG4gICAgLyogcmVhZCBibG9jayB0eXBlICgyIGJpdHMpICovXG4gICAgYnR5cGUgPSB0aW5mX3JlYWRfYml0cyhkLCAyLCAwKTtcblxuICAgIC8qIGRlY29tcHJlc3MgYmxvY2sgKi9cbiAgICBzd2l0Y2ggKGJ0eXBlKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8qIGRlY29tcHJlc3MgdW5jb21wcmVzc2VkIGJsb2NrICovXG4gICAgICAgIHJlcyA9IHRpbmZfaW5mbGF0ZV91bmNvbXByZXNzZWRfYmxvY2soZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICAvKiBkZWNvbXByZXNzIGJsb2NrIHdpdGggZml4ZWQgaHVmZm1hbiB0cmVlcyAqL1xuICAgICAgICByZXMgPSB0aW5mX2luZmxhdGVfYmxvY2tfZGF0YShkLCBzbHRyZWUsIHNkdHJlZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICAvKiBkZWNvbXByZXNzIGJsb2NrIHdpdGggZHluYW1pYyBodWZmbWFuIHRyZWVzICovXG4gICAgICAgIHRpbmZfZGVjb2RlX3RyZWVzKGQsIGQubHRyZWUsIGQuZHRyZWUpO1xuICAgICAgICByZXMgPSB0aW5mX2luZmxhdGVfYmxvY2tfZGF0YShkLCBkLmx0cmVlLCBkLmR0cmVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXMgPSBUSU5GX0RBVEFfRVJST1I7XG4gICAgfVxuXG4gICAgaWYgKHJlcyAhPT0gVElORl9PSylcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBlcnJvcicpO1xuXG4gIH0gd2hpbGUgKCFiZmluYWwpO1xuXG4gIGlmIChkLmRlc3RMZW4gPCBkLmRlc3QubGVuZ3RoKSB7XG4gICAgaWYgKHR5cGVvZiBkLmRlc3Quc2xpY2UgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gZC5kZXN0LnNsaWNlKDAsIGQuZGVzdExlbik7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGQuZGVzdC5zdWJhcnJheSgwLCBkLmRlc3RMZW4pO1xuICB9XG4gIFxuICByZXR1cm4gZC5kZXN0O1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG4gKiAtLSBpbml0aWFsaXphdGlvbiAtLSAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiBidWlsZCBmaXhlZCBodWZmbWFuIHRyZWVzICovXG50aW5mX2J1aWxkX2ZpeGVkX3RyZWVzKHNsdHJlZSwgc2R0cmVlKTtcblxuLyogYnVpbGQgZXh0cmEgYml0cyBhbmQgYmFzZSB0YWJsZXMgKi9cbnRpbmZfYnVpbGRfYml0c19iYXNlKGxlbmd0aF9iaXRzLCBsZW5ndGhfYmFzZSwgNCwgMyk7XG50aW5mX2J1aWxkX2JpdHNfYmFzZShkaXN0X2JpdHMsIGRpc3RfYmFzZSwgMiwgMSk7XG5cbi8qIGZpeCBhIHNwZWNpYWwgY2FzZSAqL1xubGVuZ3RoX2JpdHNbMjhdID0gMDtcbmxlbmd0aF9iYXNlWzI4XSA9IDI1ODtcblxubW9kdWxlLmV4cG9ydHMgPSB0aW5mX3VuY29tcHJlc3M7XG4iLCJpbXBvcnQgeyBicmVha1BsYWluVGV4dEludG9MaW5lcyB9IGZyb20gXCIuL2xpbmVicmVha1wiO1xuaW1wb3J0IHsgSU5WQUxJRF9JTkRFWF9WQUxVRSwgSU5WQUxJRF9URVhUX1BPU0lUSU9OIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGNoYW5nZVJ1blN0eWxlLCBjbG9uZU9iaiwgZ2V0Q2hhckluZGV4QmVmb3JlUG9zLCBnZXRMb2dpY0xpbmVGcm9tU3RyaW5nLCBnZXRQb3NJbmRleEZyb21DaGFySW5kZXgsIGdldFBvc3RDdXRMaW5lLCBnZXRQcmVDdXRMaW5lLCBnZXRQcmV2aW91c1Bvc2l0aW9uLCBnZXRSdW5JbmRleEF0Q2hhciwgZ2V0U3R5bGVBdFBvc2l0aW9uLCBpc0VtcHR5TGluZSwgaXNMaW5lRW1wdHksIGlzUG9zSGVhZCwgaXNQb3NUYWlsLCBtZXJnZUxpbmUsIG9mZnNldFJhbmdlRnJvbVBvcywgcG9zaXRpb25MZXNzLCByZW1vdmVDaGFyRnJvbVRleHQsIHNlbGVjdGlvbklzRW1wdHksIHVwZGF0ZVBvc2l0aW9uUnVuSW5kZXggfSBmcm9tIFwiLi91dGlsXCI7XG4vLyBoYW5kbGUgcmV0dXJuIGF0IHRoZSBjYXJldCBwb3NpdGlvbiwgY29uc2lkZXJpbmcgaW5kZW50YXRpb24sIGxpbmVzICYgcG9zIHdpbGwgYmUgbXV0YXRlZFxuLy8gMS4gaWYgY2FyZXQgaXMgZW9sLCBpbnNlcnQgYSBlbXB0eSBuZXcgbGluZSwgY2FyZXQgdG8gdGhlIG5ldyBsaW5lXG4vLyAyLiBpZiBjYXJldCBpcyBhdCBoZWFkLCBpbnNlcnQgYSBlbXB0eSBuZXcgbGluZSwgY2FyZXQgc3RpbGwgcmVtYWluXG4vLyAzLiBpZiBjYXJldCBpcyBpbiB0aGUgbWlkZGxlLCBjdXQgY3VycmVudCBsaW5lLCBwdXQgcG9zdExpbmUgdG8gdGhlIG5ld0xpbmUgXG4vLyA0LiBpZiBjdXJyZW50IGxpbmUgaGFzIGluZGVudGF0aW9uLCBuZXcgbGluZSBzaG91bGQgaGF2ZSBpbmhlcml0XG5leHBvcnQgZnVuY3Rpb24gbmV3bGluZShsaW5lcywgcG9zKSB7XG4gICAgY29uc3QgY3VyTGluZSA9IGxpbmVzW3Bvcy5saW5lSW5kZXhdO1xuICAgIGlmIChpc1Bvc1RhaWwocG9zKSkge1xuICAgICAgICAvLyBpbnNlcnQgYSBuZXcgZW1wdHkgbGluZVxuICAgICAgICBjb25zdCBuZXdMaW5lID0ge1xuICAgICAgICAgICAgcnVuczogW10sXG4gICAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGN1ckxpbmUudGV4dEluZGVudCkge1xuICAgICAgICAgICAgbmV3TGluZS50ZXh0SW5kZW50ID0gY2xvbmVPYmooY3VyTGluZS50ZXh0SW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICBsaW5lcy5zcGxpY2UocG9zLmxpbmVJbmRleCArIDEsIDAsIG5ld0xpbmUpO1xuICAgICAgICBwb3MubGluZUluZGV4Kys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBjdXQgbGluZSBpbnRvIHByZUxpbmUgYW5kIHBvc3RMaW5lLCByZXBsYWNlIGN1ckxpbmUtPnByZUxpbmUsIGluc2VydCBwb3N0TGluZSBhcyBuZXdMaW5lLCB0aGVuIHNldCBjYXJldFxuICAgICAgICBjb25zdCBwcmVMaW5lID0gZ2V0UHJlQ3V0TGluZShjdXJMaW5lLCBwb3MpO1xuICAgICAgICBjb25zdCBwb3N0TGluZSA9IGdldFBvc3RDdXRMaW5lKGN1ckxpbmUsIHBvcyk7XG4gICAgICAgIGxpbmVzLnNwbGljZShwb3MubGluZUluZGV4LCAxLCBwcmVMaW5lKTtcbiAgICAgICAgbGluZXMuc3BsaWNlKHBvcy5saW5lSW5kZXggKyAxLCAwLCBwb3N0TGluZSk7XG4gICAgICAgIC8vIGNhcmV0IHRvIHRoZSBmaXJzdCBydW4gJiBjaGFyIG9mIHRoZSBuZXdMaW5lXG4gICAgICAgIHBvcy5saW5lSW5kZXgrKztcbiAgICAgICAgcG9zLnJ1bkluZGV4ID0gMDtcbiAgICAgICAgcG9zLmNoYXJJbmRleCA9IDA7XG4gICAgfVxufVxuLy8gaGFuZGxlIGJhY2tzcGFjZSBhdCB0aGUgY2FyZXQgcG9zaXRpb24sIGNvbnNpZGVyaW5nIGluZGVudGF0aW9uLCBsaW5lcyAmIHBvcyB3aWxsIGJlIG11dGF0ZWRcbi8vIDEuIGlmIGNhcmV0IGlzIG5vdCBoZWFkLCBiYWNrIG9uZSBjaGFyYWN0ZXIsIGxpbmUgaXMgbm90IGNoYW5nZWRcbi8vIDIuIGlmIGNhcmV0IGlzIGhlYWQsIGFwcGVuZCBjdXJyZW50IGxpbmUgdG8gcHJldmlvdXMgbGluZVxuLy8gMy4gaWYgaW5kZW50IGV4aXN0cywgdXBkYXRlIGluZGVudCBhbGwgbGluZXMgYWZ0ZXIgY3VycmVudCBsaW5lXG5leHBvcnQgZnVuY3Rpb24gYmFja3NwYWNlKGxpbmVzLCBwb3MpIHtcbiAgICBjb25zdCBsaW5lID0gbGluZXNbcG9zLmxpbmVJbmRleF07XG4gICAgaWYgKGlzUG9zSGVhZChwb3MpKSB7XG4gICAgICAgIC8vIGFwcGVuZCBjdXJMaW5lIHRvIHByZXZpb3VzIGxpbmUsIHRoZW4gcmVtb3ZlIGN1cnJlbnQgbGluZSwgdGhlbiB1cGRhdGUgcG9zXG4gICAgICAgIGlmIChwb3MubGluZUluZGV4ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyBwcmV2IGxpbmVcbiAgICAgICAgbGV0IHByZXZMaW5lID0gbGluZXNbcG9zLmxpbmVJbmRleCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2UnVuTGVuZ3RoID0gcHJldkxpbmUucnVucy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHByZXZMaW5lRW5kID0gcHJldlJ1bkxlbmd0aCA9PSAwID8gMCA6IHByZXZMaW5lLnJ1bnNbcHJldkxpbmUucnVucy5sZW5ndGggLSAxXS5yYW5nZVsxXSArIDE7XG4gICAgICAgIGlmIChpc0xpbmVFbXB0eShwcmV2TGluZSkpIHtcbiAgICAgICAgICAgIGxpbmVzLnNwbGljZShwb3MubGluZUluZGV4IC0gMSwgMSk7XG4gICAgICAgICAgICBwb3MubGluZUluZGV4LS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsaW5lc1twb3MubGluZUluZGV4IC0gMV0gPSBtZXJnZUxpbmUocHJldkxpbmUsIGxpbmUpO1xuICAgICAgICAgICAgbGluZXMuc3BsaWNlKHBvcy5saW5lSW5kZXgsIDEpO1xuICAgICAgICAgICAgcG9zLmxpbmVJbmRleC0tO1xuICAgICAgICAgICAgcG9zLmNoYXJJbmRleCA9IHByZXZMaW5lRW5kO1xuICAgICAgICAgICAgcG9zLnJ1bkluZGV4ID0gZ2V0UnVuSW5kZXhBdENoYXIobGluZXMsIHBvcy5saW5lSW5kZXgsIHBvcy5jaGFySW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBlcmFzZSBvbmUgZXhpc3RpbmcgY2hhcmFjdGVyXG4gICAgICAgIGlmIChpc1Bvc1RhaWwocG9zKSkge1xuICAgICAgICAgICAgaWYgKGlzRW1wdHlMaW5lKGxpbmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGVtcHR5IGxpbmVcbiAgICAgICAgICAgICAgICBpZiAocG9zLmxpbmVJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5zcGxpY2UocG9zLmxpbmVJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHBvcy5saW5lSW5kZXgtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lLnRleHQgPSByZW1vdmVDaGFyRnJvbVRleHQobGluZS50ZXh0LCBsaW5lLnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVuID0gbGluZS5ydW5zW2xpbmUucnVucy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBydW4ucmFuZ2VbMV0tLTtcbiAgICAgICAgICAgICAgICAvLyBtYXkgc3F1YXNoIGEgcnVuLCBwb3MgbW92ZSB0byBsYXN0IHJ1blxuICAgICAgICAgICAgICAgIGlmIChydW4ucmFuZ2VbMF0gPiBydW4ucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZS5ydW5zLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBwb3MucnVuSW5kZXgtLTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdFJ1biA9IGxpbmUucnVuc1tsaW5lLnJ1bnMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UnVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MuY2hhckluZGV4ID0gbGFzdFJ1bi5yYW5nZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgdGhlIGxhc3QgcnVuLCBub3cgdGhlIGxpbmUgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5ydW5JbmRleCA9IHBvcy5jaGFySW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhckluZGV4ID0gZ2V0Q2hhckluZGV4QmVmb3JlUG9zKGxpbmUsIHBvcyk7XG4gICAgICAgICAgICBvZmZzZXRSYW5nZUZyb21Qb3MobGluZS5ydW5zLCAtMSwgY2hhckluZGV4KTtcbiAgICAgICAgICAgIGxpbmUudGV4dCA9IHJlbW92ZUNoYXJGcm9tVGV4dChsaW5lLnRleHQsIGNoYXJJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXdQb3MgPSBnZXRQb3NJbmRleEZyb21DaGFySW5kZXgobGluZS5ydW5zLCBjaGFySW5kZXgpO1xuICAgICAgICAgICAgaWYgKG5ld1Bvcykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocG9zLCBuZXdQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy8gbWFrZSBjdXJyZW50IGxpbmUgaXRlcm1pemVkXG5leHBvcnQgZnVuY3Rpb24gaXRlcm1pemUobGluZXMsIHBvcywgaWR0KSB7XG59XG4vLyBjaGFuZ2UgaW5kZW50YXRpb25cbmV4cG9ydCBmdW5jdGlvbiBpbmRlbnRpemUobGluZXMsIHBvcywgZXhpbmRlbnQpIHtcbn1cbi8vIGluc2VydCB0ZXh0KG1heSBoYXMgXFxuIGluc2lkZSkgYXQgY2VydGFpbiBwb3NpdGlvblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydFRleHQobGluZXMsIHBvcywgY29udGVudCkge1xuICAgIC8vIGlmIG5vIGNvbnRlbnQsIGRvIG5vdGhpbmdcbiAgICBpZiAoY29udGVudCA9PT0gJycpXG4gICAgICAgIHJldHVybiBwb3M7XG4gICAgLy8gZmV0Y2ggc3R5bGUgYW5kIGluZGVudCBhdCBpbnNlcnRpbmcgcG9pbnRcbiAgICBjb25zdCBjdXRMaW5lID0gbGluZXNbcG9zLmxpbmVJbmRleF07XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZUF0UG9zaXRpb24obGluZXMsIHBvcyk7XG4gICAgY29uc3QgaW5kZW50ID0gY3V0TGluZS50ZXh0SW5kZW50O1xuICAgIC8vIGJyZWFrIHRoZSBjb250ZW50KD49IDEpIGludG8gbGluZXMsIHRoZSBmaXJzdCBsaW5lIHdpbGwgYmUgYXBwZW5kIHRvIHByZUN1dCwgdGhlIGxhc3Qgc3RyaW5nIHdpbGwgYmUgY29uY2F0IHBvc3RDdXRcbiAgICBjb25zdCBzdHJpbmdBcnJheSA9IGJyZWFrUGxhaW5UZXh0SW50b0xpbmVzKGNvbnRlbnQpO1xuICAgIGNvbnNvbGUubG9nKHN0cmluZ0FycmF5KTtcbiAgICAvLyBhcHBlbmQgZmlyc3RTdHIgdG8gY2FyZXQtbGFuZGluZyBsaW5lIChjdXRMaW5lKVxuICAgIGNvbnN0IHByZUxpbmUgPSBnZXRQcmVDdXRMaW5lKGN1dExpbmUsIHBvcyk7XG4gICAgY29uc3QgcG9zdExpbmUgPSBnZXRQb3N0Q3V0TGluZShjdXRMaW5lLCBwb3MpO1xuICAgIGNvbnN0IGZpcnN0TmV3TGluZSA9IGdldExvZ2ljTGluZUZyb21TdHJpbmcoc3RyaW5nQXJyYXlbMF0sIHN0eWxlLCBpbmRlbnQpO1xuICAgIGNvbnN0IG1lcmdlZFByZUxpbmUgPSBtZXJnZUxpbmUocHJlTGluZSwgZmlyc3ROZXdMaW5lKTtcbiAgICBsaW5lcy5zcGxpY2UocG9zLmxpbmVJbmRleCwgMSwgbWVyZ2VkUHJlTGluZSk7IC8vIHVwZGF0ZSBpbiBwbGFjZVxuICAgIC8vIGZpcnN0TmV3TGluZSA9PT0gbGFzdE5ld0xpbmUsIGUuZy4gaW5zZXJ0aW5nIGEgc2luZ2xlIGxpbmUgb3IgY2hhciwgdGhlbiBzaW1wbHkgYXBwZW5kIHBvc3RMaW5lLCBlYXJseSBleGl0XG4gICAgaWYgKHN0cmluZ0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBmaW5hbExpbmUgPSBtZXJnZUxpbmUobWVyZ2VkUHJlTGluZSwgcG9zdExpbmUpO1xuICAgICAgICBsaW5lcy5zcGxpY2UocG9zLmxpbmVJbmRleCwgMSwgZmluYWxMaW5lKTtcbiAgICAgICAgLy8gY2FyZXQgc3RpbGwgcmVzaWRlIGluIGN1dExpbmVcbiAgICAgICAgLy8gaWYgcG9zIGlzIEVPTCwgcG9zLnJ1bkluZGV4IGFuZCBwb3MuQ2hhckluZGV4IGlzIGludmFsaWQsIGNhbm5vdCBzaW1wbHkgb2Zmc2V0XG4gICAgICAgIGlmIChpc1Bvc1RhaWwocG9zKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZXg6IHBvcy5saW5lSW5kZXgsXG4gICAgICAgICAgICAgICAgcnVuSW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLFxuICAgICAgICAgICAgICAgIGVuZE9mTGluZTogdHJ1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGFySW5kZXggPSBwb3MuY2hhckluZGV4ICsgY29udGVudC5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpbmVJbmRleDogcG9zLmxpbmVJbmRleCxcbiAgICAgICAgICAgICAgICBydW5JbmRleDogZ2V0UnVuSW5kZXhBdENoYXIobGluZXMsIHBvcy5saW5lSW5kZXgsIGNoYXJJbmRleCksXG4gICAgICAgICAgICAgICAgY2hhckluZGV4LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiBoYXMgc29tZSBtaWRkbGUgbGluZXMsIHByb2Nlc3MgdGhlbSBpbnRvIGxvZ2ljTGluZSBhbmQgaW5zZXJ0IFxuICAgIGlmIChzdHJpbmdBcnJheS5sZW5ndGggPiAyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3RyaW5nQXJyYXkubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGdldExvZ2ljTGluZUZyb21TdHJpbmcoc3RyaW5nQXJyYXlbaV0sIHN0eWxlLCBpbmRlbnQpO1xuICAgICAgICAgICAgbGluZXMuc3BsaWNlKHBvcy5saW5lSW5kZXggKyBpLCAwLCBsaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGFzdE5ld0xpbmUgPSBnZXRMb2dpY0xpbmVGcm9tU3RyaW5nKHN0cmluZ0FycmF5W3N0cmluZ0FycmF5Lmxlbmd0aCAtIDFdLCBzdHlsZSwgaW5kZW50KTtcbiAgICBjb25zdCBtZXJnZWRQb3N0TGluZSA9IG1lcmdlTGluZShsYXN0TmV3TGluZSwgcG9zdExpbmUpO1xuICAgIGNvbnN0IHBvc3RMaW5lSW5kZXggPSBwb3MubGluZUluZGV4ICsgc3RyaW5nQXJyYXkubGVuZ3RoIC0gMTtcbiAgICBsaW5lcy5zcGxpY2UocG9zdExpbmVJbmRleCwgMSwgbWVyZ2VkUG9zdExpbmUpO1xuICAgIC8vIGNhcmV0IG1vdmUgdG8gYmUgYmVoaW5kIGxhc3ROZXdMaW5lJ3MgRU9MXG4gICAgaWYgKGlzUG9zVGFpbChwb3MpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHBvc3RMaW5lSW5kZXgsXG4gICAgICAgICAgICBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSxcbiAgICAgICAgICAgIGNoYXJJbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSxcbiAgICAgICAgICAgIGVuZE9mTGluZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGNoYXJJbmRleCA9IGxhc3ROZXdMaW5lLnRleHQubGVuZ3RoO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluZUluZGV4OiBwb3N0TGluZUluZGV4LFxuICAgICAgICAgICAgcnVuSW5kZXg6IGdldFJ1bkluZGV4QXRDaGFyKGxpbmVzLCBwb3N0TGluZUluZGV4LCBjaGFySW5kZXgpLFxuICAgICAgICAgICAgY2hhckluZGV4LFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFRleHQobGluZXMsIHNlbGVjdGlvbikge1xuICAgIGlmIChzZWxlY3Rpb25Jc0VtcHR5KHNlbGVjdGlvbikpXG4gICAgICAgIHJldHVybiBJTlZBTElEX1RFWFRfUE9TSVRJT047XG4gICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBzZWxlY3Rpb247XG4gICAgLy8gZmV0Y2ggc3R5bGUgYW5kIGluZGVudCBhdCBzdGFydCBwb2ludFxuICAgIGNvbnN0IGN1dExpbmVTdGFydCA9IGxpbmVzW3N0YXJ0LmxpbmVJbmRleF07XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZUF0UG9zaXRpb24obGluZXMsIHN0YXJ0KTtcbiAgICBjb25zdCBpbmRlbnQgPSBjdXRMaW5lU3RhcnQudGV4dEluZGVudDtcbiAgICBjb25zdCBjdXRMaW5lRW5kID0gbGluZXNbZW5kLmxpbmVJbmRleF07XG4gICAgY29uc3QgdG90YWxMaW5lc0FmZmVjdGVkID0gZW5kLmxpbmVJbmRleCAtIHN0YXJ0LmxpbmVJbmRleCArIDE7XG4gICAgLy8gY3V0IHRoZSBzdGFydGluZyBsaW5lIGFuZCBlbmRpbmcgbGluZVxuICAgIGNvbnN0IHByZUxpbmVTdGFydCA9IGdldFByZUN1dExpbmUoY3V0TGluZVN0YXJ0LCBzdGFydCk7XG4gICAgY29uc3QgcG9zdExpbmVFbmQgPSBnZXRQb3N0Q3V0TGluZShjdXRMaW5lRW5kLCBlbmQpO1xuICAgIC8vIHN0aXRjaCB0aGUgdHdvIGhhbGZsaW5lIGJhY2tcbiAgICBjb25zdCBtZXJnZWRQcmVMaW5lID0gbWVyZ2VMaW5lKHByZUxpbmVTdGFydCwgcG9zdExpbmVFbmQpO1xuICAgIGlmIChzdGFydC5saW5lSW5kZXggPT09IGVuZC5saW5lSW5kZXgpIHtcbiAgICAgICAgLy8gaWYgc2VsZWN0ZWQgdGV4dCBpcyBpbnNpZGUgYSBzaW5nbGUgbGluZVxuICAgICAgICBsaW5lcy5zcGxpY2Uoc3RhcnQubGluZUluZGV4LCAxLCBtZXJnZWRQcmVMaW5lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vICBzZWxlY3Rpb24gc3BhbnMgbXVsdGlwbGUgbGluZXNcbiAgICAgICAgbGluZXMuc3BsaWNlKHN0YXJ0LmxpbmVJbmRleCwgdG90YWxMaW5lc0FmZmVjdGVkLCBtZXJnZWRQcmVMaW5lKTtcbiAgICB9XG4gICAgaWYgKGlzTGluZUVtcHR5KGxpbmVzW3N0YXJ0LmxpbmVJbmRleF0pKSB7XG4gICAgICAgIHJldHVybiB7IGxpbmVJbmRleDogc3RhcnQubGluZUluZGV4LCBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBlbmRPZkxpbmU6IHRydWUgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIHJ1bkluZGV4IGlzIHRoZSBwb3N0TGluRW5kJ3MgcmFuZ2VbMF1cbiAgICAgICAgaWYgKGlzRW1wdHlMaW5lKHBvc3RMaW5lRW5kKSlcbiAgICAgICAgICAgIHJldHVybiB7IGxpbmVJbmRleDogc3RhcnQubGluZUluZGV4LCBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBlbmRPZkxpbmU6IHRydWUgfTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHsgbGluZUluZGV4OiBzdGFydC5saW5lSW5kZXgsIHJ1bkluZGV4OiBwcmVMaW5lU3RhcnQucnVucy5sZW5ndGgsIGNoYXJJbmRleDogc3RhcnQuY2hhckluZGV4IH07XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVNlbGVjdGVkVGV4dFN0eWxlKGxpbmVzLCBzZWwsIG5ld1N0eWxlKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBzZWwuc3RhcnQ7XG4gICAgY29uc3QgZW5kID0gZ2V0UHJldmlvdXNQb3NpdGlvbihsaW5lcywgc2VsLmVuZCk7XG4gICAgY29uc3QgZmlyc3RMaW5lID0gbGluZXNbc3RhcnQubGluZUluZGV4XTtcbiAgICBjb25zdCBsYXN0TGluZSA9IGxpbmVzW2VuZC5saW5lSW5kZXhdO1xuICAgIGNvbnN0IGZpcnN0UnVuID0gaXNQb3NUYWlsKHN0YXJ0KSA/IHVuZGVmaW5lZCA6IGZpcnN0TGluZS5ydW5zW3N0YXJ0LnJ1bkluZGV4XTtcbiAgICBjb25zdCBsYXN0UnVuID0gaXNQb3NUYWlsKGVuZCkgPyB1bmRlZmluZWQgOiBsYXN0TGluZS5ydW5zW2VuZC5ydW5JbmRleF07XG4gICAgLy8gcmUtc3R5bGUgdGhlIGZpcnN0IGxpbmVcbiAgICBpZiAoZmlyc3RSdW4pIHtcbiAgICAgICAgLy8gdGhlcmUgaXMgcnVuIGJlaGluZCB0aGlzIHBvc2l0aW9uXG4gICAgICAgIGNoYW5nZVJ1blN0eWxlKGZpcnN0TGluZS5ydW5zLCBzdGFydC5ydW5JbmRleCwgW3N0YXJ0LmNoYXJJbmRleCwgZmlyc3RSdW4ucmFuZ2VbMV1dLCBuZXdTdHlsZSk7XG4gICAgfVxuICAgIC8vIGxvb3AgcnVucyBiZXR3ZWVuIGZpcnN0UnVuIGFuZCBsYXN0UnVuLCB1cGRhdGUgdGhlaXIgc3R5bGVcbiAgICBmb3IgKGxldCBpID0gZmlyc3RSdW4gPyBzdGFydC5saW5lSW5kZXggOiBzdGFydC5saW5lSW5kZXggKyAxOyBpIDw9IGVuZC5saW5lSW5kZXg7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbaV07XG4gICAgICAgIC8vIGxvb3AgZWFjaCBydW4gb2YgbGluZVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxpbmUucnVucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgcnVuID0gbGluZS5ydW5zW2pdO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uTGVzcyhzdGFydCwgeyBsaW5lSW5kZXg6IGksIHJ1bkluZGV4OiBqLCBjaGFySW5kZXg6IHJ1bi5yYW5nZVswXSB9KSAmJiBwb3NpdGlvbkxlc3MoeyBsaW5lSW5kZXg6IGksIHJ1bkluZGV4OiBqLCBjaGFySW5kZXg6IHJ1bi5yYW5nZVsxXSB9LCBlbmQpKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHJ1bi5yYW5nZVswXSA+IChmaXJzdFJ1biA/IGZpcnN0UnVuPy5yYW5nZVsxXSA6IC0xKSAmJiBydW4ucmFuZ2VbMV0gPCAobGFzdFJ1biA/IGxhc3RSdW4/LnJhbmdlWzBdIDogLTEpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhIGZ1bGwgcnVuIHRoYXQgd2lsbCBiZSByZS1zdHlsZWRcbiAgICAgICAgICAgICAgICBjaGFuZ2VSdW5TdHlsZShsaW5lLnJ1bnMsIGosIGxpbmUucnVuc1tqXS5yYW5nZSwgbmV3U3R5bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHJlLXN0eWxlIHRoZSBsYXN0IGxpbmVcbiAgICAvLyB0aGUgbGFzdCBzZWxlY3RlZCBwb3NpdGlvbiBpcyB0aGUgbGVmdCBwb3NpdGlvbiBvZiBlbmRcbiAgICBpZiAobGFzdFJ1bikge1xuICAgICAgICBjaGFuZ2VSdW5TdHlsZShsYXN0TGluZS5ydW5zLCBlbmQucnVuSW5kZXgsIFtsYXN0UnVuLnJhbmdlWzBdLCBlbmQuY2hhckluZGV4XSwgbmV3U3R5bGUpO1xuICAgIH1cbiAgICAvLyBhcyBzdHlsZSBoYXMgYmVlbiBjaGFuZ2VkLCBzZWwucnVuSW5kZXggY291bGQgaGF2ZSBjaGFuZ2VkIFxuICAgIHNlbC5zdGFydCA9IHVwZGF0ZVBvc2l0aW9uUnVuSW5kZXgobGluZXMsIHN0YXJ0KTtcbiAgICBzZWwuZW5kID0gdXBkYXRlUG9zaXRpb25SdW5JbmRleChsaW5lcywgc2VsLmVuZCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laV1JwZEdsdVp5NXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlsWkdsMGFXNW5MblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVWQkxFOUJRVThzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSU3hOUVVGTkxHRkJRV0VzUTBGQlF6dEJRVU4wUkN4UFFVRlBMRVZCUVVVc2JVSkJRVzFDTEVWQlFVVXNjVUpCUVhGQ0xFVkJRVEJGTEUxQlFVMHNVMEZCVXl4RFFVRkRPMEZCUXpkSkxFOUJRVThzUlVGQlJTeGpRVUZqTEVWQlFVVXNVVUZCVVN4RlFVRkZMSEZDUVVGeFFpeEZRVUZGTEhOQ1FVRnpRaXhGUVVGRkxIZENRVUYzUWl4RlFVRkZMR05CUVdNc1JVRkJSU3hoUVVGaExFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVXNhMEpCUVd0Q0xFVkJRVVVzVjBGQlZ5eEZRVUZGTEZkQlFWY3NSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVeXhGUVVGRkxGTkJRVk1zUlVGQlJTeHJRa0ZCYTBJc1JVRkJSU3haUVVGWkxFVkJRVVVzYTBKQlFXdENMRVZCUVVVc1owSkJRV2RDTEVWQlFVVXNjMEpCUVhOQ0xFVkJRVVVzVFVGQlRTeFJRVUZSTEVOQlFVTTdRVUZGYWxnc05FWkJRVFJHTzBGQlF6VkdMSEZGUVVGeFJUdEJRVU55UlN4elJVRkJjMFU3UVVGRGRFVXNLMFZCUVN0Rk8wRkJReTlGTEcxRlFVRnRSVHRCUVVOdVJTeE5RVUZOTEZWQlFWVXNUMEZCVHl4RFFVRkRMRXRCUVd0Q0xFVkJRVVVzUjBGQmFVSTdTVUZEZWtRc1RVRkJUU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVOeVF5eEpRVUZKTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSVHRSUVVOb1Fpd3dRa0ZCTUVJN1VVRkRNVUlzVFVGQlRTeFBRVUZQTEVkQlFXTTdXVUZEZGtJc1NVRkJTU3hGUVVGRkxFVkJRVVU3V1VGRFVpeEpRVUZKTEVWQlFVVXNSVUZCUlR0VFFVTllMRU5CUVVNN1VVRkRSaXhKUVVGSkxFOUJRVThzUTBGQlF5eFZRVUZWTEVWQlFVVTdXVUZEY0VJc1QwRkJUeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8xTkJRM0pFTzFGQlEwUXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03VVVGRE5VTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wdEJRMjVDTzFOQlFVMDdVVUZEU0N3eVIwRkJNa2M3VVVGRE0wY3NUVUZCVFN4UFFVRlBMRWRCUVVjc1lVRkJZU3hEUVVGRExFOUJRVThzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTTFReXhOUVVGTkxGRkJRVkVzUjBGQlJ5eGpRVUZqTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRE8xRkJSVGxETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1VVRkRlRU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkZOME1zSzBOQlFTdERPMUZCUXk5RExFZEJRVWNzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0UlFVTm9RaXhIUVVGSExFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTnFRaXhIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEVOQlFVTXNRMEZCUXp0TFFVTnlRanRCUVVOTUxFTkJRVU03UVVGRlJDd3JSa0ZCSzBZN1FVRkRMMFlzYlVWQlFXMUZPMEZCUTI1RkxEUkVRVUUwUkR0QlFVTTFSQ3hyUlVGQmEwVTdRVUZEYkVVc1RVRkJUU3hWUVVGVkxGTkJRVk1zUTBGQlF5eExRVUZyUWl4RlFVRkZMRWRCUVdsQ08wbEJRek5FTEUxQlFVMHNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdTVUZEYkVNc1NVRkJTU3hUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdVVUZEYUVJc05rVkJRVFpGTzFGQlF6ZEZMRWxCUVVrc1IwRkJSeXhEUVVGRExGTkJRVk1zUzBGQlN5eERRVUZETzFsQlFVVXNUMEZCVHp0UlFVVm9ReXhaUVVGWk8xRkJRMW9zU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEZUVNc1RVRkJUU3hoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRNME1zVFVGQlRTeFhRVUZYTEVkQlFVY3NZVUZCWVN4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRiRWNzU1VGQlNTeFhRVUZYTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVN1dVRkRka0lzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTnVReXhIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdVMEZEYmtJN1lVRkJUVHRaUVVOSUxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExGTkJRVk1zUTBGQlF5eFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1dVRkRja1FzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzFsQlF5OUNMRWRCUVVjc1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF6dFpRVU5vUWl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExGZEJRVmNzUTBGQlF6dFpRVU0xUWl4SFFVRkhMRU5CUVVNc1VVRkJVU3hIUVVGSExHbENRVUZwUWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRUUVVONlJUdExRVU5LTzFOQlFVMDdVVUZEU0N3clFrRkJLMEk3VVVGREwwSXNTVUZCU1N4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3V1VGRGFFSXNTVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVU3WjBKQlEyNUNMRzlDUVVGdlFqdG5Ra0ZEY0VJc1NVRkJTU3hIUVVGSExFTkJRVU1zVTBGQlV5eExRVUZMTEVOQlFVTXNSVUZCUlR0dlFrRkRja0lzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzI5Q1FVTXZRaXhIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdhVUpCUTI1Q08yRkJRMG83YVVKQlFVMDdaMEpCUTBnc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eHJRa0ZCYTBJc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTm9SU3hOUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVNMVF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU03WjBKQlEyWXNlVU5CUVhsRE8yZENRVU42UXl4SlFVRkpMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUdHZRa0ZETjBJc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0dlFrRkRhRUlzUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRPMjlDUVVObUxFMUJRVTBzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN2IwSkJRMmhFTEVsQlFVa3NUMEZCVHl4RlFVRkZPM2RDUVVOVUxFZEJRVWNzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dHhRa0ZEY0VNN2VVSkJRVTA3ZDBKQlEwZ3NPRU5CUVRoRE8zZENRVU01UXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hIUVVGSExFZEJRVWNzUTBGQlF5eFRRVUZUTEVkQlFVY3NRMEZCUXl4RFFVRkRPM0ZDUVVOd1F6dHBRa0ZEU2p0aFFVTktPMU5CUTBvN1lVRkJUVHRaUVVOSUxFMUJRVTBzVTBGQlV5eEhRVUZITEhGQ1FVRnhRaXhEUVVGRExFbEJRVWtzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0WlFVTnVSQ3hyUWtGQmEwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMWxCUXpkRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NhMEpCUVd0Q0xFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRaUVVOeVJDeE5RVUZOTEUxQlFVMHNSMEZCUnl4M1FrRkJkMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJSVGxFTEVsQlFVa3NUVUZCVFN4RlFVRkZPMmRDUVVOU0xFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8yRkJRemxDTzFOQlEwbzdTMEZEU2p0QlFVTk1MRU5CUVVNN1FVRkZSQ3c0UWtGQk9FSTdRVUZET1VJc1RVRkJUU3hWUVVGVkxGRkJRVkVzUTBGQlF5eExRVUZyUWl4RlFVRkZMRWRCUVdsQ0xFVkJRVVVzUjBGQlpUdEJRVVV2UlN4RFFVRkRPMEZCUlVRc2NVSkJRWEZDTzBGQlEzSkNMRTFCUVUwc1ZVRkJWU3hUUVVGVExFTkJRVU1zUzBGQmEwSXNSVUZCUlN4SFFVRnBRaXhGUVVGRkxGRkJRV2RDTzBGQlJXcEdMRU5CUVVNN1FVRkZSQ3h4UkVGQmNVUTdRVUZEY2tRc1RVRkJUU3hWUVVGVkxGVkJRVlVzUTBGQlF5eExRVUZyUWl4RlFVRkZMRWRCUVdsQ0xFVkJRVVVzVDBGQlpUdEpRVU0zUlN3MFFrRkJORUk3U1VGRE5VSXNTVUZCU1N4UFFVRlBMRXRCUVVzc1JVRkJSVHRSUVVGRkxFOUJRVThzUjBGQlJ5eERRVUZETzBsQlJTOUNMRFJEUVVFMFF6dEpRVU0xUXl4TlFVRk5MRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUTNKRExFMUJRVTBzUzBGQlN5eEhRVUZITEd0Q1FVRnJRaXhEUVVGRExFdEJRVXNzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTTNReXhOUVVGTkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRPMGxCUld4RExITklRVUZ6U0R0SlFVTjBTQ3hOUVVGTkxGZEJRVmNzUjBGQlJ5eDFRa0ZCZFVJc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU55UkN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzBsQlJYcENMR3RFUVVGclJEdEpRVU5zUkN4TlFVRk5MRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1zVDBGQlR5eEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUXpWRExFMUJRVTBzVVVGQlVTeEhRVUZITEdOQlFXTXNRMEZCUXl4UFFVRlBMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03U1VGRE9VTXNUVUZCVFN4WlFVRlpMRWRCUVVjc2MwSkJRWE5DTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTXpSU3hOUVVGTkxHRkJRV0VzUjBGQlJ5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RlFVRkZMRmxCUVZrc1EwRkJReXhEUVVGRE8wbEJRM1pFTEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETEVWQlFVVXNZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhyUWtGQmEwSTdTVUZGYWtVc09FZEJRVGhITzBsQlF6bEhMRWxCUVVrc1YwRkJWeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdVVUZETVVJc1RVRkJUU3hUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETEdGQlFXRXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVOeVJDeExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF5eEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMUZCUXpGRExHZERRVUZuUXp0UlFVVm9ReXhwUmtGQmFVWTdVVUZEYWtZc1NVRkJTU3hUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdXVUZEYUVJc1QwRkJUenRuUWtGRFNDeFRRVUZUTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNN1owSkJRM2hDTEZGQlFWRXNSVUZCUlN4dFFrRkJiVUk3WjBKQlF6ZENMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSTdaMEpCUXpsQ0xGTkJRVk1zUlVGQlJTeEpRVUZKTzJGQlEyeENMRU5CUVVNN1UwRkRURHRoUVVGTk8xbEJRMGdzVFVGQlRTeFRRVUZUTEVkQlFVY3NSMEZCUnl4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETzFsQlEycEVMRTlCUVU4N1owSkJRMGdzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4VFFVRlRPMmRDUVVONFFpeFJRVUZSTEVWQlFVVXNhVUpCUVdsQ0xFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1UwRkJVeXhEUVVGRE8yZENRVU0xUkN4VFFVRlRPMkZCUTFvc1EwRkJRenRUUVVOTU8wdEJRMG83U1VGRlJDeHZSVUZCYjBVN1NVRkRjRVVzU1VGQlNTeFhRVUZYTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRSUVVONFFpeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVjBGQlZ5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3V1VGRE4wTXNUVUZCVFN4RlFVRkZMRWRCUVVjc2MwSkJRWE5DTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0WlFVTnFSU3hMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXp0VFFVTXhRenRMUVVOS08wbEJSVVFzVFVGQlRTeFhRVUZYTEVkQlFVY3NjMEpCUVhOQ0xFTkJRVU1zVjBGQlZ5eERRVUZETEZkQlFWY3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFVkJRVVVzUzBGQlN5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUXk5R0xFMUJRVTBzWTBGQll5eEhRVUZITEZOQlFWTXNRMEZCUXl4WFFVRlhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGVFUXNUVUZCVFN4aFFVRmhMRWRCUVVjc1IwRkJSeXhEUVVGRExGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRKUVVNM1JDeExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR0ZCUVdFc1JVRkJSU3hEUVVGRExFVkJRVVVzWTBGQll5eERRVUZETEVOQlFVTTdTVUZGTDBNc05FTkJRVFJETzBsQlF6VkRMRWxCUVVrc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTzFGQlEyaENMRTlCUVU4N1dVRkRTQ3hUUVVGVExFVkJRVVVzWVVGQllUdFpRVU40UWl4UlFVRlJMRVZCUVVVc2JVSkJRVzFDTzFsQlF6ZENMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSTdXVUZET1VJc1UwRkJVeXhGUVVGRkxFbEJRVWs3VTBGRGJFSXNRMEZCUXp0TFFVTk1PMU5CUVUwN1VVRkRTQ3hOUVVGTkxGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRSUVVNeFF5eFBRVUZQTzFsQlEwZ3NVMEZCVXl4RlFVRkZMR0ZCUVdFN1dVRkRlRUlzVVVGQlVTeEZRVUZGTEdsQ1FVRnBRaXhEUVVGRExFdEJRVXNzUlVGQlJTeGhRVUZoTEVWQlFVVXNVMEZCVXl4RFFVRkRPMWxCUXpWRUxGTkJRVk03VTBGRFdpeERRVUZETzB0QlEwdzdRVUZEVEN4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxHdENRVUZyUWl4RFFVRkRMRXRCUVd0Q0xFVkJRVVVzVTBGQmQwSTdTVUZETTBVc1NVRkJTU3huUWtGQlowSXNRMEZCUXl4VFFVRlRMRU5CUVVNN1VVRkJSU3hQUVVGUExIRkNRVUZ4UWl4RFFVRkRPMGxCUXpsRUxFMUJRVTBzUlVGQlJTeExRVUZMTEVWQlFVVXNSMEZCUnl4RlFVRkZMRWRCUVVjc1UwRkJVeXhEUVVGRE8wbEJSV3BETEhkRFFVRjNRenRKUVVONFF5eE5RVUZOTEZsQlFWa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlF6VkRMRTFCUVUwc1MwRkJTeXhIUVVGSExHdENRVUZyUWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU12UXl4TlFVRk5MRTFCUVUwc1IwRkJSeXhaUVVGWkxFTkJRVU1zVlVGQlZTeERRVUZETzBsQlEzWkRMRTFCUVUwc1ZVRkJWU3hIUVVGSExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRlRU1zVFVGQlRTeHJRa0ZCYTBJc1IwRkJSeXhIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4VFFVRlRMRWRCUVVjc1EwRkJReXhEUVVGRE8wbEJSUzlFTEhkRFFVRjNRenRKUVVONFF5eE5RVUZOTEZsQlFWa3NSMEZCUnl4aFFVRmhMRU5CUVVNc1dVRkJXU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzBsQlEzaEVMRTFCUVUwc1YwRkJWeXhIUVVGSExHTkJRV01zUTBGQlF5eFZRVUZWTEVWQlFVVXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkZjRVFzSzBKQlFTdENPMGxCUXk5Q0xFMUJRVTBzWVVGQllTeEhRVUZITEZOQlFWTXNRMEZCUXl4WlFVRlpMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVU03U1VGRk0wUXNTVUZCU1N4TFFVRkxMRU5CUVVNc1UwRkJVeXhMUVVGTExFZEJRVWNzUTBGQlF5eFRRVUZUTEVWQlFVVTdVVUZEYmtNc01rTkJRVEpETzFGQlF6TkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1lVRkJZU3hEUVVGRExFTkJRVU03UzBGRGJrUTdVMEZCVFR0UlFVTklMR3REUVVGclF6dFJRVU5zUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVXNhMEpCUVd0Q0xFVkJRVVVzWVVGQllTeERRVUZETEVOQlFVTTdTMEZEY0VVN1NVRkZSQ3hKUVVGSkxGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFVkJRVVU3VVVGRGNrTXNUMEZCVHl4RlFVRkZMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTEZGQlFWRXNSVUZCUlN4dFFrRkJiVUlzUlVGQlJTeFRRVUZUTEVWQlFVVXNiVUpCUVcxQ0xFVkJRVVVzVTBGQlV5eEZRVUZGTEVsQlFVa3NSVUZCUlN4RFFVRkRPMHRCUTNwSU8xTkJRVTA3VVVGRFNDeDNRMEZCZDBNN1VVRkRlRU1zU1VGQlNTeFhRVUZYTEVOQlFVTXNWMEZCVnl4RFFVRkRPMWxCUTNoQ0xFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1UwRkJVeXhGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRk5CUVZNc1JVRkJSU3hKUVVGSkxFVkJRVVVzUTBGQlF6czdXVUZGZEVnc1QwRkJUeXhGUVVGRkxGTkJRVk1zUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZMRkZCUVZFc1JVRkJSU3haUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4VFFVRlRMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETzB0QlF6ZEhPMEZCUTB3c1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeDFRa0ZCZFVJc1EwRkJReXhMUVVGclFpeEZRVUZGTEVkQlFXdENMRVZCUVVVc1VVRkJORUk3U1VGRGVFY3NUVUZCVFN4TFFVRkxMRWRCUVVjc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGQlF6dEpRVU40UWl4TlFVRk5MRWRCUVVjc1IwRkJSeXh0UWtGQmJVSXNRMEZCUXl4TFFVRkxMRVZCUVVVc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlJTeERRVUZETzBsQlJXcEVMRTFCUVUwc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRla01zVFVGQlRTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU4wUXl4TlFVRk5MRkZCUVZFc1IwRkJkMElzVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBsQlEzQkhMRTFCUVUwc1QwRkJUeXhIUVVGM1FpeFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZGT1VZc01FSkJRVEJDTzBsQlF6RkNMRWxCUVVrc1VVRkJVU3hGUVVGRk8xRkJRMVlzYjBOQlFXOURPMUZCUTNCRExHTkJRV01zUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRMUVVOc1J6dEpRVVZFTERaRVFVRTJSRHRKUVVNM1JDeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdVVUZEY0VZc1RVRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNSQ0xIZENRVUYzUWp0UlFVTjRRaXhMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1dVRkRka01zVFVGQlRTeEhRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU42UWl4SlFVRkpMRmxCUVZrc1EwRkJReXhMUVVGTExFVkJRVVVzUlVGQlJTeFRRVUZUTEVWQlFVVXNRMEZCUXl4RlFVRkZMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVVVzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eEpRVUZKTEZsQlFWa3NRMEZCUXl4RlFVRkZMRk5CUVZNc1JVRkJSU3hEUVVGRExFVkJRVVVzVVVGQlVTeEZRVUZGTEVOQlFVTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4RlFVRkZMRWRCUVVjc1EwRkJReXhGUVVGRk8yZENRVU14U2l4clNFRkJhMGc3WjBKQlEyeElMRFJEUVVFMFF6dG5Ra0ZETlVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8yRkJRemxFTzFOQlEwbzdTMEZEU2p0SlFVVkVMSGxDUVVGNVFqdEpRVU42UWl4NVJFRkJlVVE3U1VGRGVrUXNTVUZCU1N4UFFVRlBMRVZCUVVVN1VVRkRWQ3hqUVVGakxFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NSVUZCUlN4SFFVRkhMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hIUVVGSExFTkJRVU1zVTBGQlV5eERRVUZETEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1MwRkROVVk3U1VGRlJDdzRSRUZCT0VRN1NVRkRPVVFzUjBGQlJ5eERRVUZETEV0QlFVc3NSMEZCUnl4elFrRkJjMElzUTBGQlF5eExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1NVRkRha1FzUjBGQlJ5eERRVUZETEVkQlFVY3NSMEZCUnl4elFrRkJjMElzUTBGQlF5eExRVUZMTEVWQlFVVXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRM0pFTEVOQlFVTWlmUT09IiwiLy8gZWRpdG9yIGNsYXNzLCBob2xkIHNlbGVjdGlvbiwgY2FyZXQsIGxheW91dCBhbmQgb3RoZXJzXG5pbXBvcnQgeyBGb250TWFuYWdlciB9IGZyb20gXCIuL2ZvbnRNYW5nZXJcIjtcbmltcG9ydCB7IExheW91dCB9IGZyb20gXCIuL2xheW91dFwiO1xuZXhwb3J0IGNsYXNzIEVkaXRvciB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuY2FyZXRQb3MgPSBbMCwgMF07XG4gICAgICAgIC8vIHNpemUgYW5kIGNvbnRleHRcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIC8vIGluaXQgb2Jqc1xuICAgICAgICB0aGlzLmZvbnRNYW5hZ2VyID0gbmV3IEZvbnRNYW5hZ2VyKCk7XG4gICAgICAgIHRoaXMubGF5b3V0ID0gbmV3IExheW91dCh0aGlzLmNvbnRleHQsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBoYW5kbGUgcmVzaXppbmcgZWRpdCBib3hcbiAgICByZXNpemUodywgaCkge1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVpXUnBkRzl5TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2YzNKakwyVmthWFJ2Y2k1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3g1UkVGQmVVUTdRVUZGZWtRc1QwRkJUeXhGUVVGRkxGZEJRVmNzUlVGQlJTeE5RVUZOTEdOQlFXTXNRMEZCUXp0QlFVTXpReXhQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNWVUZCVlN4RFFVRkRPMEZCUld4RExFMUJRVTBzVDBGQlR5eE5RVUZOTzBsQmJVSm1MRmxCUVZrc1RVRkJlVUlzUlVGQlJTeExRVUZoTEVWQlFVVXNUVUZCWXp0UlFVeHdSU3hoUVVGUkxFZEJRWEZDTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJUV2hETEcxQ1FVRnRRanRSUVVOdVFpeEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJRenRSUVVOeVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUXpWRExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMUZCUTI1Q0xFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMUZCUlhKQ0xGbEJRVms3VVVGRFdpeEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1YwRkJWeXhGUVVGRkxFTkJRVU03VVVGRGNrTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhKUVVGSkxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8xRkJRMnhFTEVsQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRE8wbEJReTlDTEVOQlFVTTdTVUZGUkN3eVFrRkJNa0k3U1VGRE0wSXNUVUZCVFN4RFFVRkRMRU5CUVZNc1JVRkJSU3hEUVVGVE8wbEJSVE5DTEVOQlFVTTdRMEZOU2lKOSIsIi8vIGhhbmRsZSBmb250IGxvYWRpbmcgYW5kIGZvbnQgbWV0cmljIGZldGNoaW5nXG5leHBvcnQgY2xhc3MgRm9udE1hbmFnZXIge1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWm05dWRFMWhibWRsY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OW1iMjUwVFdGdVoyVnlMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxDdERRVUVyUXp0QlFVVXZReXhOUVVGTkxFOUJRVThzVjBGQlZ6dERRVVYyUWlKOSIsImltcG9ydCB7IGJhY2tzcGFjZSwgY2hhbmdlU2VsZWN0ZWRUZXh0U3R5bGUsIGRlbGV0ZVNlbGVjdGVkVGV4dCwgaW5kZW50aXplLCBpbnNlcnRUZXh0LCBpdGVybWl6ZSwgbmV3bGluZSB9IGZyb20gXCIuL2VkaXRpbmdcIjtcbmltcG9ydCB7IGluUmFuZ2UsIHNwbGl0V29yZHMgfSBmcm9tIFwiLi9saW5lYnJlYWtcIjtcbmltcG9ydCB7IGRyYXdUZXh0UnVuUGFydCB9IGZyb20gXCIuL3JlbmRlclwiO1xuaW1wb3J0IHsgREVGQVVMVF9BTElHTk1FTlQsIERFRkFVTFRfQ1VSU09SX0NPTE9SLCBERUZBVUxUX0xJTkVfU1BBQ0lORywgREVGQVVMVF9URVhUX1NUWUxFLCBFWFRSQV9TWU1CT0xfSU5ERU5ULCBJTlZBTElEX0lOREVYX1ZBTFVFLCBJTlZBTElEX0xBWU9VVF9URVhUX1BPU0lUSU9OLCBJTlZBTElEX01FVFJJQywgTElORV9TUEFDSU5HLCBURVhUX0FMSUdOTUVOVCwgVE9QX01BUkdJTiB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBhZ2dyZWdhdGVXb3JkTWV0cmljLCBjbG9uZU9iaiwgZ2V0QWRqdXN0ZWRGb250U2l6ZSwgZ2V0TGVmdE1hcmdpbiwgZ2V0TGluZUVuZFBvc2l0aW9uLCBnZXRMaW5lU3BhY2luZywgZ2V0TmV4dFBvc2l0aW9uLCBnZXRQcmV2aW91c1Bvc2l0aW9uLCBnZXRTdHlsZUF0UG9zaXRpb24sIGdldFN0eWxlT2ZMaW5lLCBnZXRTdWJUZXh0LCBnZXRXcmFwcGVkTGluZUhlaWdodCwgZ2V0V3JhcHBlZExpbmVXaWR0aCwgaXNFbXB0eUxpbmUsIGlzRW1wdHlXYXJwcGVkTGluZSwgaXNMaW5lRW1wdHksIGlzUG9zSGVhZCwgaXNQb3NUYWlsLCBsaW5lYnJlYWssIG1lYXN1cmVUZXh0LCBzZWxlY3Rpb25Jc0VtcHR5LCB1cGRhdGVSdW5QYXJ0c0Zyb21Xb3JkcywgdXBkYXRlV29yZHNNZXRyaWMgfSBmcm9tIFwiLi91dGlsXCI7XG4vLyBMYXlvdXQgb2JqZWN0IHBlcnNpc3QgcmVzdWx0IG9mIGxheW91dCwgYW5kIHByb3ZpZGVzIHF1ZXJ5IGZvciBzZWxlY3Rpb24gYW5kIHJlbmRlcmluZ1xuZXhwb3J0IGNsYXNzIExheW91dCB7XG4gICAgY29uc3RydWN0b3IoY3R4LCBpbnB1dCkge1xuICAgICAgICAvLyBzaGFkb3cgdW4td3JhcHBlZCBkYXRhXG4gICAgICAgIHRoaXMubGluZVNwYWNpbmcgPSBMSU5FX1NQQUNJTkcuTk9STUFMO1xuICAgICAgICB0aGlzLmFsaWdubWVudCA9IFRFWFRfQUxJR05NRU5ULkxFRlQ7XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5zaG93RGVidWdSZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICAvLyBzdGF0ZSBkYXRhXG4gICAgICAgIHRoaXMuY2FyZXQgPSB7IGxpbmVJbmRleDogMCwgcnVuSW5kZXg6IC0xLCBjaGFySW5kZXg6IC0xLCBlbmRPZkxpbmU6IHRydWUgfTtcbiAgICAgICAgdGhpcy5sYXN0U3R5bGUgPSBERUZBVUxUX1RFWFRfU1RZTEU7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyByZXN1bHRhbnQgZGF0YVxuICAgICAgICB0aGlzLndyYXBwZWRMaW5lcyA9IFtdO1xuICAgICAgICB0aGlzLmxpbmVCcmVha1dpZHRoID0gODAwO1xuICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgOiBudWxsIGNvbnRleHQhJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW5pdFxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjdHg7XG4gICAgICAgIHRoaXMubGluZVNwYWNpbmcgPSBpbnB1dCA/IGlucHV0LmxpbmVTcGFjaW5nIDogREVGQVVMVF9MSU5FX1NQQUNJTkc7XG4gICAgICAgIHRoaXMuYWxpZ25tZW50ID0gaW5wdXQgPyBpbnB1dC5hbGlnbm1lbnQgOiBERUZBVUxUX0FMSUdOTUVOVDtcbiAgICAgICAgdGhpcy5saW5lcyA9IGlucHV0ID8gaW5wdXQubGluZXMgOiBbXTtcbiAgICAgICAgdGhpcy53cmFwcGVkTGluZXMgPSBbXTtcbiAgICAgICAgLy8gZmlsbCB3cmFwcGVkTGluZXMgYnkgZnVsbCBsYXlvdXRcbiAgICAgICAgdGhpcy5jYWxjTGF5b3V0KCk7XG4gICAgfVxuICAgIC8vIG9ubHkgbmVlZCB0byBwcm92aWRlIGxpbmUgbWV0cmljIGV4Y2VwdCBiYXNlbGluZVxuICAgIHdyYXBTaW5nbGVFbXB0eUxpbmUobGluZUlEKSB7XG4gICAgICAgIC8vIGNvbnN0IGRlZmF1bHRNZXRyaWMgPSBtZWFzdXJlVGV4dCh0aGlzLmNvbnRleHQhLCAnYWJjJywgREVGQVVMVF9URVhUX1NUWUxFKTtcbiAgICAgICAgY29uc3Qgd2xpbmUgPSB7XG4gICAgICAgICAgICBtZXRyaWM6IElOVkFMSURfTUVUUklDLFxuICAgICAgICAgICAgcGFyZW50TGluZTogbGluZUlELFxuICAgICAgICAgICAgaW5kZXg6IDAsXG4gICAgICAgICAgICBydW5QYXJ0czogW10sXG4gICAgICAgICAgICB3b3JkczogW10sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud3JhcHBlZExpbmVzLnB1c2god2xpbmUpO1xuICAgIH1cbiAgICB3cmFwU2luZ2xlTGluZShsb2dpY0xpbmUsIGxpbmVJRCwgYnJlYWtXaWR0aCwgbGVhZGluZ1NwYWNlKSB7XG4gICAgICAgIGNvbnN0IHdvcmRzID0gc3BsaXRXb3Jkcyhsb2dpY0xpbmUpO1xuICAgICAgICB1cGRhdGVXb3Jkc01ldHJpYyh0aGlzLmNvbnRleHQsIGxvZ2ljTGluZSwgd29yZHMpO1xuICAgICAgICBjb25zdCB3cmFwcGVkbGluZXMgPSBsaW5lYnJlYWsod29yZHMsIGJyZWFrV2lkdGgsIGxlYWRpbmdTcGFjZSk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd3JhcHBlZGxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBvbmVMaW5lb2ZXb3JkcyA9IHdyYXBwZWRsaW5lc1tqXTtcbiAgICAgICAgICAgIGNvbnN0IHJ1blBhcnRzID0gdXBkYXRlUnVuUGFydHNGcm9tV29yZHModGhpcy5jb250ZXh0LCBsb2dpY0xpbmUsIG9uZUxpbmVvZldvcmRzKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVNZXRyaWMgPSBhZ2dyZWdhdGVXb3JkTWV0cmljKG9uZUxpbmVvZldvcmRzKTtcbiAgICAgICAgICAgIGNvbnN0IHdsaW5lID0ge1xuICAgICAgICAgICAgICAgIG1ldHJpYzogbGluZU1ldHJpYyxcbiAgICAgICAgICAgICAgICBwYXJlbnRMaW5lOiBsaW5lSUQsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGosXG4gICAgICAgICAgICAgICAgcnVuUGFydHM6IHJ1blBhcnRzLFxuICAgICAgICAgICAgICAgIHdvcmRzOiBvbmVMaW5lb2ZXb3JkcywgLy8gdG8gY2hhbmdlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy53cmFwcGVkTGluZXMucHVzaCh3bGluZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZmlsbCB0aGlzLndyYXBwZWRMaW5lcyAobGF5b3V0IHJlc3VsdClcbiAgICB3cmFwbGluZXMoYnJlYWtXaWR0aCkge1xuICAgICAgICBpZiAodGhpcy5saW5lcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbG9naWNMaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChpc0xpbmVFbXB0eShsb2dpY0xpbmUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwU2luZ2xlRW1wdHlMaW5lKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXNpbmcgdGhlIGZpcnN0IHN0eWxlIG9mIHJ1blxuICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gbG9naWNMaW5lLnJ1bnNbMF0uc3R5bGU7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZGluZ1NwYWNlID0gbG9naWNMaW5lLnRleHRJbmRlbnQgPyB0aGlzLmdldEluZGVudFdpZHRoKGxvZ2ljTGluZS50ZXh0SW5kZW50LCBzdHlsZSkgOiAwO1xuICAgICAgICAgICAgICAgIHRoaXMud3JhcFNpbmdsZUxpbmUobG9naWNMaW5lLCBpLCB0aGlzLmxpbmVCcmVha1dpZHRoLCBsZWFkaW5nU3BhY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNhbGMgZW1wdHkgbGluZXMnIG1ldHJpYyBhY2MgdG8gaXRzIHByZXZpb3VzIGxpbmVcbiAgICAgICAgY29uc3QgZGVmYXVsdE1ldHJpeCA9IG1lYXN1cmVUZXh0KHRoaXMuY29udGV4dCwgJycsIERFRkFVTFRfVEVYVF9TVFlMRSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53cmFwcGVkTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbaV07XG4gICAgICAgICAgICBpZiAoaXNFbXB0eVdhcnBwZWRMaW5lKHdsaW5lKSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdsaW5lLm1ldHJpYyA9IGRlZmF1bHRNZXRyaXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3bGluZS5tZXRyaWMgPSBjbG9uZU9iaih0aGlzLndyYXBwZWRMaW5lc1tpIC0gMV0ubWV0cmljKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2FsY0xheW91dCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGVycm9yOiBjb250ZXh0IGlzIG51bGwhYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53cmFwcGVkTGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy53cmFwbGluZXModGhpcy5saW5lQnJlYWtXaWR0aCk7XG4gICAgICAgIHRoaXMudXBkYXRlQmFzZWxpbmVzKCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIGdldENoYXJXaWR0aChjaGFyLCBzdHlsZSkge1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gc3R5bGUuY29sb3I7XG4gICAgICAgIGNvbnN0IGFkanVzdGVkRm9udFNpemUgPSBnZXRBZGp1c3RlZEZvbnRTaXplKHN0eWxlKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSBhZGp1c3RlZEZvbnRTaXplICsgJ3B4ICcgKyBzdHlsZS5mb250O1xuICAgICAgICBjb25zdCB3ID0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KGNoYXIpLndpZHRoO1xuICAgICAgICByZXR1cm4gdztcbiAgICB9XG4gICAgZ2V0U3ltYm9sSW5kZW50V2lkdGgodGV4dEluZGVudCwgc3R5bGUpIHtcbiAgICAgICAgaWYgKCF0ZXh0SW5kZW50KVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IHRleHRJbmRlbnQuc3ltYm9sO1xuICAgICAgICBpZiAoc3ltYm9sKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gc3R5bGUuY29sb3I7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IHN0eWxlLmZvbnRTaXplICsgJ3B4ICcgKyBzdHlsZS5mb250O1xuICAgICAgICAgICAgY29uc3QgdyA9IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChzeW1ib2wpLndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBpbmRlbnQgd2lkdGggbWF5IGhhdmUgYXMgbWFueSBhcyAzIHBhcnRzXG4gICAgZ2V0SW5kZW50V2lkdGgodGV4dEluZGVudCwgc3R5bGUpIHtcbiAgICAgICAgaWYgKCF0ZXh0SW5kZW50KVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiB0ZXh0SW5kZW50LmluZGVudCArIHRoaXMuZ2V0U3ltYm9sSW5kZW50V2lkdGgodGV4dEluZGVudCwgc3R5bGUpICsgRVhUUkFfU1lNQk9MX0lOREVOVDtcbiAgICB9XG4gICAgLy8gb25jZSB3ZSBoYXZlIHdyYXBwZWQgbGluZXMsIGZyb20gdG9wIHRvIGJvdHRvbSwgY2FsYyBiYXNlbGluZSBiYXNlZCBvbiBsaW5lJ3MgY29udGVudCBtZXRyaWMoKVxuICAgIHVwZGF0ZUJhc2VsaW5lcygpIHtcbiAgICAgICAgLy8gaWYgbGF5b3V0IGhhcyBub3QgYmVlbiBjYWxsZWQsIGJhaWxcbiAgICAgICAgaWYgKCF0aGlzLndyYXBwZWRMaW5lcyB8fCB0aGlzLndyYXBwZWRMaW5lcy5sZW5ndGggPT09IDAgfHwgIXRoaXMuY29udGV4dClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IHkgPSBUT1BfTUFSR0lOOyAvLyBiYXNlbGluZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud3JhcHBlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkTGluZSA9IHRoaXMud3JhcHBlZExpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICB5ICs9IHdyYXBwZWRMaW5lLm1ldHJpYy5hc2NlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0Rlc2NlbnQgPSB0aGlzLndyYXBwZWRMaW5lc1tpIC0gMV0ubWV0cmljLmRlc2NlbnQ7XG4gICAgICAgICAgICAgICAgeSArPSBwcmV2aW91c0Rlc2NlbnQ7XG4gICAgICAgICAgICAgICAgeSArPSB3cmFwcGVkTGluZS5tZXRyaWMuYXNjZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc3RvcmU6IHkgaXMgdGhlIGJhc2VsaW5lIG9mIGN1cnJlbnQgd3JhcHBlZExpbmVcbiAgICAgICAgICAgIHdyYXBwZWRMaW5lLm1ldHJpYy5iYXNlbGluZSA9IHk7XG4gICAgICAgICAgICBpZiAoaXNFbXB0eVdhcnBwZWRMaW5lKHdyYXBwZWRMaW5lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGluZVdpZHRoID0gd3JhcHBlZExpbmUubWV0cmljLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgbG9naWNMaW5lID0gdGhpcy5saW5lc1t3cmFwcGVkTGluZS5wYXJlbnRMaW5lXTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRJbmRlbnQgPSBsb2dpY0xpbmUudGV4dEluZGVudDsgLy8gaW5oZXJpdCBwYXJlbnQncyBpbmRlbnRcbiAgICAgICAgICAgIC8vIGEgd2xpbmUgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMSBydW5QYXJ0XG4gICAgICAgICAgICBjb25zdCBmaXJzdFJ1blBhcnQgPSB3cmFwcGVkTGluZS5ydW5QYXJ0c1swXTtcbiAgICAgICAgICAgIGNvbnN0IHJ1biA9IGxvZ2ljTGluZS5ydW5zW2ZpcnN0UnVuUGFydC5ydW5JRF07XG4gICAgICAgICAgICBjb25zdCBpbmRlbnRTdHlsZSA9IHJ1bi5zdHlsZTtcbiAgICAgICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmFsaWdubWVudCA9PT0gVEVYVF9BTElHTk1FTlQuUklHSFQgfHwgdGhpcy5hbGlnbm1lbnQgPT09IFRFWFRfQUxJR05NRU5ULkNFTlRFUikge1xuICAgICAgICAgICAgICAgIGxldCBhY3R1YWxMaW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRJbmRlbnQgJiYgdGV4dEluZGVudC5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsTGluZVdpZHRoICs9ICh0aGlzLmdldFN5bWJvbEluZGVudFdpZHRoKHRleHRJbmRlbnQsIGluZGVudFN0eWxlKSArIEVYVFJBX1NZTUJPTF9JTkRFTlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0TWFyZ2luID0gZ2V0TGVmdE1hcmdpbihhY3R1YWxMaW5lV2lkdGgsIHRoaXMubGluZUJyZWFrV2lkdGgsIHRoaXMuYWxpZ25tZW50KTtcbiAgICAgICAgICAgICAgICB4ID0gbGVmdE1hcmdpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHN0b3JlOiB4IGlzIHRoZSBsZWZ0IHN0YXJ0aW5nIG9mIGN1cnJlbnQgd3JhcHBlZExpbmU/XG4gICAgICAgICAgICB3cmFwcGVkTGluZS5tZXRyaWMubGVmdCA9IHg7XG4gICAgICAgICAgICBpZiAodGV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgIHdyYXBwZWRMaW5lLm1ldHJpYy53aWR0aCArPSB0ZXh0SW5kZW50LmluZGVudDtcbiAgICAgICAgICAgICAgICBpZiAodGV4dEluZGVudC5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlZExpbmUubWV0cmljLndpZHRoICs9ICh0aGlzLmdldFN5bWJvbEluZGVudFdpZHRoKHRleHRJbmRlbnQsIGluZGVudFN0eWxlKSArIEVYVFJBX1NZTUJPTF9JTkRFTlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd3JhcHBlZExpbmUucnVuUGFydHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBydW5QYXJ0ID0gd3JhcHBlZExpbmUucnVuUGFydHNbal07XG4gICAgICAgICAgICAgICAgaWYgKCFydW5QYXJ0Lm1ldHJpYylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgYSBuZXcgd3JhcHBlZCBsaW5lLCBuZWVkIHRvIGhhbmRsZSBpbmRlbnRcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dEluZGVudCA9PT0gbnVsbCB8fCB0ZXh0SW5kZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0ZXh0SW5kZW50LmluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYWxpZ25tZW50ID09PSBURVhUX0FMSUdOTUVOVC5MRUZUIHx8IHRoaXMuYWxpZ25tZW50ID09PSBURVhUX0FMSUdOTUVOVC5KVVNUSUZZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCArPSB0ZXh0SW5kZW50LmluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluZGVudCBzeW1ib2xcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IHRleHRJbmRlbnQuc3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IHN0eWxlID0gcnVuUGFydC5ydW4uc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGluZGVudFN0eWxlLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gaW5kZW50U3R5bGUuZm9udFNpemUgKyAncHggJyArIGluZGVudFN0eWxlLmZvbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sV2lkdGggPSB0aGlzLmdldFN5bWJvbEluZGVudFdpZHRoKHRleHRJbmRlbnQsIGluZGVudFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlZExpbmUuaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KHN5bWJvbCwgeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKz0gc3ltYm9sV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25jZSBzeW1ib2wgaXMgYWRkZWQsIHdlIG5lZWQgc29tZSBleHRyYSBzcGFjZSBiZWZvcmUgc3RhcnQgdG8gZHJhdyByZWFsIHRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ICs9IEVYVFJBX1NZTUJPTF9JTkRFTlQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gc3RvcmU6IHggaXMgdGhlIHN0YXJ0aW5nIHBvcyBmb3IgdGhpcyBydW5QYXJ0XG4gICAgICAgICAgICAgICAgcnVuUGFydC5tZXRyaWMubGVmdCA9IHg7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBkcmF3IHRoZSByZWd1bGFyIHJ1blBhcnRcbiAgICAgICAgICAgICAgICAvLyBkcmF3VGV4dFJ1blBhcnQodGhpcy5jb250ZXh0LCBsb2dpY0xpbmUucnVucywgcnVuUGFydCwgeCwgeSk7XG4gICAgICAgICAgICAgICAgeCArPSBydW5QYXJ0Lm1ldHJpYy53aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgKz0gZ2V0TGluZVNwYWNpbmcodGhpcy5saW5lU3BhY2luZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNMYXlvdXRQb3NpdGlvblZhbGlkKHBvcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy53cmFwcGVkTGluZXMgfHwgIXRoaXMud3JhcHBlZExpbmVzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHBvcy53bGluZUluZGV4IDwgMCB8fCBwb3Mud2xpbmVJbmRleCA+ICgoX2EgPSB0aGlzLndyYXBwZWRMaW5lcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbcG9zLndsaW5lSW5kZXhdO1xuICAgICAgICBpZiAocG9zLnJ1blBhcnRJbmRleCA8IDAgfHwgcG9zLnJ1blBhcnRJbmRleCA+IHdsaW5lLnJ1blBhcnRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgcnVuUGFydCA9IHdsaW5lLnJ1blBhcnRzW3Bvcy5ydW5QYXJ0SW5kZXhdO1xuICAgICAgICBpZiAocG9zLmNoYXJJbmRleCA8IHJ1blBhcnQucmFuZ2VbMF0gfHwgcG9zLmNoYXJJbmRleCA+IHJ1blBhcnQucmFuZ2VbMV0pXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBnZXRGaXJzdENoYXJQb3NpdGlvbih3bGluZUluZGV4KSB7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF07XG4gICAgICAgIGlmIChpc0VtcHR5V2FycHBlZExpbmUod2xpbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBsaW5lSW5kZXg6IHdsaW5lLnBhcmVudExpbmUsIHJ1bkluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBjaGFySW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsIGVuZE9mTGluZTogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHdsaW5lLnBhcmVudExpbmUsXG4gICAgICAgICAgICBydW5JbmRleDogd2xpbmUucnVuUGFydHNbMF0ucnVuSUQsXG4gICAgICAgICAgICBjaGFySW5kZXg6IHdsaW5lLnJ1blBhcnRzWzBdLnJhbmdlWzBdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXb3JkQnlQb3NpdGlvbihwb3MpIHtcbiAgICAgICAgY29uc3QgbFBvcyA9IHRoaXMuZ2V0TGF5b3V0VGV4dFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbbFBvcy53bGluZUluZGV4XTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3bGluZS53b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgd29yZCA9IHdsaW5lLndvcmRzW2ldO1xuICAgICAgICAgICAgaWYgKHdvcmQucnVuUGFydHNbMF0ucmFuZ2VbMF0gPD0gcG9zLnJ1bkluZGV4ICYmIHBvcy5ydW5JbmRleCA8PSB3b3JkLnJ1blBhcnRzW3dvcmQucnVuUGFydHMubGVuZ3RoIC0gMV0ucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0V29yZFNlbGVjdGlvbihwb3MpIHtcbiAgICAgICAgY29uc3QgbFBvcyA9IHRoaXMuZ2V0TGF5b3V0VGV4dFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbbFBvcy53bGluZUluZGV4XTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3bGluZS53b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgd29yZCA9IHdsaW5lLndvcmRzW2ldO1xuICAgICAgICAgICAgaWYgKGluUmFuZ2UocG9zLmNoYXJJbmRleCwgW3dvcmQucnVuUGFydHNbMF0ucmFuZ2VbMF0sIHdvcmQucnVuUGFydHNbd29yZC5ydW5QYXJ0cy5sZW5ndGggLSAxXS5yYW5nZVsxXV0pKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHdvcmQgc2VsZWN0ZWQgaXMgOiAke3dvcmQudGV4dH1gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRDaGFyUG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVJbmRleDogd2xpbmUucGFyZW50TGluZSxcbiAgICAgICAgICAgICAgICAgICAgcnVuSW5kZXg6IHdvcmQucnVuUGFydHNbd29yZC5ydW5QYXJ0cy5sZW5ndGggLSAxXS5ydW5JRCxcbiAgICAgICAgICAgICAgICAgICAgY2hhckluZGV4OiB3b3JkLnJ1blBhcnRzW3dvcmQucnVuUGFydHMubGVuZ3RoIC0gMV0ucmFuZ2VbMV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IGdldE5leHRQb3NpdGlvbih0aGlzLmxpbmVzLCBlbmRDaGFyUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lSW5kZXg6IHdsaW5lLnBhcmVudExpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5JbmRleDogd29yZC5ydW5QYXJ0c1swXS5ydW5JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJJbmRleDogd29yZC5ydW5QYXJ0c1swXS5yYW5nZVswXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IG5leHRQb3NpdGlvbiA/IG5leHRQb3NpdGlvbiA6IGVuZENoYXJQb3NpdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYG5vIHdvcmQgc2VsZWN0ZWQhYCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGhpZ2hsaWdodCBzaG91bGQgY292ZXIgdGhlIGNoYXIgb2YgZW5kSW5kZXhcbiAgICByZW5kZXJTZWxlY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5jb250ZXh0IHx8ICF0aGlzLnNlbGVjdGlvbiB8fCBzZWxlY3Rpb25Jc0VtcHR5KHRoaXMuc2VsZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgUDAgPSB0aGlzLnNlbGVjdGlvbi5zdGFydDtcbiAgICAgICAgY29uc3QgUDEgPSB0aGlzLnNlbGVjdGlvbi5lbmQ7XG4gICAgICAgIGNvbnN0IHBvc0luZm8wID0gdGhpcy5nZXRDb29yZEluZm8oUDApO1xuICAgICAgICBjb25zdCBwb3NJbmZvMSA9IHRoaXMuZ2V0Q29vcmRJbmZvKFAxKTtcbiAgICAgICAgY29uc3QgV1AwID0gdGhpcy5nZXRMYXlvdXRUZXh0UG9zaXRpb24oUDApO1xuICAgICAgICBjb25zdCBXUDEgPSB0aGlzLmdldExheW91dFRleHRQb3NpdGlvbihQMSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDEwMCwyMDAsMC4zKSc7XG4gICAgICAgIGlmIChXUDAud2xpbmVJbmRleCA9PT0gV1AxLndsaW5lSW5kZXgpIHtcbiAgICAgICAgICAgIC8vIHNlbGVjdGlvbiBpcyBpbnNpZGUgYSBzaW5nbGUgd2xpbmVcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChwb3NJbmZvMC5sZWZ0LCBwb3NJbmZvMC50b3AsIHBvc0luZm8xLmxlZnQgLSBwb3NJbmZvMC5sZWZ0LCBnZXRXcmFwcGVkTGluZUhlaWdodCh0aGlzLndyYXBwZWRMaW5lc1tXUDAud2xpbmVJbmRleF0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIG9uIGRpZmZlcmVudCBsaW5lc1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KHBvc0luZm8wLmxlZnQsIHBvc0luZm8wLnRvcCwgZ2V0V3JhcHBlZExpbmVXaWR0aCh0aGlzLndyYXBwZWRMaW5lc1tXUDAud2xpbmVJbmRleF0pIC0gcG9zSW5mbzAubGVmdCwgZ2V0V3JhcHBlZExpbmVIZWlnaHQodGhpcy53cmFwcGVkTGluZXNbV1AwLndsaW5lSW5kZXhdKSk7XG4gICAgICAgICAgICAvLyBtaWRkbGUgZnVsbCBsaW5lc1xuICAgICAgICAgICAgaWYgKFdQMS53bGluZUluZGV4IC0gV1AwLndsaW5lSW5kZXggPiAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IFdQMC53bGluZUluZGV4ICsgMTsgaSA8IFdQMS53bGluZUluZGV4OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlkZGxlTGluZU1ldHJpYyA9IHRoaXMud3JhcHBlZExpbmVzW2ldLm1ldHJpYztcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBjaGFyIG9mIHRoaXMgd2xpbmVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBsZWZ0LCB0b3AsIGhlaWdodCB9ID0gdGhpcy5nZXRDb29yZEluZm8odGhpcy5nZXRGaXJzdENoYXJQb3NpdGlvbihpKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChsZWZ0LCB0b3AsIG1pZGRsZUxpbmVNZXRyaWMud2lkdGggLSBsZWZ0LCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgbGVmdCwgdG9wLCBoZWlnaHQgfSA9IHRoaXMuZ2V0Q29vcmRJbmZvKHRoaXMuZ2V0Rmlyc3RDaGFyUG9zaXRpb24oV1AxLndsaW5lSW5kZXgpKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGVuZExpbmVNZXRyaWMgPSB0aGlzLndyYXBwZWRMaW5lc1tXUDEud2xpbmVJbmRleF0ubWV0cmljO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KGxlZnQsIHRvcCwgcG9zSW5mbzEubGVmdCAtIGxlZnQsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG4gICAgY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyByZW5kZXIgdXNpbmcgc3RvcmVkIG1ldHJpYyBpbiBsYXlvdXRcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy53cmFwcGVkTGluZXMgfHwgdGhpcy53cmFwcGVkTGluZXMubGVuZ3RoID09PSAwIHx8ICF0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIGNsZWFyIGBzY3JlZW5gXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlclNlbGVjdGlvbigpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud3JhcHBlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkTGluZSA9IHRoaXMud3JhcHBlZExpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKGlzRW1wdHlXYXJwcGVkTGluZSh3cmFwcGVkTGluZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0SW5kZW50ID0gdGhpcy5saW5lc1t3cmFwcGVkTGluZS5wYXJlbnRMaW5lXS50ZXh0SW5kZW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGVudFN0eWxlID0gZ2V0U3R5bGVPZkxpbmUodGhpcy5saW5lcywgd3JhcHBlZExpbmUucGFyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRJbmRlbnQgPT09IG51bGwgfHwgdGV4dEluZGVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dEluZGVudC5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sID0gdGV4dEluZGVudC5zeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBpbmRlbnRTdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gaW5kZW50U3R5bGUuZm9udFNpemUgKyAncHggJyArIGluZGVudFN0eWxlLmZvbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xXaWR0aCA9IHRoaXMuZ2V0U3ltYm9sSW5kZW50V2lkdGgodGV4dEluZGVudCwgaW5kZW50U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdyYXBwZWRMaW5lLmluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KHN5bWJvbCwgdGV4dEluZGVudC5pbmRlbnQsIHdyYXBwZWRMaW5lLm1ldHJpYy5iYXNlbGluZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaW5lV2lkdGggPSB3cmFwcGVkTGluZS5tZXRyaWMud2lkdGg7XG4gICAgICAgICAgICBjb25zdCB5ID0gd3JhcHBlZExpbmUubWV0cmljLmJhc2VsaW5lO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0RlYnVnUmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgLy8gYXNjZW50XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAwLCAwLCAxKSc7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygwLCB5IC0gd3JhcHBlZExpbmUubWV0cmljLmFzY2VudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMDAwLCB5IC0gd3JhcHBlZExpbmUubWV0cmljLmFzY2VudCk7XG4gICAgICAgICAgICAgICAgLy8gYmFzZWxpbmVcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAyNTUsIDAsIDEpJztcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oMTAwMCwgeSk7XG4gICAgICAgICAgICAgICAgLy8gZGVzY2VudFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDI1NSwgMSknO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSArIHdyYXBwZWRMaW5lLm1ldHJpYy5kZXNjZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKDEwMDAsIHkgKyB3cmFwcGVkTGluZS5tZXRyaWMuZGVzY2VudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsb2dpY0xpbmUgPSB0aGlzLmxpbmVzW3dyYXBwZWRMaW5lLnBhcmVudExpbmVdO1xuICAgICAgICAgICAgY29uc3QgdGV4dEluZGVudCA9IGxvZ2ljTGluZS50ZXh0SW5kZW50OyAvLyBpbmhlcml0IHBhcmVudCdzIGluZGVudFxuICAgICAgICAgICAgLy8gYSB3bGluZSBzaG91bGQgaGF2ZSBhdCBsZWFzdCAxIHJ1blBhcnRcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0UnVuUGFydCA9IHdyYXBwZWRMaW5lLnJ1blBhcnRzWzBdO1xuICAgICAgICAgICAgY29uc3QgcnVuID0gbG9naWNMaW5lLnJ1bnNbZmlyc3RSdW5QYXJ0LnJ1bklEXTtcbiAgICAgICAgICAgIGNvbnN0IGluZGVudFN0eWxlID0gcnVuLnN0eWxlO1xuICAgICAgICAgICAgLy8gZGVidWcgb25seTogc2hvdyB0aGUgaW5kZW50YXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLmFsaWdubWVudCA9PT0gVEVYVF9BTElHTk1FTlQuUklHSFQgfHwgdGhpcy5hbGlnbm1lbnQgPT09IFRFWFRfQUxJR05NRU5ULkNFTlRFUikge1xuICAgICAgICAgICAgICAgIGxldCBhY3R1YWxMaW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRJbmRlbnQgJiYgdGV4dEluZGVudC5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsTGluZVdpZHRoICs9ICh0aGlzLmdldFN5bWJvbEluZGVudFdpZHRoKHRleHRJbmRlbnQsIGluZGVudFN0eWxlKSArIEVYVFJBX1NZTUJPTF9JTkRFTlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBsZWZ0IHNpZGUgb2Ygc3ltYm9sXG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdE1hcmdpbiA9IGdldExlZnRNYXJnaW4oYWN0dWFsTGluZVdpZHRoLCB0aGlzLmxpbmVCcmVha1dpZHRoLCB0aGlzLmFsaWdubWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0RlYnVnUmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAyNTUsIDAuMiknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSAtIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygwLCB5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyhsZWZ0TWFyZ2luLCB5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyhsZWZ0TWFyZ2luLCB5IC0gMTApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3cmFwcGVkTGluZS5ydW5QYXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1blBhcnQgPSB3cmFwcGVkTGluZS5ydW5QYXJ0c1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIXJ1blBhcnQubWV0cmljKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcnVuUGFydC5tZXRyaWMubGVmdDtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBhIG5ldyB3cmFwcGVkIGxpbmUsIG5lZWQgdG8gaGFuZGxlIGluZGVudFxuICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0SW5kZW50ID09PSBudWxsIHx8IHRleHRJbmRlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRleHRJbmRlbnQuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2wgPSB0ZXh0SW5kZW50LnN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gaW5kZW50U3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSBpbmRlbnRTdHlsZS5mb250U2l6ZSArICdweCAnICsgaW5kZW50U3R5bGUuZm9udDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xXaWR0aCA9IHRoaXMuZ2V0U3ltYm9sSW5kZW50V2lkdGgodGV4dEluZGVudCwgaW5kZW50U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3cmFwcGVkTGluZS5pbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoc3ltYm9sLCB4IC0gc3ltYm9sV2lkdGggLSBFWFRSQV9TWU1CT0xfSU5ERU5ULCB5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBkcmF3IHRoZSByZWd1bGFyIHJ1blBhcnRcbiAgICAgICAgICAgICAgICBkcmF3VGV4dFJ1blBhcnQodGhpcy5jb250ZXh0LCBsb2dpY0xpbmUsIHJ1blBhcnQsIHgsIHkpO1xuICAgICAgICAgICAgICAgIC8vIGRlYnVnIG9ubHk6IHNob3cgcnVuUGFydCBib3VuZHNcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG93RGVidWdSZW5kZXJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGogJSAyID8gJ3JnYmEoMCwgMjU1LCAyNTUsIDAuMyknIDogJ3JnYmEoMjU1LCAyNTUsIDAsIDAuMyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCwgeSAtIHJ1blBhcnQubWV0cmljLmFzY2VudCwgcnVuUGFydC5tZXRyaWMud2lkdGgsIHJ1blBhcnQubWV0cmljLmFzY2VudCArIHJ1blBhcnQubWV0cmljLmRlc2NlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4LCB5IC0gcnVuUGFydC5tZXRyaWMuYXNjZW50LCBydW5QYXJ0Lm1ldHJpYy53aWR0aCwgcnVuUGFydC5tZXRyaWMuYXNjZW50ICsgcnVuUGFydC5tZXRyaWMuZGVzY2VudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbmRlciBsaW5lIGJyZWFrIHdpZHRoXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLmxpbmVCcmVha1dpZHRoLCAtMSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5saW5lQnJlYWtXaWR0aCwgMjUwMCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgLy8gcmVuZGVyIHNlbGVjdGlvblxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIGRyYXcgYWxsIHJ1blBhcnRzIGluIHRoZSBzZWxlY3Rpb24gIFxuICAgICAgICB9XG4gICAgfVxuICAgIGluY3JlYXNlTGluZUJyZWFrV2lkdGgoKSB7XG4gICAgICAgIHRoaXMubGluZUJyZWFrV2lkdGggKz0gMTA7XG4gICAgfVxuICAgIGRlY3JlYXNlTGluZUJyZWFrV2lkdGgoKSB7XG4gICAgICAgIHRoaXMubGluZUJyZWFrV2lkdGggLT0gMTA7XG4gICAgICAgIGlmICh0aGlzLmxpbmVCcmVha1dpZHRoIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5saW5lQnJlYWtXaWR0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0TGluZUJyZWFrV2lkdGgodykge1xuICAgICAgICB0aGlzLmxpbmVCcmVha1dpZHRoID0gdztcbiAgICB9XG4gICAgLy8gdXBkYXRlIGNhcmV0IGJ5IHRvIHRoZSBwb3NpdGlvbiAoeCwgeSlcbiAgICB1cGRhdGVDYXJldCh4LCB5KSB7XG4gICAgICAgIGNvbnN0IGxwb3MgPSB0aGlzLmdldFRleHRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgaWYgKGxwb3MubGluZUluZGV4ICE9PSBJTlZBTElEX0lOREVYX1ZBTFVFKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmV0ID0gbHBvcztcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRDb29yZEluZm8ocG9zKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IHdwb3MgPSB0aGlzLmdldExheW91dFRleHRQb3NpdGlvbihwb3MpO1xuICAgICAgICAvLyBmaW5kIHRoZSBwb3NpdGlvbiBpbiBsYXlvdXQgc3BhY2VcbiAgICAgICAgY29uc3Qgd2xpbmUgPSB0aGlzLndyYXBwZWRMaW5lc1t3cG9zLndsaW5lSW5kZXhdO1xuICAgICAgICBpZiAoIXdsaW5lKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBpbnZhbGlkIHdsaW5lSW5kZXggd2hlbiBjYWxsIGdldENvb3JkSW5mb2ApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvcCA9IHdsaW5lLm1ldHJpYy5iYXNlbGluZSAtIHdsaW5lLm1ldHJpYy5hc2NlbnQ7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHdsaW5lLm1ldHJpYy5hc2NlbnQgKyB3bGluZS5tZXRyaWMuZGVzY2VudDtcbiAgICAgICAgLy8gZW1wdHkgbGluZVxuICAgICAgICBpZiAoaXNFbXB0eVdhcnBwZWRMaW5lKHdsaW5lKSkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZU9mTGluZSh0aGlzLmxpbmVzLCB3bGluZS5wYXJlbnRMaW5lKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRJbmRlbnQgPSB0aGlzLmxpbmVzW3dsaW5lLnBhcmVudExpbmVdLnRleHRJbmRlbnQ7XG4gICAgICAgICAgICBsZXQgbGVmdCA9IHRleHRJbmRlbnQgPyB0ZXh0SW5kZW50LmluZGVudCArIHRoaXMuZ2V0Q2hhcldpZHRoKHRleHRJbmRlbnQuc3ltYm9sLCBzdHlsZSkgKyBFWFRSQV9TWU1CT0xfSU5ERU5UIDogMDtcbiAgICAgICAgICAgIHJldHVybiB7IGxlZnQsIHRvcCwgaGVpZ2h0IH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBjYXJldCBpcyBlbmQgb2YgbGluZSBmb3Igd3BvcywgdGhhdCBtZWFucyB0aGlzIGlzIHRoZSBsYXN0IHdsaW5lIG9mIHRoZSBsb2dpYyBsaW5lXG4gICAgICAgIGlmICh3cG9zLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgcnVuUGFydCA9IHdsaW5lLnJ1blBhcnRzW3dsaW5lLnJ1blBhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9ICgoX2EgPSBydW5QYXJ0Lm1ldHJpYykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlZnQpICsgcnVuUGFydC5tZXRyaWMud2lkdGg7XG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0LCB0b3AsIGhlaWdodCB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJ1blBhcnQgPSB3bGluZS5ydW5QYXJ0c1t3cG9zLnJ1blBhcnRJbmRleF07XG4gICAgICAgIC8vIGZpbmQgdGhlIGNoYXIgcG9zaXRpb25cbiAgICAgICAgY29uc3QgbG9naWNMaW5lID0gdGhpcy5saW5lc1t3bGluZS5wYXJlbnRMaW5lXTtcbiAgICAgICAgY29uc3QgcnVuID0gbG9naWNMaW5lLnJ1bnNbcnVuUGFydC5ydW5JRF07XG4gICAgICAgIGxldCBsZWZ0ID0gKF9iID0gcnVuUGFydC5tZXRyaWMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5sZWZ0O1xuICAgICAgICBmb3IgKGxldCBpID0gcnVuUGFydC5yYW5nZVswXTsgaSA8IHdwb3MuY2hhckluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXIgPSBnZXRTdWJUZXh0KGxvZ2ljTGluZSwgW2ksIGldKTtcbiAgICAgICAgICAgIGNvbnN0IGNoYXJXaWR0aCA9IHRoaXMuZ2V0Q2hhcldpZHRoKGNoYXIsIHJ1bi5zdHlsZSk7XG4gICAgICAgICAgICBsZWZ0ICs9IGNoYXJXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBsZWZ0LCB0b3AsIGhlaWdodCB9O1xuICAgIH1cbiAgICAvLyB1cGRhdGUgY2FyZXQgdG8gdGhlICh4LCB5KSBpcyBwb2ludGluZyB0b1xuICAgIGdldEN1cnNvckluZm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvb3JkSW5mbyh0aGlzLmNhcmV0KTtcbiAgICB9XG4gICAgZ2V0SGVhZFRleHRQb3NpdGlvbih3bGluZSkge1xuICAgICAgICBpZiAoaXNFbXB0eVdhcnBwZWRMaW5lKHdsaW5lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldExpbmVFbmRQb3NpdGlvbih3bGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IHRoZSBmaXJzdCBydW5QYXJ0XG4gICAgICAgIGNvbnN0IHJ1blBhcnQgPSB3bGluZS5ydW5QYXJ0c1swXTtcbiAgICAgICAgY29uc3QgcnVuSUQgPSBydW5QYXJ0LnJ1bklEO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluZUluZGV4OiB3bGluZS5wYXJlbnRMaW5lLFxuICAgICAgICAgICAgcnVuSW5kZXg6IHJ1bklELFxuICAgICAgICAgICAgY2hhckluZGV4OiBydW5QYXJ0LnJhbmdlWzBdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyB0YWlsIG9mIGEgd2xpbmUgaXMgbm90IG5lY2Vzc2FyaWx5IGEgRU9MXG4gICAgZ2V0VGFpbFRleHRQb3NpdGlvbih3bGluZSkge1xuICAgICAgICAvLyBpZiBpdCdzIGVtcHR5LCBkZWZpbml0ZWx5IEVPTFxuICAgICAgICBpZiAoaXNFbXB0eVdhcnBwZWRMaW5lKHdsaW5lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldExpbmVFbmRQb3NpdGlvbih3bGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IHRoZSBsYXN0IHJ1blBhcnQgb2YgdGhpcyB3bGluZVxuICAgICAgICBjb25zdCBydW5QYXJ0ID0gd2xpbmUucnVuUGFydHNbd2xpbmUucnVuUGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGxhc3RDaGFySW5kZXggPSBydW5QYXJ0LnJhbmdlWzFdO1xuICAgICAgICBjb25zdCBsb2dpY0xpbmUgPSB0aGlzLmxpbmVzW3dsaW5lLnBhcmVudExpbmVdO1xuICAgICAgICBpZiAobGFzdENoYXJJbmRleCA9PT0gbG9naWNMaW5lLnRleHQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgLy8gRU9MXG4gICAgICAgICAgICByZXR1cm4gZ2V0TGluZUVuZFBvc2l0aW9uKHdsaW5lKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpdCdzIG5vdCBFT0xcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbmVJbmRleDogd2xpbmUucGFyZW50TGluZSxcbiAgICAgICAgICAgIHJ1bkluZGV4OiBydW5QYXJ0LnJ1bklELFxuICAgICAgICAgICAgY2hhckluZGV4OiBsYXN0Q2hhckluZGV4LFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBnaXZlbiBhICh4LCB5KSwgY2FsYyB0aGUgbG9naWMgdGV4dCBwb3NpdGlvblxuICAgIGdldFRleHRQb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKCF0aGlzLndyYXBwZWRMaW5lcyB8fCB0aGlzLndyYXBwZWRMaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGxheW91dCBoYXMgbm90IGJlZW4gY2FsbGVkIWApO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgcnVuSW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb29wIGFsbCB3bGluZXMgdG8gbG9jYXRlICB3bGluZVxuICAgICAgICBsZXQgbGluZUluZGV4ID0gSU5WQUxJRF9JTkRFWF9WQUxVRTtcbiAgICAgICAgbGV0IHdsaW5lSW5kZXggPSBJTlZBTElEX0lOREVYX1ZBTFVFO1xuICAgICAgICBjb25zdCBsaW5lR2FwID0gZ2V0TGluZVNwYWNpbmcodGhpcy5saW5lU3BhY2luZyk7XG4gICAgICAgIC8vIHJvdW5kIGJvdW5kYXJ5IHZhbHVlc1xuICAgICAgICBjb25zdCBmaXJzdFdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbMF07XG4gICAgICAgIGNvbnN0IGxhc3RXbGluZSA9IHRoaXMud3JhcHBlZExpbmVzW3RoaXMud3JhcHBlZExpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoeSA8IGZpcnN0V2xpbmUubWV0cmljLmJhc2VsaW5lIC0gZmlyc3RXbGluZS5tZXRyaWMuYXNjZW50KSB7XG4gICAgICAgICAgICBsaW5lSW5kZXggPSBmaXJzdFdsaW5lLnBhcmVudExpbmU7XG4gICAgICAgICAgICB3bGluZUluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh5ID4gbGFzdFdsaW5lLm1ldHJpYy5iYXNlbGluZSArIGxhc3RXbGluZS5tZXRyaWMuZGVzY2VudCkge1xuICAgICAgICAgICAgbGluZUluZGV4ID0gbGFzdFdsaW5lLnBhcmVudExpbmU7XG4gICAgICAgICAgICB3bGluZUluZGV4ID0gdGhpcy53cmFwcGVkTGluZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53cmFwcGVkTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3bGluZSA9IHRoaXMud3JhcHBlZExpbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldHJpYyA9IHdsaW5lLm1ldHJpYztcbiAgICAgICAgICAgICAgICBpZiAobWV0cmljLmJhc2VsaW5lIC0gbWV0cmljLmFzY2VudCAtIDAuNSAqIGxpbmVHYXAgPD0geSAmJiB5IDw9IG1ldHJpYy5iYXNlbGluZSArIG1ldHJpYy5kZXNjZW50ICsgMC41ICogbGluZUdhcCkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lSW5kZXggPSB3bGluZS5wYXJlbnRMaW5lO1xuICAgICAgICAgICAgICAgICAgICB3bGluZUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCc/Pz8/Pz8/Pz8/Pz8nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoeCwgeSkgaGl0IGEgZW1wdHkgbGluZSwgb25seSBvbiBwb3NpdGlvbiBpcyB2YWxpZFxuICAgICAgICBpZiAod2xpbmVJbmRleCAhPT0gSU5WQUxJRF9JTkRFWF9WQUxVRSAmJiBpc0VtcHR5V2FycHBlZExpbmUodGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF0pKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpbmVJbmRleDogdGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF0ucGFyZW50TGluZSxcbiAgICAgICAgICAgICAgICBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSxcbiAgICAgICAgICAgICAgICBjaGFySW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgZW5kT2ZMaW5lOiB0cnVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb29wIGVhY2ggcnVuUGFydCBvZiB0aGlzIHdsaW5lIHRvIGxvY2F0ZSBjaGFyYWN0ZXJcbiAgICAgICAgbGV0IHJ1bkluZGV4ID0gSU5WQUxJRF9JTkRFWF9WQUxVRTtcbiAgICAgICAgbGV0IGNoYXJJbmRleCA9IElOVkFMSURfSU5ERVhfVkFMVUU7XG4gICAgICAgIGlmIChsaW5lSW5kZXggIT09IElOVkFMSURfSU5ERVhfVkFMVUUpIHtcbiAgICAgICAgICAgIC8vIGlmIHggaXMgbGVmdC9yaWdodCB0byB0aGUgbGluZSwgc2V0IHRvIGhlYWQvdGFpbFxuICAgICAgICAgICAgY29uc3QgbGluZU1ldHJpYyA9IHRoaXMud3JhcHBlZExpbmVzW3dsaW5lSW5kZXhdLm1ldHJpYztcbiAgICAgICAgICAgIGlmICh4IDwgKGxpbmVNZXRyaWMgPT09IG51bGwgfHwgbGluZU1ldHJpYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogbGluZU1ldHJpYy5sZWZ0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEhlYWRUZXh0UG9zaXRpb24odGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoeCA+IChsaW5lTWV0cmljID09PSBudWxsIHx8IGxpbmVNZXRyaWMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxpbmVNZXRyaWMubGVmdCkgKyAobGluZU1ldHJpYyA9PT0gbnVsbCB8fCBsaW5lTWV0cmljID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsaW5lTWV0cmljLndpZHRoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRhaWxUZXh0UG9zaXRpb24odGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vcCBlYWNoIHJ1blBhcnQgdG8gbG9jYXRlICh4LHkpXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndyYXBwZWRMaW5lc1t3bGluZUluZGV4XS5ydW5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBydW5QYXJ0ID0gdGhpcy53cmFwcGVkTGluZXNbd2xpbmVJbmRleF0ucnVuUGFydHNbaV07XG4gICAgICAgICAgICAgICAgICAgIHJ1bkluZGV4ID0gcnVuUGFydC5ydW5JRDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9naWNMaW5lID0gdGhpcy5saW5lc1tsaW5lSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBydW4gPSBsb2dpY0xpbmUucnVuc1tydW5QYXJ0LnJ1bklEXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gKF9hID0gcnVuUGFydC5tZXRyaWMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gcnVuUGFydC5yYW5nZVswXTsgaiA8PSBydW5QYXJ0LnJhbmdlWzFdOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1lYXN1cmUgY2hhciB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgcnVuVGV4dCA9IGdldFN1YlRleHQobG9naWNMaW5lLCBydW4ucmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhciA9IGdldFN1YlRleHQobG9naWNMaW5lLCBbaiwgal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhcldpZHRoID0gdGhpcy5nZXRDaGFyV2lkdGgoY2hhciwgcnVuLnN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4IDwgc3RhcnQgKyBjaGFyV2lkdGggKiAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYXJldCBpcyBmcm9udCBvZiBmaXJzdCBjaGFyOiB0ZXh0W3JhbmdlWzBdXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJJbmRleCA9IGo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGluZUluZGV4LCBydW5JbmRleCwgY2hhckluZGV4IH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4ID49IHN0YXJ0ICsgY2hhcldpZHRoICogMC41ICYmIHggPD0gc3RhcnQgKyBjaGFyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGlzIHRoZSBsYXN0IGNoYXIgb2YgdGhpcyBydW5QYXJ0LCBwdXNoIHRvIG5leHQgcnVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IHJ1blBhcnQucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bkluZGV4ICE9PSBsb2dpY0xpbmUucnVucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBsaW5lSW5kZXgsIHJ1bkluZGV4OiBydW5JbmRleCArIDEsIGNoYXJJbmRleDogbG9naWNMaW5lLnJ1bnNbcnVuSW5kZXggKyAxXS5yYW5nZVswXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGluZUluZGV4LCBydW5JbmRleDogLTEsIGNoYXJJbmRleDogLTEsIGVuZE9mTGluZTogdHJ1ZSB9OyAvLyA/Pz8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJJbmRleCA9IGogKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBsaW5lSW5kZXgsIHJ1bkluZGV4LCBjaGFySW5kZXggfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArPSBjaGFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVJbmRleCA9PT0gSU5WQUxJRF9JTkRFWF9WQUxVRSB8fCBjaGFySW5kZXggPT09IElOVkFMSURfSU5ERVhfVkFMVUUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBpbnZhbGlkIGxpbmVJbmRleCBvciBjaGFySW5kZXghYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbmVJbmRleCxcbiAgICAgICAgICAgIHJ1bkluZGV4LFxuICAgICAgICAgICAgY2hhckluZGV4LFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBtYXAgZGF0YSBwb3NpdGlvbihsb2dpYyBwb3NpdGlvbiBvZiBhIHNwZWNpZmljIGxvY2F0aW9uIGluIHRleHQpIHRvIGxheW91dCBwb3NpdGlvbihsb2dpYyBwb3NpdGlvbiBsYXlvdXQtZWQgdGV4dCB3aXRoIG1ldHJpYylcbiAgICBnZXRMYXlvdXRUZXh0UG9zaXRpb24odGV4dFBvcykge1xuICAgICAgICBpZiAoIXRoaXMud3JhcHBlZExpbmVzKVxuICAgICAgICAgICAgcmV0dXJuIElOVkFMSURfTEFZT1VUX1RFWFRfUE9TSVRJT047XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZTogaWYgY2FyZXQgaXMgYXQgZW5kIG9mIGxpbmUsIHRoZW4gaXQgd2lsbCBtYXAgdG8gd2xpbmUncyBlbmQgb2YgbGluZSwgdGhpcyBpcyB0aGUgb25seSBjYXNlIGEgd2xpbmUgaXMgZW9sXG4gICAgICAgIGlmICh0ZXh0UG9zLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMud3JhcHBlZExpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2xpbmUgPSB0aGlzLndyYXBwZWRMaW5lc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAod2xpbmUucGFyZW50TGluZSA9PT0gdGV4dFBvcy5saW5lSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdsaW5lSW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5QYXJ0SW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFySW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRPZkxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNhbGMgd2xpbmUgICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud3JhcHBlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB3bGluZSA9IHRoaXMud3JhcHBlZExpbmVzW2ldO1xuICAgICAgICAgICAgaWYgKHdsaW5lLnBhcmVudExpbmUgIT09IHRleHRQb3MubGluZUluZGV4KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3bGluZS5ydW5QYXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1blBhcnQgPSB3bGluZS5ydW5QYXJ0c1tqXTtcbiAgICAgICAgICAgICAgICBpZiAocnVuUGFydC5ydW5JRCA9PT0gdGV4dFBvcy5ydW5JbmRleCAmJiB0ZXh0UG9zLmNoYXJJbmRleCA+PSBydW5QYXJ0LnJhbmdlWzBdICYmIHRleHRQb3MuY2hhckluZGV4IDw9IHJ1blBhcnQucmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdsaW5lSW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5QYXJ0SW5kZXg6IGosXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFySW5kZXg6IHRleHRQb3MuY2hhckluZGV4LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgICBjb25zb2xlLmVycm9yKGBmYWlsIHdoZW4gY2FsbCBnZXRMYXlvdXRUZXh0UG9zaXRpb24gd2l0aCB0ZXh0UG9zOmApO1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXh0UG9zKTtcbiAgICAgICAgcmV0dXJuIElOVkFMSURfTEFZT1VUX1RFWFRfUE9TSVRJT047XG4gICAgfVxuICAgIGlzQ2FyZXRMaW5lSGVhZCgpIHtcbiAgICAgICAgcmV0dXJuIGlzUG9zSGVhZCh0aGlzLmNhcmV0KTtcbiAgICB9XG4gICAgaXNDYXJldExpbmVUYWlsKCkge1xuICAgICAgICByZXR1cm4gaXNQb3NUYWlsKHRoaXMuY2FyZXQpO1xuICAgIH1cbiAgICBnZXRDYXJldENvbG9yKCkge1xuICAgICAgICBpZiAoaXNFbXB0eUxpbmUodGhpcy5saW5lc1t0aGlzLmNhcmV0LmxpbmVJbmRleF0pKVxuICAgICAgICAgICAgcmV0dXJuIERFRkFVTFRfQ1VSU09SX0NPTE9SO1xuICAgICAgICByZXR1cm4gZ2V0U3R5bGVBdFBvc2l0aW9uKHRoaXMubGluZXMsIHRoaXMuY2FyZXQpLmNvbG9yO1xuICAgIH1cbiAgICBpbnNlcnRUZXh0QXRDYXJldChjb250ZW50KSB7XG4gICAgICAgIC8vIG1vdmUgZm9yd2FyZCBjYXJldCwgc2hvdWxkIGJlIGNvbXB1dGVkIGJ5IHRoZSBpbnNlcnRpb24gZnVuY1xuICAgICAgICB0aGlzLmNhcmV0ID0gaW5zZXJ0VGV4dCh0aGlzLmxpbmVzLCB0aGlzLmNhcmV0LCBjb250ZW50KTtcbiAgICAgICAgdGhpcy5jYWxjTGF5b3V0KCk7XG4gICAgfVxuICAgIG5ld2xpbmVBdENhcmV0KCkge1xuICAgICAgICBuZXdsaW5lKHRoaXMubGluZXMsIHRoaXMuY2FyZXQpO1xuICAgICAgICB0aGlzLmNhbGNMYXlvdXQoKTtcbiAgICB9XG4gICAgYmFja3NwYWNlQXRDYXJldCgpIHtcbiAgICAgICAgYmFja3NwYWNlKHRoaXMubGluZXMsIHRoaXMuY2FyZXQpO1xuICAgICAgICB0aGlzLmNhbGNMYXlvdXQoKTtcbiAgICB9XG4gICAgLy8gaXRlcm1pemVkIHdpdGggYSBuZXcgaW5kZW50IG9ialxuICAgIGl0ZXJtaXplTGluZUF0Q2FyZXQoaWR0KSB7XG4gICAgICAgIGl0ZXJtaXplKHRoaXMubGluZXMsIHRoaXMuY2FyZXQsIGlkdCk7XG4gICAgICAgIHRoaXMuY2FsY0xheW91dCgpO1xuICAgIH1cbiAgICAvLyBjaGFuZ2UgaW5kZW50YXRpb25cbiAgICBpbmRlbnRMaW5lQXRDYXJldChpbmRlbnQpIHtcbiAgICAgICAgaW5kZW50aXplKHRoaXMubGluZXMsIHRoaXMuY2FyZXQsIGluZGVudCk7XG4gICAgICAgIHRoaXMuY2FsY0xheW91dCgpO1xuICAgIH1cbiAgICAvLyBtb3ZlIGNhcmV0IGJ5IG9uZSBjaGFyYWN0ZXJcbiAgICBtb3ZlQ2FyZXRMZWZ0KCkge1xuICAgICAgICBjb25zdCBwcmUgPSBnZXRQcmV2aW91c1Bvc2l0aW9uKHRoaXMubGluZXMsIHRoaXMuY2FyZXQpO1xuICAgICAgICBpZiAocHJlKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmV0ID0gcHJlO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1vdmVDYXJldFJpZ2h0KCkge1xuICAgICAgICBjb25zdCBuZXh0ID0gZ2V0TmV4dFBvc2l0aW9uKHRoaXMubGluZXMsIHRoaXMuY2FyZXQpO1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgdGhpcy5jYXJldCA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZUNhcmV0VXAoKSB7XG4gICAgICAgIGNvbnN0IGxheW91dFBvcyA9IHRoaXMuZ2V0TGF5b3V0VGV4dFBvc2l0aW9uKHRoaXMuY2FyZXQpO1xuICAgICAgICAvLyBhbHJlYWR5IHRoZSBmaXJzdCB3bGluZSwgbm8gd2hlcmUgdG8gZ28gdXBcbiAgICAgICAgaWYgKGxheW91dFBvcy53bGluZUluZGV4ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gdGhpcy5nZXRDdXJzb3JJbmZvKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FyZXQobGVmdCwgdG9wIC0gZ2V0TGluZVNwYWNpbmcodGhpcy5saW5lU3BhY2luZykgLSAxZS01KTtcbiAgICB9XG4gICAgbW92ZUNhcmV0RG93bigpIHtcbiAgICAgICAgY29uc3QgbGF5b3V0UG9zID0gdGhpcy5nZXRMYXlvdXRUZXh0UG9zaXRpb24odGhpcy5jYXJldCk7XG4gICAgICAgIC8vIGFscmVhZHkgdGhlIGxhc3Qgd2xpbmUsIG5vIGRvd24gYXZhaWxhYmxlXG4gICAgICAgIGlmIChsYXlvdXRQb3Mud2xpbmVJbmRleCA9PT0gdGhpcy53cmFwcGVkTGluZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IHRoaXMuZ2V0Q3Vyc29ySW5mbygpO1xuICAgICAgICBjb25zdCBjdXJMaW5lTWV0cmljID0gdGhpcy53cmFwcGVkTGluZXNbbGF5b3V0UG9zLndsaW5lSW5kZXhdLm1ldHJpYztcbiAgICAgICAgY29uc3QgY3VyTGluZUhlaWdodCA9IGN1ckxpbmVNZXRyaWMuYXNjZW50ICsgY3VyTGluZU1ldHJpYy5kZXNjZW50O1xuICAgICAgICB0aGlzLnVwZGF0ZUNhcmV0KGxlZnQsIHRvcCArIGdldExpbmVTcGFjaW5nKHRoaXMubGluZVNwYWNpbmcpICsgY3VyTGluZUhlaWdodCArIDFlLTUpO1xuICAgIH1cbiAgICAvLyBtb3ZlIHRvIGN1cnJlbnQgaGVhZCBvZiB3bGluZVxuICAgIG1vdmVDYXJldFRvSGVhZCgpIHtcbiAgICAgICAgY29uc3QgbGF5b3V0UG9zID0gdGhpcy5nZXRMYXlvdXRUZXh0UG9zaXRpb24odGhpcy5jYXJldCk7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbbGF5b3V0UG9zLndsaW5lSW5kZXhdO1xuICAgICAgICB0aGlzLmNhcmV0ID0gdGhpcy5nZXRIZWFkVGV4dFBvc2l0aW9uKHdsaW5lKTtcbiAgICB9XG4gICAgLy8gbW92ZSB0byB0aGUgbGFzdCBwb3NpdGlvbiBvZiB3bGluZVxuICAgIG1vdmVDYXJldFRvVGFpbCgpIHtcbiAgICAgICAgY29uc3QgbGF5b3V0UG9zID0gdGhpcy5nZXRMYXlvdXRUZXh0UG9zaXRpb24odGhpcy5jYXJldCk7XG4gICAgICAgIGNvbnN0IHdsaW5lID0gdGhpcy53cmFwcGVkTGluZXNbbGF5b3V0UG9zLndsaW5lSW5kZXhdO1xuICAgICAgICB0aGlzLmNhcmV0ID0gdGhpcy5nZXRUYWlsVGV4dFBvc2l0aW9uKHdsaW5lKTtcbiAgICB9XG4gICAgLy8gZGVsZXRlIHNlbGVjdGVkIGNvbnRlbnRcbiAgICBkZWxldGVTZWxlY3RlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmV0ID0gZGVsZXRlU2VsZWN0ZWRUZXh0KHRoaXMubGluZXMsIHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY0xheW91dCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0eWxlU2VsZWN0ZWQoc3R5bGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGlvbiB8fCAhc2VsZWN0aW9uSXNFbXB0eSh0aGlzLnNlbGVjdGlvbikpIHtcbiAgICAgICAgICAgIGNoYW5nZVNlbGVjdGVkVGV4dFN0eWxlKHRoaXMubGluZXMsIHRoaXMuc2VsZWN0aW9uLCBzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2liR0Y1YjNWMExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dmMzSmpMMnhoZVc5MWRDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBMRVZCUVVVc1UwRkJVeXhGUVVGRkxIVkNRVUYxUWl4RlFVRkZMR3RDUVVGclFpeEZRVUZGTEZOQlFWTXNSVUZCUlN4VlFVRlZMRVZCUVVVc1VVRkJVU3hGUVVGRkxFOUJRVThzUlVGQlJTeE5RVUZOTEZkQlFWY3NRMEZCUXp0QlFVTTNTQ3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEZWQlFWVXNSVUZCUlN4TlFVRk5MR0ZCUVdFc1EwRkJRenRCUVVOc1JDeFBRVUZQTEVWQlFVVXNaVUZCWlN4RlFVRkZMRTFCUVUwc1ZVRkJWU3hEUVVGRE8wRkJRek5ETEU5QlFVOHNSVUZCUlN4cFFrRkJhVUlzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3h2UWtGQmIwSXNSVUZCUlN4clFrRkJhMElzUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN3MFFrRkJORUlzUlVGQlJTeGpRVUZqTEVWQlFYTkNMRmxCUVZrc1JVRkJkMFlzWTBGQll5eEZRVUZGTEZWQlFWVXNSVUZCY1VJc1RVRkJUU3hUUVVGVExFTkJRVU03UVVGRE0xY3NUMEZCVHl4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEZGQlFWRXNSVUZCUlN4dFFrRkJiVUlzUlVGQlJTeGhRVUZoTEVWQlFVVXNhMEpCUVd0Q0xFVkJRVVVzWTBGQll5eEZRVUZGTEdWQlFXVXNSVUZCUlN4dFFrRkJiVUlzUlVGQlJTeHJRa0ZCYTBJc1JVRkJSU3hqUVVGakxFVkJRVVVzVlVGQlZTeEZRVUZGTEc5Q1FVRnZRaXhGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRmRCUVZjc1JVRkJSU3hyUWtGQmEwSXNSVUZCUlN4WFFVRlhMRVZCUVVVc1UwRkJVeXhGUVVGRkxGTkJRVk1zUlVGQlJTeFRRVUZUTEVWQlFVVXNWMEZCVnl4RlFVRkZMR2RDUVVGblFpeEZRVUZGTEhWQ1FVRjFRaXhGUVVGRkxHbENRVUZwUWl4RlFVRkZMRTFCUVUwc1VVRkJVU3hEUVVGRE8wRkJSVEZhTEhsR1FVRjVSanRCUVVONlJpeE5RVUZOTEU5QlFVOHNUVUZCVFR0SlFXOUNaaXhaUVVGWkxFZEJRVzlETEVWQlFVVXNTMEZCTWtJN1VVRm9RamRGTEhsQ1FVRjVRanRSUVVONlFpeG5Ra0ZCVnl4SFFVRnBRaXhaUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETzFGQlEyaEVMR05CUVZNc1IwRkJiVUlzWTBGQll5eERRVUZETEVsQlFVa3NRMEZCUXp0UlFVTm9SQ3hWUVVGTExFZEJRV2RDTEVWQlFVVXNRMEZCUXp0UlFVTjRRaXgxUWtGQmEwSXNSMEZCV1N4SlFVRkpMRU5CUVVNN1VVRkZia01zWVVGQllUdFJRVU5pTEZWQlFVc3NSMEZCYVVJc1JVRkJSU3hUUVVGVExFVkJRVVVzUTBGQlF5eEZRVUZGTEZGQlFWRXNSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hUUVVGVExFVkJRVVVzUTBGQlF5eERRVUZETEVWQlFVVXNVMEZCVXl4RlFVRkZMRWxCUVVrc1JVRkJSU3hEUVVGRE8xRkJRM0pHTEdOQlFWTXNSMEZCWXl4clFrRkJhMElzUTBGQlF6dFJRVU14UXl4alFVRlRMRWRCUVRoQ0xGTkJRVk1zUTBGQlF6dFJRVVZxUkN4cFFrRkJhVUk3VVVGRGFrSXNhVUpCUVZrc1IwRkJhMElzUlVGQlJTeERRVUZETzFGQlJXcERMRzFDUVVGakxFZEJRVWNzUjBGQlJ5eERRVUZETzFGQlIycENMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVU3V1VGRFRpeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMSFZDUVVGMVFpeERRVUZETEVOQlFVTTdXVUZEZGtNc1QwRkJUenRUUVVOV08xRkJSVVFzVDBGQlR6dFJRVU5RTEVsQlFVa3NRMEZCUXl4UFFVRlBMRWRCUVVjc1IwRkJSeXhEUVVGRE8xRkJSVzVDTEVsQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXh2UWtGQmIwSXNRMEZCUXp0UlFVTndSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU03VVVGRE4wUXNTVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF6dFJRVVYwUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU4yUWl4dFEwRkJiVU03VVVGRGJrTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wbEJRM1JDTEVOQlFVTTdTVUZGUkN4dFJFRkJiVVE3U1VGRGJrUXNiVUpCUVcxQ0xFTkJRVU1zVFVGQll6dFJRVU01UWl3clJVRkJLMFU3VVVGREwwVXNUVUZCVFN4TFFVRkxMRWRCUVdkQ08xbEJRM1pDTEUxQlFVMHNSVUZCUlN4alFVRmpPMWxCUTNSQ0xGVkJRVlVzUlVGQlJTeE5RVUZOTzFsQlEyeENMRXRCUVVzc1JVRkJSU3hEUVVGRE8xbEJRMUlzVVVGQlVTeEZRVUZGTEVWQlFVVTdXVUZEV2l4TFFVRkxMRVZCUVVVc1JVRkJSVHRUUVVOYUxFTkJRVUU3VVVGRFJDeEpRVUZKTEVOQlFVTXNXVUZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU51UXl4RFFVRkRPMGxCUlVRc1kwRkJZeXhEUVVGRExGTkJRVzlDTEVWQlFVVXNUVUZCWXl4RlFVRkZMRlZCUVd0Q0xFVkJRVVVzV1VGQmIwSTdVVUZEZWtZc1RVRkJUU3hMUVVGTExFZEJRVWNzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMUZCUTNCRExHbENRVUZwUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUkxFVkJRVVVzVTBGQlV5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMUZCUTI1RUxFMUJRVTBzV1VGQldTeEhRVUZITEZOQlFWTXNRMEZCUXl4TFFVRkxMRVZCUVVVc1ZVRkJWU3hGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzFGQlEyaEZMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFsQlF6RkRMRTFCUVUwc1kwRkJZeXhIUVVGSExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTjJReXhOUVVGTkxGRkJRVkVzUjBGQmEwSXNkVUpCUVhWQ0xFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFWRXNSVUZCUlN4VFFVRlRMRVZCUVVVc1kwRkJZeXhEUVVGRExFTkJRVU03V1VGRGJFY3NUVUZCVFN4VlFVRlZMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1dVRkRka1FzVFVGQlRTeExRVUZMTEVkQlFXZENPMmRDUVVOMlFpeE5RVUZOTEVWQlFVVXNWVUZCVlR0blFrRkRiRUlzVlVGQlZTeEZRVUZGTEUxQlFVMDdaMEpCUTJ4Q0xFdEJRVXNzUlVGQlJTeERRVUZETzJkQ1FVTlNMRkZCUVZFc1JVRkJSU3hSUVVGUk8yZENRVU5zUWl4TFFVRkxMRVZCUVVVc1kwRkJZeXhGUVVGRkxGbEJRVms3WVVGRGRFTXNRMEZCUVR0WlFVTkVMRWxCUVVrc1EwRkJReXhaUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMU5CUTJ4RE8wbEJRMHdzUTBGQlF6dEpRVVZFTEhsRFFVRjVRenRKUVVONlF5eFRRVUZUTEVOQlFVTXNWVUZCYTBJN1VVRkRlRUlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1MwRkJTeXhEUVVGRE8xbEJRVVVzVDBGQlR6dFJRVU53UXl4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdXVUZEZUVNc1RVRkJUU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVWb1F5eEpRVUZKTEZkQlFWY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1JVRkJSVHRuUWtGRGVFSXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUXk5Q08ybENRVUZOTzJkQ1FVTklMQ3RDUVVFclFqdG5Ra0ZETDBJc1RVRkJUU3hMUVVGTExFZEJRVWNzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03WjBKQlEzUkRMRTFCUVUwc1dVRkJXU3hIUVVGSExGTkJRVk1zUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eERRVUZETEZWQlFWVXNSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTnFSeXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXp0aFFVTjRSVHRUUVVOS08xRkJSVVFzYjBSQlFXOUVPMUZCUTNCRUxFMUJRVTBzWVVGQllTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJVU3hGUVVGRkxFVkJRVVVzUlVGQlJTeHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8xRkJRM3BGTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdFpRVU12UXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTI1RExFbEJRVWtzYTBKQlFXdENMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVU3WjBKQlF6TkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJUdHZRa0ZEVkN4TFFVRkxMRU5CUVVNc1RVRkJUU3hIUVVGSExHRkJRV0VzUTBGQlF6dHBRa0ZEYUVNN2NVSkJRVTA3YjBKQlEwZ3NTMEZCU3l4RFFVRkRMRTFCUVUwc1IwRkJSeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdhVUpCUXpWRU8yRkJRMG83VTBGRFNqdEpRVU5NTEVOQlFVTTdTVUZGUkN4VlFVRlZPMUZCUTA0c1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdXVUZEWml4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1UwRkROVU03VVVGRlJDeEpRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRVZCUVVVc1EwRkJRenRSUVVOMlFpeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dFJRVU53UXl4SlFVRkpMRU5CUVVNc1pVRkJaU3hGUVVGRkxFTkJRVU03VVVGRmRrSXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wbEJRMnhDTEVOQlFVTTdTVUZGUkN4WlFVRlpMRU5CUVVNc1NVRkJXU3hGUVVGRkxFdEJRV2RDTzFGQlEzWkRMRWxCUVVrc1EwRkJReXhQUVVGUkxFTkJRVU1zVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRkRU1zVFVGQlRTeG5Ra0ZCWjBJc1IwRkJSeXh0UWtGQmJVSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVOd1JDeEpRVUZKTEVOQlFVTXNUMEZCVVN4RFFVRkRMRWxCUVVrc1IwRkJSeXhuUWtGQlowSXNSMEZCUnl4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF6dFJRVU16UkN4TlFVRk5MRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlVTeERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03VVVGRGFFUXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkRZaXhEUVVGRE8wbEJSVVFzYjBKQlFXOUNMRU5CUVVNc1ZVRkJhME1zUlVGQlJTeExRVUZuUWp0UlFVTnlSU3hKUVVGSkxFTkJRVU1zVlVGQlZUdFpRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMUZCUXpGQ0xFMUJRVTBzVFVGQlRTeEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRha01zU1VGQlNTeE5RVUZOTEVWQlFVVTdXVUZEVWl4SlFVRkpMRU5CUVVNc1QwRkJVU3hEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRPMWxCUTNSRExFbEJRVWtzUTBGQlF5eFBRVUZSTEVOQlFVTXNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJReXhSUVVGUkxFZEJRVWNzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNN1dVRkRla1FzVFVGQlRTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVZFc1EwRkJReXhYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMWxCUTJ4RUxFOUJRVThzUTBGQlF5eERRVUZETzFOQlExbzdZVUZCVFR0WlFVTklMRTlCUVU4c1EwRkJReXhEUVVGRE8xTkJRMW83U1VGRFRDeERRVUZETzBsQlJVUXNNa05CUVRKRE8wbEJRek5ETEdOQlFXTXNRMEZCUXl4VlFVRnJReXhGUVVGRkxFdEJRV2RDTzFGQlF5OUVMRWxCUVVrc1EwRkJReXhWUVVGVk8xbEJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdVVUZETVVJc1QwRkJUeXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFZRVUZWTEVWQlFVVXNTMEZCU3l4RFFVRkRMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTTdTVUZEYkVjc1EwRkJRenRKUVVWRUxHbEhRVUZwUnp0SlFVTnFSeXhsUVVGbE8xRkJRMWdzYzBOQlFYTkRPMUZCUTNSRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4SlFVRkpMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUE8xbEJRVVVzVDBGQlR6dFJRVVZzUml4SlFVRkpMRU5CUVVNc1IwRkJSeXhWUVVGVkxFTkJRVU1zUTBGQlF5eFhRVUZYTzFGQlF5OUNMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTXZReXhOUVVGTkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJSWHBETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRuUWtGRFZDeERRVUZETEVsQlFVa3NWMEZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03WVVGRGJFTTdhVUpCUVUwN1owSkJRMGdzVFVGQlRTeGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRuUWtGRGFFVXNRMEZCUXl4SlFVRkpMR1ZCUVdVc1EwRkJRenRuUWtGRGNrSXNRMEZCUXl4SlFVRkpMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETzJGQlEyeERPMWxCUlVRc2EwUkJRV3RFTzFsQlEyeEVMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTXNRMEZCUXp0WlFVVm9ReXhKUVVGSkxHdENRVUZyUWl4RFFVRkRMRmRCUVZjc1EwRkJReXhGUVVGRk8yZENRVU5xUXl4VFFVRlRPMkZCUTFvN1dVRkZSQ3hOUVVGTkxGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRaUVVNelF5eE5RVUZOTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0WlFVTnlSQ3hOUVVGTkxGVkJRVlVzUjBGQlJ5eFRRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc01FSkJRVEJDTzFsQlJXNUZMSGxEUVVGNVF6dFpRVU42UXl4TlFVRk5MRmxCUVZrc1IwRkJSeXhYUVVGWExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUXpkRExFMUJRVTBzUjBGQlJ5eEhRVUZITEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzFsQlF5OURMRTFCUVUwc1YwRkJWeXhIUVVGSExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTTdXVUZGT1VJc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFsQlExWXNTVUZCU1N4SlFVRkpMRU5CUVVNc1UwRkJVeXhMUVVGTExHTkJRV01zUTBGQlF5eExRVUZMTEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1MwRkJTeXhqUVVGakxFTkJRVU1zVFVGQlRTeEZRVUZGTzJkQ1FVTnlSaXhKUVVGSkxHVkJRV1VzUjBGQlJ5eFRRVUZUTEVOQlFVTTdaMEpCUTJoRExFbEJRVWtzVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4TlFVRk5MRVZCUVVVN2IwSkJRMnBETEdWQlFXVXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4VlFVRlZMRVZCUVVVc1YwRkJWeXhEUVVGRExFZEJRVWNzYlVKQlFXMUNMRU5CUVVNc1EwRkJRenRwUWtGRmFrYzdaMEpCUTBRc1RVRkJUU3hWUVVGVkxFZEJRVWNzWVVGQllTeERRVUZETEdWQlFXVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0blFrRkRka1lzUTBGQlF5eEhRVUZITEZWQlFWVXNRMEZCUXp0aFFVTnNRanRaUVVWRUxIZEVRVUYzUkR0WlFVTjRSQ3hYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRU5CUVVNN1dVRkROVUlzU1VGQlNTeFZRVUZWTEVWQlFVVTdaMEpCUTFvc1YwRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVsQlFVa3NWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJRenRuUWtGRE9VTXNTVUZCU1N4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRk8yOUNRVU51UWl4WFFVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFZRVUZWTEVWQlFVVXNWMEZCVnl4RFFVRkRMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0cFFrRkRNVWM3WVVGRFNqdFpRVVZFTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFhRVUZYTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdG5Ra0ZEYkVRc1RVRkJUU3hQUVVGUExFZEJRVWNzVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGVFTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTk8yOUNRVUZGTEZOQlFWTTdaMEpCUlRsQ0xHdEVRVUZyUkR0blFrRkRiRVFzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMjlDUVVOVUxFbEJRVWtzVlVGQlZTeGhRVUZXTEZWQlFWVXNkVUpCUVZZc1ZVRkJWU3hEUVVGRkxFMUJRVTBzUlVGQlJUdDNRa0ZEY0VJc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eExRVUZMTEdOQlFXTXNRMEZCUXl4SlFVRkpMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUzBGQlN5eGpRVUZqTEVOQlFVTXNUMEZCVHl4RlFVRkZPelJDUVVOeVJpeERRVUZETEVsQlFVa3NWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJRenQ1UWtGRE1VSTdkMEpCUlVRc1owSkJRV2RDTzNkQ1FVTm9RaXhOUVVGTkxFMUJRVTBzUjBGQlJ5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPM2RDUVVOcVF5eEpRVUZKTEUxQlFVMHNSVUZCUlRzMFFrRkRVaXh0UTBGQmJVTTdORUpCUTI1RExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4SFFVRkhMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU03TkVKQlF6TkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1MwRkJTeXhIUVVGSExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTTdORUpCUTNCRkxFMUJRVTBzVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFZRVUZWTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNN05FSkJRM1pGTEVsQlFVa3NWMEZCVnl4RFFVRkRMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRVVU3WjBOQlEzcENMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03TmtKQlEzWkRPelJDUVVORUxFTkJRVU1zU1VGQlNTeFhRVUZYTEVOQlFVTTdORUpCUldwQ0xHZEdRVUZuUmpzMFFrRkRhRVlzUTBGQlF5eEpRVUZKTEcxQ1FVRnRRaXhEUVVGRE8zbENRVU0xUWp0eFFrRkRTanRwUWtGRFNqdG5Ra0ZGUkN4blJFRkJaMFE3WjBKQlEyaEVMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXp0blFrRkZlRUlzWjBOQlFXZERPMmRDUVVOb1F5eG5SVUZCWjBVN1owSkJRMmhGTEVOQlFVTXNTVUZCU1N4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dGhRVU0zUWp0WlFVTkVMRU5CUVVNc1NVRkJTU3hqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMU5CUTNwRE8wbEJRMHdzUTBGQlF6dEpRVVZFTEhGQ1FVRnhRaXhEUVVGRExFZEJRWFZDT3p0UlFVTjZReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRUdFpRVUZGTEU5QlFVOHNTMEZCU3l4RFFVRkRPMUZCUld4RkxFbEJRVWtzUjBGQlJ5eERRVUZETEZWQlFWVXNSMEZCUnl4RFFVRkRMRWxCUVVrc1IwRkJSeXhEUVVGRExGVkJRVlVzU1VGQlJ5eE5RVUZCTEVsQlFVa3NRMEZCUXl4WlFVRlpMREJEUVVGRkxFMUJRVTBzUTBGQlFUdFpRVUZGTEU5QlFVOHNTMEZCU3l4RFFVRkRPMUZCUlc1R0xFMUJRVTBzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzFGQlEyaEVMRWxCUVVrc1IwRkJSeXhEUVVGRExGbEJRVmtzUjBGQlJ5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRmxCUVZrc1IwRkJSeXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMDdXVUZCUlN4UFFVRlBMRXRCUVVzc1EwRkJRenRSUVVWdVJpeE5RVUZOTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0UlFVTnFSQ3hKUVVGSkxFZEJRVWNzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlFVVXNUMEZCVHl4TFFVRkxMRU5CUVVNN1VVRkZka1lzVDBGQlR5eEpRVUZKTEVOQlFVTTdTVUZEYUVJc1EwRkJRenRKUVVWRUxHOUNRVUZ2UWl4RFFVRkRMRlZCUVd0Q08xRkJRMjVETEUxQlFVMHNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdVVUZETlVNc1NVRkJTU3hyUWtGQmEwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVNelFpeFBRVUZQTEVWQlFVVXNVMEZCVXl4RlFVRkZMRXRCUVVzc1EwRkJReXhWUVVGVkxFVkJRVVVzVVVGQlVTeEZRVUZGTEcxQ1FVRnRRaXhGUVVGRkxGTkJRVk1zUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3hUUVVGVExFVkJRVVVzU1VGQlNTeEZRVUZGTEVOQlFVTTdVMEZETVVnN1VVRkZSQ3hQUVVGUE8xbEJRMGdzVTBGQlV5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VlFVRlZPMWxCUXpOQ0xGRkJRVkVzUlVGQlJTeExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXM3V1VGRGFrTXNVMEZCVXl4RlFVRkZMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVONFF5eERRVUZCTzBsQlEwd3NRMEZCUXp0SlFVVkVMR2xDUVVGcFFpeERRVUZETEVkQlFXbENPMUZCUXk5Q0xFMUJRVTBzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTTNReXhOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dFJRVU5xUkN4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdXVUZEZWtNc1RVRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVNMVFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhSUVVGUkxFbEJRVWtzUjBGQlJ5eERRVUZETEZGQlFWRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlR0blFrRkRMMGNzVDBGQlR5eEpRVUZKTEVOQlFVTTdZVUZEWmp0WlFVTkVMRTlCUVU4c1UwRkJVeXhEUVVGRE8xTkJRM0JDTzBsQlEwd3NRMEZCUXp0SlFVVkVMR2RDUVVGblFpeERRVUZETEVkQlFXbENPMUZCUXpsQ0xFMUJRVTBzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTTNReXhOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dFJRVU5xUkN4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdXVUZEZWtNc1RVRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVNMVFpeEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPMmRDUVVOMlJ5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMSE5DUVVGelFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJRenRuUWtGREwwTXNUVUZCVFN4bFFVRmxMRWRCUVVjN2IwSkJRM0JDTEZOQlFWTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1ZVRkJWVHR2UWtGRE0wSXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN6dHZRa0ZEZGtRc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRwUWtGRE9VUXNRMEZCUXp0blFrRkRSaXhOUVVGTkxGbEJRVmtzUjBGQk5rSXNaVUZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVVzWlVGQlpTeERRVUZETEVOQlFVTTdaMEpCUlRWR0xFOUJRVTg3YjBKQlEwZ3NTMEZCU3l4RlFVRkZPM2RDUVVOSUxGTkJRVk1zUlVGQlJTeExRVUZMTEVOQlFVTXNWVUZCVlR0M1FrRkRNMElzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN6dDNRa0ZEYUVNc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dHhRa0ZEZGtNN2IwSkJRMFFzUjBGQlJ5eEZRVUZGTEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF5eGxRVUZsTzJsQ1FVTnlSQ3hEUVVGRE8yRkJRMHc3VTBGRFNqdFJRVU5FTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0UlFVTnFReXhQUVVGUExGTkJRVk1zUTBGQlF6dEpRVU55UWl4RFFVRkRPMGxCUlVRc09FTkJRVGhETzBsQlF6bERMR1ZCUVdVN1VVRkRXQ3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFbEJRVWtzWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF6dFpRVUZGTEU5QlFVODdVVUZGYWtZc1RVRkJUU3hGUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRhRU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU03VVVGRk9VSXNUVUZCVFN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0UlFVTjJReXhOUVVGTkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJSWFpETEUxQlFVMHNSMEZCUnl4SFFVRkhMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRSUVVNelF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1VVRkZNME1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenRSUVVOd1FpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1IwRkJSeXh4UWtGQmNVSXNRMEZCUXp0UlFVVXZReXhKUVVGSkxFZEJRVWNzUTBGQlF5eFZRVUZWTEV0QlFVc3NSMEZCUnl4RFFVRkRMRlZCUVZVc1JVRkJSVHRaUVVOdVF5eHhRMEZCY1VNN1dVRkRja01zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhKUVVGSkxFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NSVUZCUlN4dlFrRkJiMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVMEZET1VrN1lVRkJUVHRaUVVOSUxIRkNRVUZ4UWp0WlFVTnlRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUTBGQlF5eEhRVUZITEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RlFVRkZMRzlDUVVGdlFpeERRVUZETEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVVndUQ3h2UWtGQmIwSTdXVUZEY0VJc1NVRkJTU3hIUVVGSExFTkJRVU1zVlVGQlZTeEhRVUZITEVkQlFVY3NRMEZCUXl4VlFVRlZMRWRCUVVjc1EwRkJReXhGUVVGRk8yZENRVU55UXl4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFZEJRVWNzUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMjlDUVVOMFJDeE5RVUZOTEdkQ1FVRm5RaXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRE8yOUNRVU55UkN3clEwRkJLME03YjBKQlF5OURMRTFCUVUwc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEUxQlFVMHNSVUZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdiMEpCUXpsRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1JVRkJSU3hIUVVGSExFVkJRVVVzWjBKQlFXZENMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0cFFrRkRNMFU3WVVGRFNqdFpRVVZFTEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVc1IwRkJSeXhGUVVGRkxFMUJRVTBzUlVGQlJTeEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETzFsQlF6TkdMR3RGUVVGclJUdFpRVU5zUlN4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMU5CUTJ4Rk8xRkJSVVFzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenRKUVVNelFpeERRVUZETzBsQlJVUXNZMEZCWXp0UlFVTldMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETzBsQlF5OUNMRU5CUVVNN1NVRkZSQ3gxUTBGQmRVTTdTVUZEZGtNc1RVRkJUVHRSUVVOR0xFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4SlFVRkpMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUE8xbEJRVVVzVDBGQlR6dFJRVVZzUml4cFFrRkJhVUk3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdVVUZGY0VZc1NVRkJTU3hEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZETzFGQlJYWkNMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTXZReXhOUVVGTkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJSWHBETEVsQlFVa3NhMEpCUVd0Q0xFTkJRVU1zVjBGQlZ5eERRVUZETEVWQlFVVTdaMEpCUTJwRExFMUJRVTBzVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXp0blFrRkRha1VzVFVGQlRTeFhRVUZYTEVkQlFVY3NZMEZCWXl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVVzVjBGQlZ5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMmRDUVVOMlJTeEpRVUZKTEZWQlFWVXNZVUZCVml4VlFVRlZMSFZDUVVGV0xGVkJRVlVzUTBGQlJTeE5RVUZOTEVWQlFVVTdiMEpCUTNCQ0xFMUJRVTBzVFVGQlRTeEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNN2IwSkJRMnBETEVsQlFVa3NUVUZCVFN4RlFVRkZPM2RDUVVOU0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4SFFVRkhMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU03ZDBKQlF6TkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1MwRkJTeXhIUVVGSExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTTdkMEpCUTNCRkxFMUJRVTBzVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFZRVUZWTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNN2QwSkJRM1pGTEVsQlFVa3NWMEZCVnl4RFFVRkRMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRVVU3TkVKQlEzcENMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNSVUZCUlN4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRkxGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVXl4RFFVRkRMRU5CUVVNN2VVSkJRMnhHTzNGQ1FVTktPMmxDUVVOS08yZENRVU5FTEZOQlFWTTdZVUZEV2p0WlFVVkVMRTFCUVUwc1UwRkJVeXhIUVVGSExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMWxCUXpORExFMUJRVTBzUTBGQlF5eEhRVUZITEZkQlFWY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVeXhEUVVGRE8xbEJSWFpETEVsQlFVa3NTVUZCU1N4RFFVRkRMR3RDUVVGclFpeEZRVUZGTzJkQ1FVTjZRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRPMmRDUVVOd1FpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8yZENRVU42UWl4VFFVRlRPMmRDUVVOVUxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SFFVRkhMRzlDUVVGdlFpeERRVUZETzJkQ1FVTm9SQ3hKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1owSkJRM1JFTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVkQlFVY3NWMEZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dG5Ra0ZGZWtRc1YwRkJWenRuUWtGRFdDeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmRCUVZjc1IwRkJSeXh2UWtGQmIwSXNRMEZCUXp0blFrRkRhRVFzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTXhRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlJUZENMRlZCUVZVN1owSkJRMVlzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4WFFVRlhMRWRCUVVjc2IwSkJRVzlDTEVOQlFVTTdaMEpCUTJoRUxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVjBGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRuUWtGRGRrUXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzJkQ1FVVXhSQ3hKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRPMmRDUVVOMFFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE8yRkJRekZDTzFsQlJVUXNUVUZCVFN4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1dVRkRja1FzVFVGQlRTeFZRVUZWTEVkQlFVY3NVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExEQkNRVUV3UWp0WlFVVnVSU3g1UTBGQmVVTTdXVUZEZWtNc1RVRkJUU3haUVVGWkxFZEJRVWNzVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVNM1F5eE5RVUZOTEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0WlFVTXZReXhOUVVGTkxGZEJRVmNzUjBGQlJ5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRPMWxCUlRsQ0xHMURRVUZ0UXp0WlFVTnVReXhKUVVGSkxFbEJRVWtzUTBGQlF5eFRRVUZUTEV0QlFVc3NZMEZCWXl4RFFVRkRMRXRCUVVzc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eExRVUZMTEdOQlFXTXNRMEZCUXl4TlFVRk5MRVZCUVVVN1owSkJRM0pHTEVsQlFVa3NaVUZCWlN4SFFVRkhMRk5CUVZNc1EwRkJRenRuUWtGRGFFTXNTVUZCU1N4VlFVRlZMRWxCUVVrc1ZVRkJWU3hEUVVGRExFMUJRVTBzUlVGQlJUdHZRa0ZEYWtNc1pVRkJaU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExGVkJRVlVzUlVGQlJTeFhRVUZYTEVOQlFVTXNSMEZCUnl4dFFrRkJiVUlzUTBGQlF5eERRVUZETzJsQ1FVTnFSenRuUWtGRFJDeHpRa0ZCYzBJN1owSkJRM1JDTEUxQlFVMHNWVUZCVlN4SFFVRkhMR0ZCUVdFc1EwRkJReXhsUVVGbExFVkJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03WjBKQlEzWkdMRWxCUVVrc1NVRkJTU3hEUVVGRExHdENRVUZyUWl4RlFVRkZPMjlDUVVONlFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRE8yOUNRVU53UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUjBGQlJ5eHpRa0ZCYzBJc1EwRkJRenR2UWtGRGFFUXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF6dHZRa0ZEZWtJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUTBGQlF6dHZRa0ZETDBJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8yOUNRVU14UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN2IwSkJRMjVETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRMRU5CUVVNN2IwSkJRM2hETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03YjBKQlEzUkNMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTTdhVUpCUXpGQ08yRkJRMG83V1VGRlJDeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3WjBKQlEyeEVMRTFCUVUwc1QwRkJUeXhIUVVGSExGZEJRVmNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRM2hETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUVHR2UWtGQlJTeFRRVUZUTzJkQ1FVVTVRaXhOUVVGTkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVzc1EwRkJRenRuUWtGRkwwSXNhMFJCUVd0RU8yZENRVU5zUkN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVU3YjBKQlExUXNTVUZCU1N4VlFVRlZMR0ZCUVZZc1ZVRkJWU3gxUWtGQlZpeFZRVUZWTEVOQlFVVXNUVUZCVFN4RlFVRkZPM2RDUVVOd1FpeE5RVUZOTEUxQlFVMHNSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE8zZENRVU5xUXl4SlFVRkpMRTFCUVUwc1JVRkJSVHMwUWtGRFVpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1IwRkJSeXhYUVVGWExFTkJRVU1zUzBGQlN5eERRVUZET3pSQ1FVTXpReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUnl4WFFVRlhMRU5CUVVNc1VVRkJVU3hIUVVGSExFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRPelJDUVVOd1JTeE5RVUZOTEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNWVUZCVlN4RlFVRkZMRmRCUVZjc1EwRkJReXhEUVVGRE96UkNRVU4yUlN4SlFVRkpMRmRCUVZjc1EwRkJReXhMUVVGTExFdEJRVXNzUTBGQlF5eEZRVUZGTzJkRFFVTjZRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhIUVVGSExGZEJRVmNzUjBGQlJ5eHRRa0ZCYlVJc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czJRa0ZETTBVN2VVSkJRMG83Y1VKQlEwbzdhVUpCUTBvN1owSkJSVVFzWjBOQlFXZERPMmRDUVVOb1F5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzVDBGQlR5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGVFUXNhME5CUVd0RE8yZENRVU5zUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNSVUZCUlR0dlFrRkRla0lzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenR2UWtGRGNFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXl4RFFVRkRMSGRDUVVGM1FpeERRVUZETzI5Q1FVTnlSaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eEZRVUZGTEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN2IwSkJRekZJTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhIUVVGSExFOUJRVThzUTBGQlF6dHZRa0ZEYmtNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMjlDUVVNMVNDeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE8ybENRVU14UWp0aFFVTktPMU5CUTBvN1VVRkZSQ3d3UWtGQk1FSTdVVUZETVVJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0UlFVTjZRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETjBNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU12UXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETzFGQlJYUkNMRzFDUVVGdFFqdFJRVU51UWl4SlFVRkpMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVU3V1VGRGFFSXNkVU5CUVhWRE8xTkJRekZETzBsQlEwd3NRMEZCUXp0SlFVVkVMSE5DUVVGelFqdFJRVU5zUWl4SlFVRkpMRU5CUVVNc1kwRkJZeXhKUVVGSkxFVkJRVVVzUTBGQlF6dEpRVU01UWl4RFFVRkRPMGxCUTBRc2MwSkJRWE5DTzFGQlEyeENMRWxCUVVrc1EwRkJReXhqUVVGakxFbEJRVWtzUlVGQlJTeERRVUZETzFGQlF6RkNMRWxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eERRVUZETEVWQlFVVTdXVUZEZWtJc1NVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eERRVUZETEVOQlFVTTdVMEZETTBJN1NVRkRUQ3hEUVVGRE8wbEJSVVFzYVVKQlFXbENMRU5CUVVNc1EwRkJVenRSUVVOMlFpeEpRVUZKTEVOQlFVTXNZMEZCWXl4SFFVRkhMRU5CUVVNc1EwRkJRenRKUVVNMVFpeERRVUZETzBsQlJVUXNlVU5CUVhsRE8wbEJRM3BETEZkQlFWY3NRMEZCUXl4RFFVRlRMRVZCUVVVc1EwRkJVenRSUVVNMVFpeE5RVUZOTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTjRReXhKUVVGSkxFbEJRVWtzUTBGQlF5eFRRVUZUTEV0QlFVc3NiVUpCUVcxQ0xFVkJRVVU3V1VGRGVFTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03VTBGRGNrSTdTVUZEVEN4RFFVRkRPMGxCUlVRc1dVRkJXU3hEUVVGRExFZEJRV2xDT3p0UlFVTXhRaXhOUVVGTkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZGTjBNc2IwTkJRVzlETzFGQlEzQkRMRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8xRkJRMnBFTEVsQlFVa3NRMEZCUXl4TFFVRkxMRVZCUVVVN1dVRkRVaXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETERKRFFVRXlReXhEUVVGRExFTkJRVU03VTBGRE9VUTdVVUZGUkN4TlFVRk5MRWRCUVVjc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlR5eERRVUZETEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1RVRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF6dFJRVU14UkN4TlFVRk5MRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1RVRkJUeXhEUVVGRExFOUJRVThzUTBGQlF6dFJRVVUxUkN4aFFVRmhPMUZCUTJJc1NVRkJTU3hyUWtGQmEwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVNelFpeE5RVUZOTEV0QlFVc3NSMEZCUnl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUlVGQlJTeExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1dVRkRNMFFzVFVGQlRTeFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNWVUZCVlN4RFFVRkRPMWxCUXpORUxFbEJRVWtzU1VGQlNTeEhRVUZITEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVY3NiVUpCUVcxQ0xFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTnNTQ3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NSVUZCUlN4TlFVRk5MRVZCUVVVc1EwRkJRenRUUVVOb1F6dFJRVVZFTEcxSFFVRnRSenRSUVVOdVJ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRXRCUVVzc1NVRkJTU3hGUVVGRk8xbEJRM3BDTEUxQlFVMHNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRE1VUXNUVUZCVFN4SlFVRkpMRWRCUVVjc1EwRkJRU3hOUVVGQkxFOUJRVThzUTBGQlF5eE5RVUZOTERCRFFVRkZMRWxCUVVzc1NVRkJSeXhQUVVGUExFTkJRVU1zVFVGQlR5eERRVUZETEV0QlFVc3NRMEZCUXp0WlFVTXpSQ3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NSVUZCUlN4TlFVRk5MRVZCUVVVc1EwRkJRenRUUVVOb1F6dFJRVVZFTEUxQlFVMHNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMUZCUld4RUxIbENRVUY1UWp0UlFVTjZRaXhOUVVGTkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dFJRVU12UXl4TlFVRk5MRWRCUVVjc1IwRkJSeXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVNeFF5eEpRVUZKTEVsQlFVa3NSMEZCUnl4TlFVRkJMRTlCUVU4c1EwRkJReXhOUVVGTkxEQkRRVUZGTEVsQlFVc3NRMEZCUXp0UlFVTnFReXhMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3V1VGRGNFUXNUVUZCVFN4SlFVRkpMRWRCUVVjc1ZVRkJWU3hEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRek5ETEUxQlFVMHNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRaUVVOeVJDeEpRVUZKTEVsQlFVa3NVMEZCVXl4RFFVRkRPMU5CUTNKQ08xRkJRMFFzVDBGQlR5eEZRVUZGTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1RVRkJUU3hGUVVGRkxFTkJRVU03U1VGRGFrTXNRMEZCUXp0SlFVVkVMRFJEUVVFMFF6dEpRVU0xUXl4aFFVRmhPMUZCUTFRc1QwRkJUeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVONlF5eERRVUZETzBsQlJVUXNiVUpCUVcxQ0xFTkJRVU1zUzBGQmEwSTdVVUZEYkVNc1NVRkJTU3hyUWtGQmEwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVNelFpeFBRVUZQTEd0Q1FVRnJRaXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzFOQlEzQkRPMUZCUlVRc2QwSkJRWGRDTzFGQlEzaENMRTFCUVUwc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRU1zVFVGQlRTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJRenRSUVVNMVFpeFBRVUZQTzFsQlEwZ3NVMEZCVXl4RlFVRkZMRXRCUVVzc1EwRkJReXhWUVVGVk8xbEJRek5DTEZGQlFWRXNSVUZCUlN4TFFVRkxPMWxCUTJZc1UwRkJVeXhGUVVGRkxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMU5CUXpsQ0xFTkJRVU03U1VGRFRpeERRVUZETzBsQlJVUXNNa05CUVRKRE8wbEJRek5ETEcxQ1FVRnRRaXhEUVVGRExFdEJRV3RDTzFGQlEyeERMR2REUVVGblF6dFJRVU5vUXl4SlFVRkpMR3RDUVVGclFpeERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMWxCUXpOQ0xFOUJRVThzYTBKQlFXdENMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VTBGRGNFTTdVVUZGUkN4eFEwRkJjVU03VVVGRGNrTXNUVUZCVFN4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU14UkN4TlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUlhaRExFMUJRVTBzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzFGQlF5OURMRWxCUVVrc1lVRkJZU3hMUVVGTExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRaUVVNM1F5eE5RVUZOTzFsQlEwNHNUMEZCVHl4clFrRkJhMElzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0VFFVTndRenRSUVVWRUxHVkJRV1U3VVVGRFppeFBRVUZQTzFsQlEwZ3NVMEZCVXl4RlFVRkZMRXRCUVVzc1EwRkJReXhWUVVGVk8xbEJRek5DTEZGQlFWRXNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTenRaUVVOMlFpeFRRVUZUTEVWQlFVVXNZVUZCWVR0VFFVTXpRaXhEUVVGRE8wbEJRMDRzUTBGQlF6dEpRVVZFTEN0RFFVRXJRenRKUVVNdlF5eGxRVUZsTEVOQlFVTXNRMEZCVXl4RlFVRkZMRU5CUVZNN08xRkJRMmhETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVOMFJDeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdXVUZETjBNc1QwRkJUenRuUWtGRFNDeFRRVUZUTEVWQlFVVXNiVUpCUVcxQ08yZENRVU01UWl4UlFVRlJMRVZCUVVVc2JVSkJRVzFDTzJkQ1FVTTNRaXhUUVVGVExFVkJRVVVzYlVKQlFXMUNPMkZCUTJwRExFTkJRVU03VTBGRFREdFJRVVZFTEcxRFFVRnRRenRSUVVOdVF5eEpRVUZKTEZOQlFWTXNSMEZCVnl4dFFrRkJiVUlzUTBGQlF6dFJRVU0xUXl4SlFVRkpMRlZCUVZVc1IwRkJWeXh0UWtGQmJVSXNRMEZCUXp0UlFVTTNReXhOUVVGTkxFOUJRVThzUjBGQlJ5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8xRkJSV3BFTEhkQ1FVRjNRanRSUVVONFFpeE5RVUZOTEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzaERMRTFCUVUwc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZGYkVVc1NVRkJTU3hEUVVGRExFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRWRCUVVjc1ZVRkJWU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVWQlFVVTdXVUZETTBRc1UwRkJVeXhIUVVGSExGVkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTTdXVUZEYkVNc1ZVRkJWU3hIUVVGSExFTkJRVU1zUTBGQlF6dFRRVU5zUWp0aFFVRk5MRWxCUVVrc1EwRkJReXhIUVVGSExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4SFFVRkhMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEZRVUZGTzFsQlEycEZMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETzFsQlEycERMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1UwRkROME03WVVGQlRUdFpRVU5JTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdG5Ra0ZETDBNc1RVRkJUU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGJrTXNUVUZCVFN4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF6dG5Ra0ZETlVJc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEhRVUZITEUxQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1IwRkJSeXhIUVVGSExFOUJRVThzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SFFVRkhMRWRCUVVjc1QwRkJUeXhGUVVGRk8yOUNRVU12Unl4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF6dHZRa0ZETjBJc1ZVRkJWU3hIUVVGSExFTkJRVU1zUTBGQlF6dHZRa0ZEWml4TlFVRk5PMmxDUVVOVU8yRkJRMG83VTBGRFNqdFJRVVZFTEVsQlFVa3NVMEZCVXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8xbEJRMnhDTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03VTBGRGFrTTdVVUZGUkN4M1JFRkJkMFE3VVVGRGVFUXNTVUZCU1N4VlFVRlZMRXRCUVVzc2JVSkJRVzFDTEVsQlFVa3NhMEpCUVd0Q0xFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhGUVVGRk8xbEJRM3BHTEU5QlFVODdaMEpCUTBnc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1ZVRkJWVHRuUWtGRGJrUXNVVUZCVVN4RlFVRkZMRzFDUVVGdFFqdG5Ra0ZETjBJc1UwRkJVeXhGUVVGRkxHMUNRVUZ0UWp0blFrRkRPVUlzVTBGQlV5eEZRVUZGTEVsQlFVazdZVUZEYkVJc1EwRkJRenRUUVVOTU8xRkJSVVFzYzBSQlFYTkVPMUZCUTNSRUxFbEJRVWtzVVVGQlVTeEhRVUZYTEcxQ1FVRnRRaXhEUVVGRE8xRkJRek5ETEVsQlFVa3NVMEZCVXl4SFFVRlhMRzFDUVVGdFFpeERRVUZETzFGQlF6VkRMRWxCUVVrc1UwRkJVeXhMUVVGTExHMUNRVUZ0UWl4RlFVRkZPMWxCUTI1RExHMUVRVUZ0UkR0WlFVTnVSQ3hOUVVGTkxGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCWVN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF6dFpRVU42UkN4SlFVRkpMRU5CUVVNc1NVRkJSeXhWUVVGVkxHRkJRVllzVlVGQlZTeDFRa0ZCVml4VlFVRlZMRU5CUVVVc1NVRkJTeXhEUVVGQkxFVkJRVVU3WjBKQlEzWkNMRTlCUVU4c1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXp0aFFVTnNSVHRwUWtGQlRTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkJMRlZCUVZVc1lVRkJWaXhWUVVGVkxIVkNRVUZXTEZWQlFWVXNRMEZCUlN4SlFVRkxMRXRCUVVjc1ZVRkJWU3hoUVVGV0xGVkJRVlVzZFVKQlFWWXNWVUZCVlN4RFFVRkZMRXRCUVUwc1EwRkJRU3hGUVVGRk8yZENRVU51UkN4UFFVRlBMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTTdZVUZEYkVVN2FVSkJRVTA3WjBKQlEwZ3NiME5CUVc5RE8yZENRVU53UXl4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVdFc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8yOUNRVU55UlN4TlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQllTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dHZRa0ZETTBRc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTTdiMEpCUTNwQ0xFMUJRVTBzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03YjBKQlEzaERMRTFCUVUwc1IwRkJSeXhIUVVGSExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8yOUNRVU14UXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhOUVVGQkxFOUJRVThzUTBGQlF5eE5RVUZOTERCRFFVRkZMRWxCUVVzc1EwRkJRenR2UWtGRGJFTXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1NVRkJTU3hQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8zZENRVU4yUkN4eFFrRkJjVUk3ZDBKQlEzSkNMRzlFUVVGdlJEdDNRa0ZEY0VRc1RVRkJUU3hKUVVGSkxFZEJRVWNzVlVGQlZTeERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzNkQ1FVTXpReXhOUVVGTkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdkMEpCUTNKRUxFbEJRVWtzUTBGQlF5eEhRVUZITEV0QlFVc3NSMEZCUnl4VFFVRlRMRWRCUVVjc1IwRkJSeXhGUVVGRk96UkNRVU0zUWl3clEwRkJLME03TkVKQlF5OURMRk5CUVZNc1IwRkJSeXhEUVVGRExFTkJRVU03TkVKQlEyUXNUMEZCVHl4RlFVRkZMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVOQlFVTTdlVUpCUXpkRE96WkNRVUZOTEVsQlFVa3NRMEZCUXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhUUVVGVExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4TFFVRkxMRWRCUVVjc1UwRkJVeXhGUVVGRk96UkNRVU12UkN4blJVRkJaMFU3TkVKQlEyaEZMRWxCUVVrc1EwRkJReXhMUVVGTExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1owTkJRM2hDTEVsQlFVa3NVVUZCVVN4TFFVRkxMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlR0dlEwRkRlRU1zVDBGQlR5eEZRVUZGTEZOQlFWTXNSVUZCUlN4UlFVRlJMRVZCUVVVc1VVRkJVU3hIUVVGSExFTkJRVU1zUlVGQlJTeFRRVUZUTEVWQlFVVXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU03YVVOQlEyeEhPM0ZEUVVGTk8yOURRVU5JTEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVc1VVRkJVU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEZOQlFWTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hUUVVGVExFVkJRVVVzU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXl4UFFVRlBPMmxEUVVNNVJUczJRa0ZEU2p0cFEwRkJUVHRuUTBGRFNDeFRRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRuUTBGRGJFSXNUMEZCVHl4RlFVRkZMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVOQlFVTTdOa0pCUXpkRE8zbENRVU5LT3paQ1FVRk5PelJDUVVOSUxFdEJRVXNzU1VGQlNTeFRRVUZUTEVOQlFVTTdlVUpCUTNSQ08zRkNRVU5LTzJsQ1FVTktPMkZCUTBvN1UwRkRTanRSUVVWRUxFbEJRVWtzVTBGQlV5eExRVUZMTEcxQ1FVRnRRaXhKUVVGSkxGTkJRVk1zUzBGQlN5eHRRa0ZCYlVJc1JVRkJSVHRaUVVONFJTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMR2xEUVVGcFF5eERRVUZETEVOQlFVTTdVMEZEYkVRN1VVRkZSQ3hQUVVGUE8xbEJRMGdzVTBGQlV6dFpRVU5VTEZGQlFWRTdXVUZEVWl4VFFVRlRPMU5CUTFvc1EwRkJRenRKUVVOT0xFTkJRVU03U1VGRlJDeHBTVUZCYVVrN1NVRkRha2tzY1VKQlFYRkNMRU5CUVVNc1QwRkJjVUk3VVVGRGRrTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWk8xbEJRVVVzVDBGQlR5dzBRa0ZCTkVJc1EwRkJRenRSUVVVMVJDd3dTRUZCTUVnN1VVRkRNVWdzU1VGQlNTeFBRVUZQTEVOQlFVTXNVMEZCVXl4TFFVRkxMRWxCUVVrc1JVRkJSVHRaUVVNMVFpeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzJkQ1FVTndSQ3hOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yZENRVU51UXl4SlFVRkpMRXRCUVVzc1EwRkJReXhWUVVGVkxFdEJRVXNzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlR0dlFrRkRlRU1zVDBGQlR6dDNRa0ZEU0N4VlFVRlZMRVZCUVVVc1EwRkJRenQzUWtGRFlpeFpRVUZaTEVWQlFVVXNiVUpCUVcxQ08zZENRVU5xUXl4VFFVRlRMRVZCUVVVc2JVSkJRVzFDTzNkQ1FVTTVRaXhUUVVGVExFVkJRVVVzU1VGQlNUdHhRa0ZEYkVJc1EwRkJRVHRwUWtGRFNqdGhRVU5LTzFOQlEwbzdVVUZGUkN4eFFrRkJjVUk3VVVGRGNrSXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFsQlF5OURMRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRia01zU1VGQlNTeExRVUZMTEVOQlFVTXNWVUZCVlN4TFFVRkxMRTlCUVU4c1EwRkJReXhUUVVGVE8yZENRVUZGTEZOQlFWTTdXVUZGY2tRc1MwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMmRDUVVNMVF5eE5RVUZOTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTnNReXhKUVVGSkxFOUJRVThzUTBGQlF5eExRVUZMTEV0QlFVc3NUMEZCVHl4RFFVRkRMRkZCUVZFc1NVRkJTU3hQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzVDBGQlR5eERRVUZETEZOQlFWTXNTVUZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTzI5Q1FVTjBTQ3hQUVVGUE8zZENRVU5JTEZWQlFWVXNSVUZCUlN4RFFVRkRPM2RDUVVOaUxGbEJRVmtzUlVGQlJTeERRVUZETzNkQ1FVTm1MRk5CUVZNc1JVRkJSU3hQUVVGUExFTkJRVU1zVTBGQlV6dHhRa0ZETDBJc1EwRkJRVHRwUWtGRFNqdGhRVU5LTzFOQlEwbzdVVUZGUkN4MVFrRkJkVUk3VVVGRGRrSXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXh2UkVGQmIwUXNRMEZCUXl4RFFVRkRPMUZCUTNCRkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1VVRkRja0lzVDBGQlR5dzBRa0ZCTkVJc1EwRkJRenRKUVVONFF5eERRVUZETzBsQlJVUXNaVUZCWlR0UlFVTllMRTlCUVU4c1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SlFVTnFReXhEUVVGRE8wbEJSVVFzWlVGQlpUdFJRVU5ZTEU5QlFVOHNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU5xUXl4RFFVRkRPMGxCUlVRc1lVRkJZVHRSUVVOVUxFbEJRVWtzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0WlFVRkZMRTlCUVU4c2IwSkJRVzlDTEVOQlFVTTdVVUZETDBVc1QwRkJUeXhyUWtGQmEwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkROVVFzUTBGQlF6dEpRVVZFTEdsQ1FVRnBRaXhEUVVGRExFOUJRV1U3VVVGRE4wSXNLMFJCUVN0RU8xRkJReTlFTEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dFJRVU42UkN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03U1VGRGRFSXNRMEZCUXp0SlFVVkVMR05CUVdNN1VVRkRWaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VVVGRGFFTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wbEJRM1JDTEVOQlFVTTdTVUZGUkN4blFrRkJaMEk3VVVGRFdpeFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdVVUZEYkVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBsQlEzUkNMRU5CUVVNN1NVRkZSQ3hyUTBGQmEwTTdTVUZEYkVNc2JVSkJRVzFDTEVOQlFVTXNSMEZCWlR0UlFVTXZRaXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eERRVUZETzFGQlEzUkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEpRVU4wUWl4RFFVRkRPMGxCUlVRc2NVSkJRWEZDTzBsQlEzSkNMR2xDUVVGcFFpeERRVUZETEUxQlFXTTdVVUZETlVJc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dFJRVU14UXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03U1VGRGRFSXNRMEZCUXp0SlFVVkVMRGhDUVVFNFFqdEpRVU01UWl4aFFVRmhPMUZCUTFRc1RVRkJUU3hIUVVGSExFZEJRVFpDTEcxQ1FVRnRRaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8xRkJRMnhHTEVsQlFVa3NSMEZCUnl4RlFVRkZPMWxCUTB3c1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eEhRVUZKTEVOQlFVTTdVMEZEY2tJN1NVRkRUQ3hEUVVGRE8wbEJSVVFzWTBGQll6dFJRVU5XTEUxQlFVMHNTVUZCU1N4SFFVRTJRaXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VVVGREwwVXNTVUZCU1N4SlFVRkpMRVZCUVVVN1dVRkRUaXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVc3NRMEZCUXp0VFFVTjBRanRKUVVOTUxFTkJRVU03U1VGRlJDeFhRVUZYTzFGQlExQXNUVUZCVFN4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dFJRVVY2UkN3MlEwRkJOa003VVVGRE4wTXNTVUZCU1N4VFFVRlRMRU5CUVVNc1ZVRkJWU3hMUVVGTExFTkJRVU03V1VGQlJTeFBRVUZQTzFGQlJYWkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1JVRkJSU3hEUVVGRE8xRkJRek5ETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hGUVVGRkxFZEJRVWNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETzBsQlF6RkZMRU5CUVVNN1NVRkZSQ3hoUVVGaE8xRkJRMVFzVFVGQlRTeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVWNlJDdzBRMEZCTkVNN1VVRkROVU1zU1VGQlNTeFRRVUZUTEVOQlFVTXNWVUZCVlN4TFFVRkxMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTTdXVUZCUlN4UFFVRlBPMUZCUld4RkxFMUJRVTBzUlVGQlJTeEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZMRWRCUVVjc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeERRVUZETzFGQlF6TkRMRTFCUVUwc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF6dFJRVU55UlN4TlFVRk5MR0ZCUVdFc1IwRkJSeXhoUVVGaExFTkJRVU1zVFVGQlRTeEhRVUZITEdGQlFXRXNRMEZCUXl4UFFVRlBMRU5CUVVNN1VVRkRia1VzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1IwRkJSeXhIUVVGSExHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWRCUVVjc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETzBsQlF6RkdMRU5CUVVNN1NVRkRSQ3huUTBGQlowTTdTVUZEYUVNc1pVRkJaVHRSUVVOWUxFMUJRVTBzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1VVRkRla1FzVFVGQlRTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdVVUZEZEVRc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTVUZEYWtRc1EwRkJRenRKUVVWRUxIRkRRVUZ4UXp0SlFVTnlReXhsUVVGbE8xRkJRMWdzVFVGQlRTeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVONlJDeE5RVUZOTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0UlFVTjBSQ3hKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SlFVTnFSQ3hEUVVGRE8wbEJSVVFzTUVKQlFUQkNPMGxCUXpGQ0xHTkJRV003VVVGRFZpeEpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVN1dVRkRhRUlzU1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4clFrRkJhMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFpRVU0xUkN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03V1VGRGRFSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8xTkJRM0pDTzBsQlEwd3NRMEZCUXp0SlFVVkVMR0ZCUVdFc1EwRkJReXhMUVVGNVFqdFJRVU51UXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNSVUZCUlR0WlFVTjBSQ3gxUWtGQmRVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZWTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1UwRkRMMFE3U1VGRFRDeERRVUZETzBOQlJVb2lmUT09IiwiLy8gbGluZWJyZWFrIGlzIHZlcnkgZGVlcCB0b3BpYywgY3VycmVudGx5IHdlIGNhbiBvbmx5IGFjaGlldmUgY2hhcmFjdGVyIGxldmVsIGxpbmVicmVhayB1c2luZyAzcmQgcGFydHlcbi8vIGxpYnMgaW1wbG1lbnRpbmcgaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMTQvI1NhbXBsZUNvZGVcbmltcG9ydCB7IElOVkFMSURfSU5ERVhfVkFMVUUgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgY2xvbmVPYmogfSBmcm9tIFwiLi91dGlsXCI7XG4vLyBmb3IgbW9yZSBzbWFydCB3b3JkIHNlZ21lbnRhdGlvbiwgd2UgcHJvYmFibHkgbmVlZCBsYW5ndWFnZSBzcGVjaWZpYyBsaWJhcmllcyBlLmcuIGh0dHBzOi8vaW52ZXN0aWdhdGUuYWkvdGV4dC1hbmFseXNpcy9zcGxpdHRpbmctd29yZHMtaW4tZWFzdC1hc2lhbi1sYW5ndWFnZXMvXG52YXIgTGluZUJyZWFrZXIgPSByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvbGluZWJyZWFrLW5leHQnKTtcbmV4cG9ydCBmdW5jdGlvbiBzZWdtZW50V29yZFJhbmdlcyhzdHIpIHtcbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBjb25zdCBicmVha2VyID0gbmV3IExpbmVCcmVha2VyKHN0cik7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIGxldCBiaztcbiAgICB3aGlsZSAoYmsgPSBicmVha2VyLm5leHRCcmVhaygpKSB7XG4gICAgICAgIHJldC5wdXNoKFtsYXN0LCBiay5wb3NpdGlvbiAtIDFdKTtcbiAgICAgICAgbGFzdCA9IGJrLnBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlZ21lbnRXb3JkcyhzdHIpIHtcbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBjb25zdCBicmVha2VyID0gbmV3IExpbmVCcmVha2VyKHN0cik7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIGxldCBiaztcbiAgICB3aGlsZSAoYmsgPSBicmVha2VyLm5leHRCcmVhaygpKSB7XG4gICAgICAgIC8vIGdldCB0aGUgc3RyaW5nIGJldHdlZW4gdGhlIGxhc3QgYnJlYWsgYW5kIHRoaXMgb25lXG4gICAgICAgIGNvbnN0IHdvcmQgPSBzdHIuc2xpY2UobGFzdCwgYmsucG9zaXRpb24pO1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHdvcmQpO1xuICAgICAgICByZXQucHVzaCh3b3JkKTtcbiAgICAgICAgLy8geW91IGNhbiBhbHNvIGNoZWNrIGJrLnJlcXVpcmVkIHRvIHNlZSBpZiB0aGlzIHdhcyBhIHJlcXVpcmVkIGJyZWFrLi4uXG4gICAgICAgIGlmIChiay5yZXF1aXJlZCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1xcblxcbicpO1xuICAgICAgICAgICAgcmV0LnB1c2goJ1xcblxcbicpO1xuICAgICAgICB9XG4gICAgICAgIGxhc3QgPSBiay5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cbi8vIGJyZWFrIGEgbGFyZ2UgYm9keSBvZiB0ZXh0IGJ5ICdcXG4nXG5leHBvcnQgZnVuY3Rpb24gYnJlYWtQbGFpblRleHRJbnRvTGluZXMocGFyYWdyYXBoKSB7XG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgbGV0IGN1ckxpbmUgPSAnJztcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgcGFyYWdyYXBoKSB7XG4gICAgICAgIGlmIChjaGFyID09PSAnXFxuJykge1xuICAgICAgICAgICAgLy8gZW5kIG9mIGEgbGluZVxuICAgICAgICAgICAgcmV0LnB1c2goY3VyTGluZS5zbGljZSgpKTtcbiAgICAgICAgICAgIGN1ckxpbmUgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGN1ckxpbmUgKz0gY2hhcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY3VyTGluZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0LnB1c2goY3VyTGluZSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBjaGFySXNDb250ZW50KGNoYXIpIHtcbiAgICAvLyBjdXJyZW50IG9ubHkgd29ya3MgZm9yIGVuZ2xpc2hcbiAgICByZXR1cm4gY2hhci5sZW5ndGggPT09IDEgJiYgY2hhci5tYXRjaCgvWzAtOV1bYS16XVtfLi1dL2kpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluUmFuZ2UoaW5kZXgsIHJhbmdlKSB7XG4gICAgcmV0dXJuIGluZGV4ID49IHJhbmdlWzBdICYmIGluZGV4IDw9IHJhbmdlWzFdO1xufVxuLy8gcmV0dXJuIHRoZSBydW5JbmRleCB3aGVyZSB0aGUgaW5kZXggbGFuZHMsIGxpbmVhciBzZWFyY2ggTyhuKVxuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bkluZGV4KGluZGV4LCBydW5zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBydW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpblJhbmdlKGluZGV4LCBydW5zW2ldLnJhbmdlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElOVkFMSURfSU5ERVhfVkFMVUU7XG59XG4vLyBnaXZlbiBhIHNpbmdsZSBsaW5lIG9mIChzdHlsZWQpdGV4dCwgc2VnbWVudCBpdCBpbnRvIHdvcmRzXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRXb3Jkcyhsb2dpY0xpbmUpIHtcbiAgICBjb25zdCBsaW5lVGV4dCA9IGxvZ2ljTGluZS50ZXh0O1xuICAgIGNvbnN0IHJ1bnMgPSBsb2dpY0xpbmUucnVucztcbiAgICBjb25zdCB3b3JkUmFuZ2VzID0gc2VnbWVudFdvcmRSYW5nZXMobG9naWNMaW5lLnRleHQpO1xuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIC8vIGhhbmRsZSBlYWNoIHdvcmQgc2VxdWVudGlhbGx5LCBnZW5lcmF0aW5nIG5ldyBydW5zXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JkUmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gd29yZFJhbmdlc1tpXTtcbiAgICAgICAgY29uc3Qgd29yZCA9IGxpbmVUZXh0LnNsaWNlKHJhbmdlWzBdLCByYW5nZVsxXSArIDEpO1xuICAgICAgICBsZXQgY3VyUGFydHMgPSBbXTtcbiAgICAgICAgLy8gd29yZFswXSBzdGFydCB3aXRoIFtjdXJSdW5JZHgsIGN1clJ1blBhcnRTdGFydF1cbiAgICAgICAgbGV0IGN1clJ1bklkeCA9IGdldFJ1bkluZGV4KHJhbmdlWzBdLCBydW5zKTtcbiAgICAgICAgbGV0IGN1clJ1blBhcnRTdGFydCA9IHJhbmdlWzBdO1xuICAgICAgICBsZXQgY3VyUnVuUGFydEVuZCA9IGN1clJ1blBhcnRTdGFydDtcbiAgICAgICAgZm9yIChsZXQgaiA9IHJhbmdlWzBdOyBqIDw9IHJhbmdlWzFdOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChnZXRSdW5JbmRleChqLCBydW5zKSA9PT0gY3VyUnVuSWR4KSB7XG4gICAgICAgICAgICAgICAgY3VyUnVuUGFydEVuZCA9IGo7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBlbmNvdW50ZXIgYSBuZXcgcnVuUGFydCwgZmlyc3QgcHVzaCBjdXJyZW50IHJ1blBhcnRcbiAgICAgICAgICAgICAgICBjdXJQYXJ0cy5wdXNoKHsgcnVuSUQ6IGN1clJ1bklkeCwgcmFuZ2U6IFtjdXJSdW5QYXJ0U3RhcnQsIGN1clJ1blBhcnRFbmRdIH0pO1xuICAgICAgICAgICAgICAgIC8vIHRoZW4gc3RhcnQgYSBuZXcgcnVuUGFydFxuICAgICAgICAgICAgICAgIGN1clJ1bklkeCsrO1xuICAgICAgICAgICAgICAgIGN1clJ1blBhcnRTdGFydCA9IGo7XG4gICAgICAgICAgICAgICAgY3VyUnVuUGFydEVuZCA9IGN1clJ1blBhcnRTdGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBmaW5pc2hlZCBsb29waW5nIHRoaXMgd29yZFxuICAgICAgICBjdXJQYXJ0cy5wdXNoKHsgcnVuSUQ6IGN1clJ1bklkeCwgcmFuZ2U6IFtjdXJSdW5QYXJ0U3RhcnQsIGN1clJ1blBhcnRFbmRdIH0pO1xuICAgICAgICBjdXJSdW5QYXJ0U3RhcnQgPSBJTlZBTElEX0lOREVYX1ZBTFVFO1xuICAgICAgICBjdXJSdW5QYXJ0RW5kID0gSU5WQUxJRF9JTkRFWF9WQUxVRTtcbiAgICAgICAgLy8gcHJvY2VzcyB0aGlzIHdvcmRcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICBhc2NlbnQ6IDAsXG4gICAgICAgICAgICBkZXNjZW50OiAwLFxuICAgICAgICAgICAgYmFzZWxpbmU6IDAsXG4gICAgICAgICAgICB0ZXh0OiB3b3JkLFxuICAgICAgICAgICAgcnVuUGFydHM6IGNsb25lT2JqKGN1clBhcnRzKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2liR2x1WldKeVpXRnJMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZjM0pqTDJ4cGJtVmljbVZoYXk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3gzUjBGQmQwYzdRVUZEZUVjc2JVVkJRVzFGTzBGQlJXNUZMRTlCUVU4c1JVRkJSU3h0UWtGQmJVSXNSVUZCZVVNc1RVRkJUU3hUUVVGVExFTkJRVU03UVVGRGNrWXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3hOUVVGTkxGRkJRVkVzUTBGQlF6dEJRVVZzUXl4dFMwRkJiVXM3UVVGRGJrc3NTVUZCU1N4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExHMURRVUZ0UXl4RFFVRkRMRU5CUVVNN1FVRkZMMFFzVFVGQlRTeFZRVUZWTEdsQ1FVRnBRaXhEUVVGRExFZEJRVmM3U1VGRGVrTXNUVUZCVFN4SFFVRkhMRWRCUVhWQ0xFVkJRVVVzUTBGQlF6dEpRVU51UXl4TlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxGZEJRVmNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTnlReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEWWl4SlFVRkpMRVZCUVVVc1EwRkJRenRKUVVOUUxFOUJRVThzUlVGQlJTeEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1JVRkJSVHRSUVVNM1FpeEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFVkJRVVVzUTBGQlF5eFJRVUZSTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOc1F5eEpRVUZKTEVkQlFVY3NSVUZCUlN4RFFVRkRMRkZCUVZFc1EwRkJRenRMUVVOMFFqdEpRVU5FTEU5QlFVOHNSMEZCUnl4RFFVRkRPMEZCUTJZc1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeFpRVUZaTEVOQlFVTXNSMEZCVnp0SlFVTndReXhOUVVGTkxFZEJRVWNzUjBGQllTeEZRVUZGTEVOQlFVTTdTVUZEZWtJc1RVRkJUU3hQUVVGUExFZEJRVWNzU1VGQlNTeFhRVUZYTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRja01zU1VGQlNTeEpRVUZKTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUTJJc1NVRkJTU3hGUVVGRkxFTkJRVU03U1VGRlVDeFBRVUZQTEVWQlFVVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhGUVVGRkxFVkJRVVU3VVVGRE4wSXNjVVJCUVhGRU8xRkJRM0pFTEUxQlFVMHNTVUZCU1N4SFFVRkhMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTEVWQlFVVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVNeFF5eDFRa0ZCZFVJN1VVRkRka0lzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVWbUxIZEZRVUYzUlR0UlFVTjRSU3hKUVVGSkxFVkJRVVVzUTBGQlF5eFJRVUZSTEVWQlFVVTdXVUZEWWl4MVFrRkJkVUk3V1VGRGRrSXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU53UWp0UlFVVkVMRWxCUVVrc1IwRkJSeXhGUVVGRkxFTkJRVU1zVVVGQlVTeERRVUZETzB0QlEzUkNPMGxCUTBRc1QwRkJUeXhIUVVGSExFTkJRVU03UVVGRFppeERRVUZETzBGQlJVUXNjVU5CUVhGRE8wRkJRM0pETEUxQlFVMHNWVUZCVlN4MVFrRkJkVUlzUTBGQlF5eFRRVUZwUWp0SlFVTnlSQ3hOUVVGTkxFZEJRVWNzUjBGQllTeEZRVUZGTEVOQlFVTTdTVUZEZWtJc1NVRkJTU3hQUVVGUExFZEJRVmNzUlVGQlJTeERRVUZETzBsQlEzcENMRXRCUVVzc1RVRkJUU3hKUVVGSkxFbEJRVWtzVTBGQlV5eEZRVUZGTzFGQlF6RkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFbEJRVWtzUlVGQlJUdFpRVU5tTEdkQ1FVRm5RanRaUVVOb1FpeEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETzFsQlF6RkNMRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU03VTBGRGFFSTdZVUZCVFR0WlFVTklMRTlCUVU4c1NVRkJTU3hKUVVGSkxFTkJRVU03VTBGRGJrSTdTMEZEU2p0SlFVTkVMRWxCUVVrc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJUdFJRVU5vUWl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzB0QlEzSkNPMGxCUlVRc1QwRkJUeXhIUVVGSExFTkJRVU03UVVGRFppeERRVUZETzBGQlJVUXNVMEZCVXl4aFFVRmhMRU5CUVVNc1NVRkJXVHRKUVVNdlFpeHBRMEZCYVVNN1NVRkRha01zVDBGQlR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03UVVGREwwUXNRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3hQUVVGUExFTkJRVU1zUzBGQllTeEZRVUZGTEV0QlFYVkNPMGxCUXpGRUxFOUJRVThzUzBGQlN5eEpRVUZKTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hMUVVGTExFbEJRVWtzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFTkJRVU03UVVGRlJDeG5SVUZCWjBVN1FVRkRhRVVzVFVGQlRTeFZRVUZWTEZkQlFWY3NRMEZCUXl4TFFVRmhMRVZCUVVVc1NVRkJaVHRKUVVOMFJDeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRSUVVOc1F5eEpRVUZKTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMWxCUXk5Q0xFOUJRVThzUTBGQlF5eERRVUZETzFOQlExbzdTMEZEU2p0SlFVTkVMRTlCUVU4c2JVSkJRVzFDTEVOQlFVTTdRVUZETDBJc1EwRkJRenRCUVVWRUxEWkVRVUUyUkR0QlFVTTNSQ3hOUVVGTkxGVkJRVlVzVlVGQlZTeERRVUZETEZOQlFXOUNPMGxCUXpORExFMUJRVTBzVVVGQlVTeEhRVUZITEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNN1NVRkRhRU1zVFVGQlRTeEpRVUZKTEVkQlFVY3NVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJRenRKUVVNMVFpeE5RVUZOTEZWQlFWVXNSMEZCUnl4cFFrRkJhVUlzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkRja1FzVFVGQlRTeEhRVUZITEVkQlFWY3NSVUZCUlN4RFFVRkRPMGxCUlhaQ0xIRkVRVUZ4UkR0SlFVTnlSQ3hMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0UlFVTjRReXhOUVVGTkxFdEJRVXNzUjBGQlJ5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkROVUlzVFVGQlRTeEpRVUZKTEVkQlFVY3NVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlJYQkVMRWxCUVVrc1VVRkJVU3hIUVVGclFpeEZRVUZGTEVOQlFVTTdVVUZGYWtNc2EwUkJRV3RFTzFGQlEyeEVMRWxCUVVrc1UwRkJVeXhIUVVGSExGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRE5VTXNTVUZCU1N4bFFVRmxMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlF5OUNMRWxCUVVrc1lVRkJZU3hIUVVGSExHVkJRV1VzUTBGQlF6dFJRVVZ3UXl4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMWxCUTNaRExFbEJRVWtzVjBGQlZ5eERRVUZETEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhUUVVGVExFVkJRVVU3WjBKQlEzQkRMR0ZCUVdFc1IwRkJSeXhEUVVGRExFTkJRVU03WjBKQlEyeENMRk5CUVZNN1lVRkRXanRwUWtGQlRUdG5Ra0ZEU0N4elJFRkJjMFE3WjBKQlEzUkVMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNVMEZCVXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hEUVVGRExHVkJRV1VzUlVGQlJTeGhRVUZoTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1owSkJSVGRGTERKQ1FVRXlRanRuUWtGRE0wSXNVMEZCVXl4RlFVRkZMRU5CUVVNN1owSkJRMW9zWlVGQlpTeEhRVUZITEVOQlFVTXNRMEZCUXp0blFrRkRjRUlzWVVGQllTeEhRVUZITEdWQlFXVXNRMEZCUXp0aFFVTnVRenRUUVVOS08xRkJSVVFzTmtKQlFUWkNPMUZCUXpkQ0xGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4TFFVRkxMRVZCUVVVc1UwRkJVeXhGUVVGRkxFdEJRVXNzUlVGQlJTeERRVUZETEdWQlFXVXNSVUZCUlN4aFFVRmhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VVVGRE4wVXNaVUZCWlN4SFFVRkhMRzFDUVVGdFFpeERRVUZETzFGQlEzUkRMR0ZCUVdFc1IwRkJSeXh0UWtGQmJVSXNRMEZCUXp0UlFVVndReXh2UWtGQmIwSTdVVUZEY0VJc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF6dFpRVU5NTEV0QlFVc3NSVUZCUlN4RFFVRkRPMWxCUTFJc1RVRkJUU3hGUVVGRkxFTkJRVU03V1VGRFZDeE5RVUZOTEVWQlFVVXNRMEZCUXp0WlFVTlVMRTlCUVU4c1JVRkJSU3hEUVVGRE8xbEJRMVlzVVVGQlVTeEZRVUZGTEVOQlFVTTdXVUZEV0N4SlFVRkpMRVZCUVVVc1NVRkJTVHRaUVVOV0xGRkJRVkVzUlVGQlJTeFJRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRPMU5CUXk5Q0xFTkJRVU1zUTBGQlF6dExRVU5PTzBsQlJVUXNUMEZCVHl4SFFVRkhMRU5CUVVNN1FVRkRaaXhEUVVGREluMD0iLCIvLyBwYXNzIGluIGNvbnRleHQsIGFuZCB1c2UgaXQgdG8gZHJhd1xuaW1wb3J0IHsgVEVYVF9ERUNPUkFUSU9OLCBURVhUX1NDUklQVCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTdWJUZXh0LCBnZXRTdHlsZVN0cmluZyB9IGZyb20gXCIuL3V0aWxcIjtcbi8vIHJlbmRlciBlYWNoIHJ1blxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdUZXh0UnVuUGFydChjdHgsIGxvZ2ljTGluZSwgcnVuUGFydCwgeCwgeSkge1xuICAgIGlmICghY3R4KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcnVucyA9IGxvZ2ljTGluZS5ydW5zO1xuICAgIGNvbnN0IHN0eWxlID0gcnVuc1tydW5QYXJ0LnJ1bklEXS5zdHlsZTtcbiAgICBjb25zdCB0ZXh0VG9EcmF3ID0gZ2V0U3ViVGV4dChsb2dpY0xpbmUsIHJ1blBhcnQucmFuZ2UpO1xuICAgIC8vIG1lYXN1cmUgdXNpbmcgY2FudmFzIEFQSSwgbWF5IGxhdGVyIGZldGNoIG1ldHJpYyBmcm9tIGZvbnRraXQgdG8gaGFuZGxlIG1vcmUgZm9udHNcbiAgICBjb25zdCBwb3NJbmZvID0gcnVuUGFydC5tZXRyaWM7XG4gICAgaWYgKCFwb3NJbmZvKVxuICAgICAgICByZXR1cm47XG4gICAgbGV0IGJhc2VsaW5lID0geTtcbiAgICBpZiAoc3R5bGUuc2NyaXB0ID09PSBURVhUX1NDUklQVC5TVVBFUikge1xuICAgICAgICBiYXNlbGluZSAtPSAocG9zSW5mby5hc2NlbnQgKyBwb3NJbmZvLmRlc2NlbnQpIC8gMjtcbiAgICB9XG4gICAgZWxzZSBpZiAoc3R5bGUuc2NyaXB0ID09PSBURVhUX1NDUklQVC5TVUIpIHtcbiAgICAgICAgYmFzZWxpbmUgKz0gcG9zSW5mby5kZXNjZW50IC8gMjtcbiAgICB9XG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yO1xuICAgIGN0eC5mb250ID0gZ2V0U3R5bGVTdHJpbmcoc3R5bGUpO1xuICAgIGN0eC5maWxsVGV4dCh0ZXh0VG9EcmF3LCB4LCBiYXNlbGluZSk7XG4gICAgaWYgKHN0eWxlLmRlY29yYXRpb24gPT09IFRFWFRfREVDT1JBVElPTi5VTkRFUkxJTkUpIHtcbiAgICAgICAgY29uc3QgdGhpY2tuZXNzID0gc3R5bGUuZm9udFNpemUgLyAxMDtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIGJhc2VsaW5lLCBwb3NJbmZvLndpZHRoLCB0aGlja25lc3MpO1xuICAgIH1cbiAgICBpZiAoc3R5bGUuZGVjb3JhdGlvbiA9PT0gVEVYVF9ERUNPUkFUSU9OLlNUUklLRSkge1xuICAgICAgICBjb25zdCB0aGlja25lc3MgPSBzdHlsZS5mb250U2l6ZSAvIDEwO1xuICAgICAgICBjb25zdCBvZmZZID0gMTA7XG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCBiYXNlbGluZSAtIChwb3NJbmZvLmFzY2VudCAvIDIpICsgb2ZmWSwgcG9zSW5mby53aWR0aCwgdGhpY2tuZXNzKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZHJhd0hpZ2hsaWdodGVkVGV4dFJ1blBhcnQoY3R4LCBydW5zLCBydW5QYXJ0LCB4LCB5KSB7XG4gICAgaWYgKCFjdHgpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwb3NJbmZvID0gcnVuUGFydC5tZXRyaWM7XG4gICAgaWYgKCFwb3NJbmZvKVxuICAgICAgICByZXR1cm47XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDI1NSwgMC4yKSc7XG4gICAgY3R4LmZpbGxSZWN0KHgsIHkgLSBwb3NJbmZvLmFzY2VudCwgcG9zSW5mby53aWR0aCwgcG9zSW5mby5hc2NlbnQgKyBwb3NJbmZvLmRlc2NlbnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZHJhd1NlbGVjdGlvbkhlaWdodGxpZ2h0KGN0eCwgc2VsZWN0aW9uKSB7XG59XG4vLyByZW5kZXIgZGVidWdnaW5nIGJib3hcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Qm91bmRpbmdCb3goY3R4LCBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20pIHtcbn1cbi8vIHJlbmRlciBkZWJ1Z2dpbmcgbWV0cmljOiBiYXNlbGluZSwgYXNjZW50LCBkZXNjZW50XG5leHBvcnQgZnVuY3Rpb24gZHJhd1RleHRNZXRyaWMoY3R4LCBiYXNlbGluZSwgYXNjZW50LCBkZXNjZW50KSB7XG59XG4vLyBkcmF3IGRlYnVnZ2luZyB3b3JkIGJib3hcbmV4cG9ydCBmdW5jdGlvbiBkcmF3V29yZEJvdW5kcyhjdHgsIHdvcmQpIHtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNtVnVaR1Z5TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2YzNKakwzSmxibVJsY2k1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3h6UTBGQmMwTTdRVUZGZEVNc1QwRkJUeXhGUVVGclJDeGxRVUZsTEVWQlFVVXNWMEZCVnl4RlFVRlJMRTFCUVUwc1UwRkJVeXhEUVVGRE8wRkJRemRITEU5QlFVOHNSVUZCUlN4VlFVRlZMRVZCUVVVc1kwRkJZeXhGUVVGRkxFMUJRVTBzVVVGQlVTeERRVUZETzBGQlJYQkVMR3RDUVVGclFqdEJRVU5zUWl4TlFVRk5MRlZCUVZVc1pVRkJaU3hEUVVGRExFZEJRVFpDTEVWQlFVVXNVMEZCYjBJc1JVRkJSU3hQUVVGdlFpeEZRVUZGTEVOQlFWTXNSVUZCUlN4RFFVRlRPMGxCUXpOSUxFbEJRVWtzUTBGQlF5eEhRVUZITzFGQlFVVXNUMEZCVHp0SlFVTnFRaXhOUVVGTkxFbEJRVWtzUjBGQlJ5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRPMGxCUXpWQ0xFMUJRVTBzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETzBsQlEzaERMRTFCUVUwc1ZVRkJWU3hIUVVGSExGVkJRVlVzUTBGQlF5eFRRVUZUTEVWQlFVVXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wbEJSWGhFTEhGR1FVRnhSanRKUVVOeVJpeE5RVUZOTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRE8wbEJReTlDTEVsQlFVa3NRMEZCUXl4UFFVRlBPMUZCUVVVc1QwRkJUenRKUVVWeVFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRha0lzU1VGQlNTeExRVUZMTEVOQlFVTXNUVUZCVFN4TFFVRkxMRmRCUVZjc1EwRkJReXhMUVVGTExFVkJRVVU3VVVGRGNFTXNVVUZCVVN4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wdEJRM1JFTzFOQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc1RVRkJUU3hMUVVGTExGZEJRVmNzUTBGQlF5eEhRVUZITEVWQlFVVTdVVUZEZWtNc1VVRkJVU3hKUVVGSkxFOUJRVThzUTBGQlF5eFBRVUZQTEVkQlFVY3NRMEZCUXl4RFFVRkRPMHRCUTI1RE8wbEJSVVFzUjBGQlJ5eERRVUZETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJRelZDTEVkQlFVY3NRMEZCUXl4SlFVRkpMRWRCUVVjc1kwRkJZeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBsQlJXcERMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVWMFF5eEpRVUZKTEV0QlFVc3NRMEZCUXl4VlFVRlZMRXRCUVVzc1pVRkJaU3hEUVVGRExGTkJRVk1zUlVGQlJUdFJRVU5vUkN4TlFVRk5MRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTjBReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNSVUZCUlN4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0TFFVTjJSRHRKUVVWRUxFbEJRVWtzUzBGQlN5eERRVUZETEZWQlFWVXNTMEZCU3l4bFFVRmxMRU5CUVVNc1RVRkJUU3hGUVVGRk8xRkJRemRETEUxQlFVMHNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZETzFGQlEzUkRMRTFCUVUwc1NVRkJTU3hIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU5vUWl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUlVGQlJTeFJRVUZSTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzB0QlEzSkdPMEZCUTB3c1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTd3dRa0ZCTUVJc1EwRkJReXhIUVVFMlFpeEZRVUZGTEVsQlFXVXNSVUZCUlN4UFFVRnZRaXhGUVVGRkxFTkJRVk1zUlVGQlJTeERRVUZUTzBsQlEycEpMRWxCUVVrc1EwRkJReXhIUVVGSE8xRkJRVVVzVDBGQlR6dEpRVVZxUWl4TlFVRk5MRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETzBsQlF5OUNMRWxCUVVrc1EwRkJReXhQUVVGUE8xRkJRVVVzVDBGQlR6dEpRVVZ5UWl4SFFVRkhMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03U1VGRFdDeEhRVUZITEVOQlFVTXNVMEZCVXl4SFFVRkhMRzlDUVVGdlFpeERRVUZETzBsQlEzSkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTVUZEY2tZc1IwRkJSeXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETzBGQlEyeENMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzZDBKQlFYZENMRU5CUVVNc1IwRkJOa0lzUlVGQlJTeFRRVUYzUWp0QlFVVm9SeXhEUVVGRE8wRkJSVVFzZDBKQlFYZENPMEZCUTNoQ0xFMUJRVTBzVlVGQlZTeGxRVUZsTEVOQlFVTXNSMEZCTmtJc1JVRkJSU3hKUVVGWkxFVkJRVVVzUjBGQlZ5eEZRVUZGTEV0QlFXRXNSVUZCUlN4TlFVRmpPMEZCUlhaSUxFTkJRVU03UVVGRlJDeHhSRUZCY1VRN1FVRkRja1FzVFVGQlRTeFZRVUZWTEdOQlFXTXNRMEZCUXl4SFFVRTJRaXhGUVVGRkxGRkJRV2RDTEVWQlFVVXNUVUZCWXl4RlFVRkZMRTlCUVdVN1FVRkRMMGNzUTBGQlF6dEJRVVZFTERKQ1FVRXlRanRCUVVNelFpeE5RVUZOTEZWQlFWVXNZMEZCWXl4RFFVRkRMRWRCUVRaQ0xFVkJRVVVzU1VGQlZUdEJRVVY0UlN4RFFVRkRJbjA9IiwiZXhwb3J0IHZhciBMSU5FX1NQQUNJTkc7XG4oZnVuY3Rpb24gKExJTkVfU1BBQ0lORykge1xuICAgIExJTkVfU1BBQ0lOR1tcIk5PUk1BTFwiXSA9IFwibm9ybWFsXCI7XG4gICAgTElORV9TUEFDSU5HW1wiSEFMRlwiXSA9IFwiaGFsZlwiO1xuICAgIExJTkVfU1BBQ0lOR1tcIkRPVUJMRVwiXSA9IFwiZG91YmxlXCI7XG4gICAgTElORV9TUEFDSU5HW1wiT05FQU5ESEFMRlwiXSA9IFwib25laGFsZlwiO1xufSkoTElORV9TUEFDSU5HIHx8IChMSU5FX1NQQUNJTkcgPSB7fSkpO1xuZXhwb3J0IHZhciBURVhUX1ZBUklBVElPTjtcbihmdW5jdGlvbiAoVEVYVF9WQVJJQVRJT04pIHtcbiAgICBURVhUX1ZBUklBVElPTltcIk5PUk1BTFwiXSA9IFwibm9ybWFsXCI7XG4gICAgVEVYVF9WQVJJQVRJT05bXCJCT0xEXCJdID0gXCJib2xkXCI7XG4gICAgVEVYVF9WQVJJQVRJT05bXCJJVEFMSUNcIl0gPSBcIml0YWxpY1wiO1xufSkoVEVYVF9WQVJJQVRJT04gfHwgKFRFWFRfVkFSSUFUSU9OID0ge30pKTtcbmV4cG9ydCB2YXIgVEVYVF9ERUNPUkFUSU9OO1xuKGZ1bmN0aW9uIChURVhUX0RFQ09SQVRJT04pIHtcbiAgICBURVhUX0RFQ09SQVRJT05bXCJOT05FXCJdID0gXCJub25lXCI7XG4gICAgVEVYVF9ERUNPUkFUSU9OW1wiVU5ERVJMSU5FXCJdID0gXCJ1bmRlcmxpbmVcIjtcbiAgICBURVhUX0RFQ09SQVRJT05bXCJTVFJJS0VcIl0gPSBcInN0cmlrZVwiO1xufSkoVEVYVF9ERUNPUkFUSU9OIHx8IChURVhUX0RFQ09SQVRJT04gPSB7fSkpO1xuZXhwb3J0IHZhciBURVhUX0FMSUdOTUVOVDtcbihmdW5jdGlvbiAoVEVYVF9BTElHTk1FTlQpIHtcbiAgICBURVhUX0FMSUdOTUVOVFtcIkxFRlRcIl0gPSBcImxlZnRcIjtcbiAgICBURVhUX0FMSUdOTUVOVFtcIlJJR0hUXCJdID0gXCJyaWdodFwiO1xuICAgIFRFWFRfQUxJR05NRU5UW1wiQ0VOVEVSXCJdID0gXCJjZW50ZXJcIjtcbiAgICBURVhUX0FMSUdOTUVOVFtcIkpVU1RJRllcIl0gPSBcImp1c3RpZnlcIjtcbn0pKFRFWFRfQUxJR05NRU5UIHx8IChURVhUX0FMSUdOTUVOVCA9IHt9KSk7XG5leHBvcnQgdmFyIFRFWFRfU0NSSVBUO1xuKGZ1bmN0aW9uIChURVhUX1NDUklQVCkge1xuICAgIFRFWFRfU0NSSVBUW1wiTk9ORVwiXSA9IFwibm9uZVwiO1xuICAgIFRFWFRfU0NSSVBUW1wiU1VQRVJcIl0gPSBcInN1cGVyXCI7XG4gICAgVEVYVF9TQ1JJUFRbXCJTVUJcIl0gPSBcInN1YlwiO1xufSkoVEVYVF9TQ1JJUFQgfHwgKFRFWFRfU0NSSVBUID0ge30pKTtcbmV4cG9ydCBjb25zdCBUT1BfTUFSR0lOID0gMDsgLy8gc3BhY2UgYmV0d2VlbiBlZGl0b3IgdG9wIGFuZCBmaXJzdCBsaW5lXG5leHBvcnQgY29uc3QgREVGQVVMVF9MSU5FX1NQQUNJTkcgPSBMSU5FX1NQQUNJTkcuTk9STUFMO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQUxJR05NRU5UID0gVEVYVF9BTElHTk1FTlQuTEVGVDtcbmV4cG9ydCBjb25zdCBTSE9XX0RFQlVHX1JFTkRFUklORyA9IHRydWU7XG5leHBvcnQgY29uc3QgSU5WQUxJRF9JTkRFWF9WQUxVRSA9IC0xO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEVYVF9TVFlMRSA9IHtcbiAgICBmb250OiBcInNlcmlmXCIsXG4gICAgZm9udFNpemU6IDUwLFxuICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgZm9udFZhcmlhdGlvbjogVEVYVF9WQVJJQVRJT04uTk9STUFMLFxuICAgIGRlY29yYXRpb246IFRFWFRfREVDT1JBVElPTi5OT05FLFxuICAgIHNjcmlwdDogVEVYVF9TQ1JJUFQuTk9ORSxcbn07XG5leHBvcnQgY29uc3QgSU5WQUxJRF9NRVRSSUMgPSB7IGJhc2VsaW5lOiBJTlZBTElEX0lOREVYX1ZBTFVFLCBhc2NlbnQ6IElOVkFMSURfSU5ERVhfVkFMVUUsIGRlc2NlbnQ6IElOVkFMSURfSU5ERVhfVkFMVUUsIHdpZHRoOiBJTlZBTElEX0lOREVYX1ZBTFVFIH07XG5leHBvcnQgY29uc3QgREVGQVVMVF9DVVJTT1JfQ09MT1IgPSAnYmxhY2snO1xuZXhwb3J0IGNvbnN0IElOVkFMSURfVEVYVF9QT1NJVElPTiA9IHsgbGluZUluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFIH07XG5leHBvcnQgY29uc3QgSU5WQUxJRF9MQVlPVVRfVEVYVF9QT1NJVElPTiA9IHsgd2xpbmVJbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgcnVuUGFydEluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBjaGFySW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUgfTtcbi8vIHVzZWQgZm9yIGl0ZW0gbGlzdCAoYnVsbGV0IHBvaW50cylcbmV4cG9ydCB2YXIgVEVYVF9CVUxMRVRfVFlQRTtcbihmdW5jdGlvbiAoVEVYVF9CVUxMRVRfVFlQRSkge1xuICAgIFRFWFRfQlVMTEVUX1RZUEVbXCJCVUxMRVRcIl0gPSBcImJ1bGxldFwiO1xuICAgIFRFWFRfQlVMTEVUX1RZUEVbXCJEQVNIXCJdID0gXCJkYXNoXCI7XG4gICAgVEVYVF9CVUxMRVRfVFlQRVtcIk5VTUJFUlwiXSA9IFwibnVtYmVyXCI7XG59KShURVhUX0JVTExFVF9UWVBFIHx8IChURVhUX0JVTExFVF9UWVBFID0ge30pKTtcbmV4cG9ydCBjb25zdCBFWFRSQV9TWU1CT0xfSU5ERU5UID0gMjA7XG4vLyBjYXJldCBpbmRleCA9PT0gY2hhciBiZWhpbmQgdGhlIGNhcmV0J3MgaW5kZXhcbi8vIHRoZSBjaGFyIGF0IHNlbGVjdGlvbi5lbmQgaXMgYWxzbyBoaWdobGlnaHRlZFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhsd1pYTXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12ZEhsd1pYTXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCVDBFc1RVRkJUU3hEUVVGT0xFbEJRVmtzV1VGTFdEdEJRVXhFTEZkQlFWa3NXVUZCV1R0SlFVTjBRaXhwUTBGQmFVSXNRMEZCUVR0SlFVTnFRaXcyUWtGQllTeERRVUZCTzBsQlEySXNhVU5CUVdsQ0xFTkJRVUU3U1VGRGFrSXNjME5CUVhOQ0xFTkJRVUU3UVVGRGVFSXNRMEZCUXl4RlFVeFhMRmxCUVZrc1MwRkJXaXhaUVVGWkxGRkJTM1pDTzBGQlJVUXNUVUZCVFN4RFFVRk9MRWxCUVZrc1kwRkpXRHRCUVVwRUxGZEJRVmtzWTBGQll6dEpRVU40UWl4dFEwRkJhVUlzUTBGQlFUdEpRVU5xUWl3clFrRkJZU3hEUVVGQk8wbEJRMklzYlVOQlFXbENMRU5CUVVFN1FVRkRia0lzUTBGQlF5eEZRVXBYTEdOQlFXTXNTMEZCWkN4alFVRmpMRkZCU1hwQ08wRkJSVVFzVFVGQlRTeERRVUZPTEVsQlFWa3NaVUZKV0R0QlFVcEVMRmRCUVZrc1pVRkJaVHRKUVVONlFpeG5RMEZCWVN4RFFVRkJPMGxCUTJJc01FTkJRWFZDTEVOQlFVRTdTVUZEZGtJc2IwTkJRV2xDTEVOQlFVRTdRVUZEYmtJc1EwRkJReXhGUVVwWExHVkJRV1VzUzBGQlppeGxRVUZsTEZGQlNURkNPMEZCUlVRc1RVRkJUU3hEUVVGT0xFbEJRVmtzWTBGTFdEdEJRVXhFTEZkQlFWa3NZMEZCWXp0SlFVTjRRaXdyUWtGQllTeERRVUZCTzBsQlEySXNhVU5CUVdVc1EwRkJRVHRKUVVObUxHMURRVUZwUWl4RFFVRkJPMGxCUTJwQ0xIRkRRVUZ0UWl4RFFVRkJPMEZCUTNKQ0xFTkJRVU1zUlVGTVZ5eGpRVUZqTEV0QlFXUXNZMEZCWXl4UlFVdDZRanRCUVVWRUxFMUJRVTBzUTBGQlRpeEpRVUZaTEZkQlNWZzdRVUZLUkN4WFFVRlpMRmRCUVZjN1NVRkRja0lzTkVKQlFXRXNRMEZCUVR0SlFVTmlMRGhDUVVGbExFTkJRVUU3U1VGRFppd3dRa0ZCVnl4RFFVRkJPMEZCUTJJc1EwRkJReXhGUVVwWExGZEJRVmNzUzBGQldDeFhRVUZYTEZGQlNYUkNPMEZCUlVRc1RVRkJUU3hEUVVGRExFMUJRVTBzVlVGQlZTeEhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRMREJEUVVFd1F6dEJRVU12UlN4TlFVRk5MRU5CUVVNc1RVRkJUU3h2UWtGQmIwSXNSMEZCYVVJc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU4wUlN4TlFVRk5MRU5CUVVNc1RVRkJUU3hwUWtGQmFVSXNSMEZCYlVJc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU55UlN4TlFVRk5MRU5CUVVNc1RVRkJUU3h2UWtGQmIwSXNSMEZCV1N4SlFVRkpMRU5CUVVNN1FVRkRiRVFzVFVGQlRTeERRVUZETEUxQlFVMHNiVUpCUVcxQ0xFZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZoT1VNc1RVRkJUU3hEUVVGRExFMUJRVTBzYTBKQlFXdENMRWRCUVdNN1NVRkRNME1zU1VGQlNTeEZRVUZGTEU5QlFVODdTVUZEWWl4UlFVRlJMRVZCUVVVc1JVRkJSVHRKUVVOYUxFdEJRVXNzUlVGQlJTeFBRVUZQTzBsQlEyUXNZVUZCWVN4RlFVRkZMR05CUVdNc1EwRkJReXhOUVVGTk8wbEJRM0JETEZWQlFWVXNSVUZCUlN4bFFVRmxMRU5CUVVNc1NVRkJTVHRKUVVOb1F5eE5RVUZOTEVWQlFVVXNWMEZCVnl4RFFVRkRMRWxCUVVrN1EwRkRla0lzUTBGQlF6dEJRVlZHTEUxQlFVMHNRMEZCUXl4TlFVRk5MR05CUVdNc1IwRkJWeXhGUVVGRkxGRkJRVkVzUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3hOUVVGTkxFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1QwRkJUeXhGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRXRCUVVzc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4RFFVRkRPMEZCUXk5S0xFMUJRVTBzUTBGQlF5eE5RVUZOTEc5Q1FVRnZRaXhIUVVGWExFOUJRVThzUTBGQlF6dEJRVU53UkN4TlFVRk5MRU5CUVVNc1RVRkJUU3h4UWtGQmNVSXNSMEZCYVVJc1JVRkJSU3hUUVVGVExFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1VVRkJVU3hGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4RFFVRkRPMEZCUTNKS0xFMUJRVTBzUTBGQlF5eE5RVUZOTERSQ1FVRTBRaXhIUVVGMVFpeEZRVUZGTEZWQlFWVXNSVUZCUlN4dFFrRkJiVUlzUlVGQlJTeFpRVUZaTEVWQlFVVXNiVUpCUVcxQ0xFVkJRVVVzVTBGQlV5eEZRVUZGTEcxQ1FVRnRRaXhGUVVGRkxFTkJRVU03UVVGRGRrc3NjVU5CUVhGRE8wRkJRM0pETEUxQlFVMHNRMEZCVGl4SlFVRlpMR2RDUVVsWU8wRkJTa1FzVjBGQldTeG5Ra0ZCWjBJN1NVRkRNVUlzY1VOQlFXbENMRU5CUVVFN1NVRkRha0lzYVVOQlFXRXNRMEZCUVR0SlFVTmlMSEZEUVVGcFFpeERRVUZCTzBGQlEyNUNMRU5CUVVNc1JVRktWeXhuUWtGQlowSXNTMEZCYUVJc1owSkJRV2RDTEZGQlNUTkNPMEZCUTBRc1RVRkJUU3hEUVVGRExFMUJRVTBzYlVKQlFXMUNMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJhVWQwUXl4blJFRkJaMFE3UVVGRGFFUXNaMFJCUVdkRUluMD0iLCJpbXBvcnQgeyBpblJhbmdlIH0gZnJvbSBcIi4vbGluZWJyZWFrXCI7XG5pbXBvcnQgeyBERUZBVUxUX1RFWFRfU1RZTEUsIElOVkFMSURfSU5ERVhfVkFMVUUsIElOVkFMSURfVEVYVF9QT1NJVElPTiwgTElORV9TUEFDSU5HLCBURVhUX0FMSUdOTUVOVCwgVEVYVF9TQ1JJUFQsIFRFWFRfVkFSSUFUSU9OIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5lU3BhY2luZyhzcGFjaW5nKSB7XG4gICAgc3dpdGNoIChzcGFjaW5nKSB7XG4gICAgICAgIGNhc2UgTElORV9TUEFDSU5HLk5PUk1BTDpcbiAgICAgICAgICAgIHJldHVybiAxMDtcbiAgICAgICAgY2FzZSBMSU5FX1NQQUNJTkcuSEFMRjpcbiAgICAgICAgICAgIHJldHVybiA1O1xuICAgICAgICBjYXNlIExJTkVfU1BBQ0lORy5PTkVBTkRIQUxGOlxuICAgICAgICAgICAgcmV0dXJuIDE1O1xuICAgICAgICBjYXNlIExJTkVfU1BBQ0lORy5ET1VCTEU6XG4gICAgICAgICAgICByZXR1cm4gMjA7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSYW5nZVZhbGlkKHJhbmdlKSB7XG4gICAgcmV0dXJuIHJhbmdlWzBdID49IDAgJiYgcmFuZ2VbMF0gPD0gcmFuZ2VbMV07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRqdXN0ZWRGb250U2l6ZShzdHlsZSkge1xuICAgIHJldHVybiAoc3R5bGUuc2NyaXB0ID09PSBURVhUX1NDUklQVC5TVVBFUiB8fCBzdHlsZS5zY3JpcHQgPT09IFRFWFRfU0NSSVBULlNVQikgPyBzdHlsZS5mb250U2l6ZSAvIDIgOiBzdHlsZS5mb250U2l6ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZVN0cmluZyhzdHlsZSkge1xuICAgIGNvbnN0IGZvbnRTaXplID0gZ2V0QWRqdXN0ZWRGb250U2l6ZShzdHlsZSk7XG4gICAgY29uc3QgdmFyaWF0aW9uID0gc3R5bGUuZm9udFZhcmlhdGlvbiA9PT0gVEVYVF9WQVJJQVRJT04uTk9STUFMID8gJycgOiAoc3R5bGUuZm9udFZhcmlhdGlvbiArICcgJyk7XG4gICAgcmV0dXJuIHZhcmlhdGlvbiArIGZvbnRTaXplICsgJ3B4ICcgKyBzdHlsZS5mb250O1xufVxuZnVuY3Rpb24gaXNTdHlsZUVxdWFsKHMxLCBzMikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShnZXRGdWxsU3R5bGUoczEpKSA9PT0gSlNPTi5zdHJpbmdpZnkoZ2V0RnVsbFN0eWxlKHMyKSk7XG59XG5mdW5jdGlvbiBnZXRGdWxsU3R5bGUoc3R5bGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1RFWFRfU1RZTEUpLCBzdHlsZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbWVhc3VyZVRleHQoY3R4LCB0ZXh0LCBzdHlsZSwgcmFuZ2UpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5mb250ID0gZ2V0U3R5bGVTdHJpbmcoc3R5bGUpO1xuICAgIGNvbnN0IHN0ciA9IChyYW5nZSAmJiBpc1JhbmdlVmFsaWQocmFuZ2UpKSA/IHRleHQuc3Vic3RyaW5nKHJhbmdlWzBdLCByYW5nZVsxXSArIDEpIDogdGV4dDtcbiAgICBjb25zdCByZXMgPSBjdHgubWVhc3VyZVRleHQoc3RyKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiByZXMud2lkdGgsXG4gICAgICAgIGJhc2VsaW5lOiAwLFxuICAgICAgICBhc2NlbnQ6IHJlcy5mb250Qm91bmRpbmdCb3hBc2NlbnQsXG4gICAgICAgIGRlc2NlbnQ6IHJlcy5mb250Qm91bmRpbmdCb3hEZXNjZW50LFxuICAgIH07XG59XG4vLyBjYWxjdWxhdGUgbGluZSBib3VuZHNcbmV4cG9ydCBmdW5jdGlvbiBhZ2dyZWdhdGVXb3JkTWV0cmljKHdvcmRzKSB7XG4gICAgY29uc3QgbWV0cmljQXJyYXkgPSB3b3Jkcy5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgYmFzZWxpbmU6IHdvcmQuYmFzZWxpbmUsIGFzY2VudDogd29yZC5hc2NlbnQsIGRlc2NlbnQ6IHdvcmQuZGVzY2VudCwgd2lkdGg6IHdvcmQud2lkdGggfTtcbiAgICB9KTtcbiAgICBjb25zdCBhZ01ldHJpYyA9IG1ldHJpY0FycmF5LnJlZHVjZSgocHJlLCBjdXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhc2VsaW5lOiAwLFxuICAgICAgICAgICAgd2lkdGg6IHByZS53aWR0aCArIGN1ci53aWR0aCxcbiAgICAgICAgICAgIGFzY2VudDogTWF0aC5tYXgocHJlLmFzY2VudCwgY3VyLmFzY2VudCksXG4gICAgICAgICAgICBkZXNjZW50OiBNYXRoLm1heChwcmUuZGVzY2VudCwgY3VyLmRlc2NlbnQpLFxuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBhZ01ldHJpYztcbn1cbi8vIGNhbGN1bGF0ZSB3b3JkIG1ldHJpYyBhbmQgbXV0YXRlIHdvcmRzXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlV29yZHNNZXRyaWMoY3R4LCBsb2dpY0xpbmUsIHdvcmRzKSB7XG4gICAgY29uc3QgcnVucyA9IGxvZ2ljTGluZS5ydW5zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgd29yZCA9IHdvcmRzW2ldO1xuICAgICAgICAvLyBtZWFzdXJlIGVhY2ggd29yZCBwYXJ0IGFuZCBhZ2dyZWdhdGUgXG4gICAgICAgIGNvbnN0IG1ldHJpY0FycmF5ID0gW107XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd29yZC5ydW5QYXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgcnVuUGFydCA9IHdvcmQucnVuUGFydHNbal07XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gZ2V0U3ViVGV4dChsb2dpY0xpbmUsIHJ1blBhcnQucmFuZ2UpO1xuICAgICAgICAgICAgY29uc3QgbWV0cmljID0gbWVhc3VyZVRleHQoY3R4LCB0ZXh0LCBydW5zW3J1blBhcnQucnVuSURdLnN0eWxlKTtcbiAgICAgICAgICAgIG1ldHJpY0FycmF5LnB1c2gobWV0cmljKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhZ2dyZWdhdGVzIG1ldHJpYyBvZiB0aGlzIHdvcmRcbiAgICAgICAgY29uc3QgYWdNZXRyaWMgPSBtZXRyaWNBcnJheS5yZWR1Y2UoKHByZSwgY3VyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJhc2VsaW5lOiAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBwcmUud2lkdGggKyBjdXIud2lkdGgsXG4gICAgICAgICAgICAgICAgYXNjZW50OiBNYXRoLm1heChwcmUuYXNjZW50LCBjdXIuYXNjZW50KSxcbiAgICAgICAgICAgICAgICBkZXNjZW50OiBNYXRoLm1heChwcmUuZGVzY2VudCwgY3VyLmRlc2NlbnQpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdvcmQud2lkdGggPSBhZ01ldHJpYy53aWR0aDtcbiAgICAgICAgd29yZC5oZWlnaHQgPSBhZ01ldHJpYy5hc2NlbnQgKyBhZ01ldHJpYy5kZXNjZW50O1xuICAgICAgICB3b3JkLmJhc2VsaW5lID0gYWdNZXRyaWMuYmFzZWxpbmU7XG4gICAgICAgIHdvcmQuYXNjZW50ID0gYWdNZXRyaWMuYXNjZW50O1xuICAgICAgICB3b3JkLmRlc2NlbnQgPSBhZ01ldHJpYy5kZXNjZW50O1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt3b3JkLndpZHRofSAke3dvcmQuaGVpZ2h0fWApO1xuICAgIH1cbn1cbi8vIGdpdmVuIGEgbGluZSBvZiB3b3JkcywgcmV0dXJuIGFycmF5IG9mIHdyYXBwZWQgd29yZHNcbmV4cG9ydCBmdW5jdGlvbiBsaW5lYnJlYWsod29yZHMsIGJyZWFrV2lkdGgsIGxlYWRpbmdTcGFjZSkge1xuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGxldCBjdXJsaW5lID0gW107XG4gICAgbGV0IGN1cldpZHRoID0gbGVhZGluZ1NwYWNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgd29yZCA9IHdvcmRzW2ldO1xuICAgICAgICBjb25zdCB3ID0gd29yZC53aWR0aDtcbiAgICAgICAgaWYgKGN1cldpZHRoICsgdyA8IGJyZWFrV2lkdGggfHwgaSA9PT0gMCkge1xuICAgICAgICAgICAgY3VyV2lkdGggKz0gdztcbiAgICAgICAgICAgIGN1cmxpbmUucHVzaCh3b3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldC5wdXNoKGN1cmxpbmUuc2xpY2UoKSk7XG4gICAgICAgICAgICBjdXJsaW5lID0gW3dvcmRdO1xuICAgICAgICAgICAgY3VyV2lkdGggPSBsZWFkaW5nU3BhY2UgKyB3O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjdXJsaW5lLmxlbmd0aCkge1xuICAgICAgICByZXQucHVzaChjdXJsaW5lLnNsaWNlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuLy8gYXNzZW1ibHkgcnVuUGFydHMgZnJvbSBzdHlsZWQgd29yZHNcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSdW5QYXJ0c0Zyb21Xb3JkcyhjdHgsIGxvZ2ljTGluZSwgd29yZHMpIHtcbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBjb25zdCBydW5zID0gbG9naWNMaW5lLnJ1bnM7XG4gICAgbGV0IGN1clJ1blBhcnRJRCA9IC0xO1xuICAgIGxldCBjdXJSdW4gPSBydW5zWzBdO1xuICAgIGxldCBjdXJSYW5nZSA9IFtjdXJSdW4ucmFuZ2VbMF0sIGN1clJ1bi5yYW5nZVsxXV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB3b3JkID0gd29yZHNbaV07XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd29yZC5ydW5QYXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgcnAgPSB3b3JkLnJ1blBhcnRzW2pdO1xuICAgICAgICAgICAgaWYgKHJwLnJ1bklEICE9PSBjdXJSdW5QYXJ0SUQpIHtcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCB3cmFwIHVwIGV4aXN0aW5nIHJ1blBhcnRcbiAgICAgICAgICAgICAgICBpZiAoY3VyUnVuUGFydElEID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UnVuUGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bklEOiBjdXJSdW5QYXJ0SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogY3VyUmFuZ2Uuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldHJpYzogbWVhc3VyZVRleHQoY3R4LCBnZXRTdWJUZXh0KGxvZ2ljTGluZSwgY3VyUmFuZ2UpLCBjdXJSdW4uc3R5bGUpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChuZXdSdW5QYXJ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBzdGFydCBhIG5ldyBydW5QYXJ0XG4gICAgICAgICAgICAgICAgY3VyUnVuUGFydElEID0gcnAucnVuSUQ7XG4gICAgICAgICAgICAgICAgY3VyUnVuID0gcnVuc1tjdXJSdW5QYXJ0SURdO1xuICAgICAgICAgICAgICAgIGN1clJhbmdlWzBdID0gcnAucmFuZ2VbMF07XG4gICAgICAgICAgICAgICAgY3VyUmFuZ2VbMV0gPSBycC5yYW5nZVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBjdXJSdW4ncyByYW5nZVsxXSBvbmx5XG4gICAgICAgICAgICAgICAgY3VyUmFuZ2VbMV0gPSBycC5yYW5nZVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBwdXNoIGxhc3QgcnVuUGFydFxuICAgIGlmIChjdXJSdW5QYXJ0SUQgPj0gMCkge1xuICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICBydW5JRDogY3VyUnVuUGFydElELFxuICAgICAgICAgICAgcmFuZ2U6IGN1clJhbmdlLnNsaWNlKCksXG4gICAgICAgICAgICBtZXRyaWM6IG1lYXN1cmVUZXh0KGN0eCwgZ2V0U3ViVGV4dChsb2dpY0xpbmUsIGN1clJhbmdlKSwgY3VyUnVuLnN0eWxlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG4vLyBzcGFjZSBiZXR3ZWVuIHdvcmRzIHRvIHNwYW4gdGhlIGxpbmUgYWNyb3NzIHRoZSBlZGl0b3Igd2lkdGhcbmV4cG9ydCBmdW5jdGlvbiBnZXRKdXN0aWZ5R2FwKHdsaW5lLCBlZGl0b3JXaWR0aCkge1xuICAgIGNvbnN0IGxpbmVXaWR0aCA9IHdsaW5lLm1ldHJpYy53aWR0aDtcbiAgICByZXR1cm4gMC41ICogKGxpbmVXaWR0aCAtIGVkaXRvcldpZHRoKTtcbn1cbi8vIHdoZXJlIHRvIHN0YXJ0IGVhY2ggbGluZVxuZXhwb3J0IGZ1bmN0aW9uIGdldExlZnRNYXJnaW4obGluZVdpZHRoLCBlZGl0b3JXaWR0aCwgYWxpZ25tZW50KSB7XG4gICAgaWYgKGFsaWdubWVudCA9PT0gVEVYVF9BTElHTk1FTlQuTEVGVCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYWxpZ25tZW50ID09PSBURVhUX0FMSUdOTUVOVC5SSUdIVCkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoZWRpdG9yV2lkdGggLSBsaW5lV2lkdGgsIDApO1xuICAgIH1cbiAgICBlbHNlIGlmIChhbGlnbm1lbnQgPT09IFRFWFRfQUxJR05NRU5ULkNFTlRFUikge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoKGVkaXRvcldpZHRoIC0gbGluZVdpZHRoKSAvIDIsIDApO1xuICAgIH1cbiAgICBlbHNlIGlmIChhbGlnbm1lbnQgPT09IFRFWFRfQUxJR05NRU5ULkpVU1RJRlkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ViVGV4dChsaW5lLCByYW5nZSkge1xuICAgIHJldHVybiBsaW5lLnRleHQuc2xpY2UocmFuZ2VbMF0sIHJhbmdlWzFdICsgMSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbFRleHRQb3NpdGlvbihwMCwgcDEpIHtcbiAgICByZXR1cm4gKHAwLmxpbmVJbmRleCA9PT0gcDEubGluZUluZGV4ICYmIHAwLnJ1bkluZGV4ID09PSBwMS5ydW5JbmRleCAmJiBwMC5jaGFySW5kZXggPT09IHAxLmNoYXJJbmRleCAmJiBwMC5lbmRPZkxpbmUgPT09IHAxLmVuZE9mTGluZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNTaW5nbGVJbnNlcnRpb25Qb2ludChzZWwpIHtcbiAgICByZXR1cm4gaXNFcXVhbFRleHRQb3NpdGlvbihzZWwuc3RhcnQsIHNlbC5lbmQpO1xufVxuLy8gZ2V0IHByZXZpb3VzIHBvc2l0aW9uIGluc2lkZSBhIGxvZ2ljIGxpbmUsIGlmIGFscmVhZHkgYXQgYmVnaW4sIHJldHVybiB1bmRlZmluZWRcbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmV2aW91c1Bvc2l0aW9uSW5MaW5lKGxpbmVzLCBwb3MpIHtcbiAgICAvLyBmaXJzdCBjaGFyIG9mIHRoaXMgbG9naWMgbGluZSwgY2Fubm90IG1vdmUgbGVmdCBhbnltb3JlXG4gICAgaWYgKGlzUG9zSGVhZChwb3MpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IGxpbmUgPSBsaW5lc1twb3MubGluZUluZGV4XTtcbiAgICAvLyBiZWhpbmQgdGhlIGxhc3QgY2hhciBvZiB0aGlzIGxvZ2ljIGxpbmUsIGdyYWIgdGhlIGxhc3QgY2hhclxuICAgIGlmIChwb3MuZW5kT2ZMaW5lID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGVtcHR5IGxpbmVcbiAgICAgICAgaWYgKGxpbmUucnVucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHNob3VsZCBub3QgcXVlcnkgcG9zaXRpb24gb24gZW1wdHkgbGluZSFgKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbmVJbmRleDogcG9zLmxpbmVJbmRleCxcbiAgICAgICAgICAgIHJ1bkluZGV4OiBsaW5lLnJ1bnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGNoYXJJbmRleDogbGluZS50ZXh0Lmxlbmd0aCAtIDEsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChwb3MuY2hhckluZGV4ID09PSBsaW5lLnJ1bnNbcG9zLnJ1bkluZGV4XS5yYW5nZVswXSkge1xuICAgICAgICAvLyBjdXJyZW50IGF0IGJvdW5kYXJ5IG9mIHR3byBydW5zKGFuZCBhbHNvIG5vdCB0aGUgZmlyc3QgcnVuKSwgY2hhbmdlIHRvIHByZXZpb3VzIHJ1blxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluZUluZGV4OiBwb3MubGluZUluZGV4LFxuICAgICAgICAgICAgcnVuSW5kZXg6IHBvcy5ydW5JbmRleCAtIDEsXG4gICAgICAgICAgICBjaGFySW5kZXg6IHBvcy5jaGFySW5kZXggLSAxLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gbW92ZSBsZWZ0IGluIGN1cnJlbnQgcnVuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHBvcy5saW5lSW5kZXgsXG4gICAgICAgICAgICBydW5JbmRleDogcG9zLnJ1bkluZGV4LFxuICAgICAgICAgICAgY2hhckluZGV4OiBwb3MuY2hhckluZGV4IC0gMSxcbiAgICAgICAgfTtcbiAgICB9XG59XG4vLyBnZXQgbmV4dCBwb3NpdGlvbiBpbnNpZGUgYSBsb2dpYyBsaW5lLCBpZiBhbHJlYWR5IGF0IGVuZCBvZiBsaW5lLCByZXR1cm4gdW5kZWZpbmVkXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFBvc2l0aW9uSW5MaW5lKGxpbmVzLCBwb3MpIHtcbiAgICBjb25zdCBsaW5lID0gbGluZXNbcG9zLmxpbmVJbmRleF07XG4gICAgLy8gZW1wdHkgbGluZSwgc3RheSBcbiAgICBpZiAoaXNFbXB0eUxpbmUobGluZSkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgc2hvdWxkIG5vdCBxdWVyeSBwb3NpdGlvbiBvbiBlbXB0eSBsaW5lIWApO1xuICAgICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgICBjb25zdCBydW5zID0gbGluZS5ydW5zO1xuICAgIC8vIGlmIGF0IGxhc3QgY2hhciBsb2dpYyBsaW5lLCByZXR1cm4gdGhlIGVuZC1vZi1saW5lIHBvc2l0aW9uXG4gICAgaWYgKHBvcy5ydW5JbmRleCA9PT0gcnVucy5sZW5ndGggLSAxICYmIHBvcy5jaGFySW5kZXggPT09IGxpbmUudGV4dC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHBvcy5saW5lSW5kZXgsXG4gICAgICAgICAgICBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSxcbiAgICAgICAgICAgIGNoYXJJbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSxcbiAgICAgICAgICAgIGVuZE9mTGluZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gaWYgYXQgZW5kIG9mIGxpbmUgcG9zaXRpb24gKGJhY2sgb2YgbGFzdCBjaGFyKSwgbm8gd2F5IHRvIG5leHRcbiAgICBpZiAocG9zLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBub3JtYWwgY2FzZTogaGFzIG5leHQgaW4gY3VycmVudCBsb2dpYyBsaW5lXG4gICAgY29uc3QgY3VyUnVuID0gcnVuc1twb3MucnVuSW5kZXhdO1xuICAgIGlmIChwb3MuY2hhckluZGV4ID09PSBjdXJSdW4ucmFuZ2VbMV0pIHtcbiAgICAgICAgLy8gcmVhY2hpbmcgZW5kIG9mIGN1cnJlbnQgcnVuLCBqdW1wIHRvIG5leHQgcnVuJ3MgYmVnaW5uaW5nXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHBvcy5saW5lSW5kZXgsXG4gICAgICAgICAgICBydW5JbmRleDogcG9zLnJ1bkluZGV4ICsgMSxcbiAgICAgICAgICAgIGNoYXJJbmRleDogcnVuc1twb3MucnVuSW5kZXggKyAxXS5yYW5nZVswXSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lSW5kZXg6IHBvcy5saW5lSW5kZXgsXG4gICAgICAgICAgICBydW5JbmRleDogcG9zLnJ1bkluZGV4LFxuICAgICAgICAgICAgY2hhckluZGV4OiBwb3MuY2hhckluZGV4ICsgMSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2xvbmVPYmoob2JqKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eUxpbmUobGluZSkge1xuICAgIHJldHVybiBsaW5lLnJ1bnMubGVuZ3RoID09PSAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHlXYXJwcGVkTGluZShsaW5lKSB7XG4gICAgcmV0dXJuIGxpbmUucnVuUGFydHMubGVuZ3RoID09PSAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpcnN0UG9zT2ZMaW5lKGxpbmVzLCBsaW5lSW5kZXgpIHtcbiAgICAvLyBmb3IgZW1wdHkgbGluZSwgcG9zaXRpb24gaXMgc3RpbGwgYSB2YWxpZCBwb3NpdGlvbiwgYWx0aG91Z2ggY2Fubm90IHF1ZXJ5IGZvciBjb250ZW50XG4gICAgaWYgKGlzRW1wdHlMaW5lKGxpbmVzW2xpbmVJbmRleF0pKSB7XG4gICAgICAgIHJldHVybiB7IGxpbmVJbmRleCwgcnVuSW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsIGNoYXJJbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgZW5kT2ZMaW5lOiB0cnVlIH07XG4gICAgfVxuICAgIC8vIHJldHVybiBmaXJzdCBjaGFyIG9mIGZpcnN0IHJ1blxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbmVJbmRleCxcbiAgICAgICAgcnVuSW5kZXg6IDAsXG4gICAgICAgIGNoYXJJbmRleDogMCxcbiAgICB9O1xufVxuLy8gcmV0dXJuIGVuZC1vZi1saW5lIHBvc2l0aW9uXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFzdFBvc09mTGluZShsaW5lcywgbGluZUluZGV4KSB7XG4gICAgcmV0dXJuIHsgbGluZUluZGV4LCBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFLCBlbmRPZkxpbmU6IHRydWUgfTtcbn1cbi8vIHF1ZXJ5IHBvc2l0aW9uIGluc2lkZSB0aGUgd2hvbGUgZG9jLCBub3QgbGltaXRlZCB0byBvbmUgc2luZ2xlIGxvZ2ljIGxpbmVcbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmV2aW91c1Bvc2l0aW9uKGxpbmVzLCBwb3MpIHtcbiAgICBjb25zdCBsaW5lID0gbGluZXNbcG9zLmxpbmVJbmRleF07IC8vIGxpbmVJbmRleCBzaG91bGQgYWx3YXlzIGJlIHZhbGlkLCBydW5JbmRleCwgY2hhckluZGV4IG1heSBub3RcbiAgICAvLyBjdXJyZW50IGxpbmUgaXMgYW4gZW1wdHkgbGluZVxuICAgIGlmIChpc0VtcHR5TGluZShsaW5lKSkge1xuICAgICAgICAvLyBtb3ZlIHRvIHByZXZpb3VzIGxpbmUncyBlbmRcbiAgICAgICAgaWYgKHBvcy5saW5lSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TGFzdFBvc09mTGluZShsaW5lcywgcG9zLmxpbmVJbmRleCAtIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHByZSA9IGdldFByZXZpb3VzUG9zaXRpb25JbkxpbmUobGluZXMsIHBvcyk7XG4gICAgaWYgKHByZSkge1xuICAgICAgICAvLyBjYW4ganVtcCB0byBwcmUgaW5zaWRlIGN1cnJlbnQgbGluZVxuICAgICAgICByZXR1cm4gcHJlO1xuICAgIH1cbiAgICAvLyBwcmUgaXMgdW5kZWZpbmVkIGluIHR3byBjYXNlczogMS4gc2hvdWxkIGp1bXAgdG8gcHJldmlvdXMgbGluZSwgMi4gbm8gd2hlcmUgdG8ganVtcFxuICAgIGlmIChwb3MubGluZUluZGV4ID09PSAwKSB7XG4gICAgICAgIC8vIG5vIHdoZXJlIHRvIGp1bXBcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGp1bXAgdG8gcHJldmlvdXMgbGluZSdzIGVuZFxuICAgICAgICByZXR1cm4gZ2V0TGFzdFBvc09mTGluZShsaW5lcywgcG9zLmxpbmVJbmRleCAtIDEpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXh0UG9zaXRpb24obGluZXMsIHBvcykge1xuICAgIGNvbnN0IGxpbmUgPSBsaW5lc1twb3MubGluZUluZGV4XTsgLy8gbGluZUluZGV4IHNob3VsZCBhbHdheXMgYmUgdmFsaWQsIHJ1bkluZGV4LCBjaGFySW5kZXggbWF5IG5vdFxuICAgIC8vIGN1cnJlbnQgbGluZSBpcyBhbiBlbXB0eSBsaW5lXG4gICAgaWYgKGlzRW1wdHlMaW5lKGxpbmUpKSB7XG4gICAgICAgIC8vIG1vdmUgdG8gbmV4dCBsaW5lJ3MgYmVnaW5uaW5nXG4gICAgICAgIGlmIChwb3MubGluZUluZGV4ID09PSBsaW5lcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Rmlyc3RQb3NPZkxpbmUobGluZXMsIHBvcy5saW5lSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldEZpcnN0UG9zT2ZMaW5lKGxpbmVzLCBwb3MubGluZUluZGV4ICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbmV4dCA9IGdldE5leHRQb3NpdGlvbkluTGluZShsaW5lcywgcG9zKTtcbiAgICBpZiAobmV4dCkge1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgLy8gbm93IHByZSBpcyB1bmRlZmluZWQgaW4gdHdvIGNhc2VzOiAxLiBuZWVkIHRvIGp1bXAgdG8gbmV4dCBsaW5lIDIuIG5vIHdoZXJlIHRvIGp1bXBcbiAgICBpZiAocG9zLmxpbmVJbmRleCA9PT0gbGluZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8ganVtcCB0byBuZXh0IGxpbmUncyBiZWdpbm5pbmdcbiAgICAgICAgcmV0dXJuIGdldEZpcnN0UG9zT2ZMaW5lKGxpbmVzLCBwb3MubGluZUluZGV4ICsgMSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExpbmVFbmRQb3NpdGlvbih3bGluZSkge1xuICAgIHJldHVybiB7IGxpbmVJbmRleDogd2xpbmUucGFyZW50TGluZSwgcnVuSW5kZXg6IElOVkFMSURfSU5ERVhfVkFMVUUsIGNoYXJJbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgZW5kT2ZMaW5lOiB0cnVlIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVPZkxpbmUobGluZXMsIGxpbmVJRCkge1xuICAgIGlmIChpc0VtcHR5TGluZShsaW5lc1tsaW5lSURdKSkge1xuICAgICAgICBpZiAobGluZUlEID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIERFRkFVTFRfVEVYVF9TVFlMRTtcbiAgICAgICAgcmV0dXJuIGdldFN0eWxlT2ZMaW5lKGxpbmVzLCBsaW5lSUQgLSAxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBsaW5lc1tsaW5lSURdLnJ1bnNbMF0uc3R5bGU7XG4gICAgfVxufVxuLy8gZ2V0IHN0eWxlIG9ubHkgdGFyZ2V0IG9uZSBzcGVjaWZpYyBsb2dpYyBsaW5lLCBhIHBvc2l0aW9uIGlzIGluc2lkZSBhIHJ1biBvciBvbiBib3VuZGFyeSBvZiB0d28gcnVuc1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlQXRQb3NpdGlvbihsaW5lcywgcG9zKSB7XG4gICAgLy8gbm9ybWFsbHkgZmV0Y2ggc3R5bGUgZnJvbSBwcmV2aW91cyBwb3MgaW4gY3VycmVudCBsb2dpYyBsaW5lLCBidXQgaWYgbm8gcHJldmlvdXMgcG9zIGZvciB0aGlzIGxpbmUsIHVzZSBuZXh0IHBvcywgb3RoZXJ3aXNlIHVzZSBkZWZhdWx0XG4gICAgY29uc3QgbGluZSA9IGxpbmVzW3Bvcy5saW5lSW5kZXhdO1xuICAgIC8vIGVtcHR5IGxpbmU6IHJldHVybiBkZWZhdWx0IHN0eWxlXG4gICAgaWYgKGlzRW1wdHlMaW5lKGxpbmUpKSB7XG4gICAgICAgIHJldHVybiBERUZBVUxUX1RFWFRfU1RZTEU7XG4gICAgfVxuICAgIC8vIHBvc2l0aW9uIGlzIGVuZC1vZi1saW5lLCByZXR1cm4gbGFzdCBydW4gb2YgY3VycmVudCBsaW5lXG4gICAgaWYgKHBvcy5lbmRPZkxpbmUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGxpbmUucnVuc1tsaW5lLnJ1bnMubGVuZ3RoIC0gMV0uc3R5bGU7XG4gICAgfVxuICAgIC8vIHBvc2l0aW9uIGlzIGluIHRoZSBtaWRkbGUgb2YgY3VycmVudCBsaW5lOiAxLiBpZiBpcyBoZWFkLCBmZXRjaCBjdXJyZW50IHBvc2l0aW9uLCAyLiBmZXRjaCBwcmV2aW91cyBwb3NpdGlvbidzIHN0eWxlXG4gICAgaWYgKGlzUG9zSGVhZChwb3MpKSB7XG4gICAgICAgIC8vIGZldGNoIGZpcnN0IHJ1bidzIHN0eWxlXG4gICAgICAgIHJldHVybiBsaW5lLnJ1bnNbcG9zLnJ1bkluZGV4XS5zdHlsZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGZldGNoIHByZXZpb3VzIGNoYXIncyBzdHlsZVxuICAgICAgICBjb25zdCBwcmUgPSBnZXRQcmV2aW91c1Bvc2l0aW9uSW5MaW5lKGxpbmVzLCBwb3MpO1xuICAgICAgICBpZiAoIXByZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgcHJlIHNob3VsZCBub3QgYmUgdW5kZWZpbmVkIGhlcmUhYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmUucnVuc1twcmUucnVuSW5kZXhdLnN0eWxlO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYXJSZXR1cm4oY2hhcikge1xuICAgIHJldHVybiBCb29sZWFuKGNoYXIubWF0Y2goL1xcbi8pKSAmJiBjaGFyLmxlbmd0aCA9PT0gMTtcbn1cbi8vIGN1dCBhIGxpbmUgYXQgcG9zLCByZXR1cm4gdGhlIG1vZGlmaWVkIHByZS1jdXQgbGluZSBpbiBwbGFjZVxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZUN1dExpbmUobGluZSwgcG9zKSB7XG4gICAgLy8gaGVhZCBhbmQgdGFpbCBwb3NpdGlvblxuICAgIGlmIChpc1Bvc0hlYWQocG9zKSlcbiAgICAgICAgcmV0dXJuIHsgcnVuczogW10sIHRleHQ6ICcnLCB0ZXh0SW5kZW50OiBsaW5lLnRleHRJbmRlbnQgfTtcbiAgICBpZiAoaXNQb3NUYWlsKHBvcykpXG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIC8vIHJlbW92ZSBjaGFycyBhZnRlciB0aGUgY3V0IHBvc2l0aW9uXG4gICAgY29uc3QgY3V0UnVuSW5kZXggPSBwb3MuY2hhckluZGV4ID09PSBsaW5lLnJ1bnNbcG9zLnJ1bkluZGV4XS5yYW5nZVswXSA/IHBvcy5ydW5JbmRleCAtIDEgOiBwb3MucnVuSW5kZXg7XG4gICAgY29uc3QgcHJlTGluZSA9IGNsb25lT2JqKGxpbmUpO1xuICAgIC8vIGFueSBmdWxsIHJ1biBiZWhpbmQgaXQgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICBwcmVMaW5lLnJ1bnMuc3BsaWNlKGN1dFJ1bkluZGV4ICsgMSk7XG4gICAgLy8gbW9kaWZ5IHRoZSBjdXQgcnVuIChub3cgdGhlIGxhc3QgcnVuKSwgYW55IGNoYXIgYmVoaW5kIHRoZSBjYXJldCB3aWxsIGJlIHJlbW92ZWRcbiAgICBjb25zdCBjdXRSdW4gPSBwcmVMaW5lLnJ1bnNbY3V0UnVuSW5kZXhdO1xuICAgIGN1dFJ1bi5yYW5nZVsxXSA9IHBvcy5jaGFySW5kZXggPT09IGxpbmUucnVuc1twb3MucnVuSW5kZXhdLnJhbmdlWzBdID8gY3V0UnVuLnJhbmdlWzFdIDogcG9zLmNoYXJJbmRleCAtIDE7XG4gICAgLy8gdXBkYXRlIHRleHRcbiAgICBwcmVMaW5lLnRleHQgPSBwcmVMaW5lLnRleHQuc2xpY2UoMCwgY3V0UnVuLnJhbmdlWzFdICsgMSk7XG4gICAgcmV0dXJuIHByZUxpbmU7XG59XG4vLyBjdXQgYSBsaW5lIGF0IHBvcywgcmV0dXJuIHRoZSBtb2RpZmllZCBwb3N0LWN1dCBsaW5lIGluIHBsYWNlXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zdEN1dExpbmUobGluZSwgcG9zKSB7XG4gICAgLy8gaGVhZCBhbmQgdGFpbCBwb3NpdGlvblxuICAgIGlmIChpc1Bvc0hlYWQocG9zKSlcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgaWYgKGlzUG9zVGFpbChwb3MpKVxuICAgICAgICByZXR1cm4geyBydW5zOiBbXSwgdGV4dDogJycgfTtcbiAgICBjb25zdCBwb3N0TGluZSA9IGNsb25lT2JqKGxpbmUpO1xuICAgIC8vIGFueSBydW4gYmVmb3JlIGN1dCBwb3NpdGlvbiBzaG91bGQgYmUgcmVtb3ZlZFxuICAgIHBvc3RMaW5lLnJ1bnMgPSBwb3N0TGluZS5ydW5zLnNsaWNlKHBvcy5ydW5JbmRleCk7XG4gICAgLy8gbW9kaWZ5IHRoZSBjdXQgcnVuIChub3cgdGhlIGZpcnN0IHJ1bikgYnkgcmVtb3ZpbmcgY2hhcnMgYmVmb3JlIHRoZSBjdXRcbiAgICBjb25zdCBjdXRSdW4gPSBwb3N0TGluZS5ydW5zWzBdO1xuICAgIGN1dFJ1bi5yYW5nZVswXSA9IHBvcy5jaGFySW5kZXg7XG4gICAgY29uc3Qgc3RhcnRJZHggPSBjdXRSdW4ucmFuZ2VbMF07IC8vIG9sZCBjaGFyIGluZGV4IC0+IDBcbiAgICAvLyBldmVyeSByYW5nZSBhZnRlciB0aGUgY3V0IHNob3VsZCBiZSB1cGRhdGVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3N0TGluZS5ydW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBvc3RMaW5lLnJ1bnNbaV0ucmFuZ2VbMF0gLT0gc3RhcnRJZHg7XG4gICAgICAgIHBvc3RMaW5lLnJ1bnNbaV0ucmFuZ2VbMV0gLT0gc3RhcnRJZHg7XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0ZXh0XG4gICAgcG9zdExpbmUudGV4dCA9IHBvc3RMaW5lLnRleHQuc2xpY2Uoc3RhcnRJZHgpO1xuICAgIHJldHVybiBwb3N0TGluZTtcbn1cbi8vIHJldHVybiB0aGUgaW5kZXggb2YgY2hhciBiZWZvcmUgdGhlIHBvc1xuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJJbmRleEJlZm9yZVBvcyhsaW5lLCBwb3MpIHtcbiAgICBpZiAoaXNQb3NUYWlsKHBvcykpIHtcbiAgICAgICAgcmV0dXJuIGxpbmUudGV4dC5sZW5ndGggLSAxO1xuICAgIH1cbiAgICByZXR1cm4gcG9zLmNoYXJJbmRleCAtIDE7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zSW5kZXhGcm9tQ2hhckluZGV4KHJ1bnMsIGluZGV4KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBydW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpblJhbmdlKGluZGV4LCBydW5zW2ldLnJhbmdlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBydW5JbmRleDogaSxcbiAgICAgICAgICAgICAgICBjaGFySW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBydW5JbmRleDogSU5WQUxJRF9JTkRFWF9WQUxVRSwgY2hhckluZGV4OiBJTlZBTElEX0lOREVYX1ZBTFVFIH07XG59XG5leHBvcnQgZnVuY3Rpb24gb2Zmc2V0UmFuZ2UocnVucywgb2ZmKSB7XG4gICAgcnVucy5mb3JFYWNoKHJ1biA9PiB7XG4gICAgICAgIHJ1bi5yYW5nZVswXSArPSBvZmY7XG4gICAgICAgIHJ1bi5yYW5nZVsxXSArPSBvZmY7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gcG9zaXRpb25MZXNzKHAwLCBwMSkge1xuICAgIGlmIChwMC5saW5lSW5kZXggPCBwMS5saW5lSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHAwLmxpbmVJbmRleCA+IHAxLmxpbmVJbmRleCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyB0d28gcG9zaXRpb25zIGFyZSBpbiBzYW1lIGxpbmVcbiAgICAgICAgaWYgKHAwLmVuZE9mTGluZSA9PT0gdHJ1ZSAmJiBwMS5lbmRPZkxpbmUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwMC5lbmRPZkxpbmUgPT09IHRydWUgJiYgcDEuZW5kT2ZMaW5lID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocDAuZW5kT2ZMaW5lICE9PSB0cnVlICYmIHAxLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcDAuY2hhckluZGV4IDwgcDEuY2hhckluZGV4O1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHBvc2l0aW9uTGVzc09yRXF1YWwocDAsIHAxKSB7XG4gICAgaWYgKHAwLmxpbmVJbmRleCA8IHAxLmxpbmVJbmRleCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAocDAubGluZUluZGV4ID4gcDEubGluZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChwMC5lbmRPZkxpbmUgPT09IHRydWUgJiYgcDEuZW5kT2ZMaW5lICE9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocDAuZW5kT2ZMaW5lID09PSB0cnVlICYmIHAxLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocDAuZW5kT2ZMaW5lICE9PSB0cnVlICYmIHAxLmVuZE9mTGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcDAuY2hhckluZGV4IDw9IHAxLmNoYXJJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3Rpb25Jc0VtcHR5KHNlbCkge1xuICAgIGlmICghc2VsKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2VsLnN0YXJ0KSA9PT0gSlNPTi5zdHJpbmdpZnkoc2VsLmVuZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ2hhckZyb21UZXh0KHN0ciwgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHN0ci5sZW5ndGgpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYG91dCBvZiByYW5nZSByZW1vdmluZyBjaGFyYCk7XG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCBpbmRleCkgKyBzdHIuc2xpY2UoaW5kZXggKyAxKTtcbn1cbi8vIHNoaWZ0IGFsbCBpbmRpY2VzIGFmdGVyIGNlcnRhaW4gcG9zXG5leHBvcnQgZnVuY3Rpb24gb2Zmc2V0UmFuZ2VGcm9tUG9zKHJ1bnMsIG9mZiwgc3RhcnQpIHtcbiAgICBjb25zdCBpMCA9IGdldFBvc0luZGV4RnJvbUNoYXJJbmRleChydW5zLCBzdGFydCkucnVuSW5kZXg7XG4gICAgZm9yIChsZXQgaSA9IGkwOyBpIDwgcnVucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBydW4gPSBydW5zW2ldO1xuICAgICAgICBpZiAoaSAhPT0gaTApIHtcbiAgICAgICAgICAgIHJ1bi5yYW5nZVswXSArPSBvZmY7XG4gICAgICAgIH1cbiAgICAgICAgcnVuLnJhbmdlWzFdICs9IG9mZjtcbiAgICB9XG4gICAgLy8gaWYgcnVuc1tpMF0gYmVlbiBzcXVhc2hlZCwgcmVtb3ZlIGl0XG4gICAgaWYgKHJ1bnNbaTBdLnJhbmdlWzBdID4gcnVuc1tpMF0ucmFuZ2VbMV0pIHtcbiAgICAgICAgcnVucy5zcGxpY2UoaTAsIDEpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRXcmFwcGVkTGluZVdpZHRoKHdsaW5lKSB7XG4gICAgaWYgKCF3bGluZS5tZXRyaWMpXG4gICAgICAgIHJldHVybiAwO1xuICAgIHJldHVybiB3bGluZS5tZXRyaWMud2lkdGg7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0V3JhcHBlZExpbmVIZWlnaHQod2xpbmUpIHtcbiAgICBpZiAoIXdsaW5lLm1ldHJpYylcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgcmV0dXJuIHdsaW5lLm1ldHJpYy5hc2NlbnQgKyB3bGluZS5tZXRyaWMuZGVzY2VudDtcbn1cbi8vIG1lcmdlIHR3byBsaW5lcyBpbnRvIGEgc2luZ2xlIGxpbmUgd2l0aG91dCBtZXJnaW5nIHJ1bnMsIHdvbid0IG92ZXJ3cml0ZSBsaW5lQSwgbGluZUJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxpbmUobGluZUEsIGxpbmVCKSB7XG4gICAgdmFyIF9hO1xuICAgIGlmIChpc0VtcHR5TGluZShsaW5lQikpXG4gICAgICAgIHJldHVybiBsaW5lQTtcbiAgICBpZiAoaXNFbXB0eUxpbmUobGluZUEpKVxuICAgICAgICByZXR1cm4gbGluZUI7XG4gICAgY29uc3QgQXJ1bnMgPSBsaW5lQS5ydW5zLnNsaWNlKCk7XG4gICAgY29uc3QgQnJ1bnMgPSBsaW5lQi5ydW5zLnNsaWNlKCk7XG4gICAgY29uc3Qgb2ZmID0gbGluZUEudGV4dC5sZW5ndGg7XG4gICAgb2Zmc2V0UmFuZ2UoQnJ1bnMsIG9mZik7XG4gICAgY29uc3QgQWxhc3RSdW4gPSBBcnVuc1tBcnVucy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBCZmlyc3RSdW4gPSBCcnVuc1swXTtcbiAgICAvLyBzZWUgaWYgd2UgY2FuIG1lcmdlIGJvdW5kYXJ5IHJ1bnNcbiAgICBpZiAoaXNTdHlsZUVxdWFsKEFsYXN0UnVuLnN0eWxlLCBCZmlyc3RSdW4uc3R5bGUpKSB7XG4gICAgICAgIEFsYXN0UnVuLnJhbmdlWzFdID0gQmZpcnN0UnVuLnJhbmdlWzFdO1xuICAgICAgICBCcnVucy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIGNvbnN0IG5ld0xpbmUgPSB7XG4gICAgICAgIHRleHRJbmRlbnQ6IChfYSA9IGxpbmVBLnRleHRJbmRlbnQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHVuZGVmaW5lZCxcbiAgICAgICAgcnVuczogQXJ1bnMuY29uY2F0KEJydW5zKSxcbiAgICAgICAgdGV4dDogbGluZUEudGV4dCArIGxpbmVCLnRleHQsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3TGluZTtcbn1cbi8vIGRlbGV0ZSBzZWxlY3RlZCB0ZXh0LCBtdXRhdGUgbG9naWNsaW5lcywgbWF5IHJldHVybiBjYXJldFxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVRleHQobGluZXMsIHNlbCkge1xuICAgIGlmIChpc1NpbmdsZUluc2VydGlvblBvaW50KHNlbCkpXG4gICAgICAgIHJldHVybjtcbiAgICAvLyBjdXQgdGhlIHN0YXJ0IHJ1blxuICAgIGNvbnN0IHN0YXJ0Q3V0TGluZSA9IGxpbmVzW3NlbC5zdGFydC5saW5lSW5kZXhdO1xuICAgIGNvbnN0IHByZUxpbmUgPSBnZXRQcmVDdXRMaW5lKHN0YXJ0Q3V0TGluZSwgc2VsLnN0YXJ0KTtcbiAgICAvLyBjdXQgdGhlIGVuZCBydW5cbiAgICBjb25zdCBlbmRDdXRMaW5lID0gbGluZXNbc2VsLmVuZC5saW5lSW5kZXhdO1xuICAgIGNvbnN0IHBvc3RMaW5lID0gZ2V0UG9zdEN1dExpbmUoZW5kQ3V0TGluZSwgc2VsLmVuZCk7XG4gICAgLy8gbWVyZ2UgcHJlIGFuZCBwb3N0XG4gICAgbWVyZ2VMaW5lKHByZUxpbmUsIHBvc3RMaW5lKTtcbn1cbi8vIGJyZWFrbGluZSBtYXkgaGFwcGVuIGF0IGJlZ2luLCBlbmQgb3IgbWlkZGxlXG5leHBvcnQgZnVuY3Rpb24gYnJlYWtMaW5lQXRQb3NpdGlvbihsaW5lcywgcG9zKSB7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNMaW5lRW1wdHkobGluZSkge1xuICAgIHJldHVybiBsaW5lLnJ1bnMubGVuZ3RoID09PSAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCcmVha01ldGFDaGFyKHN0ciwgY2hhciA9ICdcXG4nKSB7XG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgaWYgKHN0ci5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIHdoaWxlICgoaW5kZXggPSBzdHIuaW5kZXhPZihjaGFyLCBsYXN0KSkgIT09IC0xKSB7XG4gICAgICAgIHJldC5wdXNoKGluZGV4KTtcbiAgICAgICAgbGFzdCA9IGluZGV4ICsgMTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvc0hlYWQocG9zKSB7XG4gICAgcmV0dXJuIHBvcy5ydW5JbmRleCA9PT0gMCAmJiBwb3MuY2hhckluZGV4ID09PSAwICYmICFwb3MuZW5kT2ZMaW5lO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9zVGFpbChwb3MpIHtcbiAgICByZXR1cm4gcG9zLmVuZE9mTGluZSA9PT0gdHJ1ZTtcbn1cbi8vIGlmIHN0cmluZyBkb24ndCBoYXZlIGxpbmUtYnJlYWssIHdlIGNhbiBjcmVhdGUgYSBsb2dpYyBsaW5lIHdpdGggc2luZ2xlIHJ1blxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2ljTGluZUZyb21TdHJpbmcoc3RyLCBzdHlsZSwgdGV4dEluZGVudCkge1xuICAgIGNvbnN0IGhhc0xpbmVCcmVhayA9IGZpbmRCcmVha01ldGFDaGFyKHN0ciwgJ1xcbicpLmxlbmd0aCA+IDA7XG4gICAgaWYgKGhhc0xpbmVCcmVhaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBzdHIgaXMgZW1wdHkgb3Igc3RyaW5nIGhhcyBcXFxcbiB3aGVuIGdldExvZ2ljTGluZUZyb21TdHJpbmdgKTtcbiAgICB9XG4gICAgaWYgKHN0ciA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHRJbmRlbnQsXG4gICAgICAgICAgICBydW5zOiBbXSxcbiAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0SW5kZW50LFxuICAgICAgICBydW5zOiBbe1xuICAgICAgICAgICAgICAgIHN0eWxlLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBbMCwgc3RyLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgIHRleHQ6IHN0cixcbiAgICB9O1xufVxuLy8gdXBkYXRpbmcgcGFydCBvZiBhbiBleGlzdGluZyBydW4gbWF5IGJyZWFrIGl0IGludG8gMSwyLDMgcGFydHMsIGFsc28gbmVlZCB0byByZWNhbGMgbGF5aW91dFxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVJ1blN0eWxlKHJ1bnMsIHJ1bklELCBjaGFuZ2VSYW5nZSwgc3R5bGUpIHtcbiAgICBpZiAoIWluUmFuZ2UocnVuSUQsIFswLCBydW5zLmxlbmd0aCAtIDFdKSlcbiAgICAgICAgY29uc29sZS5lcnJvcihgcnVuSUQgaXMgb3V0IG9mIHJhbmdlYCk7XG4gICAgY29uc3QgcnVuID0gcnVuc1tydW5JRF07XG4gICAgY29uc3QgcmFuZ2UgPSBydW4ucmFuZ2U7XG4gICAgaWYgKGNoYW5nZVJhbmdlWzBdIDwgcmFuZ2VbMF0gfHwgY2hhbmdlUmFuZ2VbMV0gPiByYW5nZVsxXSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBzdHlsZSBjaGFuZ2VSYW5nZSBpcyBvdXQgb2YgcmFuZ2VgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvbGRTdHlsZSA9IHJ1bi5zdHlsZTtcbiAgICBjb25zdCBuZXdTdHlsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcnVuLnN0eWxlKSwgc3R5bGUpO1xuICAgIGlmIChjaGFuZ2VSYW5nZVswXSA9PT0gcmFuZ2VbMF0gJiYgY2hhbmdlUmFuZ2VbMV0gPT09IHJhbmdlWzFdKSB7XG4gICAgICAgIC8vIG5vIGNoYW5nZSB0byBydW5zXG4gICAgICAgIHJ1bi5zdHlsZSA9IG5ld1N0eWxlO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaGFuZ2VSYW5nZVswXSA9PT0gcmFuZ2VbMF0gJiYgY2hhbmdlUmFuZ2VbMV0gPCByYW5nZVsxXSkge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIGZvcm1lciBwYXJ0XG4gICAgICAgIGNvbnN0IGxlZnRSdW4gPSB7XG4gICAgICAgICAgICBzdHlsZTogbmV3U3R5bGUsXG4gICAgICAgICAgICByYW5nZTogW3JhbmdlWzBdLCBjaGFuZ2VSYW5nZVsxXV0sXG4gICAgICAgIH07XG4gICAgICAgIHJ1bi5yYW5nZVswXSA9IGNoYW5nZVJhbmdlWzFdICsgMTtcbiAgICAgICAgcnVucy5zcGxpY2UocnVuSUQsIDAsIGxlZnRSdW4pO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaGFuZ2VSYW5nZVswXSA+IHJhbmdlWzBdICYmIGNoYW5nZVJhbmdlWzFdID09PSByYW5nZVsxXSkge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIGxhdGVyIHBhcnRcbiAgICAgICAgY29uc3QgcmlnaHRSdW4gPSB7XG4gICAgICAgICAgICBzdHlsZTogbmV3U3R5bGUsXG4gICAgICAgICAgICByYW5nZTogW2NoYW5nZVJhbmdlWzBdLCByYW5nZVsxXV0sXG4gICAgICAgIH07XG4gICAgICAgIHJ1bi5yYW5nZVsxXSA9IGNoYW5nZVJhbmdlWzBdIC0gMTtcbiAgICAgICAgcnVucy5zcGxpY2UocnVuSUQgKyAxLCAwLCByaWdodFJ1bik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIG1pZGRsZSBwYXJ0XG4gICAgICAgIGNvbnN0IGxlZnRSdW4gPSB7XG4gICAgICAgICAgICBzdHlsZTogb2xkU3R5bGUsXG4gICAgICAgICAgICByYW5nZTogW3JhbmdlWzBdLCBjaGFuZ2VSYW5nZVswXSAtIDFdLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtaWRkbGVSdW4gPSB7XG4gICAgICAgICAgICBzdHlsZTogbmV3U3R5bGUsXG4gICAgICAgICAgICByYW5nZTogY2hhbmdlUmFuZ2UsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJpZ2h0UnVuID0ge1xuICAgICAgICAgICAgc3R5bGU6IG9sZFN0eWxlLFxuICAgICAgICAgICAgcmFuZ2U6IFtjaGFuZ2VSYW5nZVsxXSArIDEsIHJhbmdlWzFdXSxcbiAgICAgICAgfTtcbiAgICAgICAgcnVucy5zcGxpY2UocnVuSUQsIDEsIGxlZnRSdW4sIG1pZGRsZVJ1biwgcmlnaHRSdW4pO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1RleHRQb3NWYWxpZChsaW5lcywgcG9zKSB7XG4gICAgaWYgKGlzUG9zVGFpbChwb3MpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gaW5SYW5nZShwb3MuY2hhckluZGV4LCBsaW5lc1twb3MubGluZUluZGV4XS5ydW5zW3Bvcy5ydW5JbmRleF0ucmFuZ2UpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uUnVuSW5kZXgobGluZXMsIHBvcykge1xuICAgIGlmIChpc1Bvc1RhaWwocG9zKSlcbiAgICAgICAgcmV0dXJuIHBvcztcbiAgICBpZiAoaXNUZXh0UG9zVmFsaWQobGluZXMsIHBvcykpXG4gICAgICAgIHJldHVybiBwb3M7XG4gICAgY29uc3QgcnVuSW5kZXggPSBnZXRSdW5JbmRleEF0Q2hhcihsaW5lcywgcG9zLmxpbmVJbmRleCwgcG9zLmNoYXJJbmRleCk7XG4gICAgaWYgKHJ1bkluZGV4ICE9PSBJTlZBTElEX0lOREVYX1ZBTFVFKSB7XG4gICAgICAgIHJldHVybiB7IGxpbmVJbmRleDogcG9zLmxpbmVJbmRleCwgcnVuSW5kZXgsIGNoYXJJbmRleDogcG9zLmNoYXJJbmRleCB9O1xuICAgIH1cbiAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIGNvbnNvbGUuZXJyb3IoYFRleHRQb3NpdGlvbiBpcyBpbnZhbGlkIHdoZW4gY2FsbCB1cGRhdGVQb3NpdGlvblJ1bkluZGV4YCk7XG4gICAgcmV0dXJuIElOVkFMSURfVEVYVF9QT1NJVElPTjtcbn1cbi8vIGNhbGMgcnVuSW5kZXggYnkgdGhlIGNoYXIgcG9zaXRpb25cbmV4cG9ydCBmdW5jdGlvbiBnZXRSdW5JbmRleEF0Q2hhcihsaW5lcywgbGluZUluZGV4LCBjaGFySW5kZXgpIHtcbiAgICBpZiAobGluZUluZGV4ID09PSBJTlZBTElEX0lOREVYX1ZBTFVFIHx8IGNoYXJJbmRleCA9PT0gSU5WQUxJRF9JTkRFWF9WQUxVRSlcbiAgICAgICAgcmV0dXJuIElOVkFMSURfSU5ERVhfVkFMVUU7XG4gICAgY29uc3QgbGluZSA9IGxpbmVzW2xpbmVJbmRleF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lLnJ1bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcnVuID0gbGluZS5ydW5zW2ldO1xuICAgICAgICBpZiAoaW5SYW5nZShjaGFySW5kZXgsIHJ1bi5yYW5nZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgY29uc29sZS5lcnJvcihgZmFpbGVkIHdoZW4gY2FsbCBnZXRSdW5JbmRleEF0Q2hhcmApO1xuICAgIHJldHVybiBJTlZBTElEX0lOREVYX1ZBTFVFO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZFhScGJDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTkxZEdsc0xuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVc1RVRkJUU3hoUVVGaExFTkJRVU03UVVGRGRFTXNUMEZCVHl4RlFVRkZMR3RDUVVGclFpeEZRVUZGTEcxQ1FVRnRRaXhGUVVGRkxIRkNRVUZ4UWl4RlFVRkZMRmxCUVZrc1JVRkJLMFlzWTBGQll5eEZRVUZGTEZkQlFWY3NSVUZCUlN4alFVRmpMRVZCUVhGQ0xFMUJRVTBzVTBGQlV5eERRVUZETzBGQlJYQlJMRTFCUVUwc1ZVRkJWU3hqUVVGakxFTkJRVU1zVDBGQmNVSTdTVUZEYkVRc1VVRkJVU3hQUVVGUExFVkJRVVU3VVVGRFppeExRVUZMTEZsQlFWa3NRMEZCUXl4TlFVRk5PMWxCUTNSQ0xFOUJRVThzUlVGQlJTeERRVUZETzFGQlExb3NTMEZCU3l4WlFVRlpMRU5CUVVNc1NVRkJTVHRaUVVOd1FpeFBRVUZQTEVOQlFVTXNRMEZCUXp0UlFVTllMRXRCUVVzc1dVRkJXU3hEUVVGRExGVkJRVlU3V1VGRE1VSXNUMEZCVHl4RlFVRkZMRU5CUVVNN1VVRkRXaXhMUVVGTExGbEJRVmtzUTBGQlF5eE5RVUZOTzFsQlEzUkNMRTlCUVU4c1JVRkJSU3hEUVVGRE8xRkJRMW83V1VGRFJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0TFFVTmFPMEZCUTBnc1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeFpRVUZaTEVOQlFVTXNTMEZCZFVJN1NVRkRiRVFzVDBGQlR5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGREwwTXNRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3h0UWtGQmJVSXNRMEZCUXl4TFFVRm5RanRKUVVOc1JDeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1MwRkJTeXhYUVVGWExFTkJRVU1zUzBGQlN5eEpRVUZKTEV0QlFVc3NRMEZCUXl4TlFVRk5MRXRCUVVzc1YwRkJWeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVONFNDeERRVUZETzBGQlJVUXNUVUZCVFN4VlFVRlZMR05CUVdNc1EwRkJReXhMUVVGblFqdEpRVU0zUXl4TlFVRk5MRkZCUVZFc1IwRkJSeXh0UWtGQmJVSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVNMVF5eE5RVUZOTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1lVRkJZU3hMUVVGTExHTkJRV01zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNZVUZCWVN4SFFVRkhMRWRCUVVjc1EwRkJReXhEUVVGRE8wbEJRMjVITEU5QlFVOHNVMEZCVXl4SFFVRkhMRkZCUVZFc1IwRkJSeXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTnVSQ3hEUVVGRE8wRkJSVVFzVTBGQlV5eFpRVUZaTEVOQlFVTXNSVUZCWVN4RlFVRkZMRVZCUVdFN1NVRkRhRVFzVDBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmxCUVZrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eExRVUZMTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1dVRkJXU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETDBVc1EwRkJRenRCUVVWRUxGTkJRVk1zV1VGQldTeERRVUZETEV0QlFXZENPMGxCUTNCRExIVkRRVUZaTEd0Q1FVRnJRaXhIUVVGTExFdEJRVXNzUlVGQlJ6dEJRVU0zUXl4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxGZEJRVmNzUTBGQlF5eEhRVUUyUWl4RlFVRkZMRWxCUVZrc1JVRkJSU3hMUVVGblFpeEZRVUZGTEV0QlFYZENPMGxCVFdwSUxFZEJRVWNzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0SlFVTllMRWRCUVVjc1EwRkJReXhKUVVGSkxFZEJRVWNzWTBGQll5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMGxCUTJwRExFMUJRVTBzUjBGQlJ5eEhRVUZITEVOQlFVTXNTMEZCU3l4SlFVRkpMRmxCUVZrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRKUVVNelJpeE5RVUZOTEVkQlFVY3NSMEZCUnl4SFFVRkhMRU5CUVVNc1YwRkJWeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBsQlEycERMRWRCUVVjc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEpRVVZrTEU5QlFVODdVVUZEVEN4TFFVRkxMRVZCUVVVc1IwRkJSeXhEUVVGRExFdEJRVXM3VVVGRGFFSXNVVUZCVVN4RlFVRkZMRU5CUVVNN1VVRkRXQ3hOUVVGTkxFVkJRVVVzUjBGQlJ5eERRVUZETEhGQ1FVRnhRanRSUVVOcVF5eFBRVUZQTEVWQlFVVXNSMEZCUnl4RFFVRkRMSE5DUVVGelFqdExRVU53UXl4RFFVRkJPMEZCUTBnc1EwRkJRenRCUVVWRUxIZENRVUYzUWp0QlFVTjRRaXhOUVVGTkxGVkJRVlVzYlVKQlFXMUNMRU5CUVVNc1MwRkJZVHRKUVVNdlF5eE5RVUZOTEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzU1VGQlNUdFJRVU14UXl4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXp0SlFVTndSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5JTEUxQlFVMHNVVUZCVVN4SFFVRkhMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eEhRVUZITEVWQlFVVXNSMEZCUnl4RlFVRkZMRVZCUVVVN1VVRkRMME1zVDBGQlR6dFpRVU5NTEZGQlFWRXNSVUZCUlN4RFFVRkRPMWxCUTFnc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eExRVUZMTEVkQlFVY3NSMEZCUnl4RFFVRkRMRXRCUVVzN1dVRkROVUlzVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRPMWxCUTNoRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFVkJRVVVzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXp0VFFVTTFReXhEUVVGRE8wbEJRMG9zUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEU0N4UFFVRlBMRkZCUVZFc1EwRkJRenRCUVVOc1FpeERRVUZETzBGQlJVUXNlVU5CUVhsRE8wRkJRM3BETEUxQlFVMHNWVUZCVlN4cFFrRkJhVUlzUTBGQlF5eEhRVUUyUWl4RlFVRkZMRk5CUVc5Q0xFVkJRVVVzUzBGQllUdEpRVU5zUnl4TlFVRk5MRWxCUVVrc1IwRkJSeXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETzBsQlF6VkNMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFGQlEzSkRMRTFCUVUwc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTjBRaXgzUTBGQmQwTTdVVUZEZUVNc1RVRkJUU3hYUVVGWExFZEJRV0VzUlVGQlJTeERRVUZETzFGQlEycERMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTTNReXhOUVVGTkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRMnBETEUxQlFVMHNTVUZCU1N4SFFVRkhMRlZCUVZVc1EwRkJReXhUUVVGVExFVkJRVVVzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMWxCUTJ4RUxFMUJRVTBzVFVGQlRTeEhRVUZYTEZkQlFWY3NRMEZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03V1VGRGVrVXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU14UWp0UlFVVkVMR2xEUVVGcFF6dFJRVU5xUXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNSMEZCUnl4RlFVRkZMRWRCUVVjc1JVRkJSU3hGUVVGRk8xbEJReTlETEU5QlFVODdaMEpCUTB3c1VVRkJVU3hGUVVGRkxFTkJRVU03WjBKQlExZ3NTMEZCU3l4RlFVRkZMRWRCUVVjc1EwRkJReXhMUVVGTExFZEJRVWNzUjBGQlJ5eERRVUZETEV0QlFVczdaMEpCUXpWQ0xFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXp0blFrRkRlRU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUlVGQlJTeEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRPMkZCUXpWRExFTkJRVU03VVVGRFNpeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVklMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXp0UlFVTTFRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRWRCUVVjc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF6dFJRVU5xUkN4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExGRkJRVkVzUTBGQlF5eFJRVUZSTEVOQlFVTTdVVUZEYkVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRPMUZCUXpsQ0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJRenRSUVVOb1F5d3JRMEZCSzBNN1MwRkRhRVE3UVVGRFNDeERRVUZETzBGQlJVUXNkVVJCUVhWRU8wRkJRM1pFTEUxQlFVMHNWVUZCVlN4VFFVRlRMRU5CUVVNc1MwRkJZU3hGUVVGRkxGVkJRV3RDTEVWQlFVVXNXVUZCYjBJN1NVRkRMMFVzVFVGQlRTeEhRVUZITEVkQlFXRXNSVUZCUlN4RFFVRkRPMGxCUTNwQ0xFbEJRVWtzVDBGQlR5eEhRVUZYTEVWQlFVVXNRMEZCUXp0SlFVTjZRaXhKUVVGSkxGRkJRVkVzUjBGQlZ5eFpRVUZaTEVOQlFVTTdTVUZEY0VNc1MwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdVVUZEY2tNc1RVRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNSQ0xFMUJRVTBzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRja0lzU1VGQlNTeFJRVUZSTEVkQlFVY3NRMEZCUXl4SFFVRkhMRlZCUVZVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTzFsQlEzaERMRkZCUVZFc1NVRkJTU3hEUVVGRExFTkJRVU03V1VGRFpDeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xTkJRM0JDTzJGQlFVMDdXVUZEVEN4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRPMWxCUXpGQ0xFOUJRVThzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTJwQ0xGRkJRVkVzUjBGQlJ5eFpRVUZaTEVkQlFVY3NRMEZCUXl4RFFVRkRPMU5CUXpkQ08wdEJRMFk3U1VGRFJDeEpRVUZKTEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVN1VVRkRiRUlzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zUTBGQlF6dExRVU16UWp0SlFVVkVMRTlCUVU4c1IwRkJSeXhEUVVGRE8wRkJRMklzUTBGQlF6dEJRVVZFTEhORFFVRnpRenRCUVVOMFF5eE5RVUZOTEZWQlFWVXNkVUpCUVhWQ0xFTkJRVU1zUjBGQk5rSXNSVUZCUlN4VFFVRnZRaXhGUVVGRkxFdEJRV0U3U1VGRGVFY3NUVUZCVFN4SFFVRkhMRWRCUVd0Q0xFVkJRVVVzUTBGQlF6dEpRVU01UWl4TlFVRk5MRWxCUVVrc1IwRkJSeXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETzBsQlF6VkNMRWxCUVVrc1dVRkJXU3hIUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETzBsQlF6bENMRWxCUVVrc1RVRkJUU3hIUVVGWkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTTVRaXhKUVVGSkxGRkJRVkVzUjBGQmNVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZ3UlN4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdFJRVU55UXl4TlFVRk5MRWxCUVVrc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEZEVJc1MwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMWxCUXpkRExFMUJRVTBzUlVGQlJTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRE5VSXNTVUZCU1N4RlFVRkZMRU5CUVVNc1MwRkJTeXhMUVVGTExGbEJRVmtzUlVGQlJUdG5Ra0ZETjBJc2FVTkJRV2xETzJkQ1FVTnFReXhKUVVGSkxGbEJRVmtzU1VGQlNTeERRVUZETEVWQlFVVTdiMEpCUTNKQ0xFMUJRVTBzVlVGQlZTeEhRVUZuUWp0M1FrRkRPVUlzUzBGQlN5eEZRVUZGTEZsQlFWazdkMEpCUTI1Q0xFdEJRVXNzUlVGQlJTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RlFVRnpRanQzUWtGRE0wTXNUVUZCVFN4RlFVRkZMRmRCUVZjc1EwRkJReXhIUVVGSExFVkJRVVVzVlVGQlZTeERRVUZETEZOQlFWTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzNGQ1FVTjRSU3hEUVVGRE8yOUNRVU5HTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03YVVKQlEzUkNPMmRDUVVWRUxESkNRVUV5UWp0blFrRkRNMElzV1VGQldTeEhRVUZITEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNN1owSkJRM2hDTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03WjBKQlF6VkNMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yZENRVU14UWl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRoUVVNelFqdHBRa0ZCVFR0blFrRkRUQ3huUTBGQlowTTdaMEpCUTJoRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJGQlF6TkNPMU5CUTBZN1MwRkRSanRKUVVORUxHOUNRVUZ2UWp0SlFVTndRaXhKUVVGSkxGbEJRVmtzU1VGQlNTeERRVUZETEVWQlFVVTdVVUZEY2tJc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF6dFpRVU5RTEV0QlFVc3NSVUZCUlN4WlFVRlpPMWxCUTI1Q0xFdEJRVXNzUlVGQlJTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RlFVRnpRanRaUVVNelF5eE5RVUZOTEVWQlFVVXNWMEZCVnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hWUVVGVkxFTkJRVU1zVTBGQlV5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RlFVRkZMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03VTBGRGVFVXNRMEZCUXl4RFFVRkRPMHRCUTBvN1NVRkZSQ3hQUVVGUExFZEJRVWNzUTBGQlF6dEJRVU5pTEVOQlFVTTdRVUZGUkN3clJFRkJLMFE3UVVGREwwUXNUVUZCVFN4VlFVRlZMR0ZCUVdFc1EwRkJReXhMUVVGclFpeEZRVUZGTEZkQlFXMUNPMGxCUTI1RkxFMUJRVTBzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJRM0pETEU5QlFVOHNSMEZCUnl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExGZEJRVmNzUTBGQlF5eERRVUZETzBGQlEzcERMRU5CUVVNN1FVRkZSQ3d5UWtGQk1rSTdRVUZETTBJc1RVRkJUU3hWUVVGVkxHRkJRV0VzUTBGQlF5eFRRVUZwUWl4RlFVRkZMRmRCUVcxQ0xFVkJRVVVzVTBGQmVVSTdTVUZETjBZc1NVRkJTU3hUUVVGVExFdEJRVXNzWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlR0UlFVTnlReXhQUVVGUExFTkJRVU1zUTBGQlF6dExRVU5XTzFOQlFVMHNTVUZCU1N4VFFVRlRMRXRCUVVzc1kwRkJZeXhEUVVGRExFdEJRVXNzUlVGQlJUdFJRVU0zUXl4UFFVRlBMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVjBGQlZ5eEhRVUZITEZOQlFWTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNM1F6dFRRVUZOTEVsQlFVa3NVMEZCVXl4TFFVRkxMR05CUVdNc1EwRkJReXhOUVVGTkxFVkJRVVU3VVVGRE9VTXNUMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zVjBGQlZ5eEhRVUZITEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dExRVU51UkR0VFFVRk5MRWxCUVVrc1UwRkJVeXhMUVVGTExHTkJRV01zUTBGQlF5eFBRVUZQTEVWQlFVVTdVVUZETDBNc1QwRkJUeXhEUVVGRExFTkJRVU03UzBGRFZqdFRRVUZOTzFGQlEwd3NUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRWanRCUVVOSUxFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNWVUZCVlN4RFFVRkRMRWxCUVdVc1JVRkJSU3hMUVVGMVFqdEpRVU5xUlN4UFFVRlBMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRha1FzUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4dFFrRkJiVUlzUTBGQlF5eEZRVUZuUWl4RlFVRkZMRVZCUVdkQ08wbEJRM0JGTEU5QlFVOHNRMEZCUXl4RlFVRkZMRU5CUVVNc1UwRkJVeXhMUVVGTExFVkJRVVVzUTBGQlF5eFRRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRkZCUVZFc1MwRkJTeXhGUVVGRkxFTkJRVU1zVVVGQlVTeEpRVUZKTEVWQlFVVXNRMEZCUXl4VFFVRlRMRXRCUVVzc1JVRkJSU3hEUVVGRExGTkJRVk1zU1VGQlNTeEZRVUZGTEVOQlFVTXNVMEZCVXl4TFFVRkxMRVZCUVVVc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU14U1N4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxITkNRVUZ6UWl4RFFVRkRMRWRCUVd0Q08wbEJRM1pFTEU5QlFVOHNiVUpCUVcxQ0xFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NSVUZCUlN4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrUXNRMEZCUXp0QlFVVkVMRzFHUVVGdFJqdEJRVU51Uml4TlFVRk5MRlZCUVZVc2VVSkJRWGxDTEVOQlFVTXNTMEZCYTBJc1JVRkJSU3hIUVVGcFFqdEpRVU0zUlN3d1JFRkJNRVE3U1VGRE1VUXNTVUZCU1N4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3VVVGRGJFSXNUMEZCVHl4VFFVRlRMRU5CUVVNN1MwRkRiRUk3U1VGRlJDeE5RVUZOTEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEyeERMRGhFUVVFNFJEdEpRVU01UkN4SlFVRkpMRWRCUVVjc1EwRkJReXhUUVVGVExFdEJRVXNzU1VGQlNTeEZRVUZGTzFGQlF6RkNMR0ZCUVdFN1VVRkRZaXhKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVNeFFpeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMREJEUVVFd1F5eERRVUZETEVOQlFVTTdXVUZETVVRc1QwRkJUeXhUUVVGVExFTkJRVU03VTBGRGJFSTdVVUZGUkN4UFFVRlBPMWxCUTB3c1UwRkJVeXhGUVVGRkxFZEJRVWNzUTBGQlF5eFRRVUZUTzFsQlEzaENMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRPMWxCUXpsQ0xGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRE8xTkJRMmhETEVOQlFVRTdTMEZEUmp0SlFVVkVMRWxCUVVrc1IwRkJSeXhEUVVGRExGTkJRVk1zUzBGQlN5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1VVRkRkRVFzYzBaQlFYTkdPMUZCUTNSR0xFOUJRVTg3V1VGRFRDeFRRVUZUTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNN1dVRkRlRUlzVVVGQlVTeEZRVUZGTEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1EwRkJRenRaUVVNeFFpeFRRVUZUTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGRE8xTkJRemRDTEVOQlFVTTdTMEZEU0R0VFFVRk5PMUZCUTB3c01rSkJRVEpDTzFGQlF6TkNMRTlCUVU4N1dVRkRUQ3hUUVVGVExFVkJRVVVzUjBGQlJ5eERRVUZETEZOQlFWTTdXVUZEZUVJc1VVRkJVU3hGUVVGRkxFZEJRVWNzUTBGQlF5eFJRVUZSTzFsQlEzUkNMRk5CUVZNc1JVRkJSU3hIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEVOQlFVTTdVMEZETjBJc1EwRkJRenRMUVVOSU8wRkJRMGdzUTBGQlF6dEJRVVZFTEhGR1FVRnhSanRCUVVOeVJpeE5RVUZOTEZWQlFWVXNjVUpCUVhGQ0xFTkJRVU1zUzBGQmEwSXNSVUZCUlN4SFFVRnBRanRKUVVONlJTeE5RVUZOTEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlJXeERMRzlDUVVGdlFqdEpRVU53UWl4SlFVRkpMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdFJRVU55UWl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExEQkRRVUV3UXl4RFFVRkRMRU5CUVVNN1VVRkRNVVFzVDBGQlR5eEhRVUZITEVOQlFVTTdTMEZEV2p0SlFVVkVMRTFCUVUwc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTTdTVUZGZGtJc09FUkJRVGhFTzBsQlF6bEVMRWxCUVVrc1IwRkJSeXhEUVVGRExGRkJRVkVzUzBGQlN5eEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1NVRkJTU3hIUVVGSExFTkJRVU1zVTBGQlV5eExRVUZMTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUlVGQlJUdFJRVU01UlN4UFFVRlBPMWxCUTB3c1UwRkJVeXhGUVVGRkxFZEJRVWNzUTBGQlF5eFRRVUZUTzFsQlEzaENMRkZCUVZFc1JVRkJSU3h0UWtGQmJVSTdXVUZETjBJc1UwRkJVeXhGUVVGRkxHMUNRVUZ0UWp0WlFVTTVRaXhUUVVGVExFVkJRVVVzU1VGQlNUdFRRVU5vUWl4RFFVRkRPMHRCUTBnN1NVRkZSQ3hwUlVGQmFVVTdTVUZEYWtVc1NVRkJTU3hIUVVGSExFTkJRVU1zVTBGQlV5eExRVUZMTEVsQlFVa3NSVUZCUlR0UlFVTXhRaXhQUVVGUExGTkJRVk1zUTBGQlF6dExRVU5zUWp0SlFVVkVMRGhEUVVFNFF6dEpRVU01UXl4TlFVRk5MRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTJ4RExFbEJRVWtzUjBGQlJ5eERRVUZETEZOQlFWTXNTMEZCU3l4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTzFGQlEzSkRMRFJFUVVFMFJEdFJRVU0xUkN4UFFVRlBPMWxCUTB3c1UwRkJVeXhGUVVGRkxFZEJRVWNzUTBGQlF5eFRRVUZUTzFsQlEzaENMRkZCUVZFc1JVRkJSU3hIUVVGSExFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTTdXVUZETVVJc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdVMEZETTBNc1EwRkJRenRMUVVOSU8xTkJRVTA3VVVGRFRDeFBRVUZQTzFsQlEwd3NVMEZCVXl4RlFVRkZMRWRCUVVjc1EwRkJReXhUUVVGVE8xbEJRM2hDTEZGQlFWRXNSVUZCUlN4SFFVRkhMRU5CUVVNc1VVRkJVVHRaUVVOMFFpeFRRVUZUTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNc1IwRkJSeXhEUVVGRE8xTkJRemRDTEVOQlFVTTdTMEZEU0R0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzVVVGQlVTeERRVUZETEVkQlFWRTdTVUZETDBJc1QwRkJUeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU42UXl4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxGZEJRVmNzUTBGQlF5eEpRVUZsTzBsQlEzcERMRTlCUVU4c1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJoRExFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNhMEpCUVd0Q0xFTkJRVU1zU1VGQmFVSTdTVUZEYkVRc1QwRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRjRU1zUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4cFFrRkJhVUlzUTBGQlF5eExRVUZyUWl4RlFVRkZMRk5CUVdsQ08wbEJRM0pGTEhkR1FVRjNSanRKUVVONFJpeEpRVUZKTEZkQlFWY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUlVGQlJUdFJRVU5xUXl4UFFVRlBMRVZCUVVVc1UwRkJVeXhGUVVGRkxGRkJRVkVzUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3hUUVVGVExFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1UwRkJVeXhGUVVGRkxFbEJRVWtzUlVGQlJTeERRVUZETzB0QlEzUkhPMGxCUlVRc2FVTkJRV2xETzBsQlEycERMRTlCUVU4N1VVRkRUQ3hUUVVGVE8xRkJRMVFzVVVGQlVTeEZRVUZGTEVOQlFVTTdVVUZEV0N4VFFVRlRMRVZCUVVVc1EwRkJRenRMUVVOaUxFTkJRVU03UVVGRFNpeERRVUZETzBGQlJVUXNPRUpCUVRoQ08wRkJRemxDTEUxQlFVMHNWVUZCVlN4blFrRkJaMElzUTBGQlF5eExRVUZyUWl4RlFVRkZMRk5CUVdsQ08wbEJRM0JGTEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVc1VVRkJVU3hGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4VFFVRlRMRVZCUVVVc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRGRrY3NRMEZCUXp0QlFVVkVMRFJGUVVFMFJUdEJRVU0xUlN4TlFVRk5MRlZCUVZVc2JVSkJRVzFDTEVOQlFVTXNTMEZCYTBJc1JVRkJSU3hIUVVGcFFqdEpRVU4yUlN4TlFVRk5MRWxCUVVrc1IwRkJSeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1owVkJRV2RGTzBsQlJXNUhMR2REUVVGblF6dEpRVU5vUXl4SlFVRkpMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdFJRVU55UWl3NFFrRkJPRUk3VVVGRE9VSXNTVUZCU1N4SFFVRkhMRU5CUVVNc1UwRkJVeXhMUVVGTExFTkJRVU1zUlVGQlJUdFpRVU4yUWl4UFFVRlBMRWRCUVVjc1EwRkJRenRUUVVOYU8yRkJRVTA3V1VGRFRDeFBRVUZQTEdkQ1FVRm5RaXhEUVVGRExFdEJRVXNzUlVGQlJTeEhRVUZITEVOQlFVTXNVMEZCVXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8xTkJRMjVFTzB0QlEwWTdTVUZGUkN4TlFVRk5MRWRCUVVjc1IwRkJSeXg1UWtGQmVVSXNRMEZCUXl4TFFVRkxMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03U1VGRGJFUXNTVUZCU1N4SFFVRkhMRVZCUVVVN1VVRkRVQ3h6UTBGQmMwTTdVVUZEZEVNc1QwRkJUeXhIUVVGSExFTkJRVU03UzBGRFdqdEpRVVZFTEhOR1FVRnpSanRKUVVOMFJpeEpRVUZKTEVkQlFVY3NRMEZCUXl4VFFVRlRMRXRCUVVzc1EwRkJReXhGUVVGRk8xRkJRM1pDTEcxQ1FVRnRRanRSUVVOdVFpeFBRVUZQTEZOQlFWTXNRMEZCUXp0TFFVTnNRanRUUVVGTk8xRkJRMHdzT0VKQlFUaENPMUZCUXpsQ0xFOUJRVThzWjBKQlFXZENMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eFRRVUZUTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRia1E3UVVGRFNDeERRVUZETzBGQlJVUXNUVUZCVFN4VlFVRlZMR1ZCUVdVc1EwRkJReXhMUVVGclFpeEZRVUZGTEVkQlFXbENPMGxCUTI1RkxFMUJRVTBzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eG5SVUZCWjBVN1NVRkRia2NzWjBOQlFXZERPMGxCUTJoRExFbEJRVWtzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMUZCUTNKQ0xHZERRVUZuUXp0UlFVTm9ReXhKUVVGSkxFZEJRVWNzUTBGQlF5eFRRVUZUTEV0QlFVc3NTMEZCU3l4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFVkJRVVU3V1VGRGRFTXNUMEZCVHl4cFFrRkJhVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xTkJRMmhFTzJGQlFVMDdXVUZEVEN4UFFVRlBMR2xDUVVGcFFpeERRVUZETEV0QlFVc3NSVUZCUlN4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzFOQlEzQkVPMHRCUTBZN1NVRkZSQ3hOUVVGTkxFbEJRVWtzUjBGQlJ5eHhRa0ZCY1VJc1EwRkJReXhMUVVGTExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZETDBNc1NVRkJTU3hKUVVGSkxFVkJRVVU3VVVGRFVpeFBRVUZQTEVsQlFVa3NRMEZCUXp0TFFVTmlPMGxCUlVRc2MwWkJRWE5HTzBsQlEzUkdMRWxCUVVrc1IwRkJSeXhEUVVGRExGTkJRVk1zUzBGQlN5eExRVUZMTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRSUVVOMFF5eFBRVUZQTEZOQlFWTXNRMEZCUXp0TFFVTnNRanRUUVVGTk8xRkJRMHdzWjBOQlFXZERPMUZCUTJoRExFOUJRVThzYVVKQlFXbENMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eFRRVUZUTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRjRVE3UVVGRFNDeERRVUZETzBGQlJVUXNUVUZCVFN4VlFVRlZMR3RDUVVGclFpeERRVUZETEV0QlFXdENPMGxCUTI1RUxFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRlZCUVZVc1JVRkJSU3hSUVVGUkxFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1UwRkJVeXhGUVVGRkxHMUNRVUZ0UWl4RlFVRkZMRk5CUVZNc1JVRkJSU3hKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU42U0N4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxHTkJRV01zUTBGQlF5eExRVUZyUWl4RlFVRkZMRTFCUVdNN1NVRkRMMFFzU1VGQlNTeFhRVUZYTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFVkJRVVU3VVVGRE9VSXNTVUZCU1N4TlFVRk5MRXRCUVVzc1EwRkJRenRaUVVGRkxFOUJRVThzYTBKQlFXdENMRU5CUVVNN1VVRkROVU1zVDBGQlR5eGpRVUZqTEVOQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU14UXp0VFFVRk5PMUZCUTB3c1QwRkJUeXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF6dExRVU53UXp0QlFVTklMRU5CUVVNN1FVRkZSQ3gxUjBGQmRVYzdRVUZEZGtjc1RVRkJUU3hWUVVGVkxHdENRVUZyUWl4RFFVRkRMRXRCUVd0Q0xFVkJRVVVzUjBGQmFVSTdTVUZEZEVVc01FbEJRVEJKTzBsQlF6RkpMRTFCUVUwc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkZiRU1zYlVOQlFXMURPMGxCUTI1RExFbEJRVWtzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMUZCUTNKQ0xFOUJRVThzYTBKQlFXdENMRU5CUVVNN1MwRkRNMEk3U1VGRlJDd3lSRUZCTWtRN1NVRkRNMFFzU1VGQlNTeEhRVUZITEVOQlFVTXNVMEZCVXl4TFFVRkxMRWxCUVVrc1JVRkJSVHRSUVVNeFFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRE8wdEJRemxETzBsQlJVUXNkVWhCUVhWSU8wbEJRM1pJTEVsQlFVa3NVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRk8xRkJRMnhDTERCQ1FVRXdRanRSUVVNeFFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXp0TFFVTjBRenRUUVVGTk8xRkJRMHdzT0VKQlFUaENPMUZCUXpsQ0xFMUJRVTBzUjBGQlJ5eEhRVUZITEhsQ1FVRjVRaXhEUVVGRExFdEJRVXNzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTnNSQ3hKUVVGSkxFTkJRVU1zUjBGQlJ5eEZRVUZGTzFsQlExSXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXh0UTBGQmJVTXNRMEZCUXl4RFFVRkRPMU5CUTNCRU8xRkJRMFFzVDBGQlR5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTTdTMEZEZGtNN1FVRkRTQ3hEUVVGRE8wRkJSVVFzVFVGQlRTeFZRVUZWTEZsQlFWa3NRMEZCUXl4SlFVRlpPMGxCUTNaRExFOUJRVThzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVONFJDeERRVUZETzBGQlJVUXNLMFJCUVN0RU8wRkJReTlFTEUxQlFVMHNWVUZCVlN4aFFVRmhMRU5CUVVNc1NVRkJaU3hGUVVGRkxFZEJRV2xDTzBsQlF6bEVMSGxDUVVGNVFqdEpRVU42UWl4SlFVRkpMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU03VVVGQlJTeFBRVUZQTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSU3hKUVVGSkxFVkJRVVVzUlVGQlJTeEZRVUZGTEZWQlFWVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03U1VGREwwVXNTVUZCU1N4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRE8xRkJRVVVzVDBGQlR5eEpRVUZKTEVOQlFVTTdTVUZGYUVNc2MwTkJRWE5ETzBsQlEzUkRMRTFCUVUwc1YwRkJWeXhIUVVGSExFZEJRVWNzUTBGQlF5eFRRVUZUTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXp0SlFVTjZSeXhOUVVGTkxFOUJRVThzUjBGQll5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkZNVU1zTWtOQlFUSkRPMGxCUXpORExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZ5UXl4dFJrRkJiVVk3U1VGRGJrWXNUVUZCVFN4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0SlFVTjZReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJReXhUUVVGVExFdEJRVXNzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVVXpSeXhqUVVGak8wbEJRMlFzVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0SlFVVXhSQ3hQUVVGUExFOUJRVThzUTBGQlF6dEJRVU5xUWl4RFFVRkRPMEZCUlVRc1owVkJRV2RGTzBGQlEyaEZMRTFCUVUwc1ZVRkJWU3hqUVVGakxFTkJRVU1zU1VGQlpTeEZRVUZGTEVkQlFXbENPMGxCUXk5RUxIbENRVUY1UWp0SlFVTjZRaXhKUVVGSkxGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTTdVVUZCUlN4UFFVRlBMRWxCUVVrc1EwRkJRenRKUVVOb1F5eEpRVUZKTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNN1VVRkJSU3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVWQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU03U1VGRmJFUXNUVUZCVFN4UlFVRlJMRWRCUVdNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBsQlJUTkRMR2RFUVVGblJEdEpRVU5vUkN4UlFVRlJMRU5CUVVNc1NVRkJTU3hIUVVGSExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVVZzUkN3d1JVRkJNRVU3U1VGRE1VVXNUVUZCVFN4TlFVRk5MRWRCUVVjc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTm9ReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU03U1VGRGFFTXNUVUZCVFN4UlFVRlJMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMSE5DUVVGelFqdEpRVVY0UkN3NFEwRkJPRU03U1VGRE9VTXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFGQlF6ZERMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF6dFJRVU4wUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hSUVVGUkxFTkJRVU03UzBGRGRrTTdTVUZGUkN4alFVRmpPMGxCUTJRc1VVRkJVU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVVU1UXl4UFFVRlBMRkZCUVZFc1EwRkJRenRCUVVOc1FpeERRVUZETzBGQlJVUXNNRU5CUVRCRE8wRkJRekZETEUxQlFVMHNWVUZCVlN4eFFrRkJjVUlzUTBGQlF5eEpRVUZsTEVWQlFVVXNSMEZCYVVJN1NVRkRkRVVzU1VGQlNTeFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1VVRkRiRUlzVDBGQlR5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UzBGRE4wSTdTVUZEUkN4UFFVRlBMRWRCUVVjc1EwRkJReXhUUVVGVExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF6TkNMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzZDBKQlFYZENMRU5CUVVNc1NVRkJaU3hGUVVGRkxFdEJRV0U3U1VGRGNrVXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3VVVGRGNFTXNTVUZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRaUVVOcVF5eFBRVUZQTzJkQ1FVTk1MRkZCUVZFc1JVRkJSU3hEUVVGRE8yZENRVU5ZTEZOQlFWTXNSVUZCUlN4TFFVRkxPMkZCUTJwQ0xFTkJRVU03VTBGRFNEdExRVU5HTzBsQlEwUXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4VFFVRlRMRVZCUVVVc2JVSkJRVzFDTEVWQlFVVXNRMEZCUXp0QlFVTXpSU3hEUVVGRE8wRkJSVVFzVFVGQlRTeFZRVUZWTEZkQlFWY3NRMEZCUXl4SlFVRmxMRVZCUVVVc1IwRkJWenRKUVVOMFJDeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRk8xRkJRMnBDTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETzFGQlEzQkNMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRPMGxCUTNSQ0xFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEwd3NRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3haUVVGWkxFTkJRVU1zUlVGQlowSXNSVUZCUlN4RlFVRm5RanRKUVVNM1JDeEpRVUZKTEVWQlFVVXNRMEZCUXl4VFFVRlRMRWRCUVVjc1JVRkJSU3hEUVVGRExGTkJRVk1zUlVGQlJUdFJRVU12UWl4UFFVRlBMRWxCUVVrc1EwRkJRenRMUVVOaU8xTkJRMGtzU1VGQlNTeEZRVUZGTEVOQlFVTXNVMEZCVXl4SFFVRkhMRVZCUVVVc1EwRkJReXhUUVVGVExFVkJRVVU3VVVGRGNFTXNUMEZCVHl4TFFVRkxMRU5CUVVNN1MwRkRaRHRUUVVOSk8xRkJRMGdzYVVOQlFXbERPMUZCUTJwRExFbEJRVWtzUlVGQlJTeERRVUZETEZOQlFWTXNTMEZCU3l4SlFVRkpMRWxCUVVrc1JVRkJSU3hEUVVGRExGTkJRVk1zUzBGQlN5eEpRVUZKTEVWQlFVVTdXVUZEYkVRc1QwRkJUeXhMUVVGTExFTkJRVU03VTBGRFpEdGhRVUZOTEVsQlFVa3NSVUZCUlN4RFFVRkRMRk5CUVZNc1MwRkJTeXhKUVVGSkxFbEJRVWtzUlVGQlJTeERRVUZETEZOQlFWTXNTMEZCU3l4SlFVRkpMRVZCUVVVN1dVRkRla1FzVDBGQlR5eExRVUZMTEVOQlFVTTdVMEZEWkR0aFFVRk5MRWxCUVVrc1JVRkJSU3hEUVVGRExGTkJRVk1zUzBGQlN5eEpRVUZKTEVsQlFVa3NSVUZCUlN4RFFVRkRMRk5CUVZNc1MwRkJTeXhKUVVGSkxFVkJRVVU3V1VGRGVrUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1UwRkRZanRoUVVGTk8xbEJRMHdzVDBGQlR5eEZRVUZGTEVOQlFVTXNVMEZCVXl4SFFVRkhMRVZCUVVVc1EwRkJReXhUUVVGVExFTkJRVU03VTBGRGNFTTdTMEZEUmp0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzYlVKQlFXMUNMRU5CUVVNc1JVRkJaMElzUlVGQlJTeEZRVUZuUWp0SlFVTndSU3hKUVVGSkxFVkJRVVVzUTBGQlF5eFRRVUZUTEVkQlFVY3NSVUZCUlN4RFFVRkRMRk5CUVZNc1JVRkJSVHRSUVVNdlFpeFBRVUZQTEVsQlFVa3NRMEZCUXp0TFFVTmlPMU5CUTBrc1NVRkJTU3hGUVVGRkxFTkJRVU1zVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXl4VFFVRlRMRVZCUVVVN1VVRkRjRU1zVDBGQlR5eExRVUZMTEVOQlFVTTdTMEZEWkR0VFFVTkpPMUZCUTBnc1NVRkJTU3hGUVVGRkxFTkJRVU1zVTBGQlV5eExRVUZMTEVsQlFVa3NTVUZCU1N4RlFVRkZMRU5CUVVNc1UwRkJVeXhMUVVGTExFbEJRVWtzUlVGQlJUdFpRVU5zUkN4UFFVRlBMRXRCUVVzc1EwRkJRenRUUVVOa08yRkJRVTBzU1VGQlNTeEZRVUZGTEVOQlFVTXNVMEZCVXl4TFFVRkxMRWxCUVVrc1NVRkJTU3hGUVVGRkxFTkJRVU1zVTBGQlV5eExRVUZMTEVsQlFVa3NSVUZCUlR0WlFVTjZSQ3hQUVVGUExFbEJRVWtzUTBGQlF6dFRRVU5pTzJGQlFVMHNTVUZCU1N4RlFVRkZMRU5CUVVNc1UwRkJVeXhMUVVGTExFbEJRVWtzU1VGQlNTeEZRVUZGTEVOQlFVTXNVMEZCVXl4TFFVRkxMRWxCUVVrc1JVRkJSVHRaUVVONlJDeFBRVUZQTEVsQlFVa3NRMEZCUXp0VFFVTmlPMkZCUVUwN1dVRkRUQ3hQUVVGUExFVkJRVVVzUTBGQlF5eFRRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRk5CUVZNc1EwRkJRenRUUVVOeVF6dExRVU5HTzBGQlEwZ3NRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3huUWtGQlowSXNRMEZCUXl4SFFVRnJRanRKUVVOcVJDeEpRVUZKTEVOQlFVTXNSMEZCUnp0UlFVRkZMRTlCUVU4c1NVRkJTU3hEUVVGRE8wbEJRM1JDTEU5QlFVOHNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZETDBRc1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeHJRa0ZCYTBJc1EwRkJReXhIUVVGWExFVkJRVVVzUzBGQllUdEpRVU16UkN4SlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFbEJRVWtzUzBGQlN5eEpRVUZKTEVkQlFVY3NRMEZCUXl4TlFVRk5PMUZCUVVVc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhEUVVGRE8wbEJRMnhHTEU5QlFVOHNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVY3NSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY0VRc1EwRkJRenRCUVVWRUxITkRRVUZ6UXp0QlFVTjBReXhOUVVGTkxGVkJRVlVzYTBKQlFXdENMRU5CUVVNc1NVRkJaU3hGUVVGRkxFZEJRVmNzUlVGQlJTeExRVUZoTzBsQlF6VkZMRTFCUVUwc1JVRkJSU3hIUVVGSExIZENRVUYzUWl4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF5eFJRVUZSTEVOQlFVTTdTVUZGTVVRc1MwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVWQlFVVXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdVVUZEY2tNc1RVRkJUU3hIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNCQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNSVUZCUlR0WlFVTmFMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRPMU5CUTNKQ08xRkJRMFFzUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hIUVVGSExFTkJRVU03UzBGRGNrSTdTVUZGUkN4MVEwRkJkVU03U1VGRGRrTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1VVRkRla01zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGNFSTdRVUZEU0N4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxHMUNRVUZ0UWl4RFFVRkRMRXRCUVd0Q08wbEJRM0JFTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUVHRSUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzBsQlF6VkNMRTlCUVU4c1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZETlVJc1EwRkJRenRCUVVkRUxFMUJRVTBzVlVGQlZTeHZRa0ZCYjBJc1EwRkJReXhMUVVGclFqdEpRVU55UkN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTA3VVVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0SlFVTTFRaXhQUVVGUExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETzBGQlEzQkVMRU5CUVVNN1FVRkZSQ3gzUmtGQmQwWTdRVUZEZUVZc1RVRkJUU3hWUVVGVkxGTkJRVk1zUTBGQlF5eExRVUZuUWl4RlFVRkZMRXRCUVdkQ096dEpRVU14UkN4SlFVRkpMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU03VVVGQlJTeFBRVUZQTEV0QlFVc3NRMEZCUXp0SlFVTnlReXhKUVVGSkxGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTTdVVUZCUlN4UFFVRlBMRXRCUVVzc1EwRkJRenRKUVVWeVF5eE5RVUZOTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzBsQlEycERMRTFCUVUwc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1NVRkZha01zVFVGQlRTeEhRVUZITEVkQlFVY3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03U1VGRE9VSXNWMEZCVnl4RFFVRkRMRXRCUVVzc1JVRkJSU3hIUVVGSExFTkJRVU1zUTBGQlF6dEpRVVY0UWl4TlFVRk5MRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVONlF5eE5RVUZOTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRk0wSXNiME5CUVc5RE8wbEJRM0JETEVsQlFVa3NXVUZCV1N4RFFVRkRMRkZCUVZFc1EwRkJReXhMUVVGTExFVkJRVVVzVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMUZCUTJwRUxGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTjJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOd1FqdEpRVVZFTEUxQlFVMHNUMEZCVHl4SFFVRmpPMUZCUTNwQ0xGVkJRVlVzUlVGQlJTeE5RVUZCTEV0QlFVc3NRMEZCUXl4VlFVRlZMRzFEUVVGSkxGTkJRVk03VVVGRGVrTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzFGQlEzcENMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4SlFVRkpPMHRCUXpsQ0xFTkJRVUU3U1VGRlJDeFBRVUZQTEU5QlFVOHNRMEZCUXp0QlFVTnFRaXhEUVVGRE8wRkJSVVFzTkVSQlFUUkVPMEZCUXpWRUxFMUJRVTBzVlVGQlZTeFZRVUZWTEVOQlFVTXNTMEZCYTBJc1JVRkJSU3hIUVVGclFqdEpRVU12UkN4SlFVRkpMSE5DUVVGelFpeERRVUZETEVkQlFVY3NRMEZCUXp0UlFVRkZMRTlCUVU4N1NVRkZlRU1zYjBKQlFXOUNPMGxCUTNCQ0xFMUJRVTBzV1VGQldTeEhRVUZITEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEyaEVMRTFCUVUwc1QwRkJUeXhIUVVGSExHRkJRV0VzUTBGQlF5eFpRVUZaTEVWQlFVVXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wbEJSWFpFTEd0Q1FVRnJRanRKUVVOc1FpeE5RVUZOTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTTFReXhOUVVGTkxGRkJRVkVzUjBGQlJ5eGpRVUZqTEVOQlFVTXNWVUZCVlN4RlFVRkZMRWRCUVVjc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEpRVVZ5UkN4eFFrRkJjVUk3U1VGRGNrSXNVMEZCVXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU12UWl4RFFVRkRPMEZCUlVRc0swTkJRU3RETzBGQlF5OURMRTFCUVUwc1ZVRkJWU3h0UWtGQmJVSXNRMEZCUXl4TFFVRnJRaXhGUVVGRkxFZEJRV2xDTzBGQlJYcEZMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzVjBGQlZ5eERRVUZETEVsQlFXVTdTVUZEZWtNc1QwRkJUeXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRhRU1zUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4cFFrRkJhVUlzUTBGQlF5eEhRVUZYTEVWQlFVVXNUMEZCWlN4SlFVRkpPMGxCUTJoRkxFMUJRVTBzUjBGQlJ5eEhRVUZoTEVWQlFVVXNRMEZCUXp0SlFVTjZRaXhKUVVGSkxFZEJRVWNzUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXp0UlFVRkZMRTlCUVU4c1IwRkJSeXhEUVVGRE8wbEJSV3BETEVsQlFVa3NTVUZCU1N4SFFVRlhMRU5CUVVNc1EwRkJRenRKUVVOeVFpeEpRVUZKTEV0QlFVc3NSMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVOMlFpeFBRVUZQTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVU3VVVGREwwTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dFJRVU5vUWl4SlFVRkpMRWRCUVVjc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF6dExRVU5zUWp0SlFVTkVMRTlCUVU4c1IwRkJSeXhEUVVGRE8wRkJRMklzUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4VFFVRlRMRU5CUVVNc1IwRkJhVUk3U1VGRGVrTXNUMEZCVHl4SFFVRkhMRU5CUVVNc1VVRkJVU3hMUVVGTExFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNVMEZCVXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZEY2tVc1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeFRRVUZUTEVOQlFVTXNSMEZCYVVJN1NVRkRla01zVDBGQlR5eEhRVUZITEVOQlFVTXNVMEZCVXl4TFFVRkxMRWxCUVVrc1EwRkJRenRCUVVOb1F5eERRVUZETzBGQlJVUXNPRVZCUVRoRk8wRkJRemxGTEUxQlFVMHNWVUZCVlN4elFrRkJjMElzUTBGQlF5eEhRVUZYTEVWQlFVVXNTMEZCWjBJc1JVRkJSU3hWUVVGMVFqdEpRVU16Uml4TlFVRk5MRmxCUVZrc1IwRkJSeXhwUWtGQmFVSXNRMEZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTTNSQ3hKUVVGSkxGbEJRVmtzUlVGQlJUdFJRVU5vUWl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExEUkVRVUUwUkN4RFFVRkRMRU5CUVVNN1MwRkROMFU3U1VGRlJDeEpRVUZKTEVkQlFVY3NTMEZCU3l4RlFVRkZMRVZCUVVVN1VVRkRaQ3hQUVVGUE8xbEJRMHdzVlVGQlZUdFpRVU5XTEVsQlFVa3NSVUZCUlN4RlFVRkZPMWxCUTFJc1NVRkJTU3hGUVVGRkxFVkJRVVU3VTBGRFZDeERRVUZETzB0QlEwZzdTVUZGUkN4UFFVRlBPMUZCUTB3c1ZVRkJWVHRSUVVOV0xFbEJRVWtzUlVGQlJTeERRVUZETzJkQ1FVTk1MRXRCUVVzN1owSkJRMHdzUzBGQlN5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWRCUVVjc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzJGQlF6TkNMRU5CUVVNN1VVRkRSaXhKUVVGSkxFVkJRVVVzUjBGQlJ6dExRVU5XTEVOQlFVRTdRVUZGU0N4RFFVRkRPMEZCUlVRc09FWkJRVGhHTzBGQlF6bEdMRTFCUVUwc1ZVRkJWU3hqUVVGakxFTkJRVU1zU1VGQlpTeEZRVUZGTEV0QlFXRXNSVUZCUlN4WFFVRTJRaXhGUVVGRkxFdEJRWGxDTzBsQlEzSklMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExIVkNRVUYxUWl4RFFVRkRMRU5CUVVNN1NVRkZiRVlzVFVGQlRTeEhRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wbEJRM2hDTEUxQlFVMHNTMEZCU3l4SFFVRkhMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRmVFSXNTVUZCU1N4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1VVRkRNVVFzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4dFEwRkJiVU1zUTBGQlF5eERRVUZETzFGQlEyNUVMRTlCUVU4N1MwRkRVanRKUVVWRUxFMUJRVTBzVVVGQlVTeEhRVUZITEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRNMElzVFVGQlRTeFJRVUZSTEcxRFFVRlJMRWRCUVVjc1EwRkJReXhMUVVGTExFZEJRVXNzUzBGQlN5eERRVUZGTEVOQlFVTTdTVUZGTlVNc1NVRkJTU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVU3VVVGRE9VUXNiMEpCUVc5Q08xRkJRM0JDTEVkQlFVY3NRMEZCUXl4TFFVRkxMRWRCUVVjc1VVRkJVU3hEUVVGRE8wdEJRM1JDTzFOQlFVMHNTVUZCU1N4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1VVRkRia1VzZVVKQlFYbENPMUZCUTNwQ0xFMUJRVTBzVDBGQlR5eEhRVUZaTzFsQlEzWkNMRXRCUVVzc1JVRkJSU3hSUVVGUk8xbEJRMllzUzBGQlN5eEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0VFFVTnNReXhEUVVGRE8xRkJRMFlzUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUTJ4RExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dExRVU5vUXp0VFFVRk5MRWxCUVVrc1YwRkJWeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8xRkJRMjVGTEhkQ1FVRjNRanRSUVVONFFpeE5RVUZOTEZGQlFWRXNSMEZCV1R0WlFVTjRRaXhMUVVGTExFVkJRVVVzVVVGQlVUdFpRVU5tTEV0QlFVc3NSVUZCUlN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1UwRkRiRU1zUTBGQlF6dFJRVU5HTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRSUVVOc1F5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMHRCUTNKRE8xTkJRVTA3VVVGRFRDeDVRa0ZCZVVJN1VVRkRla0lzVFVGQlRTeFBRVUZQTEVkQlFWazdXVUZEZGtJc1MwRkJTeXhGUVVGRkxGRkJRVkU3V1VGRFppeExRVUZMTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRUUVVOMFF5eERRVUZETzFGQlJVWXNUVUZCVFN4VFFVRlRMRWRCUVZrN1dVRkRla0lzUzBGQlN5eEZRVUZGTEZGQlFWRTdXVUZEWml4TFFVRkxMRVZCUVVVc1YwRkJWenRUUVVOdVFpeERRVUZCTzFGQlJVUXNUVUZCVFN4UlFVRlJMRWRCUVZrN1dVRkRlRUlzUzBGQlN5eEZRVUZGTEZGQlFWRTdXVUZEWml4TFFVRkxMRVZCUVVVc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFRRVU4wUXl4RFFVRkRPMUZCUlVZc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RlFVRkZMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdTMEZEY2tRN1FVRkRTQ3hEUVVGRE8wRkJSVVFzVFVGQlRTeFZRVUZWTEdOQlFXTXNRMEZCUXl4TFFVRnJRaXhGUVVGRkxFZEJRV2xDTzBsQlEyeEZMRWxCUVVrc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF6dFJRVUZGTEU5QlFVOHNTVUZCU1N4RFFVRkRPMGxCUTJoRExFOUJRVThzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUXk5RkxFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNjMEpCUVhOQ0xFTkJRVU1zUzBGQmEwSXNSVUZCUlN4SFFVRnBRanRKUVVNeFJTeEpRVUZKTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNN1VVRkJSU3hQUVVGUExFZEJRVWNzUTBGQlF6dEpRVU12UWl4SlFVRkpMR05CUVdNc1EwRkJReXhMUVVGTExFVkJRVVVzUjBGQlJ5eERRVUZETzFGQlFVVXNUMEZCVHl4SFFVRkhMRU5CUVVNN1NVRkZNME1zVFVGQlRTeFJRVUZSTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEzaEZMRWxCUVVrc1VVRkJVU3hMUVVGTExHMUNRVUZ0UWl4RlFVRkZPMUZCUTNCRExFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNSMEZCUnl4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRMUVVONlJUdEpRVVZFTEhWQ1FVRjFRanRKUVVOMlFpeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMREJFUVVFd1JDeERRVUZETEVOQlFVTTdTVUZETVVVc1QwRkJUeXh4UWtGQmNVSXNRMEZCUXp0QlFVTXZRaXhEUVVGRE8wRkJSVVFzY1VOQlFYRkRPMEZCUTNKRExFMUJRVTBzVlVGQlZTeHBRa0ZCYVVJc1EwRkJReXhMUVVGclFpeEZRVUZGTEZOQlFXbENMRVZCUVVVc1UwRkJhVUk3U1VGRGVFWXNTVUZCU1N4VFFVRlRMRXRCUVVzc2JVSkJRVzFDTEVsQlFVa3NVMEZCVXl4TFFVRkxMRzFDUVVGdFFqdFJRVUZGTEU5QlFVOHNiVUpCUVcxQ0xFTkJRVU03U1VGRGRrY3NUVUZCVFN4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlF6bENMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0UlFVTjZReXhOUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRM3BDTEVsQlFVa3NUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSU3hIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFVVTdXVUZEYWtNc1QwRkJUeXhEUVVGRExFTkJRVU03VTBGRFZqdExRVU5HTzBsQlJVUXNkVUpCUVhWQ08wbEJRM1pDTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc2IwTkJRVzlETEVOQlFVTXNRMEZCUXp0SlFVTndSQ3hQUVVGUExHMUNRVUZ0UWl4RFFVRkRPMEZCUXpkQ0xFTkJRVU1pZlE9PSIsImNvbnN0IGluZmxhdGUgPSByZXF1aXJlKCd0aW55LWluZmxhdGUnKTtcblxuLy8gU2hpZnQgc2l6ZSBmb3IgZ2V0dGluZyB0aGUgaW5kZXgtMSB0YWJsZSBvZmZzZXQuXG5jb25zdCBTSElGVF8xID0gNiArIDU7XG5cbi8vIFNoaWZ0IHNpemUgZm9yIGdldHRpbmcgdGhlIGluZGV4LTIgdGFibGUgb2Zmc2V0LlxuY29uc3QgU0hJRlRfMiA9IDU7XG5cbi8vIERpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIHNoaWZ0IHNpemVzLFxuLy8gZm9yIGdldHRpbmcgYW4gaW5kZXgtMSBvZmZzZXQgZnJvbSBhbiBpbmRleC0yIG9mZnNldC4gNj0xMS01XG5jb25zdCBTSElGVF8xXzIgPSBTSElGVF8xIC0gU0hJRlRfMjtcblxuLy8gTnVtYmVyIG9mIGluZGV4LTEgZW50cmllcyBmb3IgdGhlIEJNUC4gMzI9MHgyMFxuLy8gVGhpcyBwYXJ0IG9mIHRoZSBpbmRleC0xIHRhYmxlIGlzIG9taXR0ZWQgZnJvbSB0aGUgc2VyaWFsaXplZCBmb3JtLlxuY29uc3QgT01JVFRFRF9CTVBfSU5ERVhfMV9MRU5HVEggPSAweDEwMDAwID4+IFNISUZUXzE7XG5cbi8vIE51bWJlciBvZiBlbnRyaWVzIGluIGFuIGluZGV4LTIgYmxvY2suIDY0PTB4NDBcbmNvbnN0IElOREVYXzJfQkxPQ0tfTEVOR1RIID0gMSA8PCBTSElGVF8xXzI7XG5cbi8vIE1hc2sgZm9yIGdldHRpbmcgdGhlIGxvd2VyIGJpdHMgZm9yIHRoZSBpbi1pbmRleC0yLWJsb2NrIG9mZnNldC4gKi9cbmNvbnN0IElOREVYXzJfTUFTSyA9IElOREVYXzJfQkxPQ0tfTEVOR1RIIC0gMTtcblxuLy8gU2hpZnQgc2l6ZSBmb3Igc2hpZnRpbmcgbGVmdCB0aGUgaW5kZXggYXJyYXkgdmFsdWVzLlxuLy8gSW5jcmVhc2VzIHBvc3NpYmxlIGRhdGEgc2l6ZSB3aXRoIDE2LWJpdCBpbmRleCB2YWx1ZXMgYXQgdGhlIGNvc3Rcbi8vIG9mIGNvbXBhY3RhYmlsaXR5LlxuLy8gVGhpcyByZXF1aXJlcyBkYXRhIGJsb2NrcyB0byBiZSBhbGlnbmVkIGJ5IERBVEFfR1JBTlVMQVJJVFkuXG5jb25zdCBJTkRFWF9TSElGVCA9IDI7XG5cbi8vIE51bWJlciBvZiBlbnRyaWVzIGluIGEgZGF0YSBibG9jay4gMzI9MHgyMFxuY29uc3QgREFUQV9CTE9DS19MRU5HVEggPSAxIDw8IFNISUZUXzI7XG5cbi8vIE1hc2sgZm9yIGdldHRpbmcgdGhlIGxvd2VyIGJpdHMgZm9yIHRoZSBpbi1kYXRhLWJsb2NrIG9mZnNldC5cbmNvbnN0IERBVEFfTUFTSyA9IERBVEFfQkxPQ0tfTEVOR1RIIC0gMTtcblxuLy8gVGhlIHBhcnQgb2YgdGhlIGluZGV4LTIgdGFibGUgZm9yIFUrRDgwMC4uVStEQkZGIHN0b3JlcyB2YWx1ZXMgZm9yXG4vLyBsZWFkIHN1cnJvZ2F0ZSBjb2RlIF91bml0c18gbm90IGNvZGUgX3BvaW50c18uXG4vLyBWYWx1ZXMgZm9yIGxlYWQgc3Vycm9nYXRlIGNvZGUgX3BvaW50c18gYXJlIGluZGV4ZWQgd2l0aCB0aGlzIHBvcnRpb24gb2YgdGhlIHRhYmxlLlxuLy8gTGVuZ3RoPTMyPTB4MjA9MHg0MDA+PlNISUZUXzIuIChUaGVyZSBhcmUgMTAyND0weDQwMCBsZWFkIHN1cnJvZ2F0ZXMuKVxuY29uc3QgTFNDUF9JTkRFWF8yX09GRlNFVCA9IDB4MTAwMDAgPj4gU0hJRlRfMjtcbmNvbnN0IExTQ1BfSU5ERVhfMl9MRU5HVEggPSAweDQwMCA+PiBTSElGVF8yO1xuXG4vLyBDb3VudCB0aGUgbGVuZ3RocyBvZiBib3RoIEJNUCBwaWVjZXMuIDIwODA9MHg4MjBcbmNvbnN0IElOREVYXzJfQk1QX0xFTkdUSCA9IExTQ1BfSU5ERVhfMl9PRkZTRVQgKyBMU0NQX0lOREVYXzJfTEVOR1RIO1xuXG4vLyBUaGUgMi1ieXRlIFVURi04IHZlcnNpb24gb2YgdGhlIGluZGV4LTIgdGFibGUgZm9sbG93cyBhdCBvZmZzZXQgMjA4MD0weDgyMC5cbi8vIExlbmd0aCAzMj0weDIwIGZvciBsZWFkIGJ5dGVzIEMwLi5ERiwgcmVnYXJkbGVzcyBvZiBTSElGVF8yLlxuY29uc3QgVVRGOF8yQl9JTkRFWF8yX09GRlNFVCA9IElOREVYXzJfQk1QX0xFTkdUSDtcbmNvbnN0IFVURjhfMkJfSU5ERVhfMl9MRU5HVEggPSAweDgwMCA+PiA2OyAgLy8gVSswODAwIGlzIHRoZSBmaXJzdCBjb2RlIHBvaW50IGFmdGVyIDItYnl0ZSBVVEYtOFxuXG4vLyBUaGUgaW5kZXgtMSB0YWJsZSwgb25seSB1c2VkIGZvciBzdXBwbGVtZW50YXJ5IGNvZGUgcG9pbnRzLCBhdCBvZmZzZXQgMjExMj0weDg0MC5cbi8vIFZhcmlhYmxlIGxlbmd0aCwgZm9yIGNvZGUgcG9pbnRzIHVwIHRvIGhpZ2hTdGFydCwgd2hlcmUgdGhlIGxhc3Qgc2luZ2xlLXZhbHVlIHJhbmdlIHN0YXJ0cy5cbi8vIE1heGltdW0gbGVuZ3RoIDUxMj0weDIwMD0weDEwMDAwMD4+U0hJRlRfMS5cbi8vIChGb3IgMHgxMDAwMDAgc3VwcGxlbWVudGFyeSBjb2RlIHBvaW50cyBVKzEwMDAwLi5VKzEwZmZmZi4pXG4vL1xuLy8gVGhlIHBhcnQgb2YgdGhlIGluZGV4LTIgdGFibGUgZm9yIHN1cHBsZW1lbnRhcnkgY29kZSBwb2ludHMgc3RhcnRzXG4vLyBhZnRlciB0aGlzIGluZGV4LTEgdGFibGUuXG4vL1xuLy8gQm90aCB0aGUgaW5kZXgtMSB0YWJsZSBhbmQgdGhlIGZvbGxvd2luZyBwYXJ0IG9mIHRoZSBpbmRleC0yIHRhYmxlXG4vLyBhcmUgb21pdHRlZCBjb21wbGV0ZWx5IGlmIHRoZXJlIGlzIG9ubHkgQk1QIGRhdGEuXG5jb25zdCBJTkRFWF8xX09GRlNFVCA9IFVURjhfMkJfSU5ERVhfMl9PRkZTRVQgKyBVVEY4XzJCX0lOREVYXzJfTEVOR1RIO1xuXG4vLyBUaGUgYWxpZ25tZW50IHNpemUgb2YgYSBkYXRhIGJsb2NrLiBBbHNvIHRoZSBncmFudWxhcml0eSBmb3IgY29tcGFjdGlvbi5cbmNvbnN0IERBVEFfR1JBTlVMQVJJVFkgPSAxIDw8IElOREVYX1NISUZUO1xuXG5jbGFzcyBVbmljb2RlVHJpZSB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBjb25zdCBpc0J1ZmZlciA9ICh0eXBlb2YgZGF0YS5yZWFkVUludDMyQkUgPT09ICdmdW5jdGlvbicpICYmICh0eXBlb2YgZGF0YS5zbGljZSA9PT0gJ2Z1bmN0aW9uJyk7XG5cbiAgICBpZiAoaXNCdWZmZXIgfHwgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgIC8vIHJlYWQgYmluYXJ5IGZvcm1hdFxuICAgICAgbGV0IHVuY29tcHJlc3NlZExlbmd0aDtcbiAgICAgIGlmIChpc0J1ZmZlcikge1xuICAgICAgICB0aGlzLmhpZ2hTdGFydCA9IGRhdGEucmVhZFVJbnQzMkJFKDApO1xuICAgICAgICB0aGlzLmVycm9yVmFsdWUgPSBkYXRhLnJlYWRVSW50MzJCRSg0KTtcbiAgICAgICAgdW5jb21wcmVzc2VkTGVuZ3RoID0gZGF0YS5yZWFkVUludDMyQkUoOCk7XG4gICAgICAgIGRhdGEgPSBkYXRhLnNsaWNlKDEyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoZGF0YS5idWZmZXIpO1xuICAgICAgICB0aGlzLmhpZ2hTdGFydCA9IHZpZXcuZ2V0VWludDMyKDApO1xuICAgICAgICB0aGlzLmVycm9yVmFsdWUgPSB2aWV3LmdldFVpbnQzMig0KTtcbiAgICAgICAgdW5jb21wcmVzc2VkTGVuZ3RoID0gdmlldy5nZXRVaW50MzIoOCk7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YmFycmF5KDEyKTtcbiAgICAgIH1cblxuICAgICAgLy8gZG91YmxlIGluZmxhdGUgdGhlIGFjdHVhbCB0cmllIGRhdGFcbiAgICAgIGRhdGEgPSBpbmZsYXRlKGRhdGEsIG5ldyBVaW50OEFycmF5KHVuY29tcHJlc3NlZExlbmd0aCkpO1xuICAgICAgZGF0YSA9IGluZmxhdGUoZGF0YSwgbmV3IFVpbnQ4QXJyYXkodW5jb21wcmVzc2VkTGVuZ3RoKSk7XG4gICAgICB0aGlzLmRhdGEgPSBuZXcgVWludDMyQXJyYXkoZGF0YS5idWZmZXIpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHByZS1wYXJzZWQgZGF0YVxuICAgICAgKHsgZGF0YTogdGhpcy5kYXRhLCBoaWdoU3RhcnQ6IHRoaXMuaGlnaFN0YXJ0LCBlcnJvclZhbHVlOiB0aGlzLmVycm9yVmFsdWUgfSA9IGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldChjb2RlUG9pbnQpIHtcbiAgICBsZXQgaW5kZXg7XG4gICAgaWYgKChjb2RlUG9pbnQgPCAwKSB8fCAoY29kZVBvaW50ID4gMHgxMGZmZmYpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lcnJvclZhbHVlO1xuICAgIH1cblxuICAgIGlmICgoY29kZVBvaW50IDwgMHhkODAwKSB8fCAoKGNvZGVQb2ludCA+IDB4ZGJmZikgJiYgKGNvZGVQb2ludCA8PSAweGZmZmYpKSkge1xuICAgICAgLy8gT3JkaW5hcnkgQk1QIGNvZGUgcG9pbnQsIGV4Y2x1ZGluZyBsZWFkaW5nIHN1cnJvZ2F0ZXMuXG4gICAgICAvLyBCTVAgdXNlcyBhIHNpbmdsZSBsZXZlbCBsb29rdXAuICBCTVAgaW5kZXggc3RhcnRzIGF0IG9mZnNldCAwIGluIHRoZSBpbmRleC5cbiAgICAgIC8vIGRhdGEgaXMgc3RvcmVkIGluIHRoZSBpbmRleCBhcnJheSBpdHNlbGYuXG4gICAgICBpbmRleCA9ICh0aGlzLmRhdGFbY29kZVBvaW50ID4+IFNISUZUXzJdIDw8IElOREVYX1NISUZUKSArIChjb2RlUG9pbnQgJiBEQVRBX01BU0spO1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YVtpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcbiAgICAgIC8vIExlYWQgU3Vycm9nYXRlIENvZGUgUG9pbnQuICBBIFNlcGFyYXRlIGluZGV4IHNlY3Rpb24gaXMgc3RvcmVkIGZvclxuICAgICAgLy8gbGVhZCBzdXJyb2dhdGUgY29kZSB1bml0cyBhbmQgY29kZSBwb2ludHMuXG4gICAgICAvLyAgIFRoZSBtYWluIGluZGV4IGhhcyB0aGUgY29kZSB1bml0IGRhdGEuXG4gICAgICAvLyAgIEZvciB0aGlzIGZ1bmN0aW9uLCB3ZSBuZWVkIHRoZSBjb2RlIHBvaW50IGRhdGEuXG4gICAgICBpbmRleCA9ICh0aGlzLmRhdGFbTFNDUF9JTkRFWF8yX09GRlNFVCArICgoY29kZVBvaW50IC0gMHhkODAwKSA+PiBTSElGVF8yKV0gPDwgSU5ERVhfU0hJRlQpICsgKGNvZGVQb2ludCAmIERBVEFfTUFTSyk7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhW2luZGV4XTtcbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50IDwgdGhpcy5oaWdoU3RhcnQpIHtcbiAgICAgIC8vIFN1cHBsZW1lbnRhbCBjb2RlIHBvaW50LCB1c2UgdHdvLWxldmVsIGxvb2t1cC5cbiAgICAgIGluZGV4ID0gdGhpcy5kYXRhWyhJTkRFWF8xX09GRlNFVCAtIE9NSVRURURfQk1QX0lOREVYXzFfTEVOR1RIKSArIChjb2RlUG9pbnQgPj4gU0hJRlRfMSldO1xuICAgICAgaW5kZXggPSB0aGlzLmRhdGFbaW5kZXggKyAoKGNvZGVQb2ludCA+PiBTSElGVF8yKSAmIElOREVYXzJfTUFTSyldO1xuICAgICAgaW5kZXggPSAoaW5kZXggPDwgSU5ERVhfU0hJRlQpICsgKGNvZGVQb2ludCAmIERBVEFfTUFTSyk7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhW2luZGV4XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSBEQVRBX0dSQU5VTEFSSVRZXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaWNvZGVUcmllOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZWRpdG9yXCI7XG5pbXBvcnQgeyBGb250TWFuYWdlciB9IGZyb20gXCIuL2ZvbnRNYW5nZXJcIjtcbmltcG9ydCB7IExheW91dCB9IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgc3BsaXRXb3JkcyB9IGZyb20gXCIuL2xpbmVicmVha1wiO1xuaW1wb3J0IHsgZHJhd1RleHRSdW5QYXJ0IH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5pbXBvcnQgeyBMSU5FX1NQQUNJTkcsIFRFWFRfQUxJR05NRU5ULCBURVhUX0RFQ09SQVRJT04sIFRFWFRfU0NSSVBULCBURVhUX1ZBUklBVElPTiB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBhZ2dyZWdhdGVXb3JkTWV0cmljLCBnZXRQb3N0Q3V0TGluZSwgZ2V0UHJlQ3V0TGluZSwgZ2V0U3R5bGVBdFBvc2l0aW9uLCBsaW5lYnJlYWssIG1lcmdlTGluZSwgcG9zaXRpb25MZXNzT3JFcXVhbCwgc2VsZWN0aW9uSXNFbXB0eSwgdXBkYXRlUnVuUGFydHNGcm9tV29yZHMsIHVwZGF0ZVdvcmRzTWV0cmljIH0gZnJvbSBcIi4vdXRpbFwiO1xudmFyIExpbmVCcmVha2VyID0gcmVxdWlyZSgnLi4vLi4vbm9kZV9tb2R1bGVzL2xpbmVicmVhay1uZXh0Jyk7XG4vLyBleHBvcnQgY29uc3RzLCBjbGFzcywgZnVuY3Rpb25zXG5mdW5jdGlvbiBncmVldChzdHIpIHtcbiAgICB2YXIgYnJlYWtlciA9IG5ldyBMaW5lQnJlYWtlcihzdHIpO1xuICAgIHZhciBsYXN0ID0gMDtcbiAgICB2YXIgYms7XG4gICAgd2hpbGUgKGJrID0gYnJlYWtlci5uZXh0QnJlYWsoKSkge1xuICAgICAgICAvLyBnZXQgdGhlIHN0cmluZyBiZXR3ZWVuIHRoZSBsYXN0IGJyZWFrIGFuZCB0aGlzIG9uZVxuICAgICAgICB2YXIgd29yZCA9IHN0ci5zbGljZShsYXN0LCBiay5wb3NpdGlvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKHdvcmQpO1xuICAgICAgICAvLyB5b3UgY2FuIGFsc28gY2hlY2sgYmsucmVxdWlyZWQgdG8gc2VlIGlmIHRoaXMgd2FzIGEgcmVxdWlyZWQgYnJlYWsuLi5cbiAgICAgICAgaWYgKGJrLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnXFxuXFxuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdCA9IGJrLnBvc2l0aW9uO1xuICAgIH1cbn1cbnZhciBidGV4ID0ge1xuICAgIGdyZWV0OiBncmVldCxcbiAgICBkcmF3VGV4dFJ1blBhcnQsXG4gICAgc3BsaXRXb3JkcyxcbiAgICB1cGRhdGVXb3Jkc01ldHJpYyxcbiAgICBsaW5lYnJlYWssXG4gICAgYWdncmVnYXRlV29yZE1ldHJpYyxcbiAgICB1cGRhdGVSdW5QYXJ0c0Zyb21Xb3JkcyxcbiAgICBnZXRQcmVDdXRMaW5lLFxuICAgIGdldFBvc3RDdXRMaW5lLFxuICAgIG1lcmdlTGluZSxcbiAgICBnZXRTdHlsZUF0UG9zaXRpb24sXG4gICAgcG9zaXRpb25MZXNzT3JFcXVhbCxcbiAgICBzZWxlY3Rpb25Jc0VtcHR5LFxuICAgIC8vIGVudW1zXG4gICAgVEVYVF9WQVJJQVRJT04sXG4gICAgVEVYVF9ERUNPUkFUSU9OLFxuICAgIFRFWFRfQUxJR05NRU5ULFxuICAgIFRFWFRfU0NSSVBULFxuICAgIExJTkVfU1BBQ0lORyxcbiAgICBGb250TWFuYWdlcixcbiAgICBMYXlvdXQsXG4gICAgRWRpdG9yLFxufTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICBpZiAod2luZG93Lmhhc093blByb3BlcnR5KFwiYnRleFwiKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWV0aGluZyBlbHNlIGlzIGNhbGxlZCBidGV4IScpO1xuICAgIH1cbn1cbndpbmRvdy5idGV4ID0gYnRleDtcbi8vIGdyZWV0KCfmiJHov5nph4zov5jmnInvvIzkvaDopoHkuI3opoHlkaI/XFxu6L+Z5LmI55qE77yBJyk7XG4vLyBjb25zb2xlLmxvZyhgc2VnbWVudFdvcmRzOmApO1xuLy8gY29uc3Qgc3RyID0gJ3RoaXMgaXMgYSBUZXh0XFxuXFxuYm9vayBpbiBoZXJlISc7XG4vLyBjb25zdCBzdHIgPSAnXFxuYWJjIFRFWHQgZGVcXG4xMiAzNDUnO1xuLy8gY29uc3Qgc3RyMSA9ICdBLWItYy1kLWctZy1oLWotay1rLWxBLWItYy1kLWctZy1oLWotay1rLWxBLWItYy1kLWctZy1oLWotay1rLWwnO1xuLy8gY29uc29sZS5sb2coc2VnbWVudFdvcmRzKHN0cjEpKTtcbi8vIGNvbnNvbGUubG9nKHNlZ21lbnRXb3JkUmFuZ2VzKHN0cikpO1xuLy8gY29uc29sZS5sb2coYGJyZWFrUGxhaW5UZXh0SW50b0xpbmVzOmApO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWVhCd0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dmMzSmpMMkZ3Y0M1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNWVUZCVlN4RFFVRkRPMEZCUTJ4RExFOUJRVThzUlVGQlJTeFhRVUZYTEVWQlFVVXNUVUZCVFN4alFVRmpMRU5CUVVNN1FVRkRNME1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4TlFVRk5MRlZCUVZVc1EwRkJRenRCUVVOc1F5eFBRVUZQTEVWQlFVVXNWVUZCVlN4RlFVRkZMRTFCUVUwc1lVRkJZU3hEUVVGRE8wRkJRM3BETEU5QlFVOHNSVUZCUlN4bFFVRmxMRVZCUVVVc1RVRkJUU3hWUVVGVkxFTkJRVUU3UVVGRE1VTXNUMEZCVHl4RlFVRkZMRmxCUVZrc1JVRkJSU3hqUVVGakxFVkJRVVVzWlVGQlpTeEZRVUZGTEZkQlFWY3NSVUZCUlN4alFVRmpMRVZCUVVVc1RVRkJUU3hUUVVGVExFTkJRVU03UVVGRGNrY3NUMEZCVHl4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEdOQlFXTXNSVUZCUlN4aFFVRmhMRVZCUVVVc2EwSkJRV3RDTEVWQlFVVXNVMEZCVXl4RlFVRkZMRk5CUVZNc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4blFrRkJaMElzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSU3hwUWtGQmFVSXNSVUZCUlN4TlFVRk5MRkZCUVZFc1EwRkJRenRCUVVONlRTeEpRVUZKTEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc2JVTkJRVzFETEVOQlFVTXNRMEZCUXp0QlFVVXZSQ3hyUTBGQmEwTTdRVUZEYkVNc1UwRkJVeXhMUVVGTExFTkJRVU1zUjBGQlZ6dEpRVU40UWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxGZEJRVmNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTnVReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEWWl4SlFVRkpMRVZCUVVVc1EwRkJRenRKUVVWUUxFOUJRVThzUlVGQlJTeEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1JVRkJSVHRSUVVNdlFpeHhSRUZCY1VRN1VVRkRja1FzU1VGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUTNoRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkZiRUlzZDBWQlFYZEZPMUZCUTNoRkxFbEJRVWtzUlVGQlJTeERRVUZETEZGQlFWRXNSVUZCUlR0WlFVTm1MRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdVMEZEY2tJN1VVRkZSQ3hKUVVGSkxFZEJRVWNzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXp0TFFVTndRanRCUVVOSUxFTkJRVU03UVVGRlJDeEpRVUZKTEVsQlFVa3NSMEZCUnp0SlFVTlVMRXRCUVVzc1JVRkJSU3hMUVVGTE8wbEJRMW9zWlVGQlpUdEpRVU5tTEZWQlFWVTdTVUZEVml4cFFrRkJhVUk3U1VGRGFrSXNVMEZCVXp0SlFVTlVMRzFDUVVGdFFqdEpRVU51UWl4MVFrRkJkVUk3U1VGRGRrSXNZVUZCWVR0SlFVTmlMR05CUVdNN1NVRkRaQ3hUUVVGVE8wbEJRMVFzYTBKQlFXdENPMGxCUTJ4Q0xHMUNRVUZ0UWp0SlFVTnVRaXhuUWtGQlowSTdTVUZGYUVJc1VVRkJVVHRKUVVOU0xHTkJRV003U1VGRFpDeGxRVUZsTzBsQlEyWXNZMEZCWXp0SlFVTmtMRmRCUVZjN1NVRkRXQ3haUVVGWk8wbEJRMW9zVjBGQlZ6dEpRVU5ZTEUxQlFVMDdTVUZEVGl4TlFVRk5PME5CUTBFc1EwRkJRenRCUVVWVUxFbEJRVWtzVDBGQlR5eE5RVUZOTEV0QlFVc3NWMEZCVnl4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFVkJRVVU3U1VGRGNFUXNTVUZCU1N4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZGTzFGQlEycERMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zWjBOQlFXZERMRU5CUVVNc1EwRkJRenRMUVVOdVJEdERRVU5HTzBGQlJVRXNUVUZCWXl4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRk5VSXNLMEpCUVN0Q08wRkJReTlDTEdkRFFVRm5RenRCUVVOb1F5eHBSRUZCYVVRN1FVRkRha1FzZFVOQlFYVkRPMEZCUTNaRExHdEdRVUZyUmp0QlFVTnNSaXh0UTBGQmJVTTdRVUZEYmtNc2RVTkJRWFZETzBGQlEzWkRMREpEUVVFeVF5SjkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=