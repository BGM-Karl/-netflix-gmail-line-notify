
import { gmail_v1, google } from 'googleapis';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { GaxiosResponse } from 'gaxios';
import base64 from 'base-64';
import utf8 from 'utf8';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';


export async function handleMsgToImg(msgItem: GaxiosResponse<gmail_v1.Schema$Message>, msgId: string = "img") {
    const IMG_PATH = `${path.join(process.cwd(), '/msg-img')}/${msgId}.jpg`;
    var part = msgItem.data.payload?.parts?.find((part) => part.mimeType == 'text/html');
    const textBase64 = part?.body?.data;
    if (!textBase64) return;
    var bytes = base64.decode(textBase64.replace(/-/g, '+').replace(/_/g, '/'));
    var text = utf8.decode(bytes);
    await nodeHtmlToImage({
        output: IMG_PATH,
        html: text
    })
    return IMG_PATH
}

export async function getMessage(auth: JSONClient, messageId: string) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
        id: messageId,
        userId: 'me',
        format: 'full'
    })
    return res
}
export async function getMailList(auth: JSONClient) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        q: 'from:info@account.netflix.com',
        userId: 'me'
    })
    // ({

    // }) as any
    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
        console.log('No messages found.');
        return;
    }
    return messages
    // for (let index = 0; index < messages.length; index++) {
    //     const msg = messages[index];
    //     const msgId  = msg.id;
    //     if(!msgId)return;
    //     const msgItem = await getMessage(auth, msgId)
    //     var part = msgItem.data.payload?.parts?.find(function (part) {
    //         return part.mimeType == 'text/html';
    //     });
    //     const textBase64 = part?.body?.data;
    //     if (!textBase64) return;
    //     var bytes = base64.decode(textBase64.replaceAll('-', '+').replaceAll('_', '/'));
    //     var text = utf8.decode(bytes);
    //     await fs.writeFile('mail.html', text);
    //     await nodeHtmlToImage({
    //         output: './image.png',
    //         html: text
    //     })
    //     break;
    // }
}