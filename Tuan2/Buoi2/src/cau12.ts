// ...existing code...
import { simulateTask } from './cau5';

async function callSimulateTask() {
   const result2 = await simulateTask(1000);
     console.log(result2);
  const result = await simulateTask(2000);
 
  console.log(result);

}

callSimulateTask();
//