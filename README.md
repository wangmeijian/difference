# difference

### 对比js数据修改前后差异，生成操作日志

```js
import difference from './difference'

// 数据修改前  
let before = {
  name: 'wang',
  // 枚举数据
  sex: 1,
  // 元素为基本数据类型的数组
  skill: ['javascript', 'html', 'css'],
  // 元素为对象的数组
  stock: [{
    apple: 100
  },{
    google: 200
  }],
  asset: {
    house: 5,
    car: 6,
    dog: 1
  }
};

// 数据修改后  
let after = {
  name: 'wang',
  sex: 2,
  skill: ['javascript', 'html', 'vue', 'react'],
  stock: [{
    apple: 100
  },{
    google: 200
  }],
  asset: {
    house: 10,
    car: 6,
    cat: 2
  },
  job: null
};

const diff = difference(after, before);
```
输出结果为如下格式的数组：

```js
[{
  // 字段路径
  path: [],
  // 字段描述
  path_desc: [],
  // 操作共3种：ADD、REMOVE、UPDATE，即增、删、改
  action: "ADD",
  // 修改前的值
  modify_from: "",
  // 修改后的值
  modify_to: ""
}]
```

结果用表格展示如下：

| 操作 | 字段路径 | 修改前 | 修改后 | 解释
| -- | -- | -- | -- | -- |
| UPDATE | sex | 1 | 2 | sex从1更新为2
| UPDATE | skill/2 | css | vue | skill[2]从css更新为vue
| ADD | skill/3 |  | react | 新增skill[3]，值为react
| UPDATE | stock/0/apple | 100 | 500 | stock[0].apple从100更新为500
| UPDATE | asset/house | 5 | 10 | asset.house从5更新为10
| ADD | asset/cat |  | 2 | 新增字段asset.cat，值为2
| ADD | job |  | null | 新增job字段值为null
| REMOVE | asset/dog | 1 |  | 删除了字段：asset.dog

配合字典增强可读性

```js
// 字典
let dict = {
  name: {
    _label: '姓名'
  },
  age: {
    _label: '年龄'
  },
  sex: {
    _label: '性别',
    // 枚举数据
    _enum: {
      1: '男',
      2: '女'
    }
  },
  skill: {
    _label: '技能'
  },
  stock: {
    _label: '股票',
    apple: {
      _label: '苹果'
    },
    google: {
      _label: '谷歌'
    }
  },
  asset: {
    _label: '资产',
    house: {
      _label: '房子'
    },
    car: {
      _label: '豪车'
    },
    cat: {
      _label: '猫'
    },
    dog: {
      _label: '狗'
    }
  },
  job: {
    _label: '工作'
  }
}

const diff = difference(after, before, dict);
```
输出结果为数组，用表格展示如下：

| 操作 | 字段描述 | 修改前 | 修改后 | 解释
| -- | -- | -- | -- | -- | 
| UPDATE | 性别 | 男 | 女 | 性别从男更新为女
| UPDATE | 技能 | css | vue | 技能从css更新为vue
| ADD | 技能 |  | react | 新增了技能：react
| UPDATE | 股票/苹果 | 100 | 500 | 苹果股票从100更新为500
| UPDATE | 资产/房子 | 5 | 10 | 房子从5套更新为10套
| ADD | 	资产/猫 |  | 2 | 新增了字段猫：值为2
| ADD | 工作 |  | null | 新增了工作字段，值为空
| REMOVE | 	资产/狗 | 1 |  | 删除了字段：狗

