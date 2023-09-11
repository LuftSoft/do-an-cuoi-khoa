export class Helper {
    static getUniqueId(parts: number) {
        var resultArr = [];
        for (let i = 0; i < parts; i++) {
            const s4 = ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            resultArr.push(s4);
        }
        return resultArr.join('-');
    }
    static cloneObject(object: any) {
        return JSON.stringify(object);
    }
    static parseObject(object: string) {
        return JSON.parse(object);
    }
}