function getNumberAsync(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}

// Example usage:
getNumberAsync().then((num) => {
  console.log(num); // Outputs: 10 after 1 second
});