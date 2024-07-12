import { Router } from "express";

import ScreenshotController from "../adapters/controllers/screenshotController";

const router= Router();

router.get('/screenShot/start',ScreenshotController.start.bind(ScreenshotController));
router.get('/screenShot/stop',ScreenshotController.stop.bind(ScreenshotController));
router.get('/screenShot/status',ScreenshotController.status.bind(ScreenshotController));
// router.post('/screenShot',ScreenshotController.create.bind(ScreenshotController));

export default router;