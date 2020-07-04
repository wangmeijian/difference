const ACTION = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
};
/**
 *
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

      diff.push({
        path: [...path, key],
        path_desc: createPathDesc(dictionaries, [...path, key]),
        action: ACTION[action],
        modify_from: action === "ADD" ? "" : oldVal,
        modify_to: newVal,
      });
      delete oldData[key];
    } else if (newVal === oldVal) {
      delete oldData[key];
    }
  }
  return diff;
}

function createPathDesc(dictionaries = {}, path = []) {
  if (Object.keys(dictionaries).length === 0 || path.length === 0) return "";
  let desc = [];
  let dict = dictionaries;

  for (let i = 0; i < path.length; i++) {
    if (dict._array) {
      dict = dict._array;
    } else {
      dict = dict[path[i]];
    }
    if (dict && dict.label) {
      desc.push(dict.label);
    }
  }
  return desc.join("/");
}
/**
 *
 * @param {object} newData 修改后的数据
 * @param {object} oldData 修改前的数据
 * @param {object} dictionaries 字典描述
 * @param {array} path 字典完整路径
 * @returns {array}
 */
function remove(newData = {}, oldData = {}, dictionaries = {}, path = []) {
  const diff = [];
  for (const field in oldData) {
    if (typeof newData[field] === "undefined") {
      if (typeof oldData[field] === "object") {
        diff.push(
          ...remove({}, oldData[field], dictionaries, [...path, field])
        );
      } else {
        diff.push({
          path: [...path, field],
          path_desc: createPathDesc(dictionaries, [...path, field]),
          action: ACTION.REMOVE,
          modify_from: oldData[field],
          modify_to: "",
        });
      }
    }
  }
  return diff;
}

const difference = (
  newData = {},
  oldData = {},
  dictionaries = {},
  path = []
) => {
  return [
    ...modify(newData, oldData, dictionaries, path),
    ...remove(newData, oldData, dictionaries, path),
  ];
};

export default difference;
