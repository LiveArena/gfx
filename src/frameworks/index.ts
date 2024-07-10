import fs from 'fs';
import { PassThrough } from 'stream';

import bodyParser from 'body-parser';
import { config } from "dotenv";
import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';
import screenRoutes from "../routes/screenshotRoute";

config();

/** @ignore */
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/** @ignore */
async function testStartMethod(format: string, isStream: boolean) {
  const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
  const browser = await puppeteer.launch({
    ...(executablePath ? { executablePath: executablePath } : {}),
    headless: false,
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);

  if (isStream) {
    console.log("stream");
    const passthrough = new PassThrough();
    format = format.replace('video', 'stream');
    const fileWriteStream = fs.createWriteStream(format);
    passthrough.pipe(fileWriteStream);
    await recorder.startStream(passthrough);
  } else {
    console.log("recorded");
    await recorder.start(format);
  }

  await page.goto('https://ai-producer-gfx.web.app/p/CQ1J7IJ1/output');
  await page.setViewport({ width: 1920, height: 1080 });

  await new Promise(r => setTimeout(r, 15000));
  //await page.waitFor(10 * 1000);
  await recorder.stop();
  await browser.close();
}

async function executeSample(format: any) {
  const argList = process.argv.slice(2);
  const isStreamTest = argList.includes('stream');

  console.log(
    `Testing with Method using ${isStreamTest ? 'stream' : 'normal'} mode`
  );
  return testStartMethod(format, isStreamTest);
}

async function captureScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://ai-producer-gfx.web.app/p/CQ1J7IJ1/output');
  const screenshotBuffer = await page.screenshot({
    omitBackground: true,
    type: 'png'
  });
  await browser.close();
  return screenshotBuffer;
}

// executeSample('./report/video/simple1.mp4').then(() => {
//   console.log('completed');
// });

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use('/api', screenRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
