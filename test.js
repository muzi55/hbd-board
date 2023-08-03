function solution(arr, queries) {
  var answer = [];

  return queries.map((el) => {
    const a = el[0],
      b = el[1],
      c = el[2];
    let newArr = [];
    arr.forEach((num) => {
      if (a <= num && num <= b) {
        newArr.push(num);
      }
      newArr.forEach((min) => console.log(min));
    });
    console.log(newArr);
  });
}
