const myArray = [0, 1, 2, 3, 4];

console.log(myArray);

const myNewArray = myArray.map(item => {
   return item + 3;
})

console.log(myNewArray);