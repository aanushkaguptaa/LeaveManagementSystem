import ExcelJS from 'exceljs';

export const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Overview');

  // Define columns
  worksheet.columns = [
    { header: 'SAP ID', key: 'sapId', width: 15 },
    { header: 'Employee Name', key: 'employeeName', width: 30 },
    { header: 'Leave Type', key: 'leaveType', width: 20 },
    { header: 'From Date', key: 'leaveRequestDateFrom', width: 15 },
    { header: 'To Date', key: 'leaveRequestDateTo', width: 15 },
    { header: 'Requested On', key: 'leaveRequestedOn', width: 15 },
  ];

  // Add rows
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};