# NipunAI 🎓🤖

**NipunAI** is an AI-powered student placement management platform designed to streamline the entire campus placement lifecycle — from job applications and skill-building to AI-driven mock interviews — all in one place.

---

## ✨ Features

### 👨‍🎓 For Students
- **Job Applications** — Browse and apply to companies/jobs posted by the placement officer.
- **Integrated Coding Dashboard** — Practice coding in-browser using the Monaco Editor with real-time code execution.
- **AI-Powered Mock Interviews** — Attend both **Technical** and **HR** mock interviews powered by a local LLM (Ollama).
- **Progress Tracking** — Track your practice history and improvement over time.
- **Study Materials** — Access placement prep materials and resources shared by the admin.
- **Secure Login** — SMTP email-based authentication for student accounts.

### 🛠️ For Admin (Placement Officer)
- Post job openings and company drives.
- Publish important announcements for students.
- Upload and manage study/preparation materials.
- Track student progress and practice activity.

---

## 🧰 Tech Stack

| Layer            | Technology                              |
|-------------------|------------------------------------------|
| Frontend          | React.js                                 |
| Backend           | Node.js, Express.js                      |
| Database          | MongoDB                                  |
| Authentication    | SMTP-based email login                   |
| Code Editor       | Monaco Editor                            |
| Code Execution    | Piston API                               |
| AI / Mock Interviews | Ollama (Gemma 3:4B) + RAG               |

*(MERN Stack: MongoDB, Express.js, React.js, Node.js)*

---

## ⚙️ How It Works

### Job Posting & Application Flow
- The **admin** posts a job/company drive via a `POST` request, which is stored in the database.
- **Students** view available jobs via a `GET` request and apply directly through the platform.

### Coding Dashboard
- Built using the **Monaco Editor** for a smooth, VS Code-like coding experience.
- Code execution and evaluation are handled via the **Piston API**.

### AI Mock Interviews
- Powered by **Ollama** running the **Gemma 3:4B** model locally.
- Uses **RAG (Retrieval-Augmented Generation)** to process student responses against a fixed, well-defined prompt structure.
- For HR interviews, responses are evaluated using sentiment/tone analysis to simulate real interview assessment.

---

## 🔐 Authentication

Login is handled via **SMTP email-based authentication**. Once logged in, students get full access to all platform features (jobs, coding dashboard, mock interviews, materials, and progress tracking).

An **Admin account** is also available — typically assigned to the placement officer of the college — with elevated privileges to manage jobs, announcements, and materials.

---

## 🚀 Live Demo

This project is not currently deployed publicly due to security and data-privacy considerations (the platform handles student credentials, interview data, and institutional information).

For a walkthrough, demo video, or access request, feel free to reach out via the contact details below.

---

## 📦 Getting Started

> Note: Since this is not publicly deployed, you'll need to set up the project locally.

```bash
# Clone the repository
git clone https://github.com/kxnekin/NipunAi.git

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

Set up your environment variables (`.env`) for:
- MongoDB connection string
- SMTP credentials (for email login)
- Ollama server endpoint
- Piston API endpoint

Then run the backend and frontend servers separately.

---

## 📬 Contact

**kxnekin**
For questions, demo access, or collaboration — feel free to reach out directly.
