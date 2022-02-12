// import { ACCESSTOKEN } from "./api";

//コマンドの用意
var command = {
  show: "#prepas",
  help: "#helpme",
  attend: "#attend",
};

var today = new Date();
var today_date = today.getDate();
var today_month = today.getMonth() + 1;
var next_month = today_month + 1;

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

var sheet_data = fetchPrepaarea(
  sheet_prepa,
  sheet_prepa_lastrow,
  sheet_prepa_lastcolumn
);

// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = "";

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  var botMessage = mach_command(userMessage, sheet_data);

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

var mach_command = function (msg, data) {
  var text = "";
  if (msg.search(command.show) >= 0) {
    text += "直近二か月のプレパは、\n";
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] >= today_month && data[i][0] <= next_month) {
        text += `${data[i][0]}月${data[i][1]}日  ${data[i][2]}~  ${data[i][3]}教室\n`;
      }
    }
    text += "で行います！";
  } else if (msg.search(command.help) >= 0) {
    text =
      "コマンド\n#prepas:直近2か月のプレパ日程に表示\n#retell:直近プレパの再確認\n#attend:出席登録（comming soon）";
  } else if (msg.search(command.attend) >= 0) {
    text = "comming soon";
  }
  return text;
};

function sendByButton() {}
