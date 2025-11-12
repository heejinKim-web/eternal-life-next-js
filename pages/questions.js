import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import QuestionForm from "@/components/QuestionForm";
import PdfExporter from "@/components/PdfExporter";

const QUESTIONS = [
  "무엇을 할까가 아닌 어떻게 살까로 전환",
  "삶의 목적이 어떻게 변하게 될까요?",
  "무슨 일을 할때 가장 기쁘고 행복한가요?",
  "배우거나 하고 싶은 것이 있었는데 영원히 미루어놓은 것이 있나요?",
  "무엇이든지 탐구해볼 수 있습니다. 어떤 것부터 해볼까요?",
  "모두가 영원히 사는 세상에서는 어떤 것이 가장 가치있게 될까요?",
  "어떤 사람이 되고 싶은가요?",
  "무엇을 표현하고 싶은가요?",
];

export default function QuestionsPage() {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("answers");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  const handleChange = (index, text) => {
    setAnswers((prev) => ({ ...prev, [index]: text }));
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h2 style={{ fontSize: 22 }}>문답 작성</h2>
        <p style={{ color: "#6b7280" }}>
          자유롭게 생각을 적어보세요. 저장은 자동으로 됩니다.
        </p>

        <div style={{ marginTop: 18 }}>
          <QuestionForm
            questions={QUESTIONS}
            answers={answers}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <PdfExporter type="reflection" />
        </div>
      </main>
    </div>
  );
}
