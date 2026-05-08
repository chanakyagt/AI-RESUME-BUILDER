import OpenAI from "openai";

// Rotate through keys to avoid rate limits
const deepseekKeys = [
  process.env.DEEPSEEK_API_KEY_1,
  process.env.DEEPSEEK_API_KEY_2,
  process.env.DEEPSEEK_API_KEY_3,
].filter(Boolean) as string[];

let keyIndex = 0;

function getDeepSeekClient() {
  const key = deepseekKeys[keyIndex % deepseekKeys.length];
  keyIndex++;
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.deepseek.com",
  });
}

async function chat(messages: OpenAI.Chat.ChatCompletionMessageParam[], retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const client = getDeepSeekClient();
      const res = await client.chat.completions.create({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      });
      return res.choices[0]?.message?.content ?? "";
    } catch (err: unknown) {
      if (attempt === retries) throw err;
      // try next key on failure
    }
  }
  return "";
}

export async function generateSummary(data: {
  name: string;
  jobTitle: string;
  experience: { title: string; company: string; bullets: string[] }[];
  skills: { technical: string[]; tools: string[] };
  yearsOfExperience: number;
}): Promise<string> {
  const prompt = `Write a compelling, ATS-optimized professional summary for a resume. Keep it 3-4 sentences, first person, present tense. No filler phrases like "results-driven" or "passionate".

Candidate info:
- Name: ${data.name}
- Target Role: ${data.jobTitle}
- Years of Experience: ${data.yearsOfExperience}
- Recent roles: ${data.experience.slice(0, 2).map(e => `${e.title} at ${e.company}`).join(", ")}
- Key skills: ${[...data.skills.technical, ...data.skills.tools].slice(0, 8).join(", ")}

Return ONLY the summary text, no labels or quotes.`;

  return chat([{ role: "user", content: prompt }]);
}

export async function enhanceExperience(data: {
  title: string;
  company: string;
  rawDescription: string;
  existingBullets: string[];
}): Promise<string[]> {
  const input = data.rawDescription || data.existingBullets.join("\n");
  const prompt = `Transform the following job description into 4-5 strong resume bullet points.
Rules:
- Start each with a strong action verb (Led, Built, Reduced, Increased, Automated, etc.)
- Include quantifiable metrics where possible (%, $, time saved, users impacted)
- Be specific and ATS-friendly
- No periods at the end

Role: ${data.title} at ${data.company}
Input: ${input}

Return ONLY a JSON array of strings, e.g. ["Built...", "Led..."]`;

  const result = await chat([{ role: "user", content: prompt }]);
  try {
    const parsed = JSON.parse(result.trim());
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fallback: split by newlines
    return result.split("\n").filter(l => l.trim().startsWith("-") || l.trim().length > 10)
      .map(l => l.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 5);
  }
  return [];
}

export async function suggestSkills(data: {
  jobTitle: string;
  experience: { title: string; company: string }[];
}): Promise<{ technical: string[]; tools: string[]; soft: string[] }> {
  const prompt = `Suggest relevant skills for a ${data.jobTitle} resume.
Previous roles: ${data.experience.map(e => e.title).join(", ")}

Return ONLY a JSON object with keys "technical" (array of 8 tech skills), "tools" (array of 6 tools/frameworks), "soft" (array of 4 soft skills). No explanation.`;

  const result = await chat([{ role: "user", content: prompt }]);
  try {
    return JSON.parse(result.trim());
  } catch {
    return { technical: [], tools: [], soft: [] };
  }
}

export async function enhanceProjectDescription(data: {
  name: string;
  description: string;
  technologies: string[];
}): Promise<string[]> {
  const prompt = `Write 2-3 strong resume bullet points for this project:
Project: ${data.name}
Description: ${data.description}
Technologies: ${data.technologies.join(", ")}

Rules: Start with action verbs, include impact/metrics where possible, be concise.
Return ONLY a JSON array of strings.`;

  const result = await chat([{ role: "user", content: prompt }]);
  try {
    const parsed = JSON.parse(result.trim());
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return [data.description];
  }
  return [];
}

export async function getATSScore(resumeText: string): Promise<{
  score: number;
  feedback: string[];
}> {
  const prompt = `Analyze this resume text for ATS compatibility and give a score out of 100.

Resume:
${resumeText.slice(0, 3000)}

Return ONLY a JSON object: {"score": number, "feedback": ["tip1", "tip2", "tip3"]}`;

  const result = await chat([{ role: "user", content: prompt }]);
  try {
    return JSON.parse(result.trim());
  } catch {
    return { score: 75, feedback: ["Add more keywords", "Quantify achievements"] };
  }
}
