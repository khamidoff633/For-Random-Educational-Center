import { Router, type Request, type Response } from "express";

/** Static placement-test question bank (English level diagnostics). */
const PLACEMENT_QUESTIONS = [
  {
    id: 1,
    question: "Choose the correct verb form: 'Neither of the students ___ completed the assignment yet.'",
    options: ["has", "have", "is", "are"],
    correct: 0,
    explanation: "'Neither of' takes a singular verb in formal English, so 'has' is correct.",
  },
  {
    id: 2,
    question: "If she ___ more attention in class yesterday, she would know the answer today.",
    options: ["paid", "has paid", "had paid", "would pay"],
    correct: 2,
    explanation: "A mixed conditional uses 'if + past perfect' for yesterday's action.",
  },
  {
    id: 3,
    question: "Identify the word that is closest in meaning to 'OBDURATE':",
    options: ["Flexible", "Stubborn", "Mischievous", "Generous"],
    correct: 1,
    explanation: "'Obdurate' means stubbornly refusing to change one's mind.",
  },
  {
    id: 4,
    question: "By next October, they ___ in London for exactly ten years.",
    options: ["will live", "are living", "will be living", "will have lived"],
    correct: 3,
    explanation: "Future Perfect ('will have lived') marks completion by a future point.",
  },
  {
    id: 5,
    question: "Complete the sentence: 'Hardly ___ entered the room when the lights went out.'",
    options: ["had he", "he had", "did he", "has he"],
    correct: 0,
    explanation: "Negative adverbials like 'Hardly' trigger subject-verb inversion ('had he').",
  },
  {
    id: 6,
    question: "Choose the correct preposition: 'The manager congratulated the team ___ their outstanding scores.'",
    options: ["for", "on", "about", "with"],
    correct: 1,
    explanation: "You congratulate someone 'on' an achievement.",
  },
];

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(PLACEMENT_QUESTIONS);
});

export default router;
