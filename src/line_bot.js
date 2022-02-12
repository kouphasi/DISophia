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

var range = sheet_prepa.getRange(
  `R2C1:R${sheet_prepa_lastrow}C${sheet_prepa_lastcolumn}`
);
var data = range.getValues();

// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = "アクセストークンはシークレットです";

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  var botMessage = "";

  if (userMessage.search(command.show) >= 0) {
    console.log("get prepas");
    botMessage += "直近二か月のプレパは、\n";
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] >= today_month && data[i][0] <= next_month) {
        botMessage += `${data[i][0]}月${data[i][1]}日  ${data[i][2]}時~  ${data[i][3]}教室\n`;
      }
    }
    botMessage += "で行います！";
  } else if (userMessage.search(command.help) >= 0) {
    console.log("get helpme");
    botMessage =
      "コマンド\n#prepas:直近2か月のプレパ日程に表示\n#attend:出席登録（comming soon）";
  } else if (userMessage.search(command.attend) >= 0) {
    console.log("get attend");
    botMessage = "comming soon";
  }

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
