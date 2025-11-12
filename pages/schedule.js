import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SchedulePlanner from "@/components/SchedulePlanner";
import PdfExporter from "@/components/PdfExporter";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 12 }).map((_, i) => ({
      time: `${i + 6}:00`,
      activity: "",
    }))
  );

  useEffect(() => {
    const saved = localStorage.getItem("schedule");
    if (saved) setSchedule(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);

  const handleChange = (idx, field, value) => {
    setSchedule((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h2 style={{ fontSize: 22 }}>나의 영생 하루 일정표</h2>
        <p style={{ color: "#6b7280" }}>
          시간대별 루틴을 자유롭게 기록해보세요.
        </p>

        <div style={{ marginTop: 18 }}>
          <SchedulePlanner schedule={schedule} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 18 }}>
          <PdfExporter type="schedule" />
        </div>
      </main>
    </div>
  );
}
