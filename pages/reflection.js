import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function Reflection() {
  const [values, setValues] = useState([]);
  const [identity, setIdentity] = useState("");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 초기 상태: 없음
  }, []);

  const handleGenerate = async () => {
    const saved = localStorage.getItem("answers");
    if (!saved) return alert("먼저 문답을 작성해주세요.");

    setLoading(true);
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: saved }),
    });

    if (!res.ok) {
      setLoading(false);
      try {
        const errData = await res.json();
        console.error("Server error response:", errData);
        alert(
          `요약 생성 중 오류가 발생했습니다: ${errData.error || res.statusText}`
        );
      } catch (e) {
        console.error("Failed to parse error response:", e);
        alert(`요약 생성 중 오류가 발생했습니다. (상태: ${res.status})`);
      }
      return;
    }

    let data;
    try {
      data = await res.json();
      console.log("Server response data:", data);
    } catch (parseErr) {
      setLoading(false);
      console.error("Failed to parse response JSON:", parseErr);
      alert("응답 형식이 올바르지 않습니다. (JSON 파싱 실패)");
      return;
    }

    if (!data.values && !data.identity && !data.summary) {
      setLoading(false);
      console.warn("Response data missing expected fields:", data);
      alert("응답에 예상한 데이터가 없습니다.");
      return;
    }

    // 서버는 values, identity, summary 반환
    setValues(data.values || []);
    setIdentity(data.identity || "");
    setEssay(data.summary || "");
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h2 style={{ fontSize: 22 }}>AI 회고</h2>
        <p style={{ color: "#6b7280" }}>
          작성한 문답을 바탕으로 AI가 가치지도·선언문·회고 에세이를 생성합니다.
        </p>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              background: "#0f172a",
              color: "white",
              padding: "10px 14px",
              borderRadius: 8,
            }}
          >
            {loading ? "AI가 회고를 작성 중입니다…" : "AI 회고 생성하기"}
          </button>
        </div>

        {values.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <h3>🌍 영생 가치 지도</h3>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {values.map((v, i) => (
                <span
                  key={i}
                  style={{
                    background: "#e6f0ff",
                    padding: "6px 10px",
                    borderRadius: 20,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </section>
        )}

        {identity && (
          <section style={{ marginTop: 16 }}>
            <h3>🕊️ 정체성 선언문</h3>
            <p style={{ fontStyle: "italic", marginTop: 8 }}>{identity}</p>
          </section>
        )}

        {essay && (
          <section style={{ marginTop: 16 }}>
            <h3>📜 회고 에세이</h3>
            <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{essay}</p>
          </section>
        )}
      </main>
    </div>
  );
}
