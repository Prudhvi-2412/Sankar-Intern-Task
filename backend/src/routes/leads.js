import { Router } from "express";
import { createLead, deleteLead, listLeads, updateLead, updateLeadStatus } from "../controllers/leadsController.js";

const router = Router();

router.post("/", createLead);
router.get("/", listLeads);
router.patch("/:id", updateLead);
router.patch("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);

export default router;