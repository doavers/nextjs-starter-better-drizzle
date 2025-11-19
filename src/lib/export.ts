/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ExcelJS from "exceljs";
import FileSaver from "file-saver"; // You may also need to install `file-saver` with `npm install file-saver`
import Papa from "papaparse";

export async function exportToXLSX(data: any[], filename: string) {
  if (!data || !data.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add headers
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // Add data
  data.forEach((row) => {
    const rowData = headers.map((header) => row[header]);
    worksheet.addRow(rowData);
  });

  // Create a buffer with workbook data
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob from the buffer
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Save the file using FileSaver
  FileSaver.saveAs(blob, `${filename}.xlsx`);
}

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  FileSaver.saveAs(blob, `${filename}.csv`);
}

export function exportDataToCSV(data: any[], filename: string) {
  if (!data || !data.length) return;

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
