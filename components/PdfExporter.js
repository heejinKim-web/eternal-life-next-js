import React from "react";

export default function PdfExporter({ type = "reflection" }) {
  const handleExport = async () => {
    // assemble content from localStorage depending on type
    let content = "";
    try {
      if (type === "reflection") {
        const raw = localStorage.getItem("answers");
        if (raw) {
          const answers = JSON.parse(raw);
          // format as numbered list
          const lines = Object.keys(answers)
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => `${Number(k) + 1}. ${answers[k]}`);
          content = lines.join("\n\n");
        }
      } else if (type === "schedule") {
        const raw = localStorage.getItem("schedule");
        if (raw) {
          const schedule = JSON.parse(raw);
          const lines = schedule.map((s) => `${s.time} - ${s.activity}`);
          content = lines.join("\n");
        }
      }
    } catch (e) {
      console.warn("Failed to build PDF content from localStorage:", e);
    }

    // 호출할 서버 API 경로 (exportPdf API는 body.content를 받음)
    const res = await fetch("/api/exportPdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }), // send content so server can include it
    });

    if (!res.ok) {
      alert("PDF 생성에 실패했습니다.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "schedule" ? "schedule.pdf" : "reflection.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 18 }}>
      <button onClick={handleExport} className="export-btn">
        📄 PDF로 내보내기
      </button>
    </div>
  );
}
