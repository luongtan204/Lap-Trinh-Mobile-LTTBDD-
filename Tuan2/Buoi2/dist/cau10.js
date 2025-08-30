"use strict";
const examplePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // Change to resolve("Success") or reject(new Error("Fail")) to test both cases
        resolve("Success");
        // reject(new Error("Fail"));
    }, 1000);
});
examplePromise
    .then((result) => {
    console.log("Result:", result);
})
    .catch((error) => {
    console.error("Error:", error.message);
})
    .finally(() => {
    console.log("Done");
});
