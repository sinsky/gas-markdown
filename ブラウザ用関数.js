/**
 * Settingシートからファイル構造を取り出す
 */
const getFileStructureData = () => {
  const {sheetId,settingData} = config;
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(settingData.sheetName);
  const data = sheet.getRange(settingData.fileDataRange).getValue();
  console.log(data);
  return {data};
}
/**
 * ファイル構造をセットする
 * ファイルを作成したら新規ファイルをセット
 */
const setFileStructureData = (e) => {
  console.log(e);
  const { isCreate, data, type,uid,uids } = e;
  const { sheetId, settingData, markdownData } = config;
  const ss = SpreadsheetApp.openById(sheetId);
  const settingSheet = ss.getSheetByName(settingData.sheetName);
  settingSheet.getRange(settingData.fileDataRange).setValue(data);
  if (type === "file" || (type === "foldar" && !isCreate)) {
    const markdownSheet = ss.getSheetByName(markdownData.sheetName);
    if (isCreate) {
      console.log("create events");
      const lastRow = markdownSheet.getLastRow() + 1;
      console.log(`create Row ${lastRow}`);
      markdownSheet.getRange(`A${lastRow}:B${lastRow}`).setValues([[uid, ""]]);
    } else {
      console.log("delete events");
      uids.map(uid => {
      const removeRow = markdownSheet
        .getRange(`A:A`)
        .getValues()
        .map((row) => row[0])
        .findIndex(row => row === uid) + 1;
        console.log(`remove Row ${removeRow}`);
        markdownSheet.deleteRow(removeRow);
      })
    }
  }
  return { status: "success" };
}

/**
 * Markdownデータを取得する
 */
const getMarkdownText = (e) => {
  const { uid } = e;
  const { sheetId, markdownData } = config;
  console.log(e);
  const ss = SpreadsheetApp.openById(sheetId);
  const markdownSheet = ss.getSheetByName(markdownData.sheetName);
  const data = markdownSheet.getRange(`A:B`).getValues()
  const markdownRow = data.findIndex((row) => row[0] === uid);
  console.log(data);
  console.log(markdownRow);
  console.log(data[markdownRow]);
  return { value: data[markdownRow][1] };
};
/**
 * Markdownデータを格納する
 */
const setMarkdownText = (e) => {
  const { uid, value } = e;
  const { sheetId, markdownData } = config;
  const ss = SpreadsheetApp.openById(sheetId);
  const markdownSheet = ss.getSheetByName(markdownData.sheetName);
  const markdownRow = markdownSheet
    .getRange(`A:A`)
    .getValues()
    .findIndex((row) => row[0] === uid) + 1;
  markdownSheet.getRange(`B${markdownRow}`).setValue(value);
  return { status: "success" };
}
