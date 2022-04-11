/**
 * Getアクション時にHTMLを返す
 * @return {Object} - Class HtmlOutput
 */
const doGet = () => {
  const html = HtmlService.createTemplateFromFile("index").evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Markdowner");
  return html;
}
/**
 * HTML内から別のHTMLを呼び出し挿入する関数
 * @param {String} filename - ファイル名
 * @return {String} - output file
 */
const include = (filename) => HtmlService.createTemplateFromFile(filename).evaluate().getContent();

const config = {
  sheetId: "1pxRNPtTF5MIMRwR1BbsQGRbcQ6UcHGN205zIb3ks6s8",
  settingData: {
    sheetName: "Setting",
    headers: ["file data"],
    fileDataRange: "A2",
  },
  markdownData: {
    sheetName: "markdown一覧",
    headers: ["uuid","text"],
  },
};

/**
 * シートの存在チェック関数
 * @param {Object} spreadSheet - Class SpreadSheet
 * @param {String} sheetName - 検索するシート名
 */
const isExistSheet = (spreadSheet,sheetName) => spreadSheet.getSheets().filter(sheet=>sheet.getSheetName() === sheetName).length === 0;
/**
 * 設定用シートを作成する、存在していれば作成しない
 */
const initCreateSheet = () => {
  const {sheetId,settingData,markdownData} = config;
  const ss = SpreadsheetApp.openById(sheetId);

  /* settingシートの存在チェック、無ければ作成 */
  if(isExistSheet(ss,settingData.sheetName)){
    const settingSheet = ss.insertSheet();
    settingSheet.setName(settingData.sheetName);
    settingSheet.getRange("A1").setValue(settingData.headers);
    settingSheet.getRange(settingData.fileDataRange).setValue(JSON.stringify([]));
  }else console.log("Settingシートは既に作成されています");

  /* markdownシートの存在チェック、なければ作成 */
  if(isExistSheet(ss,markdownData.sheetName)){
    const markdownSheet = ss.insertSheet();
    markdownSheet.setName(markdownData.sheetName);
    markdownSheet.getRange(1,1,1,markdownData.headers.length).setValues([markdownData.headers]);
  }else console.log("markdownシートは既に作成されています");
}
