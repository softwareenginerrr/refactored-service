import {existsSync, mkdirSync} from "fs";
import * as fsPromises from 'fs/promises'
import path from "path";
import {ICacheEntry} from "../interfaces/cacheEntry.interface";

export class CacheFile {
    constructor(private readonly cacheDirectory: string) {
        this.cacheDirectory = cacheDirectory;

        if (!existsSync(cacheDirectory)) {
            mkdirSync(cacheDirectory);
            console.log(`___FOLDER FOR CACHING ${cacheDirectory} CREATED___`);
        }
    }

    private getFilePath(key: string): string {
        return path.join(this.cacheDirectory, `${key}.json`);
    }

    private isCacheValid(entry: ICacheEntry): boolean {
        const currentTime = Date.now();
        return currentTime - entry.createdAt < entry.ttl * 1000;
    }

    async set(key: string, value: any, ttl: number): Promise<void> {
        const entry: ICacheEntry = {
            value,
            ttl,
            createdAt: Date.now(),
        };

        const filePath = this.getFilePath(key);
        await fsPromises.writeFile(filePath, JSON.stringify(entry));
        console.log(`____CACHE FILE WITH KEY "${key}" CREATED!____`)
    }

    async get(key: string): Promise<any | null> {
        const filePath = this.getFilePath(key);
        try {
            const data = await fsPromises.readFile(filePath, 'utf-8');
            const entry: ICacheEntry = JSON.parse(data);

            if (this.isCacheValid(entry)) {
                return entry.value;
            } else {
                await this.delete(key);
                return null;
            }
        } catch (error) {
            console.log(error, "\n____MEANS THAT FILE HAS NOT BEEN CREATED YET____\n____OR JUST DELETED BY SOMEONE____\n");
            return null;
        }
    }

   async delete(key: string): Promise<void> {
        const filePath = this.getFilePath(key);
        try {
            await fsPromises.unlink(filePath);
            console.log('___UNLINKED____')
        } catch (error) {
           console.log(error, "\n___PATH__DOES__NOT___EXIST_____\n Try to look manually!");
        }
    }

    async clear(): Promise<void> {
        const files = await fsPromises.readdir(this.cacheDirectory);
        for (const file of files) {
            const filePath = path.join(this.cacheDirectory, file);
            await fsPromises.unlink(filePath);
        }
    }
}
