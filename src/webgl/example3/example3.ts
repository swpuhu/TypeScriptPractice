import Util from '../glUtil';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';
import points from './points';
import texPoints from './texturePoints';

export default function () {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = 640;
    canvas.height = 360;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let util = new Util(gl);
    let program = util.initProgram(vertexShader, fragmentShader) as WebGLProgram;
    // gl.disable(gl.CULL_FACE);
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

    let u_matrix = gl.getUniformLocation(program, 'u_matrix');
    let uMatrix = util.orthographic(0, canvas.width * 2, canvas.height * 2, 0, -1000, 1000);
    let translation = util.translation(500, 50, 0);
    let xRotateMat = util.xRotation(60 * Math.PI / 180);
    let yRotateMat = util.yRotation(60 * Math.PI / 180);
    uMatrix = util.multiply(uMatrix, translation);
    uMatrix = util.multiply(uMatrix, xRotateMat);
    uMatrix = util.multiply(uMatrix, yRotateMat);
    gl.uniformMatrix4fv(u_matrix, false, uMatrix);


    let image = new Image();
    image.src = '../../assets/test.jpg';
    image.onload = function () {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}