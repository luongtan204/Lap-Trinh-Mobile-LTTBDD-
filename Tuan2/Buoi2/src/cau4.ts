const randomNumberPromise = new Promise<number>((resolve, reject) => {
  const num = Math.random();
  if (!isNaN(num)) {
    resolve(num);
  } else {
    reject(new Error("Failed to generate a random number"));
  }
});

randomNumberPromise
  .then((number) => {
    console.log("Random number:", number);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
