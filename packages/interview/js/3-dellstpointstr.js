function delLastPointStr(str, delStr) {
  if (typeof str !== 'string') {
    throw new Error('str is not a string');
  }
  const index = str.lastIndexOf(delStr);
  if (index < 0) {
    return str;
  }
  return str.substring(0, index) + str.substring(index + 1, str.length);
}

console.log(delLastPointStr('cabc', 'c'));
