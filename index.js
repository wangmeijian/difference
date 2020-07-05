/**
 * 获取新增、修改的数据
 * @param {object} newData 修改后的数据
 * @param {object} oldData 修改前的数据
 * @param {object} dictionaries 字典描述
 * @param {array} path 字典完整路径
 * @returns {array}
 */
function modify(newData = {}, oldData = {}, dictionaries = {}, path = []) {
  const diff = [];

  for (const key in newData) {
    const newVal = newData[key];
    const oldVal = oldData[key];
    if (
      typeof newVal === "object" &&
      typeof oldVal === "object" &&
      newVal &&
      oldVal
    ) {
      diff.push(...modify(newVal, oldVal, dictionaries, [...path, key]));
    } else if (newVal !== oldVal) {
      const action = typeof oldVal === "undefined" ? "ADD" : "UPDATE";
      const { desc, enumerable } = createPathDesc(dictionaries, [...path, key]);

      diff.push({
        path: [...path, key],
        path_desc: desc,
        action,
        modify_from: action === "ADD" ? "" : enum2Text(enumerable, oldVal),
        modify_to: enum2Text(enumerable, newVal),
      });
    }
  }
  return diff;
}

/**
 * 获取删除的数据
 * @param {object} newData 修改后的数据
 * @param {object} oldData 修改前的数据
 * @param {object} dictionaries 字典描述
 * @param {array} path 字典完整路径
 * @returns {array}
 */
function remove(newData = {}, oldData = {}, dictionaries = {}, path = []) {
  const diff = [];
  for (const key in oldData) {
    if (typeof newData[key] === "undefined") {
      const { desc, enumerable } = createPathDesc(dictionaries, [...path, key]);
      diff.push({
        path: [...path, key],
        path_desc: desc,
        action: "REMOVE",
        modify_from: enum2Text(enumerable, oldData[key]),
        modify_to: "",
      });
    } else if (
      typeof oldData[key] === "object" &&
      typeof newData[key] === "object"
    ) {
      diff.push(
        ...remove(newData[key], oldData[key], dictionaries, [...path, key])
      );
    }
  }
  return diff;
}
/**
 * 生成操作路径
 * @param {object} dictionaries
 * @param {array[string]} path
 * @returns {array[string]}
 */
function createPathDesc(dictionaries = {}, path = []) {
  if (Object.keys(dictionaries).length === 0 || path.length === 0) {
    return {
      desc: [],
      enumerable: {},
    };
  }

  let desc = [];
  let dict = dictionaries;

  for (let i = 0; i < path.length; i++) {
    if (dict._array || dict[path[i]]) {
      dict = dict._array || dict[path[i]];
      dict && dict._label && desc.push(dict._label);
    }
  }
  return {
    desc,
    enumerable: dict._enum || {},
  };
}
/**
 * 枚举数据转换为文本
 * @param {object} enumerable 枚举数据对象
 * @param {string|number|boolean} value
 */
function enum2Text(enumerable = {}, value) {
  return enumerable && typeof enumerable[value] !== "undefined"
    ? transformNull(enumerable[value])
    : transformNull(value);
}

function transformNull(value) {
  return value === null ? "null" : value;
}

/**
 * 数据操作日志
 * @param {object} newData 修改后的数据
 * @param {object} oldData 修改前的数据
 * @param {object} dictionaries 字典描述
 * @returns {array} 操作日志
 */
const difference = (newData = {}, oldData = {}, dictionaries = {}) => {
  return [
    ...modify(newData, oldData, dictionaries),
    ...remove(newData, oldData, dictionaries),
  ];
};

export default difference;
