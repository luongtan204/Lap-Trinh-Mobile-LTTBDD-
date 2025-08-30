const asyncHello = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello Async");
  }, 2000);
});

asyncHello.then((message) => {
  console.log(message);
});