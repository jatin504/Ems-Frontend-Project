import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import CogEtaViewLogo from "../assets/cog_etaView.png";

// Accept your data format
interface ReportData {
  title: string;
  createdAt : string;
  data: {
    [plant: string]: Array<{
      timestamp: string;
      [key: string]: string | number;
    }>;
  };
}

// Optional logo (base64) if needed

export const ExportReportToExcel = async (report: ReportData) => {
  console.log("EXPORT FUNCTION CALLED");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ETAFlux.Cogneta.Cloud";
  workbook.created = new Date();

  for (const plant in report.data) {
      const worksheet = workbook.addWorksheet(plant);
      // --- Extract headers
    const sample = report.data[plant][0];
    // const headers = Object.keys(sample);
    // const headers = Object.entries(sample).map(([key]) => key);
    // const headers = Object.keys(sample).sort((a, b) => {
    //   // Extract inverter number (e.g., "Energy_Daily_kWh_inverter_10" → 10)
    //   const getNum = (key: string) => {
    //     const match = key.match(/(\d+)$/);
    //     return match ? parseInt(match[1]) : 0;
    //   };
    //   return getNum(a) - getNum(b);
    // });

    const headers = Object.keys(sample).sort((a, b) => {
      // Always keep Time_Stamp first (case-insensitive)
      if (a.toLowerCase() === "time_stamp") return -1;
      if (b.toLowerCase() === "time_stamp") return 1;

      const getNum = (key: string) => {
        const match = key.match(/(\d+)$/); // capture number at the END of key
        return match ? parseInt(match[1]) : Number.MAX_SAFE_INTEGER; // non-number keys go last
      };

      const numA = getNum(a);
      const numB = getNum(b);

      // If both have numbers, sort numerically
      if (numA !== Number.MAX_SAFE_INTEGER || numB !== Number.MAX_SAFE_INTEGER) {
        return numA - numB;
      }

      // Otherwise sort alphabetically
      return a.localeCompare(b);
    });

    const formatHeader = (header: string) => {
      return header
        // remove plant prefix
        .replace(/^plant_\d+_/, "")

        // block_1 => B.1
        .replace(/^block_(\d+)_/i, "B.$1_")

        // remove repeated words
        .replace(/inverter_inverter_/gi, "inverter_")
        .replace(/pcs_pcs_/gi, "pcs_")
        .replace(/bank_bank_/gi, "bank_")
        .replace(/rack_rack_/gi, "rack_")

        // remove interval suffix
        .replace(/_15_min/gi, "")
        .replace(/_30_min/gi, "")
        .replace(/_1_hour/gi, "")
        .replace(/_1_day/gi, "")
        .replace(/_1_week/gi, "")
        .replace(/_1_month/gi, "")
        .replace(/_1_year/gi, "")

        .toUpperCase();
    };

    // console.log("Excel column order:", headers);

    const colCount = headers.length < 5 ? 7 : headers.length;

    
    // Finding Max Width
    // const arrLen = headers.map((elem) => elem.length)


    // Find first and last column letter
    const startCol = 1;
    const endCol = colCount;
    const startCell = worksheet.getRow(1).getCell(startCol).address.replace(/\d+/, '');
    const endCell = worksheet.getRow(1).getCell(endCol).address.replace(/\d+/, '');
    // const mergedRange = `${startCell}1:${endCell}1`;
    // const mergedRange2 = `${startCell}2:${endCell}2`;
    // const mergedRange3 = `${startCell}3:${endCell}3`;

    worksheet.mergeCells("A1:G4");

    const response = await fetch(CogEtaViewLogo);
    const blob = await response.blob();

    const reader = new FileReader();

    const base64: string = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const logoId = workbook.addImage({
      base64,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0, row: 0 },
      ext: { width: 220, height: 60 },
    });

    // Title placed under logos
    worksheet.getCell("C3").value = report.title;
    worksheet.getCell("C3").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("C3").font = { bold: true, size: 16 };

    // Merge plant + date row (Row 2)
    worksheet.mergeCells(`${startCell}5:${endCell}5`);

    const downloadedBy =
      sessionStorage.getItem("name") ||
      sessionStorage.getItem("email") ||
      sessionStorage.getItem("userName") ||
      sessionStorage.getItem("username") ||
      sessionStorage.getItem("user") ||
      "Admin";

    worksheet.getCell("A5").value =
     `Downloaded By User-id: ${downloadedBy} | Created At: ${report.createdAt}`;
    worksheet.getCell("A5").alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell("A5").font = { italic: true, size: 12 };


    // Merge spacer/info row (Row 3)
    // worksheet.mergeCells(mergedRange3);
    // worksheet.getCell(`${startCell}3`).value = ""; // Optional placeholder or note

    // Merge and add report title
    // worksheet.mergeCells('C1:F1');
    // worksheet.getCell('C1').value = report.title;
    // worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell('C1').font = { bold: true, size: 16 };

    // Merge and add plant info and created date
    // worksheet.mergeCells('C2:F2');
    // worksheet.getCell('C2').value = `Plant Name: ${Object.keys(plant)} | Created At: ${report.createdAt}`;
    // worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    


    // --- Add Table Headers
    // worksheet.addRow([]);
    worksheet.mergeCells(`${startCell}6:${endCell}6`);

    const headerRow = worksheet.addRow(
      headers.map((h) => formatHeader(h))
    );
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF87CEFA' }, // sky blue
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });
    

    // --- Add data rows
    report.data[plant].forEach((entry) => {
      const row = headers.map((key) => entry[key]);
      worksheet.addRow(row);
    });

    worksheet.columns = headers.map((header) => ({
        // header,
        // key: header,
        width: Math.max(
            header.length,
            ...report.data[plant].map((row) => String(row[header] || '').length)
        ) + 4
    }));

    worksheet.eachRow((row) => {
      row.alignment = { vertical: "middle", horizontal: "center" };
      row.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  saveAs(blob, `${report.title}-${new Date().toISOString().split("T")[0]}.xlsx`);
};
