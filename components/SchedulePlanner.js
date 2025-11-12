import React from "react";

export default function SchedulePlanner({ schedule, onChange }) {
  return (
    <div>
      {schedule.map((slot, i) => (
        <div key={i} className="row">
          <input
            value={slot.time}
            placeholder={`${i + 6}:00`}
            onChange={(e) => onChange(i, "time", e.target.value)}
          />
          <input
            value={slot.activity}
            placeholder="활동을 적어보세요"
            onChange={(e) => onChange(i, "activity", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
