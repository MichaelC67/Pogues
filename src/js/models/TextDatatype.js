/**
A numeric response datatype
*/
import DatatypeModel from './Datatype.js';

class TextDatatypeModel extends DatatypeModel {
  constructor(object) {
    super(object);
    if (object) {
      this._maxLength = object._maxLength;
      this._pattern = object._pattern;
     } else {
      this._maxLength = 0;
      this._pattern = '';
    }
    this._typeName = DATATYPE_TYPES[2];
  }

  get maxLength() {
    return this._maxLength;
  }

  get pattern() {
    return this._pattern;
  }

  set maxLength(maxLength) {
    if (typeof maxLength !== 'number') {
      throw new Error('The parameter must be a number');
    }
    this._maxLength = maxLength;
  }

  set pattern(pattern) {
    if (typeof pattern !== 'string') {
      throw new Error('The parameter must be a string');
    }
    this._pattern = pattern;
  }
}

export default TextDatatypeModel;
