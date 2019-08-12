import SHADER from './example2Shader';
import Util from '../glUtil';
import vertex from '../vertexPoints';
import TextRange from '../../components/TextRange';

export default function () {

    let canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.width = 640;
    canvas.height = 360;
    let VERTEX_SHADER = SHADER.vertexShader;
    let FRAGMENT_SHADER = SHADER.fragmentShader;

    let gl = canvas.getContext('webgl') as WebGLRenderingContext;
    let util = new Util(gl);
    let program = util.initProgram(VERTEX_SHADER, FRAGMENT_SHADER) as WebGLProgram;
    gl.useProgram(program);

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.coord, gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);


    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.color, gl.STATIC_DRAW);
    let a_color = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(a_color);
    gl.vertexAttribPointer(a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.normal, gl.STATIC_DRAW);
    let a_normal = gl.getAttribLocation(program, 'a_normal');
    gl.enableVertexAttribArray(a_normal);
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

    let reverseLightDirection = gl.getUniformLocation(program, 'u_reverseLightDirection');
    let direction = new Float32Array(util.normalize([200, 300, 1]));
    gl.uniform3fv(reverseLightDirection, direction);

    let u_worldViewProjection = gl.getUniformLocation(program, 'u_worldViewProjection');
    let u_world = gl.getUniformLocation(program, 'u_world');
    let u_matrix = gl.getUniformLocation(program, 'u_matrix');

    let cameraAngleRadians = util.degToRad(0);
    let fieldOfViewRadians = util.degToRad(100);
    let fRotationRadians = 0;

    let controller = new TextRange('cameraAngle', -360, 360, 1, 0);
    document.body.appendChild(controller.ref);
    controller.onchange = function (value: number) {
        cameraAngleRadians = util.degToRad(value);
        drawScene();
    }
    let then = 0;
    let rotationSpeed = 30;
    function animation (now: number) {
        now = now * 0.001;
        let delta = now - then;
        cameraAngleRadians = util.degToRad(rotationSpeed * delta);
        requestAnimationFrame(animation);
        drawScene();
    }

    drawScene();



    function drawScene() {
        let numFs = 5;
        let radius = 200;
        let aspect = canvas.width / canvas.height;
        let zNear = 1;
        let zFar = 2000;
        let projectionMatrix = util.perspective(fieldOfViewRadians, aspect, zNear, zFar);
        let fPosition = [radius, 0, 0];
        let cameraPosition = [0, 0, 1, 1];
        let cameraMatrix = util.yRotation(cameraAngleRadians);
        let worldMat = util.yRotation(fRotationRadians);
        let worldViewProjectMat = util.multiply(projectionMatrix, worldMat);
        gl.uniformMatrix4fv(u_world, false, worldMat);
        gl.uniformMatrix4fv(u_worldViewProjection, false, worldViewProjectMat);
        cameraMatrix = util.multiply(cameraMatrix, util.translation(50, 50, radius * 1.5));
        cameraPosition = util.vectorMultiply(cameraPosition, cameraMatrix);
        cameraPosition = [
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2]
        ];
        let up = [0, 1, 0];
        cameraMatrix = util.lookAt(cameraPosition, fPosition, up);
        let viewMatrix = util.inverse(cameraMatrix);

        let viewProjectionMatrix = util.multiply(projectionMatrix, viewMatrix);



        for (let i = 0; i < numFs; i++) {
            let angle = i * Math.PI * 2 / numFs;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;

            let matrix = util.multiply(viewProjectionMatrix, util.translation(x, 0, y));
            gl.uniformMatrix4fv(u_matrix, false, matrix);
            gl.drawArrays(gl.TRIANGLES, 0, 96);
        }

    }

}