export default {
    vertexShader: `
        attribute vec4 a_position;
        attribute vec4 a_color;
        varying vec4 v_color;
        uniform mat4 u_translateMat;
        uniform mat4 u_scaleMat;
        uniform mat4 u_xRotateMat;
        uniform mat4 u_yRotateMat;
        uniform mat4 u_zRotateMat;
        uniform mat4 u_perspectiveMat;
        uniform mat4 projection;
        uniform mat4 u_makeZToWMatrix;
        void main() {
            gl_Position = u_perspectiveMat * u_translateMat * u_xRotateMat * u_yRotateMat * u_zRotateMat * u_scaleMat * a_position;
            v_color = a_color;
        }
    `,
    fragmentShader: `
        precision mediump float;
        varying vec4 v_color;
        void main() {
            gl_FragColor = v_color;
        }
    `
}