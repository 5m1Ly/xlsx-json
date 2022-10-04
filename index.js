const { existsSync, readdirSync, statSync } = require("node:fs");
const { join } = require("node:path");
const { runInThisContext } = require("node:vm");
const readXlsxFile = { readSheetNames } = require('read-excel-file/node');

class File {

    sheets = [];

    constructor(path, file) {

        // set file metadata
        this.path = join(path, file);
        this.fullname = file;
        this.name = file.replace(".xlsx", "");
        this.stats = statSync(this.path);

    }

    read = (sheet, options) => new Promise(async r => {

        if (!this.sheets[sheet] || options.override)
            this.sheets[sheet] = await readXlsxFile(this.path, { sheet })

        return r(this.sheets[sheet])

    })

    fetch = async (sheetOptions, options) => {

        // if the tab names are unset fetch them from the file
        if (!this.tabs) this.tabs = await readSheetNames(this.path);

        // get keys and map them to load the sheets within a file
        const sheets = Object.keys(sheetOptions);
        
        await Promise.all(sheets.map(async name => {

            const sheet = sheetOptions[name]

            // check if the sheet exists
            if (!this.tabs.includes(name)) {
                console.error("the given schema list contains a schema for a sheet (tab) that doesn't exist")
                return false
            }

            // set constant equal to the options so it doesnt point to the outside of the function
            const opt = options;

            // add the schema of the current given sheet to the options
            opt.sheet = name
            opt.schema = sheet.schema

            // read the current sheet within the curren file
            sheet.result = await this.read(name, opt)

            sheetOptions[name] = sheet

        }))

        return sheetOptions;

    }



}

module.exports = class XlsxHandler {

    files = [];

    /**
     * @param {String} path the path of the folder containing the xlsx files
     * @param {Object} options default options used by all files
     */
    constructor(path, options) {

        this.path = path;
        this.options = options;

        if (!existsSync(this.path)) {
            console.error("given xlsx folder doesn't exist")
            process.exit(1)
        }

        readdirSync(this.path)
            .filter(file => file.endsWith(".xlsx"))
            .map(file => this.preload(file, false))

    }

    /**
     * @param {String} file file name
     * @param {Boolean} override override current instance of file
     * @returns {Object} instance of the File class
     */
    preload = (file, override) => new Promise(async r => {

        // if you call doesn't want to override and there allready
        // exists an inctance we resolve the current instance
        if (!this.files[file] || override) {

            // initialize a new file class for the given file
            this.files[file] = new File(this.path, file)

        }

        // resolve the file instance
        return r(this.files[file])

    })

    /**
     * @param {String} file file name
     * @param {Object} schemas object containing an
     * @returns {Object} contains the file content
     */
    fetch = (file, schemas) => new Promise(async r => {
         
        // make sure the file is loaded
        const f = await this.preload(file, false);

        // fetch the content of the file
        const result = f.fetch(schemas, this.options)

        // resolve the results
        return r(result)

    })

}
