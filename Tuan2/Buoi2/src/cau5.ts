// Create a function simulateTask(time) that returns a Promise resolving with "Task done" after time ms.
export function simulateTask(time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Task done in ${time} ms`);
    }, time);
  });
}
