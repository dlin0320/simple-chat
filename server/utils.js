export const createParticipants = (listData) => {
  return listData.sort().toString();
};

export const addParticipants = (stringData, item) => {
  const newData = stringData.split(",")
  newData.push(item);
  return newData.sort().toString();
};

export const removeParticipants = (stringData, item) => {
  const newData = stringData.replace(`${item},`, "");
  return newData.replace(`,${item}`, "");
};

export const listRemove = (listData, item) => {
  for (const i in listData) {
    if (listData[i] === item) {
      listData.splice(i, 1);
    };
  };
};