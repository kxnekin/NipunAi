import fetch from "node-fetch";
import 'dotenv/config';


const HF_TOKEN = "hf_your_token_here"; // paste your token

const prompt = "Say hello in one word";

fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ inputs: prompt }),
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
