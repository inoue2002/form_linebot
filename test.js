"use strict";
// モジュール呼び出し
const crypto = require("crypto");
const line = require("@line/bot-sdk");
const axios = require("axios");

// インスタンス生成
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

exports.handler = (event) => {
  const signature = crypto
    .createHmac("sha256", process.env.CHANNELSECRET)
    .update(event.body)
    .digest("base64");
  const checkHeader = (event.headers || {})["X-Line-Signature"];
  const body = JSON.parse(event.body);
  const events = body.events;
  //console.log(events);

  // 署名検証が成功した場合
  if (signature === checkHeader) {
    events.forEach(async (event) => {
      let message;
      switch (event.type) {
        case "message":
          message = await messageFunc(event);
          break;
        case "postback":
          message = await postbackFunc(event);
          break;
        case "follow":
          message = {
            type: "text",
            text:
              "LINEから簡単にGoogleFormに回答を送るプロトタイプです。リッチメニューのボタンから試せます。回答するとLINEの名前がスプレッドシートに記録されるのでご注意ください。授業中に思いついた時のメモ→https://twitter.com/inoue2002/status/1272376009061359616?s=20",
          };
          break;
      }
      // メッセージを返信
      if (message != undefined) {
        await sendFunc(body.events[0].replyToken, message);
        return;
      }
    });
  }
  // 署名検証に失敗した場合
  else {
    console.log("署名認証エラー");
  }
};

async function sendFunc(replyToken, mes) {
  const result = new Promise(function (resolve, reject) {
    client.replyMessage(replyToken, mes).then((response) => {
      resolve("送信完了");
    });
  });
  return result;
}

