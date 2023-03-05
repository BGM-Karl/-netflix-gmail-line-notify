import { promises as fs } from 'fs';
import path from 'path';

const SETTING_PATH = path.join(process.cwd(), '/asset/setting.json');


interface Setting {
    sendIds: string[]
}
export async function handleGetSetting() {
    try {
        const content = await fs.readFile(SETTING_PATH);
        const setting = JSON.parse(content.toString())
        return setting as Setting;
    } catch (err) {
        return null;
    }
}

export async function handleSetSetting(setting: Setting) {
    const payload = JSON.stringify(setting);
    await fs.writeFile(SETTING_PATH, payload);
}


export async function handleDeleteFile(path: string) {
    try {
        const fsUnlinkResult = await fs.unlink(path)
    } catch (error) {
        return;
    }
}

export function log(text: string) {
    process.stdout.write(text);
}

export function delay(ms: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}


/**
 * 刪除文字中的所有連結
 * @param text 要處理的文字
 * @returns 處理後的文字
 */
export function removeAllLink(text: string): string {
    const linkRegex = /https?:\/\/[-\w.]+(:\d+)?(\/([\w\/_.]*(\?\S+)?)?)?/gi;
    return text.replace(linkRegex, "");
}

/**
* 刪除文字中的所有中括號和其中的文字。
* @param text 要處理的文字。
* @returns 處理後的文字。
*/
export function removeSquareBrackets(text: string): string {
    const bracketRegex = /\[[^\]]*\]/g;
    return text.replace(bracketRegex, "");
}




/**
* 將兩個及以上的換行符號之間沒有中文、英文或數字的情況替換為一個換行符號。
* @param text 要處理的文字。
* @returns 處理後的文字。
*/
export function replaceMultipleEmptyLines(text: string): string {
    const newlineRegex = /([^\u4e00-\u9fa5a-zA-Z0-9])\n{2,}([^\u4e00-\u9fa5a-zA-Z0-9])|\n{2,}/g;
    return text.replace(newlineRegex, "$1\n$2");
}