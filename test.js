const { generate_freeform } = require("./dist/index.js");

const colors = [
    "#40c260",
    "#878787",
    "#42524b"
]

const options = {
    colors,
    width: 200,
    height: 200,
    save: true,
}

const canvas = generate_freeform(options);