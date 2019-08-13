import '../css/style.css';


let canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 640;
canvas.height = 360;
let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
let image = new Image();
image.src = '../../assets/2222.png'
image.onload = function () {
    ctx.fillStyle = '#000';
    ctx.drawImage(image, 0, 0);
    let sourceData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    render();
    // let data = sourceData.data;
    // for (let i = 0; i < data.length; i += 4) {
    //     let YUV = RGB2YUV([data[i], data[i + 1], data[i + 2]]);
    //     let RGB = YUV2RGB(YUV);
    //     data[i] = RGB[0];
    //     data[i + 1] = RGB[1];
    //     data[i + 2] = RGB[2];
    // }
    // ctx.putImageData(sourceData, 0, 0);
}


function deg2radians(deg: number) {
    return deg * Math.PI / 180;
}

function dot(a: number[], b: number[]) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
let cos = Math.cos;
let sin = Math.sin;

function clamp(n:number, l:number, r:number) {
    if (n < l) {
        n = l;
    } else if (n > r) {
        n = r;
    }
    return n;
}


function lerp(source: number[], target: number[], factor: number):number[] {
    let ret:number[] = [];
    for (let i = 0; i < source.length; i++) {
        ret[i] = source[i] + (target[i] - source[i]) * factor;
    }
    return ret;
}

function YUV2RGB(pYUV: number[]) {
    let pRGB: number[] = [];
    let matYUV2RGBA_SD = [
        [1.0    , 0.0       , 1.401978  ],
        [1.0    , -0.344116 , -0.714111 ],
        [1.0    , 1.771973  , 0.0       ]
    ];
    for (let i = 0; i < 3; i++) {
        pRGB[i] = pYUV[0] * matYUV2RGBA_SD[i][0] + (pYUV[1] - 128) * matYUV2RGBA_SD[i][1] + (pYUV[2] - 128) * matYUV2RGBA_SD[i][2];
    }
    return pRGB;
}

function RGB2YUV(pRGB: number[]) {
    let pYUV: number[] = [];
    let matRGB2YUV_SD = [
        [0.29895    , 0.587036  , 0.114014  ],
        [-0.168701  , -0.331299 , 0.5       ],
        [0.5        , -0.418701 , -0.081299 ]
    ];
    for (let i = 0; i < 3; i++) {
        pYUV[i] = pRGB[0] * matRGB2YUV_SD[i][0] + pRGB[1] * matRGB2YUV_SD[i][1] + pRGB[2] * matRGB2YUV_SD[i][2];
    }
    pYUV[1] += 128;
    pYUV[2] += 128;
    return pYUV;
}



let vLightDir = [sin(deg2radians(135)), -sin(deg2radians(135)), cos(deg2radians(135)), -cos(deg2radians(135))];

function EmbossRender(__embossFacotor: number, vLuDir: number[], srcColor: number[], lightClr: number[], shadowColor: number[]) {
    // if (vLuDir[0] !== 0) {
    //     debugger;
    // }
    let d = dot(vLuDir, vLightDir) / 255;
    let retColor = [0, 0, 0, 0];
    d = clamp(d * __embossFacotor, -1, 1);

    if (d > 0) {
        retColor = lerp(srcColor, lightClr, d);
    } else {
        retColor = lerp(srcColor, shadowColor, d);
    }
    return retColor;
}



function render() {
    let sourceData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let iWidthCount = sourceData.width * 4;
    for (let y = 0; y < sourceData.height; y++) {
        for (let x = 0; x < sourceData.width; x += 4) {
            let lrud = [];
            let index = y * iWidthCount + x;
            let bLeft = (x === 0);
            let bRight = ((x + 4) === iWidthCount);
            let bUp = (y === 0);
            let bDown = (y === sourceData.height - 1);

            let nL = bLeft ? index : index - 4;
            let nR = bRight ? index : index + 4;
            let nU = bUp ? index : ((y - 1) * iWidthCount + x);
            let nD = bDown ? index : ((y + 1) * iWidthCount + x);
            
            let RGB0 = [sourceData.data[index], sourceData.data[index + 1], sourceData.data[index + 2]];
            let RGBL = [sourceData.data[nL], sourceData.data[nL + 1], sourceData.data[nL + 2]];
            let RGBR = [sourceData.data[nR], sourceData.data[nR + 1], sourceData.data[nR + 2]];
            let RGBU = [sourceData.data[nU], sourceData.data[nU + 1], sourceData.data[nU + 2]];
            let RGBD = [sourceData.data[nD], sourceData.data[nD + 1], sourceData.data[nD + 2]];
            let YUV0 = RGB2YUV(RGB0);
            let YUVL = RGB2YUV(RGBL);
            let YUVR = RGB2YUV(RGBR);
            let YUVU = RGB2YUV(RGBU);
            let YUVD = RGB2YUV(RGBD);

            lrud[0] = YUV0[0] - YUVL[0];
            lrud[1] = YUV0[0] - YUVR[0];
            lrud[2] = YUV0[0] - YUVU[0];
            lrud[3] = YUV0[0] - YUVD[0];

            let pDesRGB = EmbossRender(1, lrud, RGB0, [255, 0, 0], [0, 255, 0]);

            sourceData.data[index] = pDesRGB[0];
            sourceData.data[index + 1] = pDesRGB[1];
            sourceData.data[index + 2] = pDesRGB[2];
        }
    }
    ctx.putImageData(sourceData, 0, 0);
}