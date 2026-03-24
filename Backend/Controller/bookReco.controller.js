// Controller/textAnalysis.controller.js

import axios from "axios";


// ─────────────────────────────────────────────────────────────────────────────
// POST /api/text/analyze
// Body: { text }
// Sends user text to external ML/analysis API and returns result
// ─────────────────────────────────────────────────────────────────────────────
export const handleUserText = async (req, res) => {
    try {
        const { text } = req.body;
        console.log(text);

        // ── Validate ──────────────────────────────────────────────────────────────
        if (!text || String(text).trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Text is required",
            });
        }

        const cleanText = String(text).trim();

        // ── Call external analysis API ────────────────────────────────────────────
        const apiEmoResponse = await axios.post(
            process.env.ANALYSISEmo_API_URL,
            { text: cleanText },
            {
                timeout: 10000, // 10 second timeout
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = apiEmoResponse.data;
        console.log(data);


        const apiRecResponse = await axios.post(
            process.env.ANALYSISRECO_API_URL,
            {
                emotion: data.emotion,
                intent: data.intent,
                user_input: data.user_input
            },
            {
                timeout: 10000, // 10 second timeout
                headers: { "Content-Type": "application/json" },
            }
        );
        
        return res.status(200).json({
            success: true,
            data: apiRecResponse.data,
        });

    } catch (error) {

        // ── External API returned an error response (4xx / 5xx) ───────────────────
        if (error.response) {
            console.error("Analysis API error response:", error.response.data);
            return res.status(502).json({
                success: false,
                message: "Analysis service returned an error",
                detail: error.response.data || null,
            });
        }

        // ── Request timed out or network issue ────────────────────────────────────
        if (error.request) {
            console.error("Analysis API unreachable:", error.message);
            return res.status(503).json({
                success: false,
                message: "Analysis service is unavailable. Please try again later.",
            });
        }

        // ── Unexpected server error ───────────────────────────────────────────────
        console.error("handleUserText error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const handleUserGoal = async (req, res) => {
    try {
        const { goal } = req.body;
        console.log(goal);

        // ── Validate ──────────────────────────────────────────────────────────────
        if (!goal || String(goal).trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "goal is required",
            });
        }

        const cleanText = String(goal).trim();

        // ── Call external analysis API ────────────────────────────────────────────
        const apiEmoResponse = await axios.post(
            process.env.ANALYSISGOAL_API_URL,
            { goal: cleanText },
            {
                timeout: 10000, // 10 second timeout
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = apiEmoResponse.data;
        console.log(data);


       
    
        
        return res.status(200).json({
            success: true,
            data: data,
        });

    } catch (error) {

        // ── External API returned an error response (4xx / 5xx) ───────────────────
        if (error.response) {
            console.error("Analysis API error response:", error.response.data);
            return res.status(502).json({
                success: false,
                message: "Analysis service returned an error",
                detail: error.response.data || null,
            });
        }

        // ── Request timed out or network issue ────────────────────────────────────
        if (error.request) {
            console.error("Analysis API unreachable:", error.message);
            return res.status(503).json({
                success: false,
                message: "Analysis service is unavailable. Please try again later.",
            });
        }

        // ── Unexpected server error ───────────────────────────────────────────────
        console.error("handleUserText error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};