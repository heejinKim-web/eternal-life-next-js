import OpenAI from "openai";

// Initialize OpenAI client using the standard environment variable.
// Make sure you set OPENAI_API_KEY in your environment (e.g. .env.local).
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "no text provided" });

    const prompt = `
사용자의 문답(문자열)을 바탕으로 아래 세가지를 만들어주세요.
1) 영생 가치 지도: 핵심 키워드 5~10개를 쉼표로 나열.
2) 영생 속 나의 정체성 선언문: 짧고 시적인 1문장.
3) 회고 에세이: 사용자의 어투를 부분 반영하되, 명상적·서사적으로 3~5문단.

--- 사용자 입력 ---
${text}
--- 출력 형식 ---
[VALUES] 키워드1, 키워드2, ...
[IDENTITY] 선언문
[ESSAY] (여기에 에세이)
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const out = completion.choices?.[0]?.message?.content || "";
    // 단순 파싱: 태그로 분리
    const valuesMatch = out.match(/\[VALUES\]\s*([^\n\r]+)/i);
    const identityMatch = out.match(/\[IDENTITY\]\s*([^\n\r]+)/i);
    const essayMatch = out.match(/\[ESSAY\]\s*([\s\S]+)/i);

    const valuesText = valuesMatch ? valuesMatch[1].trim() : "";
    const identityText = identityMatch ? identityMatch[1].trim() : "";
    const essayText = essayMatch ? essayMatch[1].trim() : "";

    const values = valuesText
      ? valuesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    res
      .status(200)
      .json({ values, identity: identityText, summary: essayText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
}
