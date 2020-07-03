const actionDesc = {
  add: "新增",
  update: "更新",
  delete: "删除",
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
    const newDataItem = newData[key];
    const oldDataItem = oldData[key];
    if (
      typeof newDataItem === "object" &&
      typeof oldDataItem === "object" &&
      newDataItem &&
      oldDataItem
    ) {
      diff.push(
        ...modify(newDataItem, oldDataItem, dictionaries[key], [...path, key])
      );
    } else if (newDataItem !== oldDataItem) {
      const action = typeof oldDataItem === "undefined" ? "add" : "update";

      diff.push({
        path: [...path, key],
        action: actionDesc[action],
        modify_from: action === "add" ? "" : oldDataItem,
        modify_to: newDataItem,
      });
      delete oldData[key];
    } else if (newDataItem === oldDataItem) {
      delete oldData[key];
    }
  }
  return diff;
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
        diff.push(...remove({}, oldData[field], dictionaries[field], [field]));
      } else {
        diff.push({
          path: [...path, field],
          action: actionDesc.delete,
          modify_from: oldData[field],
          modify_to: "空",
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