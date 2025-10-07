import express from "express";
import { QrController } from "../controllers/qrControllers.js";

const router = express.Router();

router.get("/", QrController.getAll);
router.post("/", QrController.create);
router.delete("/:id", QrController.delete);

export default router;
