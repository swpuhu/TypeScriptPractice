import TextRange from '../../components/TextRange';
import '../../css/style.css';


let canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 640;
canvas.height = 360;
let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

interface Point {
    x: number,
    y: number
}

function lerp(min: number, max: number, t: number) {
    return min + (max - min) * t;
}

let radius = 5;
let bezierPoints: Point[] = [];

function drawLine(points: Point[], t: number) {
    if (points.length === 1) {
        let p = points[0];
        ctx.fillStyle = '#ff0022';
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        bezierPoints.push(p);
    } else {
        
        ctx.fillStyle = '#3ee6cd';
        ctx.beginPath();
        for (let p of points) {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            
        }
        ctx.fill();
        ctx.lineJoin = 'miter';
        let nextPoints:Point[] = [];
        ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
            let cur = points[i];
            let nextItem = points[i + 1];
            ctx.moveTo(cur.x, cur.y);
            ctx.lineTo(nextItem.x, nextItem.y);
            if (t) {
                nextPoints.push({
                    x: lerp(cur.x, nextItem.x, t),
                    y: lerp(cur.y, nextItem.y, t)
                })
            }
            ctx.stroke();
        }
        drawLine(nextPoints, t);
    }
}

let points: Point[] = [
    {x: 20, y: 20},
    {x: 300, y: 20},
    {x: 300, y: 300},
    {x: 640, y: 300},
    {x: 640, y: 20}
];


function calcPoint (points: Point[], t: number): Point {
    if (points.length === 1) {
        let p = points[0];
        return {
            x: p.x,
            y: p.y
        }
    } else {
        let nextPoints:Point[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            let cur = points[i];
            let nextItem = points[i + 1];
            if (t) {
                nextPoints.push({
                    x: lerp(cur.x, nextItem.x, t),
                    y: lerp(cur.y, nextItem.y, t)
                })
            }
        }
        return calcPoint(nextPoints, t);
    }
}

function drawPoints(points: Point[]) {
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
        let curPoint = points[i];
        let nextPoint = points[i + 1];
        ctx.moveTo(curPoint.x, curPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
    }
    ctx.stroke();
}

export default function () {
    let progress = new TextRange('Progress', 0, 1, 0.01, 0);
    progress.onchange = function (value) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        drawLine(points, value);
        ctx.strokeStyle = '#ff0022';
        drawPoints(bezierPoints);
        let result = calcPoint(points, value);
        console.log(result);
    }
    document.body.appendChild(progress.ref);
    // drawLine(points, 0.1);
}