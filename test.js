const { generate_freeform } = require("./dist/index.js");

const colors = [
    "#40c260",
    "#878787",
    "#42524b"
]

const options = {
    colors,
    width: 500,
    height: 500,
    save: true,
}

const canvas = generate_freeform(options);