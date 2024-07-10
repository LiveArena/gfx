import fs from 'fs';
import { PassThrough } from 'stream';

import { Request,Response } from "express";
import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../../lib/PuppeteerScreenRecorder';

class ScreenshotController
{
    public get(req:Request,res:Response):void
    {
        res.send('Get Shot');
    }
    public async create(req:Request,res:Response)
    {
        let format='./report/video/simple1.mp4';
        const argList = process.argv.slice(2);
        const isStream = argList.includes('stream');
        console.log(`Testing with Method using ${isStream ? 'stream' : 'normal'} mode`);
        const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
        const browser = await puppeteer.launch({...(executablePath ? { executablePath: executablePath } : {}), headless: false, });
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
        res.send('Create Shot');
    }
}

export default new ScreenshotController();