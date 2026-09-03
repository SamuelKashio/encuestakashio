// Google Apps Script — KasHIO NPS Survey Backend
// Deploy as: Web app > Execute as: Me > Access: Anyone

var SHEET_NAME = "Respuestas";

var HEADERS = [
  "Fecha", "Cliente", "Tipo", "Productos",
  "Q1 - Propuesta valor",
  "Q2 - NPS (recomendación)",
  "Q3 - Razón / mejora corporativo",
  "Q4 - Atención comercial",
  "Q5 - Entendimiento negocio",
  "Q6 - Mejora equipo comercial",
  "Q7 - Velocidad soporte",
  "Q8 - Calidad soluciones soporte",
  "Q9 - Claridad comunicación soporte",
  "Q10 - Consistencia soporte",
  "Q10b - Mejora equipo soporte",
  "Q11 - Facilidad onboarding",
  "Q12 - Acompañamiento onboarding",
  "Q13 - Documentación onboarding",
  "Q14 - Tiempo onboarding",
  "Q15 - Mejora onboarding",
  "Q16 - Satisfacción Payin",
  "Q17 - Eficiencia conciliación Payin",
  "Q18 - Satisfacción Payout",
  "Q19 - Confiabilidad Payout",
  "Q20 - Usabilidad plataforma",
  "Q21 - Funcionalidad faltante / mejora"
];

function doGet(e) {
  try {
    var params = e.parameter;

    // Legacy support: old survey format (without 'tipo' field)
    if (!params.tipo) {
      return handleLegacy(params);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      formatHeaders(sheet);
    }

    // Ensure headers exist on first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      formatHeaders(sheet);
    }

    var row = [
      params.fecha || new Date().toLocaleString("es-PE"),
      params.cliente || "Anónimo",
      params.tipo || "",
      params.productos || "",
      toNum(params.q1),
      toNum(params.q2),
      params.q3 || "",
      toNum(params.q4),
      toNum(params.q5),
      params.q6 || "",
      toNum(params.q7),
      toNum(params.q8),
      toNum(params.q9),
      toNum(params.q10),
      params.q10b || "",
      toNum(params.q11),
      toNum(params.q12),
      toNum(params.q13),
      toNum(params.q14),
      params.q15 || "",
      toNum(params.q16),
      toNum(params.q17),
      toNum(params.q18),
      toNum(params.q19),
      toNum(params.q20),
      params.q21 || ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function toNum(val) {
  if (val === undefined || val === null || val === "") return "";
  var n = Number(val);
  return isNaN(n) ? "" : n;
}

function formatHeaders(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground("#0666EB");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// Legacy handler for old 5-question format
function handleLegacy(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var legacyName = "Respuestas_Legacy";
  var sheet = ss.getSheetByName(legacyName);

  if (!sheet) {
    sheet = ss.insertSheet(legacyName);
    sheet.appendRow(["Fecha","Cliente","P1","P2","P3","P4","NPS","Comentario"]);
  }

  sheet.appendRow([
    params.fecha || new Date().toLocaleString("es-PE"),
    params.cliente || "Anónimo",
    toNum(params.cobranza),
    toNum(params.estabilidad),
    toNum(params.soporte),
    toNum(params.satisfaccion),
    toNum(params.nps),
    params.comentario || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
