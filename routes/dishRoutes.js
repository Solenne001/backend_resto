// server/routes/dishRoutes.js
import express from "express";
import { getDishes, createDish, updateDish, deleteDish } from "../controllers/dishControllers.js";

const router = express.Router();

router.get("/", getDishes);
router.post("/", createDish);
router.put("/:dishId", updateDish);
router.delete("/:dishId", deleteDish);

export default router;
