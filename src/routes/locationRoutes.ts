import { Router } from "express";
import { geocode, suggest } from "../controllers/locationController";

const router = Router();

router.post("/geocode", geocode);
router.get("/suggest", suggest);

export default router;
