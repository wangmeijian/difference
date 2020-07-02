let oldData = {
  firstname: "John",
  lastname: "Cena",
  user: {
    list: ["z", "q", "s"],
    total: 3,
  },
  arr: [
    {
      a: 1,
    },
    {
      b: 2,
    },
  ],
  brr: [
    {
      info: {
        age: 12,
      },
    },
  ],
  privateInfo: {
    privateProperty1: false,
    privateProperty2: true,
  },
};

let newData = {
  middlename: "Felix",
  lastname: "Pina",
  arr: [
    {
      a: 1,
      b: 2,
    },
  ],
  brr: [
    {
      info: {
        age: 14,
      },
    },
  ],
  privateInfo: {
    privateProperty1: true,
    privateProperty2: true,
  },
};

console.log(modify(newData, oldData));
console.log(deleteModify(newData, oldData));
