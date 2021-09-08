export default class Maskit {
  constructor(item, options = {}) {
    this.isDom = item instanceof Element || item instanceof HTMLDocument;
    this.input = this.isDom ? item : false;
    this.value = this.input ? this.input.value : '';
    this.input.value = '';
    this.mask = options.mask ? this.createMaskArray(options.mask) : false;
    this.options = options;
    this.filled = false;
    this.onBlur = this.onBlur.bind(this);
    this.setInitialValue = this.setInitialValue.bind(this);
    this.checkErrors();
    this.init();
  }

  checkErrors() {
    if (!this.isDom) throw new Error('First argument must be DOM element');
  }

  createMaskArray(mask, callback) {
    if (!mask) return false;
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
          value: mask[index + 1],
        });
        continueCount += 2;
      } else {
        if (specChars.split('').indexOf(mask[index]) >= 0) {
          maskArray.push({
            type: 'plain',
            value: mask[index],
          });
        } else {
          maskArray.push({
            type: 'dynamic',
            value: mask[index],
          });
        }
      }
    }
    callback && callback();
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
      if (maskChar.value === 'Ы') {
        let pattern = /^[А-Яа-я]+$/;
        if (pattern.test(char)) result += char;
      }
    }
    if (result.length) maskInc();
    return result;
  }

  checkMask(value, mask) {
    if (!mask) return value;
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

  checkInitialMask(value, mask) {
    let newValue = '';
    for (let index in value) {
      index = parseInt(index);
      let char = value[index].toString(),
        maskChar = mask[index];
      if (!maskChar) break;
      if (maskChar.type === 'plain') {
        if (maskChar.value === char) newValue += char;
        else break;
      }
      if (maskChar.type === 'dynamic') {
        if (maskChar.value === '0') {
          let pattern = /^[0-9]+$/;
          if (pattern.test(char)) newValue += char;
          else break;
        }
        if (maskChar.value === 'A') {
          let pattern = /^[A-Za-zА-Яа-я]+$/;
          if (pattern.test(char)) newValue += char;
          else break;
        }
        if (maskChar.value === 'Ы') {
          let pattern = /^[А-Яа-я]+$/;
          if (pattern.test(char)) newValue += char;
          else break;
        }
      }
    }
    return newValue;
  }

  setMask(mask) {
    this.mask = this.createMaskArray(mask);
    this.setInitialValue();
  }

  onFilled() {
    let { onFilled } = this.options;
    this.filled = true;
    onFilled && onFilled(this);
  }

  offFilled() {
    let { offFilled } = this.options;
    this.filled = false;
    offFilled && offFilled(this);
  }

  onBlur() {
    let { onBlur, notFilledClear } = this.options;
    if (notFilledClear && this.value.length !== this.mask.length) {
      this.setValue('');
      setTimeout(() => {
        if ('createEvent' in document) {
          var event = document.createEvent('HTMLEvents');
          event.initEvent('change', false, true);
          this.input.dispatchEvent(event);
        } else this.input.fireEvent('onchange');
      }, 0);
    }

    onBlur && onBlur(this);
  }

  setValue(value) {
    let { onChange } = this.options;
    this.input.value = value;
    if (this.value === value) return;
    this.value = value;
    onChange && onChange(this);
    if (value.length === this.mask.length) {
      this.onFilled();
    } else {
      this.offFilled();
    }
  }

  setInitialValue() {
    if (!this.value) return;
    let value = this.checkInitialMask(this.value, this.mask);
    this.setValue(value);
  }

  listenerInput() {
    this.input &&
      this.input.addEventListener('input', (e) => {
        this.setValue(this.checkMask(e.target.value, this.mask));
      });
  }

  listenerBlur() {
    this.input && this.input.addEventListener('blur', this.onBlur);
  }

  runListener() {
    this.listenerInput();
    this.listenerBlur();
  }

  init() {
    let { onInit } = this.options;
    this.setInitialValue();
    this.runListener();
    onInit && onInit(this);
  }
}
