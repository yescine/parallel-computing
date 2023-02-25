import async, { AsyncResultCallback, parallelLimit } from "async";
import axios from "axios";
import fs from "fs";
import CliProgress from "cli-progress";

const argv = process.argv[2];
const cliFormat = `${argv || "fetch"} {name}: {bar} {percentage}% | ETA: {eta}s | {value}/{total} | {state}`;
const cliProgress = new CliProgress.SingleBar({ format: cliFormat, barsize: 20 }, CliProgress.Presets.shades_classic);

const file = fs.createWriteStream("./data.txt");
const maxProduct = 100;
cliProgress.start(maxProduct, 0, { state: "-" });

const workFlowArr = Array.from(Array(maxProduct).keys()).map((key) => async (cb: AsyncResultCallback<string>) => {
  const url = `https://dummyjson.com/products/${key + 1}`;
  const data = await (await axios(url)).data;

  file.write(`${url}\ntitle=${data.title}\n`);
  cliProgress.update(key, { name: `get product`, state: key });
  setTimeout(() => cb(null, url), 1000);
});

(async () => {
  const batch = 10;
  console.time(`Parallel workflow-${batch}`);
  const results: string[] = await async.parallelLimit(workFlowArr, batch);
  cliProgress.stop();
  console.timeEnd(`Parallel workflow-${batch}`);

})();
