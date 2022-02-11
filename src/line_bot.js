// import { ACCESSTOKEN } from "./api";

//コマンドの用意
var command = {
  show: "#prepas",
  help: "#helpme",
  attend: "#attend",
  again: "#retell",
};

var today = new Date();
var date = today.getDate();
var month = today.getMonth() + 1;
var next_month = month + 1;
// WebHookで受信した応答用Token
var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
// ユーザーのメッセージを取得
var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
// 応答メッセージ用のAPI URL
var url = "https://api.line.me/v2/bot/message/reply";

//スプレッドシートの抽出
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

var getsheet = function (sheet_name) {
  return spreadsheet.getSheetByName(sheet_name);
};

var sheet_prepa = getsheet("プレパ日程");
var sheet_prepa_lastrow = sheet_prepa.getLastRow();
var sheet_prepa_lastcolumn = sheet_prepa.getLastColumn();

var sheet_send = getsheet("任意メッセージ");

// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = ACCESSTOKEN;

function doPost(e) {
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: botMessage,
        },
      ],
    }),
  });
  return ContentService.createTextOutput(
    JSON.stringify({ content: "post ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

var fetchPrepaarea = function (sheet, lastRow, lastColumn) {
  var range = sheet.getRange(`R2C1:R${lastRow}C${lastColumn}`);
  var data = range.getValues();
  return data;
};
var make_text = function (data) {};
var mach_command = function (msg, data) {
  var text = "";
  if (msg.search(command.show) >= 0) {
    for (let i = 0; i < data.length; i++) {
      text += `${data[i][0]}月${data[i][1]}日  ${data[i][2]}~  ${data[i][3]}教室\n`;
    }
    text += "で行ってます！";
  } else if (msg.search(command.help) >= 0) {
    text =
      "コマンド\n#prepas:1か月先までのプレパ日程に表示\n#retell:直近プレパの再確認\n#attend:出席登録（comming soon）";
  } else if (msg.search(command.attend) >= 0) {
    text = "comming soon";
  } else if (msg.search(command.again) >= 0) {
    text = kokuchi;
  }
};

function sendByButton() {}
