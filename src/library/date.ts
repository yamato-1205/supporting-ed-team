/** 日付文字列（ISO / RFC822 どちらも可）を YYYY.MM.DD 形式にフォーマット */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/** 日付文字列を { year, monthDay } に分解（日付バッジ表示用） */
export function splitDate(dateStr: string): { year: string; monthDay: string } {
  const formatted = formatDate(dateStr);
  const [year, month, day] = formatted.split(".");
  return { year, monthDay: `${month}/${day}` };
}
