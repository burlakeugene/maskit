import Maskit from '../package';
import './styles.scss';

window.addEventListener('load', () => {
  let blobFunc = () => {
    let blob = document.querySelector('.header-blob');
    if(!blob) return;
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if(scrollTop > 0){
        // blob.querySelector('path').setAttribute('d', 'm 0,0 0,300 L 300,300 0, 300, 0')
      }
    })
  }
  blobFunc();
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
})