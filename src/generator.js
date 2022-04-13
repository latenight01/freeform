
class InfluenceRect {
    constructor(x, y, w, h, r, g, b, power) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.g = g;
        this.b = b;
        this.power = power;
        this.min = { x: x - w / 2, y: y - h / 2 };
        this.max = { x: x + w / 2, y: y + h / 2 };
    }

    updateBounds() {
        this.min.x = this.x - this.w / 2;
        this.min.y = this.y - this.h / 2;
        this.max.x = this.x + this.w / 2;
        this.max.y = this.y + this.h / 2;
    }

    distance(x, y) {
        var dx = Math.max(this.min.x - x, 0, x - this.max.x);
        var dy = Math.max(this.min.y - y, 0, y - this.max.y);

        if (dx == 0 && dy == 0) {
            return 0;
        } else {
            return Math.sqrt(dx * dx + dy * dy);
        }
    }
}

class InfluencePoint {
    constructor(x, y, r, g, b, power) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.power = power;
    }

    distance(x, y) {
        let deltaX = this.x - x;
        let deltaY = this.y - y;
        let distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (distanceSquared == 0) {
            return 0;
        } else {
            return Math.sqrt(distanceSquared);
        }
    }
}

class FreeformGradient {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.points = [];
        this.pointElements = [];
        this.offsetX = 0;
        this.offsetY = 0;

        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        this.lastImageData = null;
        this.imageOverlay = null;

        this.reOffset();
    }

    // used to calc canvas position relative to window
    reOffset() {
        this.offsetX = 0;
        this.offsetY = 0;
    }

    generate(points, imageOverlay) {
        this.points = [];
        this.pointElements = points;
        this.imageOverlay = imageOverlay;

        for (const point of points) {
            const { color } = point;
            const x = parseFloat(point.x);
            const y = parseFloat(point.y);
            const w = parseFloat(point.w);
            const h = parseFloat(point.h);
            const power = -parseFloat(point.power || 1.0);

            let r = 0;
            let g = 0;
            let b = 0;

            // HEX to RGB
            if (color.length == 7) {
                r = parseInt(color.substr(1, 2), 16);
                g = parseInt(color.substr(3, 2), 16);
                b = parseInt(color.substr(5, 2), 16);
            }

            if (w == 0 && h == 0) {
                this.points.push(new InfluencePoint(x, y, r, g, b, power));
            }
            else {
                this.points.push(new InfluenceRect(x, y, w, h, r, g, b, power));
            }
        }

        const drawGradient = !this.isDragging;
        if (drawGradient) {
            var imgData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

            const maxPowerValue = -2;

            let maxDistance = Math.pow(Math.sqrt(2), maxPowerValue);

            for (let cy = 0; cy < this.canvas.height; cy++) {
                let rowIndex = cy * (this.canvas.width * 4);
                let y = 1.0 / this.canvas.height * cy;

                for (let cx = 0; cx < this.canvas.width; cx++) {
                    let columnIndex = rowIndex + cx * 4;
                    let x = 1.0 / this.canvas.width * cx;

                    let totalInfluence = 0;

                    for (const point of this.points) {
                        const rawDistance = point.distance(x, y);
                        let distance = rawDistance > 0 ? Math.pow(rawDistance, point.power) : 0;
                        totalInfluence += Math.abs(maxDistance - distance);
                    }

                    for (const point of this.points) {
                        const rawDistance = point.distance(x, y);
                        let distance = rawDistance > 0 ? Math.pow(rawDistance, point.power) : 0;
                        let influence = Math.abs(maxDistance - distance);
                        let weighting = (1.0 / totalInfluence * influence);

                        if (distance == 0) {
                            weighting = 1.0;
                        }

                        imgData.data[columnIndex + 0] += point.r * weighting;
                        imgData.data[columnIndex + 1] += point.g * weighting;
                        imgData.data[columnIndex + 2] += point.b * weighting;

                        imgData.data[columnIndex + 3] = 255;
                    }
                }
            }

            // Stamp the rect points over the final image as we don't want their centres being
            // influenced by any other colors.
            for (const point of this.points) {
                if (point instanceof InfluenceRect) {
                    const startX = Math.max(0, Math.floor(point.min.x * this.canvas.width));
                    const startY = Math.max(0, Math.floor(point.min.y * this.canvas.height));
                    const endX = Math.min(this.canvas.width - 1, Math.floor(point.max.x * this.canvas.width));
                    const endY = Math.min(this.canvas.height - 1, Math.floor(point.max.y * this.canvas.height));

                    for (let cy = startY; cy <= endY; cy++) {
                        let rowIndex = cy * (this.canvas.width * 4);

                        for (let cx = startX; cx <= endX; cx++) {
                            let columnIndex = rowIndex + cx * 4;

                            imgData.data[columnIndex + 0] = point.r;
                            imgData.data[columnIndex + 1] = point.g;
                            imgData.data[columnIndex + 2] = point.b;
                        }
                    }
                }
                else if (point instanceof InfluencePoint) {
                    const cx = Math.floor(point.x * this.canvas.width);
                    const cy = Math.floor(point.y * this.canvas.height);

                    let rowIndex = cy * (this.canvas.width * 4);
                    let columnIndex = rowIndex + cx * 4;

                    imgData.data[columnIndex + 0] = point.r;
                    imgData.data[columnIndex + 1] = point.g;
                    imgData.data[columnIndex + 2] = point.b;
                }
            }

            this.lastImageData = imgData;
            this.ctx.putImageData(imgData, 0, 0);
        }
        else {
            this.ctx.putImageData(this.lastImageData, 0, 0);
        }

        if (this.imageOverlay) {
            this.ctx.drawImage(this.imageOverlay, 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

module.exports = { FreeformGradient };