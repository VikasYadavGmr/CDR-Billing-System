/**
 * Export utilities for downloading tables as CSV or triggering print
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || !data.length) {
    alert('No data to export.');
    return;
  }

  let csvContent = '';

  if (headers && headers.length > 0) {
    csvContent += headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',') + '\r\n';
    data.forEach((row) => {
      const line = headers
        .map((h) => {
          const val = row[h.key] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  } else {
    const keys = Object.keys(data[0]) as (keyof T)[];
    csvContent += keys.map((k) => `"${String(k)}"`).join(',') + '\r\n';
    data.forEach((row) => {
      const line = keys
        .map((k) => {
          const val = row[k] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printElement(elementId: string) {
  const content = document.getElementById(elementId);
  if (!content) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Document - CDR Billing System</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 600; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 12px; }
          .title { font-size: 20px; font-weight: bold; color: #0f172a; }
          .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}
