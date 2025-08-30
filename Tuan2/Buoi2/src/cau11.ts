//11. Convert Exercise 1 into async/await.
import {asyncHello} from './cau1'

async function runAsyncHello() {
  const message = await asyncHello;
  console.log(message);
}

runAsyncHello();
