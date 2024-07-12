import fs from 'fs';
import { PassThrough } from 'stream';

import { Request, Response } from "express";
import puppeteer, { Browser, Page } from 'puppeteer';

import { PuppeteerScreenRecorder } from '../../lib/PuppeteerScreenRecorder';

class ScreenshotController {
    public browser: Browser;
    public page: Page;
    public recorder: PuppeteerScreenRecorder;
    public recording: boolean = false;

    public async stop(req: Request, res: Response) {
        if (this.recording) {
            await this.recorder.stop();
            await this.browser.close();
            this.recording = false;
            res.send('Recording stopped.');
        } else {
            res.send('Recording not started.');
        }

    }

    public status(req: Request, res: Response) {

        if (!this.recording) {
            res.send(`Not recorded.`);
        }
        else {
            res.send(`Recorded.`);
        }


    }
    public async start(req: Request, res: Response) {
        const path = req.query.path;
        let format = './report/video/simple1.mp4';
        const argList = process.argv.slice(2);
        const isStream = argList.includes('stream');
        console.log(`Testing with Method using ${isStream ? 'stream' : 'normal'} mode`);
        const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];


        if (!this.recording) {

            this.browser = await puppeteer.launch({ ...(executablePath ? { executablePath: executablePath } : {}), headless: false, });
            this.page = await this.browser.newPage();
            this.recorder = new PuppeteerScreenRecorder(this.page);
            if (isStream) {
                const passthrough = new PassThrough();
                format = format.replace('video', 'stream');
                const fileWriteStream = fs.createWriteStream(format);
                passthrough.pipe(fileWriteStream);
                await this.recorder.startStream(passthrough);

            } else {
                console.log(`recorded`);
                await this.recorder.start(format);
            }

            await this.page.goto(`https://ai-producer-gfx.web.app/p/CQ1J7IJ1/output`);
            await this.page.setViewport({ width: 1920, height: 1080 });
            res.send('Recording started.');
        } else {
            res.send('Recording running.');
        }
        this.recording = true;
        await new Promise(r => setTimeout(r, 15000));
        //await page.waitFor(10 * 1000);
       
        // await recorder.stop();
        // await this.browser.close();


    }
}

export default new ScreenshotController();