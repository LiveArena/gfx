import { Router } from "express";

import ScreenshotController from "../adapters/controllers/screenshotController";

const router= Router();

router.get('/screenShot',ScreenshotController.create.bind(ScreenshotController));
// router.post('/screenShot',ScreenshotController.create.bind(ScreenshotController));

export default router;