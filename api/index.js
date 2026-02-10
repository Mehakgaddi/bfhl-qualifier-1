import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OFFICIAL_EMAIL = "mehak0655.be23@chitkara.edu.in";

// Utility functions
function fibonacci(n) {
  const arr = [0, 1];
  for (let i = 2; i < n; i++) arr[i] = arr[i - 1] + arr[i - 2];
  return arr.slice(0, n);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function lcm(a, b) {
  return (a * b) / hcf(a, b);
}

function hcf(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

// Routes
app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    // Fibonacci
    if (body.fibonacci !== undefined) {
      const n = body.fibonacci;
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: fibonacci(n)
      });
    }

    // Prime numbers
    if (body.prime !== undefined) {
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    // LCM
    if (body.lcm !== undefined) {
      const arr = body.lcm;
      let ans = arr[0];
      for (let i = 1; i < arr.length; i++) ans = lcm(ans, arr[i]);

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: ans
      });
    }

    // HCF
    if (body.hcf !== undefined) {
      const arr = body.hcf;
      let ans = arr[0];
      for (let i = 1; i < arr.length; i++) ans = hcf(ans, arr[i]);

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: ans
      });
    }

    // AI (Gemini)
    if (body.AI !== undefined) {
      const question = body.AI;
      const geminiKey = process.env.GEMINI_KEY;

      const aiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiKey,
        {
          contents: [{ role: "user", parts: [{ text: question }] }]
        }
      );

      const text = aiRes.data.candidates[0].content.parts[0].text;
      const answer = text.split(" ")[0];

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: answer
      });
    }

    return res.status(400).json({ is_success: false });

  } catch (err) {
    return res.status(500).json({ is_success: false });
  }
});

export default app;
