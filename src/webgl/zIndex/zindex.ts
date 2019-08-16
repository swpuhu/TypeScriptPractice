import Util from '../glUtil';

const vertexShader = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    uniform mat4 u_matrix;
    void main () {
        float zToDivide = 1.0 + a_position.z * 0.1;
        vec4 position = u_matrix * a_position;
        gl_Position = vec4(position.xy / zToDivide, position.zw);
        v_color = a_color;
    }
`;

const fragmentShader = `
    precision mediump float;
    varying vec4 v_color;
    void main () {
        gl_FragColor = v_color;
    }
`;

const points = new Float32Array([
    0, 0, 10, 1,
    300, 300, 10, 1,
    300, 0, 10, 1,
    100, 150, 0, 1,
    400, 450, 0, 1,
    400, 150, 0, 1,
]);


const colors = new Float32Array([
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 0.2, 0.5, 1.0,
    1.0, 0.2, 0.5, 1.0,
    1.0, 0.2, 0.5, 1.0, 
])
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
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 4, gl.FLOAT, false, 0, 0);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    let a_color = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(a_color);
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);
    
    let u_matrix = gl.getUniformLocation(program, 'u_matrix');
    let uMat = util.orthographic(0, canvas.width, canvas.height, 0, 100, -100);
    gl.uniformMatrix4fv(u_matrix, false, uMat);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

}