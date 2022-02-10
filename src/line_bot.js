import { ACCESSTOKEN } from "./api";

//コマンドの用意
var command = {
  show: "#prepas",
  help: "#helpme",
  attend: "#attend",
  again: "#retell",
};

var today = new Date();
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

var fetchPrepaarea = function () {};
var fetchPrepas = function () {};
var mach_command = function (msg) {
  var text = "";
  if (msg.search(command.show) >= 0) {
  }
};
