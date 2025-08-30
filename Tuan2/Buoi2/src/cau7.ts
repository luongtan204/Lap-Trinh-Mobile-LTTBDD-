import { simulateTask } from "./cau5";
Promise.race([
  simulateTask(1000),
  simulateTask(500),
  simulateTask(2000)
]).then((result) => {
  console.log("First completed:", result);
});
