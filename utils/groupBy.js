function groupBy(array, getKey) {
    const map = new Map();
    array.forEach((item) => {
      const key = getKey(item);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });
    return map;
  }
  module.exports = {groupBy}