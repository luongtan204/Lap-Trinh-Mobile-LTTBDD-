
Promise.resolve(3)
  .then((num) => num * num)      // square: 4
  .then((num) => num * 2)        // double: 8
  .then((num) => num + 5)        // add 5: 13
  .then((result) => {
    console.log("Final result:", result); // Outputs: Final result: 13
  });

