// 删除字段转中的空格 满足删除前、后、前后、中间

function deleSpace(str, direction) {
  if (typeof str !== 'string') {
    throw new Error('str not a string');
  }
  let Reg = '';
  switch (direction) {
    case 'start':
      Reg = /^[\s]+/g;
      break;
    case 'end':
      Reg = /([\s]*)$/g;
      break;
    case 'both':
      Reg = /(^\s*)|(\s*$)/g;
      break;
    default:
      Reg = /[\s]+/g;
      break;
  }
  let newStr = str.replace(Reg, '');
  if (direction == 'middle') {
    const RegLeft = str.match(/(^\s*)/g)[0]; // 保存右边空格
    const RegRight = str.match(/(\s*$)/g)[0]; // 保存左边空格
    newStr = RegLeft + newStr + RegRight;
  }
  return newStr;
}
const str = deleSpace(' a b c ');
console.log(str, str.length);
