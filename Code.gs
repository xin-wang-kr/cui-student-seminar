/**
 * CUI Student Seminar survey → Google Sheet.
 * Paste into Extensions › Apps Script of the target spreadsheet, then
 * Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
 */
const SHEET_NAME = 'Responses';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const params = e.parameter || {};
    const order = JSON.parse(params._order || '[]').filter(k => k !== '_order');
    const sheet = getSheet_();

    // Header row: "Received" + every field the page sends; new fields become new columns.
    let headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (!headers.length) headers = ['Received'];
    const missing = order.filter(k => headers.indexOf(k) === -1);
    if (missing.length) {
      headers = headers.concat(missing);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = headers.map(h => {
      if (h === 'Received') return new Date();
      const v = params[h] || '';
      // Stop spreadsheet formula injection from free-text answers
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('CUI Student Seminar survey endpoint is running.');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}
