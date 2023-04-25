import { Camera } from "./camera";
import { Color } from "./color";
import { Light } from "./light";
import { initShaderProgram } from "./shader_setup";
import { Skybox } from "./skybox";

/**
 * Manages the state of render data that is shared between most objects in the scene.
 */
class RenderState {
    // Shader attributes
    public readonly positionVertexAttrib: number = 0;
    public readonly normalVertexAttrib: number = 1;
    public readonly texCoordVertexAttrib: number = 2;

    // Public uniform locations
    public readonly materialUniform: WebGLUniformLocation;
    public readonly modelMatrixUniform: WebGLUniformLocation;
    public readonly textureUniform: WebGLUniformLocation;

    // Internal uniform locations
    private viewMatrixUniform: WebGLUniformLocation;
    private projectionMatrixUniform: WebGLUniformLocation;
    private cameraPositionUniform: WebGLUniformLocation;
    private lightPositionUniform: WebGLUniformLocation;
    private lightAmbientUniform: WebGLUniformLocation;
    private lightDiffuseUniform: WebGLUniformLocation;
    private lightSpecularUniform: WebGLUniformLocation;

    // Internal state
    private mainCamera: Camera;
    private skybox: Skybox;
    private mainLight: Light;
    private shaderProgram: WebGLProgram;

    private constructor(gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) {
        this.shaderProgram = shaderProgram;

        // Initialize vertex attributes
        gl.enableVertexAttribArray(this.positionVertexAttrib);
        gl.enableVertexAttribArray(this.normalVertexAttrib);

        // Initialize the shader uniforms
        this.materialUniform = gl.getUniformLocation(this.shaderProgram, "u_Material");
        this.modelMatrixUniform = gl.getUniformLocation(this.shaderProgram, "u_ModelMatrix");
        this.textureUniform = gl.getUniformLocation(this.shaderProgram, "u_Texture");
        this.viewMatrixUniform = gl.getUniformLocation(this.shaderProgram, "u_ViewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgram, "u_ProjectionMatrix");
        this.cameraPositionUniform = gl.getUniformLocation(this.shaderProgram, "u_CameraPosition");
        this.lightPositionUniform = gl.getUniformLocation(this.shaderProgram, "u_LightPosition");
        this.lightAmbientUniform = gl.getUniformLocation(this.shaderProgram, "u_Light.ambient");
        this.lightDiffuseUniform = gl.getUniformLocation(this.shaderProgram, "u_Light.diffuse");
        this.lightSpecularUniform = gl.getUniformLocation(this.shaderProgram, "u_Light.specular");
    }

    public static create(gl: WebGL2RenderingContext, fragmentShaderSource: string, vertexShaderSource: string) {
        let shaderProgram: WebGLProgram = initShaderProgram(gl, fragmentShaderSource, vertexShaderSource);

        let renderState: RenderState = new RenderState(gl, shaderProgram);

        renderState.mainCamera = Camera.create(gl);
        renderState.skybox = Skybox.create(gl);
        renderState.mainLight = new Light();

        return renderState;
    }

    public begin(gl: WebGL2RenderingContext, clearColor: Color = Color.black): void {
        gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearColor.alpha);

        // Set the viewport and update the camera
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        this.mainCamera.aspect = gl.canvas.width / gl.canvas.height;

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render the skybox
        this.skybox.render(gl, this);

        // Set the default shader program
        gl.useProgram(this.shaderProgram);

        // Set the shader uniforms
        gl.uniformMatrix4fv(this.viewMatrixUniform, false, this.camera.view);
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, this.camera.projection);
        gl.uniform3fv(this.cameraPositionUniform, this.camera.worldTranslation);
        gl.uniform3fv(this.lightPositionUniform, this.light.translation);
        gl.uniform3fv(this.lightAmbientUniform, this.light.ambient);
        gl.uniform3fv(this.lightDiffuseUniform, this.light.diffuse);
        gl.uniform3fv(this.lightSpecularUniform, this.light.specular);
    }

    /*
     * Properties
     */

    public get camera(): Camera {
        return this.mainCamera;
    }

    public get light(): Light {
        return this.mainLight;
    }
}

export { RenderState };
