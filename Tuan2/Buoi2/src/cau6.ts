import { simulateTask } from "./cau5";

Promise.all([
  simulateTask(1000).then((result) => {
    console.log("tsk1 tasks completed:", result);
  }),
  simulateTask(1500).then((result) => {
    console.log("tsk2 tasks completed:", result);
  }),
  simulateTask(2000).then((result) => {
    console.log("tsk3 tasks completed:", result);
  })
]).then((results) => {
    console.log("All tasks completed:");
});

