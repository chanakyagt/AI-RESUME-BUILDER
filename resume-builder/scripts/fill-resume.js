// Playwright script: fills the resume builder with Chanakya Gattu's details and screenshots each step
const { chromium } = require("playwright");
const path = require("path");

const SCREENSHOTS_DIR = path.join(__dirname, "../screenshots");
const BASE_URL = "http://localhost:3000";

async function ss(page, name) {
  const file = path.join(SCREENSHOTS_DIR, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("  Screenshot saved:", name);
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 120 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  // ── Landing Page ──────────────────────────────────────────────────
  console.log("\n[1] Landing page");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await ss(page, "01_landing.png");

  // ── Open Builder ──────────────────────────────────────────────────
  console.log("\n[2] Opening builder");
  await page.click("text=Build My Resume");
  await page.waitForURL("**/builder", { timeout: 10000 });
  await page.waitForTimeout(800);
  await ss(page, "02_builder_opened.png");

  // ── Step 1: Personal Info ─────────────────────────────────────────
  console.log("\n[3] Filling Personal Info");

  await page.fill('input[placeholder="Jane Doe"]', "Chanakya Gattu");
  await page.fill('input[placeholder="Senior Software Engineer"]', "AI Engineer (Fresher)");
  await page.fill('input[placeholder="jane@example.com"]', "chanakahg.aiml.regex@gmail.com");
  await page.fill('input[placeholder="+1 (555) 000-0000"]', "+91 98765 43210");
  await page.fill('input[placeholder="San Francisco, CA"]', "Bellary, Karnataka, India");
  await page.fill('input[placeholder="linkedin.com/in/janedoe"]', "linkedin.com/in/chanakyagattu");
  await page.fill('input[placeholder="github.com/janedoe"]', "github.com/chanakyagattu");
  await page.fill('input[placeholder="janedoe.dev"]', "chanakyagattu.dev");

  await page.waitForTimeout(500);
  await ss(page, "03_step1_personal_info.png");

  // Next → Experience
  await page.click("text=Next: Experience →");
  await page.waitForTimeout(700);
  await ss(page, "04_step2_experience_empty.png");

  // ── Step 2: Work Experience ───────────────────────────────────────
  console.log("\n[4] Adding Work Experience — FutureAcad internship");

  await page.click("text=Add Work Experience");
  await page.waitForTimeout(400);

  await page.locator('input[placeholder="Software Engineer"]').first().fill("Web Development with Generative AI Intern");
  await page.locator('input[placeholder="Acme Corp"]').first().fill("FutureAcad");
  await page.locator('input[placeholder="New York, NY"]').first().fill("Remote, India");

  await page.locator('input[type="month"]').first().fill("2024-07");
  await page.locator('input[type="month"]').nth(1).fill("2025-01");

  await page.locator('textarea').first().fill(
    "Built web applications integrating Generative AI features using React and Node.js. Implemented AI-powered chatbot using OpenAI API for student support. Developed RAG-based document Q&A system using LangChain and FAISS. Created AI content generation tools for educational content. Worked with REST APIs, prompt engineering, and deployed projects on Vercel."
  );

  await page.waitForTimeout(400);
  await ss(page, "05_step2_experience_filled.png");

  // Click AI Enhance Bullets
  console.log("   → Clicking AI Enhance Bullets...");
  await page.click("text=AI Enhance Bullets");
  await page.waitForTimeout(10000);
  await ss(page, "06_step2_experience_ai_enhanced.png");

  // Next → Education
  await page.click("text=Next: Education →");
  await page.waitForTimeout(700);
  await ss(page, "07_step3_education_empty.png");

  // ── Step 3: Education ─────────────────────────────────────────────
  console.log("\n[5] Adding Education — RYMEC");

  await page.click("text=Add Education");
  await page.waitForTimeout(400);

  await page.locator('input[placeholder="MIT"]').first().fill("Rao Bahadur Y Mahabaleshwarappa Engineering College (RYMEC)");
  await page.locator('input[placeholder="Bachelor of Science"]').first().fill("Bachelor of Engineering");
  await page.locator('input[placeholder="Computer Science"]').first().fill("Computer Science & Engineering (AI & ML)");
  await page.locator('input[placeholder="Cambridge, MA"]').first().fill("Bellary, Karnataka, India");
  await page.locator('input[placeholder="2018"]').first().fill("2021");
  await page.locator('input[placeholder="2022"]').first().fill("2025");
  await page.locator('input[placeholder="3.8"]').first().fill("8.2 / 10");
  await page.locator('input[placeholder="Magna Cum Laude"]').first().fill("CSC AI ML Department — VTU Affiliated");

  await page.waitForTimeout(500);
  await ss(page, "08_step3_education_filled.png");

  // Next → Skills
  await page.click("text=Next: Skills →");
  await page.waitForTimeout(700);
  await ss(page, "09_step4_skills_empty.png");

  // ── Step 4: Skills ────────────────────────────────────────────────
  console.log("\n[6] Adding Skills — AI Suggest first");

  await page.click("text=AI Suggest Skills");
  console.log("   → Waiting for AI skill suggestions...");
  await page.waitForTimeout(10000);
  await ss(page, "10_step4_skills_ai_suggested.png");

  // Add extra manual AI skills to the first TagInput (Technical Skills)
  // bg-transparent class is unique to tag pill inputs
  const tagInputs = page.locator('input[class*="bg-transparent"]');

  const techInput = tagInputs.first();
  for (const skill of ["LangChain", "Hugging Face", "OpenAI API", "Prompt Engineering"]) {
    await techInput.fill(skill);
    await techInput.press("Enter");
    await page.waitForTimeout(150);
  }

  // Add tools
  const toolsInput = tagInputs.nth(1);
  for (const tool of ["LangChain", "FAISS", "Streamlit", "Vercel"]) {
    await toolsInput.fill(tool);
    await toolsInput.press("Enter");
    await page.waitForTimeout(150);
  }

  await page.waitForTimeout(400);
  await ss(page, "11_step4_skills_manual_added.png");

  // Next → Projects
  await page.click("text=Next: Projects →");
  await page.waitForTimeout(700);
  await ss(page, "12_step5_projects_empty.png");

  // ── Step 5: Projects ──────────────────────────────────────────────
  console.log("\n[7] Adding Project — AI Study Buddy");

  await page.click("text=Add Project");
  await page.waitForTimeout(400);

  await page.locator('input[placeholder="My Awesome Project"]').first().fill("AI Study Buddy");
  await page.locator('input[placeholder="github.com/user/project"]').first().fill("github.com/chanakyagattu/ai-study-buddy");
  await page.locator('textarea').first().fill(
    "Built an AI-powered study assistant for engineering students that answers questions from uploaded PDFs using RAG, generates quizzes, and summarizes lecture notes using GPT-4 and LangChain."
  );

  const techProj = page.locator('input[placeholder="Add tech..."]').first();
  for (const tech of ["Python", "LangChain", "OpenAI GPT-4", "FAISS", "Streamlit", "React"]) {
    await techProj.fill(tech);
    await techProj.press("Enter");
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(400);
  await ss(page, "13_step5_project_filled.png");

  // AI enhance project bullets
  await page.locator("text=AI Enhance Bullets").last().click();
  console.log("   → Waiting for project AI enhancement...");
  await page.waitForTimeout(10000);
  await ss(page, "14_step5_project_ai_enhanced.png");

  // Next → Finalize
  await page.click("text=Next: Finalize →");
  await page.waitForTimeout(700);
  await ss(page, "15_step6_finalize.png");

  // ── Step 6: Finalize ──────────────────────────────────────────────
  console.log("\n[8] Finalizing — AI Generate Summary");

  await page.click("text=AI Generate");
  console.log("   → Waiting for summary...");
  await page.waitForTimeout(10000);
  await ss(page, "16_step6_summary_generated.png");

  // ATS Check
  console.log("   → Running ATS check...");
  await page.click("text=Check ATS Score");
  await page.waitForTimeout(10000);
  await ss(page, "17_step6_ats_score.png");

  // Template screenshots — click the <p> label inside each button (exact text match)
  await page.locator('p:text-is("Minimal")').click();
  await page.waitForTimeout(500);
  await ss(page, "18_step6_minimal_template.png");

  await page.locator('p:text-is("Classic")').click();
  await page.waitForTimeout(500);
  await ss(page, "19_step6_classic_template.png");

  await page.locator('p:text-is("Modern")').click();
  await page.waitForTimeout(500);
  await ss(page, "20_step6_modern_template.png");

  // Open live preview panel
  await page.click("text=Preview Resume");
  await page.waitForTimeout(1000);
  await ss(page, "21_final_with_live_preview.png");

  console.log("\n✅ All 21 screenshots saved to /screenshots/");
  await browser.close();
}

main().catch(err => {
  console.error("Script error:", err);
  process.exit(1);
});
