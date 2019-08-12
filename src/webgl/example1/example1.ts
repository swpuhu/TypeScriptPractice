import SHADER from './shader';
import Util from '../glUtil';
import TextRange from '../../components/TextRange';
import vertex from '../vertexPoints';
export default function () {

    function arc2radians(arc: number) {
        return Math.PI / 180 * arc;
    }


    function createInterface() {
        let perspective = new TextRange('fieldOfView', 1, 179, 1, 60);
        let translateX = new TextRange('translateX', -200, canvas.width, 1, -150);
        let translateY = new TextRange('translateY', -200, canvas.height, 1, 0);
        let translateZ = new TextRange('translateZ', -1000, 1, 1, -360);
        let xRotate = new TextRange('xRotate', 0, 360, 1, 40);
        let yRotate = new TextRange('yRotate', 0, 360, 1, 25);
        let zRotate = new TextRange('zRotate', 0, 360, 1, 325);
        let scaleX = new TextRange('scaleX', -2, 2, 0.01, 1);
        let scaleY = new TextRange('scaleY', -2, 2, 0.01, 1);
        let scaleZ = new TextRange('scaleZ', -2, 2, 0.01, 1);

        perspective.onchange = function (value: number) {
            perspectiveMat = util.perspective(arc2radians(value), aspect, zNear, zFar);
            gl.uniformMatrix4fv(u_perspectiveMat, false, perspectiveMat);
            draw();
        }

        translateX.onchange = function (value: number) {
            translateMat = util.translation(translateX.value, translateY.value, translateZ.value);
            gl.uniformMatrix4fv(u_TranslateMat, false, translateMat);
            draw();
        }

        translateY.onchange = function (value: number) {
            translateMat = util.translation(translateX.value, translateY.value, translateZ.value);
            gl.uniformMatrix4fv(u_TranslateMat, false, translateMat);
            draw();
        }

        translateZ.onchange = function (value: number) {
            translateMat = util.translation(translateX.value, translateY.value, translateZ.value);
            gl.uniformMatrix4fv(u_TranslateMat, false, translateMat);
            draw();
        }

        xRotate.onchange = function (value: number) {
            xRotationMat = util.xRotation(arc2radians(value));
            gl.uniformMatrix4fv(u_xRotateMat, false, xRotationMat);
            draw();
        }

        yRotate.onchange = function (value: number) {
            yRotateMat = util.yRotation(arc2radians(value));
            gl.uniformMatrix4fv(u_yRotateMat, false, yRotateMat);
            draw();
        }

        zRotate.onchange = function (value: number) {
            zRotateMat = util.zRotation(arc2radians(value));
            gl.uniformMatrix4fv(u_zRotateMat, false, zRotateMat);
            draw();
        }

        scaleX.onchange = function (value: number) {
            scaleMat = util.scalling(scaleX.value, scaleY.value, scaleZ.value);
            gl.uniformMatrix4fv(u_scaleMat, false, scaleMat);
            draw();
        }

        scaleY.onchange = function (value: number) {
            scaleMat = util.scalling(scaleX.value, scaleY.value, scaleZ.value);
            gl.uniformMatrix4fv(u_scaleMat, false, scaleMat);
            draw();
        }

        scaleZ.onchange = function (value: number) {
            scaleMat = util.scalling(scaleX.value, scaleY.value, scaleZ.value);
            gl.uniformMatrix4fv(u_scaleMat, false, scaleMat);
            draw();
        }

        document.body.appendChild(perspective.ref);
        document.body.appendChild(translateX.ref);
        document.body.appendChild(translateY.ref);
        document.body.appendChild(translateZ.ref);
        document.body.appendChild(xRotate.ref);
        document.body.appendChild(yRotate.ref);
        document.body.appendChild(zRotate.ref);
        document.body.appendChild(scaleX.ref);
        document.body.appendChild(scaleY.ref);
        document.body.appendChild(scaleZ.ref);
        return {
            perspective: perspective,
            translateX: translateX,
            translateY: translateY,
            translateZ: translateZ,
            xRotate: xRotate,
            yRotate: yRotate,
            zRotate: zRotate,
            scaleX: scaleX,
            scaleY: scaleY,
            scaleZ: scaleZ
        }
    }

    function draw(): void {
        gl.drawArrays(gl.TRIANGLES, 0, 96);
    }

    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let UI = createInterface();

    canvas.width = 640;
    canvas.height = 360;
    let VERTEX_SHADER = SHADER.vertexShader;
    let FRAGMENT_SHADER = SHADER.fragmentShader;

    let gl = canvas.getContext('webgl') as WebGLRenderingContext;
    let util = new Util(gl);
    let program = util.initProgram(VERTEX_SHADER, FRAGMENT_SHADER) as WebGLProgram;
    gl.useProgram(program);

    let aspect = canvas.width / canvas.height;
    let zNear = 1;
    let zFar = 2000;
    let perspectiveMat = util.perspective(arc2radians(UI.perspective.value), aspect, zNear, zFar);
    let translateMat = util.translation(UI.translateX.value, UI.translateY.value, UI.translateZ.value);
    let xRotationMat = util.xRotation(arc2radians(UI.xRotate.value));
    let yRotateMat = util.yRotation(arc2radians(UI.yRotate.value));
    let zRotateMat = util.zRotation(arc2radians(UI.zRotate.value));
    let scaleMat = util.scalling(UI.scaleX.value, UI.scaleY.value, UI.scaleZ.value);
    let fudgeMat = util.makeZToWMatrix(2);

    let projectionMat = util.orthographic(0, canvas.width, canvas.height, 0, 400, -400);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.coord, gl.STATIC_DRAW);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // let color = vertex.color.map(item => item / 255);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.color, gl.STATIC_DRAW);


    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);


    let aColor = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(aColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    let u_TranslateMat = gl.getUniformLocation(program, 'u_translateMat');
    gl.uniformMatrix4fv(u_TranslateMat, false, translateMat);

    let u_xRotateMat = gl.getUniformLocation(program, 'u_xRotateMat');
    gl.uniformMatrix4fv(u_xRotateMat, false, xRotationMat);


    let u_yRotateMat = gl.getUniformLocation(program, 'u_yRotateMat');
    gl.uniformMatrix4fv(u_yRotateMat, false, yRotateMat);

    let u_zRotateMat = gl.getUniformLocation(program, 'u_zRotateMat');
    gl.uniformMatrix4fv(u_zRotateMat, false, zRotateMat);

    let u_scaleMat = gl.getUniformLocation(program, 'u_scaleMat');
    gl.uniformMatrix4fv(u_scaleMat, false, scaleMat);

    let u_perspectiveMat = gl.getUniformLocation(program, 'u_perspectiveMat');
    gl.uniformMatrix4fv(u_perspectiveMat, false, perspectiveMat);

    let projection = gl.getUniformLocation(program, 'projection');
    gl.uniformMatrix4fv(projection, false, projectionMat);

    let u_makeZToWMatrix = gl.getUniformLocation(program, 'u_makeZToWMatrix');
    gl.uniformMatrix4fv(u_makeZToWMatrix, false, fudgeMat);
    draw();

}