async function messageFunc(event) {
  let message = "";

  switch (event.message.text) {
    case "回答する":
      message = {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "bubble",
          direction: "ltr",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Q1 満足度はいくらですか?",
                align: "start",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "↓数字をTAPして回答してください↓",
                    size: "xs",
                    align: "center",
                    gravity: "center",
                  },
                  {
                    type: "spacer",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "①",
                      data: "1-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "②",
                      data: "2-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "③",
                      data: "3-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "④",
                      data: "4-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "⑤",
                      data: "5-0",
                    },
                    color: "#0E08F7",
                  },
                ],
              },
            ],
          },
          styles: {
            header: {
              backgroundColor: "#0CF470",
            },
            body: {
              separator: false,
              separatorColor: "#251515",
            },
          },
        },
      };
      break;
    case "回答を見る":
      message = {
        type: "text",
        text:
          "https://docs.google.com/spreadsheets/d/1LdC1m_mZnpH3_ae1vrtoRWYvFtjkINnTam9FuBz4xH0/edit?usp=sharing",
      };
      break;
  }

  return message;
}
const postbackFunc = async function (event) {
  let message = "";
  let postbackData = event.postback.data;

  if (postbackData === "やり直す") {
    message = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        direction: "ltr",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Q1 満足度はいくらですか?",
              align: "start",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "↓数字をTAPして回答してください↓",
                  size: "xs",
                  align: "center",
                  gravity: "center",
                },
                {
                  type: "spacer",
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "①",
                    data: "1-0",
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "②",
                    data: "2-0",
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "③",
                    data: "3-0",
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "④",
                    data: "4-0",
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "⑤",
                    data: "5-0",
                  },
                  color: "#0E08F7",
                },
              ],
            },
          ],
        },
        styles: {
          header: {
            backgroundColor: "#0CF470",
          },
          body: {
            separator: false,
            separatorColor: "#251515",
          },
        },
      },
    };
    return message;
  }
  let userData = postbackData.split("-");

  let q1Data = userData[0]; // "1" String

  if (q1Data === "submit") {
    const userName = await client.getProfile(event.source.userId);
    let Dataq1 = userData[1]; //Q1のデータ "2"
    let Dataq2 = userData[2]; //Q2のデータ "3"
    let DataName = encodeURIComponent(userName.displayName);
    Dataq1 = Number(Dataq1);
    Dataq2 = Number(Dataq2);
    let data2;

    switch (Dataq2) {
      case 1:
        data2 = "とても思う";
        break;
      case 2:
        data2 = "少しそう思う";
        break;
      case 3:
        data2 = "あまり思わない";
        break;
      case 4:
        data2 = "思わない";
        break;
    }

    await axios.get(
      `https://docs.google.com/forms/u/0/d/e/1FAIpQLSfbovS_Bh20Vt5N5X1jf-cdeqa-m6m_p2oB-4rBYJ2wox_-iA/formResponse?entry.216620522=${DataName}&entry.281298718=${Dataq1}&entry.2054453875=` +
        encodeURIComponent(data2)
    );

    return {
      type: "text",
      text: "回答しました。「回答を見る」で反映されているか見てください！",
    };
  }
  let q2Data = userData[1]; // "2" String

  if (q1Data === "x" && q2Data === "x") {
    return;
  }

  q1Data = Number(q1Data); // 1
  q2Data = Number(q2Data); // 2

  //console.log("Q1Data", q1Data);
  //console.log("Q2Data", q2Data);

  if (q1Data > 0 && q2Data === 0) {
    message = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        direction: "ltr",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Q2 友達に勧めようと思いますか?",
              align: "start",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              margin: "xl",
              contents: [
                {
                  type: "text",
                  text: "①とても思う",
                  size: "lg",
                  align: "start",
                },
                {
                  type: "text",
                  text: "②少しそう思う",
                  size: "lg",
                  align: "start",
                },
                {
                  type: "text",
                  text: "④思わない",
                  size: "lg",
                  align: "start",
                },
                {
                  type: "text",
                  text: "③あまり思わない",
                  size: "lg",
                  align: "start",
                },
              ],
            },
            {
              type: "text",
              text: "↓数字をTAPして回答してください↓",
              margin: "lg",
              size: "xs",
              align: "center",
              gravity: "center",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "①",
                    data: `${q1Data}-1`,
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "②",
                    data: `${q1Data}-2`,
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "③",
                    data: `${q1Data}-3`,
                  },
                  color: "#0E08F7",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "④",
                    data: `${q1Data}-4`,
                  },
                  color: "#0E08F7",
                },
              ],
            },
          ],
        },
        styles: {
          header: {
            backgroundColor: "#0CF470",
          },
          body: {
            separator: false,
            separatorColor: "#251515",
          },
        },
      },
    };
    return message;
  }

  if (q1Data === 0 && q2Data > 0) {
    message = [
      { type: "text", text: "エラーが発生しました。最初からお試しください。" },
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "bubble",
          direction: "ltr",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Q1 満足度はいくらですか?",
                align: "start",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "↓数字をTAPして回答してください↓",
                    size: "xs",
                    align: "center",
                    gravity: "center",
                  },
                  {
                    type: "spacer",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "①",
                      data: "1-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "②",
                      data: "2-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "③",
                      data: "3-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "④",
                      data: "4-0",
                    },
                    color: "#0E08F7",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "⑤",
                      data: "5-0",
                    },
                    color: "#0E08F7",
                  },
                ],
              },
            ],
          },
          styles: {
            header: {
              backgroundColor: "#0CF470",
            },
            body: {
              separator: false,
              separatorColor: "#251515",
            },
          },
        },
      },
    ];
  }

  if (q1Data > 0 && q2Data > 0) {
    message = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        direction: "ltr",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "確認",
              align: "start",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "lg",
          contents: [
            {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "Q1 満足度",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  spacing: "sm",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "1",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "2",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "3",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "4",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "5",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "Q2 友達に勧めたいか",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  spacing: "sm",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "1",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "2",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "3",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "4",
                        data: "x-x",
                      },
                      style: "secondary",
                      color: "#EEDEDE",
                    },
                  ],
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          margin: "lg",
          contents: [
            {
              type: "button",
              action: {
                type: "postback",
                label: "回答を送信",
                data: `submit-${q1Data}-${q2Data}`,
              },
              color: "#0CF470",
              style: "primary",
            },
            {
              type: "button",
              action: {
                type: "postback",
                label: "やり直す",
                data: "やり直す",
              },
            },
          ],
        },
        styles: {
          header: {
            backgroundColor: "#0CF470",
          },
          body: {
            separator: false,
            separatorColor: "#251515",
          },
        },
      },
    };
    //回答に合わせて表示を変える。 "style": "secondary"で灰色、"style": "primary"で光る

    switch (q1Data) {
      case 1:
        message.contents.body.contents[0].contents[1].contents[0].style =
          "primary";
        message.contents.body.contents[0].contents[1].contents[0].color =
          "#0CF470";
        break;
      case 2:
        message.contents.body.contents[0].contents[1].contents[1].style =
          "primary";
        message.contents.body.contents[0].contents[1].contents[1].color =
          "#0CF470";
        break;
      case 3:
        message.contents.body.contents[0].contents[1].contents[2].style =
          "primary";
        message.contents.body.contents[0].contents[1].contents[2].color =
          "#0CF470";
        break;
      case 4:
        message.contents.body.contents[0].contents[1].contents[3].style =
          "primary";
        message.contents.body.contents[0].contents[1].contents[3].color =
          "#0CF470";
        break;
      case 5:
        message.contents.body.contents[0].contents[1].contents[4].style =
          "primary";
        message.contents.body.contents[0].contents[1].contents[4].color =
          "#0CF470";
        break;
    }
    switch (q2Data) {
      case 1:
        message.contents.body.contents[1].contents[1].contents[0].style =
          "primary";
        message.contents.body.contents[1].contents[1].contents[0].color =
          "#0CF470";
        break;
      case 2:
        message.contents.body.contents[1].contents[1].contents[1].style =
          "primary";
        message.contents.body.contents[1].contents[1].contents[1].color =
          "#0CF470";
        break;
      case 3:
        message.contents.body.contents[1].contents[1].contents[2].style =
          "primary";
        message.contents.body.contents[1].contents[1].contents[2].color =
          "#0CF470";
        break;
      case 4:
        message.contents.body.contents[1].contents[1].contents[3].style =
          "primary";
        message.contents.body.contents[1].contents[1].contents[3].color =
          "#0CF470";
        break;
    }
    return message;
  }
};
