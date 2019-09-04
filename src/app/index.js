import Maskit from '../package';

document.querySelectorAll('[data-maskit]').forEach((item, index) => {
  new Maskit(item, {
    notFilledClear: true,
    onFilled: (scope) => {
    },
    offFilled: (scope) => {
    },
    // onBlur: (scope) => {
    //   if(!scope.filled) item.value = '';
    // }
  });
})