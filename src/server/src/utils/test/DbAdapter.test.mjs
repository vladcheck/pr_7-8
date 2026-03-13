import dbAdapter from "../DbAdapter.ts";

const dataMock = {
  id: "123456",
  title: "Деревянная подставка для книги",
  price: 2000,
  score: 3.6,
  reviews: [],
};

const basename = "users.json";

dbAdapter
  .createFile("users.json")
  .then(() => dbAdapter.appendEntry(basename, dataMock))
  .then(() => dbAdapter.appendEntry(basename, dataMock))
  .then(() => dbAdapter.readEntries(basename))
  .then((data) => console.log(data.length))
  .then(() => dbAdapter.deleteAllEntries(basename))
  .then(() => dbAdapter.deleteFile(basename))
  .catch((error) => console.error(error));
