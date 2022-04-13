/**
 * Each Point represents a point on the canvas to draw a color.
 * It has a color, x, y, width, and height.
 * @property {string} color hexadecimal color code
 * @property {number} x x coordinate of the point
 * @property {number} y y coordinate of the point
 * @property {number} w width of the point
 * @property {number} h height of the point
 */
export interface Point {
    color: string;
    x: number;
    y: number;
    w: number;
    h: number;
}