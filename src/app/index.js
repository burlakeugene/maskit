import Maskit from '../package';
import './styles.scss';

window.addEventListener('load', () => {
  const reRenderCode = mask => {
    document.querySelectorAll('.mask-value').forEach(item => {
      item.innerHTML = mask;
      setTimeout(() => {
        hljs.highlightBlock(item.closest('.code'));
      }, 0)
    });
  };
  let maskInput = document.querySelector('input#mask'),
    mask = maskInput.value,
    resultInput = document.querySelector('input#result'),
    masked = new Maskit(resultInput, {
      mask,
      notFilledClear: true,
      onFilled: scope => {},
      offFilled: scope => {},
      onBlur: scope => {},
      onChange: scope => {},
      onInit: scope => {
        reRenderCode(scope.options.mask);
      }
    });
  document.querySelectorAll('.mask-value').forEach(item => {
    item.innerHTML = mask;
  });
  resultInput.addEventListener('change', e => {
    console.log(e.target.value);
  })
  maskInput.addEventListener('input', e => {
    let value = e.target.value;
    masked.setValue('');
    masked.setMask(value);
    reRenderCode(value);
  });
});
