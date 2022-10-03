const { readdirSync, existsSync } = require("node:fs")
const { join } = require("node:path")
const { } = require('read-excel-file/node');

const errors = (src = "core") => {

    const error = {
        source: src,
        label: `[xlsx_reader:error:${src}] `,
        count: 0
    }

    return (info, ...args) => {

        const message = typeof info === "string" ? info : "unkown error occured";
        const details = [...args].length > 0 ? "| details >>" : "";
        const baseErr = `${error.label} ${message}`

        console.log(`${baseErr} ${details}`, ...args)

        error.count++;

        return baseErr

    }

}

class Cache {

    e = errors("cache")
    cache = []

    constructor() {}

    store = (key, val, override) => {
        if (this.cache[key] && !override)
            return this.e("there is allready a value stored at the location of the given key set the third parameter to true if you want to override the currently cached value")
        this.cache[key] = val;
    }

    fetch = key => new Promise((resolve, reject) => {
        const r = (reason, ...args) => reject(this.e(reason, ...args))
        try {
            if (!this.cache[key])
                return r("there isn't any value stored at the location of the given key")
            else
                resolve(this.cache[key])
        } catch (error) { r("catch error", error) }
    })

}

class Queue {

    e = errors("queue")
    list = [];

    constructor(core) {
        this.core = core;
    }

    count = () => this.list.length;

    add = value => this.list.push(value);

    next = () => new Promise((resolve, reject) => {
        const r = (reason, ...args) => reject(this.e(reason, ...args))
        try {
            if (this.count() == 0)
                return r("the queue is empty")
            else
                resolve(this.list.shift())
        } catch (error) { r("catch error", error) }
    })

}

class Folder {

    files = [];

    constructor(core, path) {
        this.core = core;
        this.path = path || __dirname;
    }

    read = async () => {
        this.files = readdirSync(this.path).filter(async f => f.endsWith(".xlsx"));
        if (this.files.length > 0)
            this.files.map(file => this.core.queue.add({
                path: join(this.path, file),
                read: false
            }))
    }

    get = async () => this.files;

}

class Xlsx {

    constructor(path, { readnow = false, options }) {
        
        this.cache = new Cache();
        
        this.queue = new Queue(this);

        this.folder = new Folder(this, path);

        this.reader = new Reader(this, options);

        if (readnow) this.fetchQueue()

    }

    fetchQueue = async () => {

        await this.folder.read()

        while (this.queue.count() > 0) {

            this.

        }

    }

}

new Xlsx("uploads", {
    readnow: true,
    options: {
        dateFormat: "dd/mm/yyyy",
        schema: {
            "First Name": {
                prop: "firstName",
                type: String
            },
            "Last Name": {
                prop: "lastName",
                type: String
            },
            "Gender": {
                prop: "gender",
                type: String
            },
            "Country": {
                prop: "country",
                type: String
            },
            "Age": {
                prop: "age",
                type: Number
            },
            "Date": {
                prop: "date",
                type: Date
            },
            "Id": {
                prop: "id",
                type: Number
            }
        }
    }
})