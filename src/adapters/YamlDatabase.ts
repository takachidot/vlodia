"use strict";
import { set, get, has, unset } from "../util/lodash";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { DataError } from "../util/error";
import { WriteOptions } from "../types/types";
import parentModule from "parent-module";
import { absolute } from "../util/index";
import { isAbsolute, dirname, sep } from "path";
import yaml from "js-yaml";

export class YamlDatabase {
    private readonly dbFilePath: string;
    private cache: Record<string, unknown>;

    constructor(file: string = "database.yml") {
        file = file.endsWith(".yml") ? file : `${file}.yml`;
        this.dbFilePath =
            file === "database.yml" || isAbsolute(file)
                ? process.cwd() + sep + file
                : absolute(dirname(parentModule()!) + sep, file);
        this.cache = {};
        if (existsSync(this.dbFilePath)) this.cache = this.read();
        else writeFileSync(this.dbFilePath, "{}", "utf-8");
    }

    private read(): Record<string, unknown> {
        try {
            const data = readFileSync(this.dbFilePath, { encoding: "utf-8" }) || "{}";
            return yaml.load(data) as Record<string, unknown>;
        } catch (error) {
            throw new DataError("Error reading database file.");
        }
    }


    private write(options: WriteOptions = { write: true, pretty: true }): void {
        try {
            const str = options.pretty ? yaml.dump(this.cache, { indent: 2 }) : yaml.dump(this.cache);
            writeFileSync(this.dbFilePath, str);
        } catch (error) {
            throw new DataError("Error writing to database file.");
        }
    }

    private get _get(): number {
        const start = Date.now();
        this.get("takachi");
        return Date.now() - start;
    }

    private get _set(): number {
        const start = Date.now();
        this.set("takachi", "takachi");
        return Date.now() - start;
    }

    public get ping(): Record<string, unknown> {
        const read = this._get;
        const write = this._set;
        const average = (read + write) / 2;
        this.delete("takachi");
        return {
            read: `${read}ms`,
            write: `${write}ms`,
            average: `${average}ms`,
        };
    }

    public get(key: string): any {
        if (!key) throw new DataError("Please specify a valid key.");
        return get(this.cache, key);
    }

    public fetch(key: string): any {
        return this.get(key);
    }

    public has(key: string): boolean {
        if (!key) throw new DataError("Please specify a valid key.");
        return has(this.cache, key);
    }

    public set(key: string, value: any, options: WriteOptions = { write: true, pretty: true }): any {
        if (!key) throw new DataError("Please specify a valid key.");
        if (typeof value !== "boolean" && value !== 0 && !value) throw new DataError("Please specify a valid value.");
        set(this.cache, key, value);
        if (options.write) this.write(options);
        return true;
    }

    public add(key: string, count: number, options: WriteOptions): any {
        if (!key) throw new DataError("Please specify a valid key.");
        if (!count) throw new DataError("Please specify a valid count.");
        const data = get(this.cache, key) || 0;
        if (isNaN(data as number)) throw new DataError("Data is not a number.");
        this.set(key, (data as number) + count, options);
        return this.get(key);
    }

    public delete(key: string, options: WriteOptions = { write: true, pretty: true }): boolean {
        if (!key) throw new DataError("Please specify a valid key.");
        unset(this.cache, key);
        if (options.write) this.write(options);
        return true;
    }

    public push(key: string, el: any, options: WriteOptions): any {
        if (!key) throw new DataError("Please specify a valid key.");
        if (el !== 0 && !el && typeof el !== "boolean") throw new DataError("Please specify a valid element to push.");
        const data = get(this.cache, key) || [];
        if (!Array.isArray(data)) throw new DataError("Data is not an array.");
        data.push(el);
        this.set(key, data, options);
        return this.get(key);
    }

    public pull(key: string, el: any, options: WriteOptions): boolean {
        if (!key) throw new DataError("Please specify a valid key.");
        if (el !== 0 && !el && typeof el !== "boolean") throw new DataError("Please specify a valid element to pull.");
        const data = get(this.cache, key) || [];
        if (!Array.isArray(data)) throw new DataError("Data is not an array.");
        const newData = data.filter((x) => x !== el);
        this.set(key, newData, options);
        return true;
    }

    public all(): Record<string, unknown> {
        return this.cache;
    }

    public clear(): boolean {
        this.cache = {};
        this.write();
        return true;
    }

    public subtract(key: string, count: number, options: WriteOptions): any {
        if (!key) throw new DataError("Please specify a valid key.");
        if (!count) throw new DataError("Please specify a valid count.");
        const data = get(this.cache, key) || 0;
        if (isNaN(data as number)) throw new DataError("Data is not a number.");
        this.set(key, (data as number) - count, options);
        return this.get(key);
    }

    public remove(key: string, options: WriteOptions = { write: true, pretty: true }): boolean {
        if (!key) throw new DataError("Please specify a valid key.");
        delete this.cache[key];
        if (options.write) this.write(options);
        return true;
    }

    public findOneAndUpdate(key: string, updateFn: (value: any) => any, options: WriteOptions): any {
        if (!key) throw new DataError("Please specify a valid key.");
        const currentValue = this.get(key);
        if (currentValue === undefined) throw new DataError("Key not found in database.");
        const updatedValue = updateFn(currentValue);
        this.set(key, updatedValue, options);
        return updatedValue;
    }

    public increment(key: string, options: WriteOptions = { write: true, pretty: true }): number {
        if (!key) throw new DataError("Please specify a valid key.");
        const data = get(this.cache, key) || 0;
        if (isNaN(data as number)) throw new DataError("Data is not a number.");
        const incrementedValue = (data as number) + 1;
        this.set(key, incrementedValue, options);
        return incrementedValue;
    }

    public unpush(key: string, el: any, options: WriteOptions): boolean {
        if (!key) throw new DataError("Please specify a valid key.");
        if (el !== 0 && !el && typeof el !== "boolean") throw new DataError("Please specify a valid element to unpush.");
        const data = get(this.cache, key) || [];
        if (!Array.isArray(data)) throw new DataError("Data is not an array.");
        const index = data.indexOf(el);
        if (index === -1) throw new DataError("Element not found in array.");
        data.splice(index, 1);
        this.set(key, data, options);
        return true;
    }
}
