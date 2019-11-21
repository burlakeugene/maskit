import Maskit from '../package';

document.querySelectorAll('input').forEach((item, index) => {
  let mask = new Maskit(item, {
    mask: item.getAttribute('data-maskit'),
    notFilledClear: true,
    onFilled: scope => {},
    offFilled: scope => {},
    onBlur: scope => {},
    onChange: scope => {}
  });
});