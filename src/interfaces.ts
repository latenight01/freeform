/**
 * Each Point represents a point on the canvas to draw a color.
 * It has a color, x, y, width, and height.
 * @property {string} color hexadecimal color code
 * @property {number} power power of the color
 * @property {number} x x coordinate of the point
 * @property {number} y y coordinate of the point
 * @property {number} w width of the point
 * @property {number} h height of the point
 */
export interface Point {
    color: string;
    power: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Options for the generator
 * @property {string[]} colors array of hexadecimal color codes
 * @property {number} width width of the canvas
 * @property {number} height height of the canvas
 * @property {Point[]} points detailed points to draw on the canvas
 * @property {boolean} save whether to save the canvas to a file
 * @property {string} file path to save the canvas to
 */
export interface GradientOptions {
    colors: string[];
    width?: number;
    height?: number;
    points?: Point[];
    save?: boolean;
    file?: string;
}