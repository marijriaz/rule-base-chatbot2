
"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
};

const starterQuestions = [
  "How do I write a CV?",
  "How do I prepare for an interview?",
  "How can I find a job?",
  "How do I explain an employment gap?"
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findReply(message: string): string {
  const query = normalize(message);
  const allRules = rules as Rule[];

  let bestRule: Rule | undefined;
  let bestScore = 0;

  for (const rule of allRules) {
    let score = 0;

    for (const keyword of rule.keywords) {
      const key = normalize(keyword);

      if (query === key) {
        score += 5;
      } else if (key.length > 2 && query.includes(key)) {
        score += key.includes(" ") ? 4 : 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (bestRule && bestScore > 0) {
    return bestRule.reply;
  }

  return "Sorry, I couldn't find a matching answer. You can ask me about CV writing, cover letters, interviews, job searching, LinkedIn, professional emails, communication skills, career planning, salary negotiation, remote work, employment gaps, job rejection, workplace professionalism, strengths and weaknesses, time management, or getting your first job.";
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function Home() {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Welcome to CareerCompass! I'm your career guidance assistant. Ask me about CVs, interviews, job applications, or professional skills.",
      time: getTime()
    }
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text = input) {
    const question = text.trim();

    if (!question || typing) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: question,
      time: getTime()
    };

    setMessages((old) => [...old, userMessage]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const answer = findReply(question);

      setMessages((old) => [
        ...old,
        {
          id: Date.now() + 1,
          role: "bot",
          text: answer,
          time: getTime()
        }
      ]);

      setTyping(false);
    }, 300);
  }

  function clearChat() {
    setMessages([
      {
        id: Date.now(),
        role: "bot",
        text: "Your chat has been cleared. What career question can I help you with?",
        time: getTime()
      }
    ]);
    setInput("");
    setTyping(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-3 text-slate-800 sm:p-8">
      <div className="mx-auto flex min-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        <header className="bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                Your career companion
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                ✦ CareerCompass
              </h1>
              <p className="mt-2 text-sm text-indigo-100">
                Clear answers. Confident next steps.
              </p>
            </div>

            <button
              onClick={clearChat}
              className="rounded-xl border border-white/30 px-3 py-2 text-sm hover:bg-white/10"
            >
              Clear chat
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-400/20 px-3 py-2">
              ● Rule-based assistant
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2">
              {(rules as Rule[]).length} knowledge rules
            </span>
          </div>
        </header>

        <section className="border-b border-slate-100 bg-slate-50 p-4 sm:p-6">
          <p className="mb-3 text-sm font-semibold">
            Suggested questions
          </p>

          <div className="flex flex-wrap gap-2">
            {starterQuestions.map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                disabled={typing}
                className="rounded-full border border-indigo-200 bg-white px-3 py-2 text-left text-sm text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </section>

        <section
          aria-live="polite"
          className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="max-w-[90%] sm:max-w-[80%]">
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-indigo-700 text-white"
                      : "rounded-bl-sm border border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  {message.text}
                </div>

                <p
                  className={`mt-1 text-xs text-slate-400 ${
                    message.role === "user"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {message.role === "user" ? "You" : "CareerCompass"}
                  {" · "}
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="text-sm text-slate-400">
              CareerCompass is preparing an answer...
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <footer className="border-t border-slate-200 bg-white p-4 sm:p-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a career question..."
              aria-label="Type your question"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Send
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-400">
            CareerCompass matches your message with predefined rules.
          </p>
        </footer>
      </div>
    </main>
  );
}
