import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { type } = req.body || {};
    const { content } = req.body;

    // PDF 생성
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // 응답 헤더 설정
    // 안전한 한글 파일명 처리를 위해 RFC5987 방식의 filename*을 함께 설정합니다.
    const rawFileName = `${type || "export"}.pdf`;
    const asciiFileName = rawFileName.replace(/[\u0080-\uFFFF]/g, "_");
    const encodedFileName = encodeURIComponent(rawFileName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodedFileName}`
    );

    // 한글을 출력하려면 한글을 지원하는 폰트를 등록해야 합니다.
    // 프로젝트 루트의 `public/fonts` 폴더에 한글 TTF 파일을 넣어주세요.
    // 예: public/fonts/NotoSansKR-Medium.ttf
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansKR-Medium.ttf"
      );
      if (fs.existsSync(fontPath)) {
        doc.registerFont("NotoSansKR", fontPath);
        doc.font("NotoSansKR");
      } else {
        // Windows에서 시스템 폰트를 직접 사용하려면 경로를 명시할 수도 있습니다.
        // 예: const winFont = 'C:\\Windows\\Fonts\\malgun.ttf'
        // 다만 일반적으로 배포 시에는 프로젝트 내부에 폰트를 포함시키는 것이 안전합니다.
        console.warn("Korean font not found at:", fontPath);
        // 폰트가 없으면 기본 폰트 사용(한글 깨짐 가능성 있음)
      }
    } catch (fontErr) {
      console.warn("Failed to register font for PDF:", fontErr);
    }

    // 먼저 파이프를 연결한 뒤 내용을 쓰고 end()를 호출해야 스트림이 올바르게 전송됩니다.
    doc.pipe(res);

    doc.fontSize(18).text("영생 살기 프로젝트", { align: "center" });
    doc.moveDown();

    if (content) {
      doc.fontSize(12).text(content, { align: "left" });
    } else {
      doc
        .fontSize(12)
        .text(
          "PDF 콘텐츠가 제공되지 않았습니다. 클라이언트에서 content를 같이 보내주세요.",
          { align: "left" }
        );
    }

    doc.end();
    // doc.pipe(res) 이후에 별도로 res.end()를 호출할 필요는 없습니다. pdfkit이 스트림을 닫습니다.
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
