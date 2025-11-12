import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li>
          <Link href="/questions">문답 작성</Link>
        </li>
        <li>
          <Link href="/schedule">영생 일정표</Link>
        </li>
        <li>
          <Link href="/reflection">AI 회고</Link>
        </li>
      </ul>
    </nav>
  );
}
