export default {
    vertexShader: `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec3 a_normal;
        varying vec3 v_normal;
        uniform mat4 u_matrix;
        varying vec4 v_color;
        uniform mat4 u_world;
        uniform mat4 u_worldViewProjection;
        void main() {
            gl_Position = u_matrix * a_position;
            v_color = a_color;
            v_normal = mat3(u_world) * a_normal;
        }
    `,
    fragmentShader: `
        precision mediump float;
        varying vec4 v_color;
        varying vec3 v_normal;
        uniform vec3 u_reverseLightDirection;
        void main() {
            vec3 normal = normalize(v_normal);
            float light = dot(normal, u_reverseLightDirection);
            gl_FragColor = v_color;
            gl_FragColor.rgb *= light;
        }
    `
}