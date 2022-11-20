function getNumber() {
  const arr = new Array(5);
  const num = randomInt(2, 32);
  let i = 0;
  randomArr(arr, num);
  function randomArr(arr, num) {
    if (!arr.includes(num)) {
      arr[i] = num;
      i++;
    } else {
      num = randomInt(2, 32);
    }

    if (i >= arr.length) {
      console.log(arr);
      return;
    } else {
      randomArr(arr, num);
    }
  }
}

function randomInt(min, max) {
  min = Math.ceil(min); // 包含最小值
  max = Math.floor(max); // 不包含最大值
  return Math.floor(Math.random() * (max - min) + min);
}

getNumber();
