import { Camera } from "./camera";
import { Matrix4 } from "./matrix4";
import { RenderState } from "./render_state";
import { initShaderProgram } from "./shader_setup";

/**
 * A cube that is rendered around the camera, used to
 * simulate the sky and distant scenery. Most of this code is based on the code from
 * https://webgl2fundamentals.org/webgl/lessons/webgl-skybox.html.
 */
class Skybox {
    private constructor(
        private readonly program: WebGLProgram,
        private readonly vao: WebGLVertexArrayObject,
        private readonly textureUniform: WebGLUniformLocation,
        private readonly inverseVPMatrixUniform: WebGLUniformLocation
    ) {}

    /**
     * Create and return a new Skybox object.
     * @param gl The WebGL2 rendering context.
     * @returns A new Skybox object.
     */
    public static create(gl: WebGL2RenderingContext): Skybox {
        // Create the program
        let fragmentShaderSource: string = require("./shaders/skybox_fragment.glsl");
        let vertexShaderSource: string = require("./shaders/skybox_vertex.glsl");
        let program: WebGLProgram = initShaderProgram(gl, fragmentShaderSource, vertexShaderSource);

        // Get the locations of the uniforms
        let textureUniform: WebGLUniformLocation = gl.getUniformLocation(program, "u_Skybox");
        let inverseVPMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(
            program,
            "u_ViewDirectionProjectionInverse"
        );
        let positionLocation = gl.getAttribLocation(program, "a_Position");

        // Create a vertex array object (attribute state)
        let vao = gl.createVertexArray();

        // and make it the one we're currently working with
        gl.bindVertexArray(vao);

        // Create a buffer for positions
        let positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put the positions in the buffer
        let positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2; // 2 components per iteration
        let type = gl.FLOAT; // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        gl.bindVertexArray(null);

        Skybox.loadCubeMap(
            gl,
            require("../res/right.png"),
            require("../res/left.png"),
            require("../res/top.png"),
            require("../res/bottom.png"),
            require("../res/front.png"),
            require("../res/back.png")
        );

        return new Skybox(program, vao, textureUniform, inverseVPMatrixUniform);
    }

    /**
     * Render the skybox.
     * @param gl The WebGL2 rendering context.
     * @param renderState The current render state.
     */
    public render(gl: WebGL2RenderingContext, renderState: RenderState): void {
        // Tell it to use our program (pair of shaders)
        gl.useProgram(this.program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(this.vao);

        let camera: Camera = renderState.camera;

        let viewDirectionMatrix: Matrix4 = Matrix4.copy(camera.view);
        // Remove the translation
        viewDirectionMatrix[12] = 0;
        viewDirectionMatrix[13] = 0;
        viewDirectionMatrix[14] = 0;

        let viewDirectionProjectionMatrix: Matrix4 = Matrix4.multiply(camera.projection, viewDirectionMatrix);
        let viewDirectionProjectionInverseMatrix: Matrix4 = Matrix4.invert(viewDirectionProjectionMatrix);

        // Set the uniforms
        gl.uniformMatrix4fv(this.inverseVPMatrixUniform, false, viewDirectionProjectionInverseMatrix);

        // Tell the shader to use texture unit 0 for u_skybox
        gl.uniform1i(this.textureUniform, 0);

        // let our quad pass the depth test at 1.0
        gl.depthFunc(gl.LEQUAL);

        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

        gl.bindVertexArray(null);
    }

    /**
     * Load a cube map texture from 6 individual 2D image files.
     * @param gl The WebGL2 rendering context.
     * @param rightSource Image source for the right face.
     * @param leftSource Image source for the left face.
     * @param topSource Image source for the top face.
     * @param bottomSource Image source for the bottom face.
     * @param frontSource Image source for the front face.
     * @param backSource Image source for the back face.
     */
    private static loadCubeMap(
        gl: WebGL2RenderingContext,
        rightSource: string,
        leftSource: string,
        topSource: string,
        bottomSource: string,
        frontSource: string,
        backSource: string
    ): void {
        // Create a texture.
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        const faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: rightSource,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: leftSource,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: topSource,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: bottomSource,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: frontSource,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: backSource,
            },
        ];
        faceInfos.forEach((faceInfo) => {
            const { target, url } = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.crossOrigin = "";
            image.src = url;
            image.addEventListener("load", function () {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
}

export { Skybox };
