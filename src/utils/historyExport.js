import ExcelJS from 'exceljs';

export const exportToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Leave History');

  // Define columns
  worksheet.columns = [
    { header: 'Request ID', key: 'id', width: 10 },
    { header: 'Leave Type', key: 'leaveType', width: 15 },
    { header: 'From Date', key: 'fromDate', width: 15 },
    { header: 'To Date', key: 'toDate', width: 15 },
    { header: 'Requested On', key: 'requestedOn', width: 15 },
    { header: 'Cancelled', key: 'cancelled', width: 10 }
  ];

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9ECEF' }
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
    };
  });

  // Add data rows
  data.forEach(record => {
    worksheet.addRow({
      id: record.id,
      leaveType: record.leaveType,
      fromDate: record.fromDate,
      toDate: record.toDate,
      requestedOn: record.requestedOn,
      cancelled: record.cancelled
    });
  });

  // Style data cells
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };
      });
    }
  });

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leave_history.xlsx';
  link.click();
  window.URL.revokeObjectURL(url);
};