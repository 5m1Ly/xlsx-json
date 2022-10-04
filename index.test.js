// load third party package
const { join } = require("node:path");

// load our packages
const XlsxHandler = require("./index.js");

// get the path of the uploads folder
const filepath = join(__dirname, "uploads");

// preset the default options
const defaultOptions = {
    dateFormat: "dd/mm/yyyy"
}

// schema of the dummy files
const dummySchemas = {
    "1. Point of origin": {
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

let logged = 0

// test work file schema
const sheetOptions = {
    "1. Point of origin": {
        schema: {
            "Supplier code": {
                prop: "id",
                type: String
            },
            "Supplier name": {
                prop: "name",
                type: String
            },
            "Adress": {
                prop: "adress",
                type: String
            },
            "Zip": {
                prop: "zip",
                type: String
            },
            "Place": {
                prop: "place",
                type: String
            },
            "Distance  in KM": {
                prop: "place",
                type: String
            },
            "Self declaration": {
                prop: "place",
                type: String
            },
            "Valid until": {
                prop: "place",
                type: String
            },
            "Contract ": {
                prop: "place",
                type: String
            },
            "": {
                prop: "rnum1",
                type: String
            },
            "Sustainable YES/NO": {
                prop: "sustainable",
                type: String
            },
            "": {
                prop: "rnum2",
                type: String
            },
            "Material \"IN\"": {
                prop: "rnum2",
                type: String
            },
            "Material Code": {
                prop: "rnum",
                type: String
            },
            "": {
                prop: "empt",
                type: String
            },
        }
    },
    // "2. Inbound data 2022": {},
    // "3. Conversion ": {},
    // "4. Month Balance": {},
    // "5. Clients": {},
    // "6. Outbound data 2022": {}
}

const xlsxHandler = new XlsxHandler(filepath, defaultOptions)

const test = (async () => {

    const res = await xlsxHandler.fetch("Test_work_file_MB_CNSL_1.xlsx", sheetOptions)
    
    console.log(res["1. Point of origin"].result[0])
    console.log(res["1. Point of origin"].result[1])

})()
