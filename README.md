# 📝 To-Do App with AI Chat Assistant

A modern full-stack To-Do application built with **React, Tailwind CSS, Supabase, and Clerk Authentication**, enhanced with an **AI chat assistant powered by OpenRouter LLMs**.

This project combines task management + AI assistance in one clean, modern interface.

---

## 🚀 Features

### ✅ Task Management
- Add, edit, delete tasks
- Mark tasks as complete/incomplete
- Real-time UI updates
- User-specific todos (secure)

### 🔐 Authentication
- Secure login/signup using Clerk
- Protected routes
- User-based data isolation

### ☁️ Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- CRUD operations for todos

### 🤖 AI Chat Assistant
- Chat interface inside app
- Powered by OpenRouter API (LLM models)
- ChatGPT-like UI experience
- Markdown support (headings, lists, code blocks)
- Typing animation (dots indicator)

### 🎨 UI/UX
- Built with Tailwind CSS
- Glassmorphism chat sidebar
- Floating chat button
- Smooth animations
- Responsive design
- ChatGPT-style message layout

---

## 🧠 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **AI API:** OpenRouter (LLM models)
- **Markdown Rendering:** react-markdown + remark-gfm
- **Code Highlighting:** react-syntax-highlighter

---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/your-username/todo-ai-app.git
cd todo-ai-app

### 2. Install dependencies
npm install

### 3. Setup environment variables

Create a .env file in the root directory:

1. VITE_SUPABASE_URL=your_supabase_url
2. VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

3. VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

4. VITE_OPENROUTER_API_KEY=your_openrouter_key

### 4. Run the project
npm run dev

## 🔐 Database Setup (Supabase)

Create a table:
todos

| Column         | Type      |
| ---------------|-----------|
| **id**         | uuid (PK) |
| **text**       | text      |
| **done**       | boolean   |
| **user_id**    | text      |
| **created_at** | timestamp |

Enable Row Level Security (RLS) and add policies for user access.


## 🤖 AI Chat Setup

This project uses OpenRouter API.

Example request:

```js
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer YOUR_API_KEY`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistralai/mistral-7b-instruct",
    messages: [...]
  })
});
```

## 📌 Future Improvements
 - Chat history stored in Supabase
 - Voice input for AI chat
 - Drag & drop todos
 - Smart AI task suggestions
 - Due dates + reminders
 - Mobile app version
