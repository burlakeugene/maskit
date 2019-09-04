
## Maskit

```
npm i --save maskit
```

```
<input type="text" data-maskit="+{7}(000) 000-00-00">
<input type="text" data-maskit="000 / 000">
```

```
document.querySelectorAll('input[data-maskit]').forEach((input, index) => {
  new Maskit(input, {
    notFilledClear: true,
    onFilled: scope => {},
    offFilled: scope => {},
    onBlur: scope => {}
  });
});
```
