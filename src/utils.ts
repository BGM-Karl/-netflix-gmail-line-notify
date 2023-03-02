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

export function delay(ms: number){
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}