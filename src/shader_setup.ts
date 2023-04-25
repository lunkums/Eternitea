/**
 * Create a WebGL shader of the specified type, upload the source and compile it.
 * @param gl The WebGL2 rendering context.
 * @param type The type of shader to create.
 * @param source The source code of the shader.
 * @returns A WebGL shader of the specified type, containing the compiled source.
 */
function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    let shader: WebGLShader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

/**
 * Create a WebGL program containing the compiled vertex and fragment shaders.
 * @param gl The WebGL2 rendering context.
 * @param fragmentShaderSource The source code of the fragment shader.
 * @param vertexShaderSource The source code of the vertex shader.
 * @returns A WebGL program containing the compiled vertex and fragment shaders.
 */
function initShaderProgram(
    gl: WebGL2RenderingContext,
    fragmentShaderSource: string,
    vertexShaderSource: string
): WebGLProgram {
    let shaderProgram = gl.createProgram();

    let vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return shaderProgram;
}

export { initShaderProgram };
