// routes/textAnalysis.routes.js

import express from "express";
import { handleUserText , handleUserGoal} from "../Controller/bookReco.controller.js";



const router = express.Router();

router.post("/analyze", handleUserText);
router.post("/goal",handleUserGoal)

export default router;