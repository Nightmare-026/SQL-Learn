'use client';

// ============ SQL tokenizer (used by editor overlay + code blocks) ============

export type Token = { text: string; cls: string };

const KEYWORDS = new Set(
  `SELECT FROM WHERE GROUP BY HAVING ORDER ASC DESC LIMIT OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW INDEX TRIGGER DROP ALTER ADD COLUMN RENAME TO AND OR NOT NULL IS IN LIKE BETWEEN EXISTS CASE WHEN THEN ELSE END JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS DISTINCT UNION ALL INTERSECT EXCEPT WITH RECURSIVE PRIMARY KEY FOREIGN REFERENCES UNIQUE CHECK DEFAULT BEGIN TRANSACTION COMMIT ROLLBACK IF CAST COLLATE USING NATURAL TEMP TEMPORARY IFNULL ROW_NUMBER RANK DENSE_RANK LAG LEAD OVER PARTITION ROWS RANGE PRECEDING FOLLOWING CURRENT UNBOUNDED EXPLAIN QUERY PLAN VACUUM PRAGMA AUTOINCREMENT CONSTRAINT CASCADE EXTRACT REPLACE ROUND FUNCTION RETURNING BEFORE AFTER EACH ROW WHENEVER VIRTUAL GENERATED ALWAYS STORED STABLE STRICT WITHOUT`
    .split(/\s+/)
    .filter(Boolean)
);

const FUNCTIONS = new Set(
  `COUNT SUM AVG MIN MAX ABS COALESCE IFNULL IIF INSTR LENGTH LTRIM RTRIM TRIM LOWER UPPER REPLACE SUBSTR SUBSTRING HEX ROUND RANDOM SIGN MOD POWER SQRT FLOOR CEIL CEILING DATE TIME DATETIME JULIANDAY STRFTIME strftime NOW TODAY LAST_INSERT_ROWID CHANGES TOTAL_CHANGES NULLIF UNICODE CHAR LIKELY UNLIKELY MAX MIN GROUP_CONCAT STRING_AGG DATEADD DATEDIFF POWER EXP LOG FORMAT QUOTE ZEROBLOB TYPEOF SQLRTREE`
    .split(/\s+/)
    .filter(Boolean)
);

const TOKEN_RE =
  /(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^']|'')*'|"(?:[^"]|"")*"|`(?:[^`])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([=<>!+\-*/%<>]+|<>|\|\||,|\(|\)|\.|;)/g;

export function tokenizeSql(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: '' });
    last = m.index + m[0].length;
    if (m[1]) tokens.push({ text: m[1], cls: 'tok-comment' });
    else if (m[2]) tokens.push({ text: m[2], cls: 'tok-string' });
    else if (m[3]) tokens.push({ text: m[3], cls: 'tok-number' });
    else if (m[4]) {
      const word = m[4];
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper)) tokens.push({ text: word, cls: 'tok-keyword' });
      else if (FUNCTIONS.has(upper)) tokens.push({ text: word, cls: 'tok-function' });
      else if (/^(NULL|TRUE|FALSE)$/i.test(word)) tokens.push({ text: word, cls: 'tok-null' });
      else tokens.push({ text: word, cls: 'tok-ident' });
    } else if (m[5]) {
      tokens.push({ text: m[5], cls: /[,();.]/.test(m[5]) ? 'tok-punct' : 'tok-operator' });
    }
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: '' });
  return tokens;
}

/** Split code into lines of tokens (for line-numbered rendering). */
export function tokenizeLines(code: string): Token[][] {
  const tokens = tokenizeSql(code);
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    const parts = t.text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ text: p, cls: t.cls });
    });
  }
  return lines;
}

export function renderTokenText(tokens: Token[]): string {
  return tokens.map((t) => t.text).join('');
}
