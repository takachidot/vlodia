"use strict";
import { set, get, has, unset } from "../util/lodash";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { DataError } from "../util/error";
import { WriteOptions } from "../types/types";
import parentModule from "parent-module";
import { absolute } from "../util/index";
import { isAbsolute, dirname, sep } from "path";

/**
 * @type Database
 */

export class Database {
    /**
	 * @type {string}
	 * @private
	 * @readonly
	 */
	private readonly dbFilePath: string;
	/**
	 * @type {object}
	 * @private
	 */
	private cache: Record<string, unknown>;

	/**
	 * @param {string} [file="database.json"] file
	 * @constructor
	 */
    constructor(file: string = "database.json") {
        file = file.endsWith(".json") ? file : `${file}.json`
        this.dbFilePath =
		file === "database.json" || isAbsolute(file) ? process.cwd() + sep + file : absolute(dirname(<string>parentModule()) + sep, file);
		this.cache = {};
        if(existsSync(this.dbFilePath)) this.cache = this.read();
        else writeFileSync(this.dbFilePath, "{}", "utf-8");
    }

    private read(): Record<string, unknown> {
		return JSON.parse(
			readFileSync(this.dbFilePath, { encoding: "utf-8" }) || "{}"
		);
	}
    	/**
	 * @param {WriteOptions} [options={ write: true, pretty: false }] options
	 * @returns {void}
	 */
    private write(
		options: WriteOptions = { write: true, pretty: false }
	): void {
		const str = options.pretty
			? JSON.stringify(this.cache, null, 2)
			: JSON.stringify(this.cache);
		writeFileSync(this.dbFilePath, str);
	}

    	/**
	 * @returns {number}
	 */
    private get _get(): number {
		const start = Date.now();
		this.get("takachi");
		return Date.now() - start;
	}

	/**
	 * @returns {number}
	 */
	private get _set(): number {
		const start = Date.now();
		this.set("takachi", "takachi");
		return Date.now() - start;
	}

	/**
	 * @returns {object}
	 */
	public get ping(): Record<string, unknown> {
		const read = this._get;
		const write = this._set;
		const average = (read + write) / 2;
		this.delete("takachi");
		return {
			read: `${read}ms`,
			write: `${write}ms`,
			average: `${average}ms`
		};
	}

    /**
     * @param {string} key
     * @return {any}
     */

    public get(key: string): any {
        if(!key) throw new DataError("Please specify a valid key.");
        else writeFileSync(this.dbFilePath, "{}", "utf-8")
    }

    /**
	 * @param {string} key
	 * @returns {any}
	 */

    public fetch(key: string): any {
            return this.get(key);
    }

	/**
	 * @param {string} key
	 * @returns {boolean}
	 */

    public has(key: string): boolean {
		if (!key) throw new DataError("Please specify a valid key.");
		return has(this.cache, key);
	}

    /**
     * @param {string} key
     * @param {any} value
     * @param {WriteOptions} [options={ write: true, pretty: false }] options
     * @returns {any} 
    */

    public set(key: string, value: any, options: WriteOptions = {
        write: true, pretty: false
    }
    ): any {
        if(!key) throw new DataError("Please specify a valid key.");
        if(typeof value !== "boolean" && value !== 0 && !value) throw new DataError("Please specify a valid value.");
        set(this.cache, key, value);
        if(options.write) this.write(options);
        return true;
    }


    /**
	 * @param {string} key
	 * @param {number} count
	 * @param {WriteOptions} options
	 * @returns {any}
	 */

    public add(key: string, count: number, options: WriteOptions): any {
        if (!key) throw new DataError("Please specify a valid key.");
		if (!count) throw new DataError("Please specify a valid count.");
		const data = get(this.cache, key) || 0;
		if (isNaN(<number>data)) throw new DataError("Data is not a number.");
		this.set(key, <number>data + count, options);
		return this.get(key);
    }
	/**
	 * @param {string} key
	 * @param {WriteOptions} [options={ write: true, pretty: false }] options
	 * @returns {boolean}
	 */
    public delete(
		key: string,
		options: WriteOptions = { write: true, pretty: false }
	): boolean {
		if (!key) throw new DataError("Please specify a valid key.");
		unset(this.cache, key);
		if (options.write) this.write(options);
		return true;
	}


    /**
	 * @param {string} key
	 * @param {any} el
	 * @param {WriteOptions} options
	 * @returns {any}
	 */

    public push(key: string, el: any, options: WriteOptions): any {
		if (!key) throw new DataError("Please specify a valid key.");
		if (el !== 0 && !el && typeof el !== "boolean")
			throw new DataError("Please specify a valid element to push.");
		const data = get(this.cache, key) || [];
		if (!Array.isArray(data))
			throw new DataError("Data is not an array");
		data.push(el);
		this.set(key, data, options);
		return this.get(key);
	}

	/**
	 * @param {string} key
	 * @param {any} el
	 * @param {WriteOptions} options
	 * @returns {boolean}
	 */
	public pull(key: string, el: any, options: WriteOptions): boolean {
		if (!key) throw new DataError("Please specify a valid key.");
		if (el !== 0 && !el && typeof el !== "boolean")
			throw new DataError("Please specify a valid element to pull.");
		const data = get(this.cache, key) || [];
		if (!Array.isArray(data)) throw new DataError("The data is not a array.");
		const newData = data.filter((x) => x !== el);
		this.set(key, newData, options);
		return this.get(key);
	}

	/**
	 * @returns {object}
	 */
	public all(): Record<string, unknown> {
		return this.cache;
	}

	/**
	 * @returns {boolean}
	 */
	public clear(): boolean {
		this.cache = {};
		this.write();
		return true;
	}

    /**
	 * @param {string} key
	 * @param {number} count
	 * @param {WriteOptions} options
	 * @returns {any}
	 */
	public subtract(key: string, count: number, options: WriteOptions): any {
		if (!key) throw new DataError("Please specify a valid key");
		if (!count) throw new DataError("Please specify a valid count");
		const data = get(this.cache, key) || 0;
		if (isNaN(<number>data))
			throw new DataError("Data is not a number");
		this.set(key, <number>data - count, options);
		return this.get(key);
	}
}