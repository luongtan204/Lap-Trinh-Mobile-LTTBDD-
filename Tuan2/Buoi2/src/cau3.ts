export function rejectWithError(): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Something went wrong"));
    }, 1000);
  });
}

// Example usage:
rejectWithError().catch((err) => {
  console.error(err.message); // Outputs: Something went wrong
});