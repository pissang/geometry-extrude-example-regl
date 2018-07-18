import createRegl from 'regl';
import {extrudePolygon} from 'geometry-extrude';
import canvasOrbitCamera from'canvas-orbit-camera';
import mat4 from 'gl-mat4';
import * as dat from 'dat.gui';
import buildStarPolygon from './buildStarPolygon';

const config = {
    bevelSize: 0.2,
    bevelSegments: 2,
    smoothBevel: false,
    n: 5
};

const canvas = document.createElement('canvas');
const viewport = document.querySelector('#viewport');
viewport.appendChild(canvas);
canvas.width = viewport.clientWidth;
canvas.height = viewport.clientHeight;

const regl = createRegl({
    canvas: canvas
});
const camera = canvasOrbitCamera(canvas);
camera.lookAt([0, 0, 20], [0, 0, 0], [0, 1, 0]);

const positionBuffer = regl.buffer([]);
const normalBuffer = regl.buffer([]);
const indicesBuffer = regl.elements([]);

const draw = regl({
    vert: `
precision mediump float;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection, view, model;

varying vec3 vNormal;

void main() {
    gl_Position = projection * view * model * vec4(position, 1.0);
    vNormal = normal;
}
    `,
    frag: `
precision mediump float;

varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(vNormal, 1.0);
}
    `,
    uniforms: {
        projection: ({viewportWidth, viewportHeight}) =>
            mat4.perspective([], Math.PI / 4, viewportWidth / viewportHeight, 0.01, 1000),
        model: (_, props, batchId) => mat4.identity([]),
        view: () => camera.view()
    },
    attributes: {
        position: positionBuffer,
        normal: normalBuffer
    },
    elements: indicesBuffer
});

function updateBuffer() {
    const {position, indices, normal} = extrudePolygon([buildStarPolygon(config.n)], {
        depth: 2,
        smoothBevel: config.smoothBevel,
        bevelSize: config.bevelSize,
        bevelSegments: config.bevelSegments
    });
    positionBuffer({
        data: position
    });
    normalBuffer({
        data: normal
    });
    indicesBuffer({
        data: indices
    });
}

updateBuffer();

regl.frame(_ => {
    draw();
    camera.tick();
});


const ui = new dat.GUI();
ui.add(config, 'n', 3, 20).step(1).onChange(updateBuffer);
ui.add(config, 'bevelSize', 0, 1).onChange(updateBuffer);
ui.add(config, 'bevelSegments', 0, 10).step(1).onChange(updateBuffer);
ui.add(config, 'smoothBevel').onChange(updateBuffer);