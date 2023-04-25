import { Color } from "./color";
import { Input } from "./input";
import { RenderState } from "./render_state";
import "./styles/stylesheet.css";
import { World } from "./world";

// HTML elements
const canvas: HTMLCanvasElement = document.getElementById("code00-canvas") as HTMLCanvasElement;

// WebGL context
const gl: WebGL2RenderingContext = canvas.getContext("webgl2") as WebGL2RenderingContext;

// Globals
let world: World;
let renderState: RenderState;
let previousTime = 0;

main();

/**
 * Update the scene.
 * @param delta The time, in seconds, since the last call to update.
 */
function update(delta: number): void {
    world.update(delta);
}

/**
 * Render the scene, including all game objects in the world.
 */
function render(): void {
    let clearColor: Color = Color.fromInt8(46, 36, 63);
    renderState.begin(gl, clearColor);
    world.render(gl, renderState);
}

/**
 * Process a single animation frame.
 * @param time The number of milliseconds since the first call to this method.
 */
function tick(time: DOMHighResTimeStamp): void {
    // Calculate delta time
    let delta: number = (time - previousTime) * 0.001;
    previousTime = time;

    // Update and draw
    update(delta);
    render();

    // Loop
    requestAnimationFrame(tick);
}

/**
 * Start WebGL.
 */
function main(): void {
    if (!gl) {
        alert("Could not initialize WebGL");
        return;
    }

    // Load config files
    let inputConfig: object = require("../res/input.json");
    let fragmentSource: string = require("./shaders/fragment.glsl");
    let vertexSource: string = require("./shaders/vertex.glsl");

    // Initialize systems
    Input.initialize(inputConfig);
    renderState = RenderState.create(gl, fragmentSource, vertexSource);
    world = World.create(gl, renderState.camera, renderState.light);

    // Start the loop
    requestAnimationFrame(tick);
}
