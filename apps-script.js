// ============================================================
//  KasHIO NPS — Google Apps Script
//  Creado desde el Google Sheet: Extensiones → Apps Script
// ============================================================

function doGet(e) {
  // ── Servir datos para el dashboard ──
  if (e && e.parameter && e.parameter.action === "getData") {
    return getSheetData();
  }
  // ── Guardar respuesta de encuesta ──
  return saveSurveyResponse(e);
}

function saveSurveyResponse(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Fecha","Cliente","P1 - Gestiones de cobranza",
        "P2 - Continuidad del servicio","P3 - Atención de soporte",
        "P4 - Satisfacción general","P5 - NPS (Recomendación)",
        "Categoría NPS","Comentario"]);
    }
    var p = e.parameter;
    var nps = parseInt(p.nps);
    var categoria = nps <= 6 ? "Detractor" : nps <= 8 ? "Pasivo" : "Promotor";
    sheet.appendRow([
      p.fecha || new Date().toLocaleString("es-PE"),
      p.cliente || "Anónimo",
      parseInt(p.cobranza), parseInt(p.estabilidad),
      parseInt(p.soporte),  parseInt(p.satisfaccion),
      nps, categoria, p.comentario || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "ok", rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      rows.push(row);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", rows: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
