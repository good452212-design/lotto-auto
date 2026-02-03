import fs from "fs";

const API = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=";

async function getDraw(no) {
  const res = await fetch(API + no, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.dhlottery.co.kr/common.do?method=main",
    },
  });

  const text = await res.text();
  if (text.trim().startsWith("<")) return null;

  try {
    const j = JSON.parse(text);
    if (j?.returnValue === "success") return j;
  } catch (_) {}
  return null;
}

async function main() {
  for (let no = 2000; no >= 900; no--) {
    const j = await getDraw(no);
    if (j) {
      fs.mkdirSync("data", { recursive: true });
      fs.writeFileSync("data/latest.json", JSON.stringify(j, null, 2), "utf-8");
      console.log("latest draw:", j.drwNo);
      return;
    }
  }
  throw new Error("latest draw not found");
}

main();
