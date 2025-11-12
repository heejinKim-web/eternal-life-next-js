import React from "react";

export default function QuestionForm({ questions, answers, onChange }) {
  return (
    <div className="form-wrap">
      {questions.map((q, idx) => (
        <div key={idx} className="q-block">
          <p className="q-title">
            {idx + 1}. {q}
          </p>
          <textarea
            value={answers[idx] || ""}
            onChange={(e) => onChange(idx, e.target.value)}
            rows={4}
            placeholder="생각을 적어보세요..."
          />
        </div>
      ))}
    </div>
  );
}
