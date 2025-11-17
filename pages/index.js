import React from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  useEffect(() => {
    // 페이지 로드 시 localStorage 초기화
    localStorage.removeItem("answers");
    localStorage.removeItem("schedule");
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>🌌 영생 살기 프로젝트</h1>
        <p style={{ color: "#374151" }}>
          모두가 영원히 사는 세계를 상상하며, 삶의 의미를 써 내려가는
          문답집입니다.
        </p>
        <div style={{ marginTop: 24 }}>
          <a href="/questions" style={{ marginRight: 12, fontWeight: 600 }}>
            문답 시작하기
          </a>
          <a href="/schedule" style={{ marginRight: 12 }}>
            영생 일정표
          </a>
          <a href="/reflection">AI 회고</a>
        </div>
      </main>
    </div>
  );
}
