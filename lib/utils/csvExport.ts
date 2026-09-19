// Generic browser-side CSV export utility
// Converts an array of objects into a properly escaped, downloadable .csv file
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns?: { key: keyof T; header: string }[]
): void {
  if (!rows || rows.length === 0) {
    return;
  }

  const effectiveColumns = columns ?? Object.keys(rows[0]).map((key) => ({
    key: key as keyof T,
    header: key,
  }));

  const escapeField = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = effectiveColumns.map((col) => escapeField(col.header)).join(",");
  const dataLines = rows.map((row) =>
    effectiveColumns.map((col) => escapeField(row[col.key])).join(",")
  );

  const csvContent = [headerLine, ...dataLines].join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
