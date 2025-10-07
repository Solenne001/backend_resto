import express from "express";
import * as MenuController from "../controllers/menuManagementControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET tous les plats
router.get("/", MenuController.getAllMenuItems);

// POST ajouter un plat avec image
router.post("/", upload.single("photo"), MenuController.addMenuItem);

// PUT modifier un plat avec image
router.put("/:id", upload.single("photo"), MenuController.updateMenuItem);

// DELETE
router.delete("/:id", MenuController.deleteMenuItem);

export default router;
