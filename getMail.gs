// FIXME your email address
var sender = "to: hoge@example.com' ";

// FIXME your Incoming Webhooks URL
var url = 'https://hooks.slack.com/xxx';

function getMail() {

  var dateTime = getNowDateTime();
  Logger.log('dateTime:' + dateTime);

  // search your unread mails
  var query   = GmailApp.search('label:inbox is:unread after:' + dateTime + ' ' + sender); //←指定時間以降＋受信者フィルター
  var threads = GmailApp.getMessagesForThreads(query);

  for(var i in threads){
    var messages = threads[i];

    // Threads(j)
    for(var j in messages){
      var message = messages[j];

      // 日時
      var date      = message.getDate();
      // 差出人
      var from      = message.getFrom();
      // 件名
      var subject   = message.getSubject();
      // 本文
      var plainBody = message.getPlainBody();

      var str = '日時: ' + date + '\n' + '差出人:' + from + '\n' + '件名: ' + subject + '\n' + '内容: ' + plainBody;//使ってない

      //sendToSlack(str);
      sendToSlack(str, from, subject, plainBody);

      //既読にする。
      message.markRead();
    }
  }

}

function getNowDateTime(){

  // 現在時刻を取得
  const dateTime = new Date();

  // UNIX TIMEに変換
  const unixTime = dateTime.getTime();

  // ミリ秒を秒に変換
  const now = Math.floor(unixTime/1000);

  // 現在時刻から5分(=300秒)前
  const term = now - 300;

  return term;
}

//function sendToSlack(str){
function sendToSlack(str, from, subject, plainBody) { 
  var payload = {
    //'text': str
    'attachments': [{
      'pretext': '*' + subject + '*' + '\n' + from,
      'text'   : '```' + plainBody + '```'
    }]
  };

  var options = {
    'method'     : 'post'                 ,
    'contentType': 'application/json'     ,
    'payload'    : JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);

}
