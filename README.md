# difference

## 对比js数据修改前后差异，生成操作日志


```js
import difference from 'difference';

// 数据修改前  
let before = {
  name: 'undefined',
  age: '18',
  sex: '1',
  skill: ['javascript', 'html', 'css'],
  asset: {
    house: 10,
    car: 6,
    dog: 1
  }
};

// 数据修改后  
let after = {
  name: 'undefined',
  age: '20',
  sex: '2',
  skill: ['javascript', 'html', 'vue', 'react'],
  asset: {
    house: 18,
    car: 6,
    cat: 2
  }
};

const diff = difference(after, before);
```
