const save = (key, value) => {
  if (typeof value === 'string') {
    return localStorage.setItem(key, value);
  }
  return localStorage.setItem(key, JSON.stringify(value));
};

const get = (key) => localStorage.getItem(key);

const remove = (key) => {
  localStorage.removeItem(key);
};

export {
  save,
  get,
  remove,
};
