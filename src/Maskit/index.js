export default class Maskit {
  constructor(item, options = {}) {
    this.input = item;
    this.value = '';
    this.mask = this.createMaskArray(item.getAttribute('data-maskit'));
    this.options = options;
    this.filled = false;
    this.init();
  }

  createMaskArray(mask) {
    let maskArray = [],
      continueCount = 0,
      specChars = '?+-()[]{}.,\\/-=_~`|\'" ';
    for (let index in mask) {
      index = parseInt(index);
      if (continueCount) {
        --continueCount;
        continue;
      }
      if (mask[index] === '{' && mask[index + 2] === '}') {
        maskArray.push({
          type: 'plain',
          value: mask[index + 1]
        });
        continueCount += 2;
      } else {
        if (specChars.split('').indexOf(mask[index]) >= 0) {
          maskArray.push({
            type: 'plain',
            value: mask[index]
          });
        } else {
          maskArray.push({
            type: 'dynamic',
            value: mask[index]
          });
        }
      }
    }
    return maskArray;
  }

  checkMaskChar(char, mask, index, maskInc) {
    let result = '',
      maskChar = mask[index];
    if (maskChar.type === 'plain') {
      result += maskChar.value;
      result += this.checkMaskChar(char, mask, ++index, maskInc);
    }
    if (maskChar.type === 'dynamic') {
      if (maskChar.value === '0') {
        let pattern = /^[0-9]+$/;
        if (pattern.test(char)) result += char;
      }
      if (maskChar.value === 'A') {
        let pattern = /^[A-Za-zА-Яа-я]+$/;
        if (pattern.test(char)) result += char;
      }
    }
    if (result.length) maskInc();
    return result;
  }

  checkMask(value, mask) {
    let newValue = '',
      maskIndex = 0;
    for (let index in value) {
      if (!mask[index]) return newValue;
      index = parseInt(index);
      let char = value[index].toString();
      if (char === mask[index].value) {
        newValue += char;
        ++maskIndex;
      } else {
        newValue += this.checkMaskChar(char, mask, maskIndex, () => {
          ++maskIndex;
        });
      }
    }
    return newValue;
  }

  onFilled(){
    let {onFilled} = this.options;
    this.filled = true;
    onFilled && onFilled(this);
  }

  offFilled(){
    let {offFilled} = this.options;
    this.filled = false;
    offFilled && offFilled(this);
  }

  onBlur(){
    let {onBlur, notFilledClear} = this.options;
    notFilledClear && this.value.length !== this.mask.length && this.setValue('');
    onBlur && onBlur(this);
  }

  setValue(value){
    this.input.value = value;
    if(value.length === this.mask.length){
      this.onFilled();
    }
    else{
      this.offFilled();
    }
  }

  listenerInput(){
    this.input.addEventListener('input', e => {
      this.value = this.checkMask(e.target.value, this.mask);
      this.setValue(this.value);
    });
  }

  listenerBlur(){
    this.input.addEventListener('blur', (e) => {
      this.onBlur();
    })
  }

  runListener() {
    this.listenerInput();
    this.listenerBlur();
  }

  init() {
    this.runListener();
  }
}
