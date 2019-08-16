import Util from '../glUtil';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';
import points from './points';
import texPoints from './texturePoints';
import TextRange from '../../components/TextRange';
import '../../css/style.css';

export default function () {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = 640;
    canvas.height = 360;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let util = new Util(gl);
    let program = util.initProgram(vertexShader, fragmentShader) as WebGLProgram;
    gl.useProgram(program);

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

    let texturePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPoints), gl.STATIC_DRAW);
    let a_texCoord = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(a_texCoord);
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let u_matrix, uMatrix: number[], translation: number[], xRotateMat: number[], yRotateMat: number[], zRotateMat: number[];
    let translateXDefault = 0;
    let translateYDefault = 0;
    let translateZDefault = 0;
    let xRotateDefault = 0;
    let yRotateDefault = 0;
    let zRotateDefault = 0;
    let cameraAngleRadians = 60 * Math.PI / 180;
    let cameraMatrix = util.yRotation(cameraAngleRadians);
    cameraMatrix = util.multiply(cameraMatrix, util.translation(0, 500, 2000));
    let viewMatrix = util.inverse(cameraMatrix);

    translation = util.translation(translateXDefault, translateYDefault, translateZDefault);
    xRotateMat = util.xRotation(xRotateDefault * Math.PI / 180);
    yRotateMat = util.yRotation(yRotateDefault * Math.PI / 180);
    zRotateMat = util.zRotation(zRotateDefault * Math.PI / 180);

    
    let fieldOfView = 60 * Math.PI / 180;
    let aspect = canvas.clientWidth / canvas.clientHeight;
    let zNear = 1;
    let zFar = -2000;
    uMatrix = util.perspective(fieldOfView, aspect, zNear, zFar);
    uMatrix = util.multiply(uMatrix, viewMatrix);


    function createUI() {
        let translateX = new TextRange('translateX', -canvas.width, canvas.width, 1, translateXDefault);
        let translateY = new TextRange('translateY', -canvas.height, canvas.height, 1, translateYDefault);
        let translateZ = new TextRange('translateZ', -2000, 1, 1, translateZDefault);
        let xRotate = new TextRange('xRotate', 0, 360, 1, xRotateDefault);
        let yRotate = new TextRange('yRotate', 0, 360, 1, yRotateDefault);
        let zRotate = new TextRange('zRotate', 0, 360, 1, zRotateDefault);
        translateX.onchange = translateY.onchange = translateZ.onchange = function () {
            translation = util.translation(translateX.value, translateY.value, translateZ.value);
            draw();
        }
        xRotate.onchange = function (value: number) {
            xRotateMat = util.xRotation(value * Math.PI / 180);
            draw();
        }
    
    
        yRotate.onchange = function (value: number) {
            yRotateMat = util.yRotation(value * Math.PI / 180);
            draw();
        }
    
    
        zRotate.onchange = function (value: number) {
            zRotateMat = util.zRotation(value * Math.PI / 180);
            draw();
        }
    
        document.body.appendChild(translateX.ref);
        document.body.appendChild(translateY.ref);
        document.body.appendChild(translateZ.ref);
        document.body.appendChild(xRotate.ref);
        document.body.appendChild(yRotate.ref);
        document.body.appendChild(zRotate.ref);

    }

    function createCameraUI() {
        let cameraRotate = new TextRange('cameraRotation', -360, 360, 1, 0);
        
        cameraRotate.onchange = function (value) {
            cameraAngleRadians = value * Math.PI / 180;
            drawScene(5);
        }
        document.body.appendChild(cameraRotate.ref);

    }

    createCameraUI();

    // createUI();

    let image = new Image();
    image.src = '/assets/blur.png';
    image.onload = function () {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        drawScene(5);
    }

    function draw() {
        u_matrix = gl.getUniformLocation(program, 'u_matrix');
        let viewMatrix = util.inverse(cameraMatrix);
        uMatrix = util.perspective(fieldOfView, aspect, zNear, zFar);
        uMatrix = util.multiply(uMatrix, viewMatrix);
        // uMatrix = util.orthographic(0, canvas.width * 2, canvas.height * 2, 0, -1000, 1000);
        uMatrix = util.multiply(uMatrix, translation);
        uMatrix = util.multiply(uMatrix, xRotateMat);
        uMatrix = util.multiply(uMatrix, yRotateMat);
        uMatrix = util.multiply(uMatrix, zRotateMat);
        gl.uniformMatrix4fv(u_matrix, false, uMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function drawScene(num: number) {
        let cos = Math.cos;
        let sin = Math.sin;
        let radius = 500;
        cameraMatrix = util.yRotation(cameraAngleRadians);
        cameraMatrix = util.multiply(cameraMatrix, util.translation(0, 500, 2000));
        for (let i = 0; i < num; i++) {
            let x = radius * cos(Math.PI * 2 / num * i);
            let y = radius * sin(Math.PI * 2 / num * i);
            translation = util.translation(x, 0, y);
            if (i === 0) {
                zRotateMat = util.zRotation(Math.PI / 180 * 30);
                draw();
            } else {
                zRotateMat = util.zRotation(Math.PI / 180 * 0);
                draw();
            }
        }
    }
}