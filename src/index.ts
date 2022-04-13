import { Canvas, createCanvas } from "canvas"
import fs from "fs"
import { Point } from "./types"
const { FreeformGradient } = require("./generator")

/**
 * Saves a canvas to an image file
 * @param {Canvas} canvas canvas element to save
 * @param {String} file file name/path
 */
function save_canvas_image(canvas: Canvas, file: string = "./out.png") {
    const format = file.split(".").pop()
    const buffer = canvas.toBuffer()
    fs.writeFileSync(file, buffer)
}

/**
 * 
 * @param colors hexadecimal color codes to include in the gradient
 * @returns {Point[]} array of points to draw on the canvas
 */
function get_default_points(colors: string[]): Point[] {
    const defaultPoints = [
        { color: colors[0], x: 0.1, y: 0.3, w: 0, h: 0 },
        { color: colors[1], x: 0.95, y: 0.5, w: 0, h: 0 },
        { color: colors[2], x: 0.5, y: 0.95, w: 0, h: 0 },
    ]
    return defaultPoints
}

/**
 * 
 * @param {string[]} colors hexadecimal color codes to include in the gradient
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 * @param {Point[]} points optional array of points to draw on the canvas
 * @param {boolean} save whether to save the canvas to a file
 * @param {string} path path to save the canvas to
 */
function generate_freeform(colors: string[], width: number, height: number, points?: Point[], save?: boolean, path: string = "./out.png") {
    const canvas = createCanvas(width, height)
    const ffg = new FreeformGradient(canvas)
    ffg.generate(points || get_default_points(colors));
    if (save) {
        save_canvas_image(canvas, path)
    }
    return canvas
}