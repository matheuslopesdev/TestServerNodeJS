import ExcelJS from 'exceljs';

export const handleXlsxFromStream = async (stream, worksheetsProcess, processRow) => {
    const processedRows = [];
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream);

    for await(const worksheetReader of workbookReader) {
        if(!worksheetsProcess.includes(worksheetReader.name)) {
            continue;
        }

        for await(const row of worksheetReader) {
            const result = processRow(row);

            if(result) {
                processedRows.push(result);
            }
        }
    }

    return processedRows;
}