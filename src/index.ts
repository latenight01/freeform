import { Canvas, createCanvas } from "canvas"
import fs from "fs"
import { GradientOptions, Point } from "./interfaces"
const { FreeformGradient } = require("./generator")

/**
 * Saves a canvas to an image file
 * @param {Canvas} canvas canvas element to save
 * @param {String} file file name/path
 */
function save_canvas_image(canvas: Canvas, file: string) {
    console.log(`Saving canvas image to ${file}`)
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
        { color: colors[0], power: 1, x: 0.1, y: 0.3, w: 0, h: 0 },
        { color: colors[1], power: 1, x: 0.95, y: 0.5, w: 0, h: 0 },
        { color: colors[2], power: 1, x: 0.5, y: 0.95, w: 0, h: 0 },
    ]
    return defaultPoints
}

/**
 * Generates a freeform gradient, returns the generated canvas
 * and optionally saves it to a file
 * @param {GradientOptions} options options for generating the gradient
 */
function generate_freeform(options: GradientOptions): Canvas {
    const { colors, width, height, points, save, file } = options;
    const canvas = createCanvas(width ?? 400, height ?? 400)
    const ffg = new FreeformGradient(canvas)
    let _points = points || get_default_points(colors)

    console.log(`Generating freeform gradient with ${_points.length} points in a ${width}x${height} canvas`);

    ffg.generate(_points);
    if (save) {
        save_canvas_image(canvas, file ?? `freeform_${width}x${height}.png`)
    }
    return canvas
}

export { generate_freeform }