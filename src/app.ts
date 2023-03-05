// const fs = require('fs').promises;
import { Notify } from 'line-api';
import { last } from 'lodash';
import { authorize } from './api-auth';
import { getMailList, getMessage, handleMsgToText } from './api-gmail';
import { delay, handleGetSetting, handleSetSetting, log } from './utils';

const lineNotifyToken = "AEMm5V3v2QqzPaiBPs5UjpUURrDYCsi6stbzmc3cYB9";
const notify = new Notify({
    token: lineNotifyToken
})
async function init() {
    const setting = await handleGetSetting();
    if (!setting) return;
    log('登入...');
    const auth = await authorize()
    log('成功\n');

    log('取得最新的信件...');
    const msgList = await getMailList(auth)
    if (!msgList) return;
    log(`成功，共${msgList.length}封\n`);

    log('取得尚未送出的信件...');
    const noSendMsgList = msgList.filter((msg) => msg.id ? setting.sendIds.indexOf(msg.id) === -1 : false)
    log(`成功，共${noSendMsgList.length}封\n`);

    log('準備送出的最舊的信...');
    const sendMsgTarget = last(noSendMsgList);
    if (!sendMsgTarget || !sendMsgTarget.id) {
        log('失敗，找不到信件\n');
        log(`休息五秒...`)
        await delay(5000)
        log(`結束\n`)
        return;
    }
    log('\n取得信件內容...');
    const msg = await getMessage(auth, sendMsgTarget.id);
    log(`成功\n`)
        ;
    // log('將信件內容轉成圖片...');
    // const imgPath = await handleMsgToImg(msg, sendMsgTarget.id);
    // if (!imgPath) return;
    log('將信件內容轉成文字...');
    const imgText = handleMsgToText(msg);
    console.log("🚀 ~ file: app.ts:45 ~ init ~ imgText:", JSON.stringify({imgText}))
    log(`成功\n`)

    await handleSetSetting({
        sendIds: [...setting.sendIds, sendMsgTarget.id]
    })

    log('將信件轉發至line notify...');
    await notify.send({
        'message': `\n${imgText}`,
    })
    log(`成功\n`)

    // await handleDeleteFile(imgPath)

    log(`休息五秒...`)
    await delay(5000)
    log(`結束\n`)

}
// init()
(async () => {
    while (true) {
        await init();
    }
})()

