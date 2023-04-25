import { Component } from "./component";
import { Entity } from "./entity";
import { Input } from "./input";
import { Material } from "./material";
import { RenderState } from "./render_state";
import { TextureFactory } from "./texture_factory";

const FLOATS_PER_VERTEX: number = 3;
const FLOATS_PER_NORMAL: number = 3;
const FLOATS_PER_TEXTURE_COORD: number = 2;

/**
 * A primitive 3D object, such as a cube, sphere, or cylinder.
 */
class Primitive extends Component {
    public material: Material;

    private static DEFAULT_TEXTURE: WebGLTexture = null;

    private glDrawMode: number;
    private vertexBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;
    private normalBuffer: WebGLBuffer;
    private textureCoordBuffer: WebGLBuffer;
    private vertexCount: number;
    private wireframeEnabled: boolean;

    private constructor(
        drawMode: number,
        vertexBuffer: WebGLBuffer,
        indexBuffer: WebGLBuffer,
        normalBuffer: WebGLBuffer,
        textureCoordBuffer: WebGLBuffer,
        vertexCount: number,
        material: Material
    ) {
        super();
        this.glDrawMode = drawMode;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.normalBuffer = normalBuffer;
        this.textureCoordBuffer = textureCoordBuffer;
        this.vertexCount = vertexCount;
        this.material = material;
    }

    public static isPrimitive(component: Component): component is Primitive {
        return component instanceof Primitive;
    }

    public static create(
        gl: WebGL2RenderingContext,
        vertices: Array<number>,
        indices: Array<number>,
        normals: Array<number> = [],
        texCoords: Array<number> = [],
        material: Material = Material.default
    ): Primitive {
        // Load the default texture if it hasn't been loaded yet
        if (Primitive.DEFAULT_TEXTURE == null) {
            Primitive.DEFAULT_TEXTURE = TextureFactory.createDefaultTexture(gl);
        }

        if (material.albedo == null) {
            material.albedo = Primitive.DEFAULT_TEXTURE;
        }

        // Assemble the vertex buffer
        const vertexBuffer: WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Assembly the normal buffer
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        // Assemble the index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Assemble the texture coordinate buffer
        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        let component: Primitive = new Primitive(
            gl.TRIANGLES,
            vertexBuffer,
            indexBuffer,
            normalBuffer,
            texCoordBuffer,
            indices.length,
            material
        );
        return component;
    }

    public render(gl: WebGL2RenderingContext, renderState: RenderState, entity: Entity): void {
        // Set the position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(renderState.positionVertexAttrib, FLOATS_PER_VERTEX, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(renderState.positionVertexAttrib);

        // Set the normal attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(renderState.normalVertexAttrib, FLOATS_PER_NORMAL, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(renderState.normalVertexAttrib);

        // Set the texture coordinate attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(renderState.texCoordVertexAttrib, FLOATS_PER_TEXTURE_COORD, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(renderState.texCoordVertexAttrib);

        // Bind the index buffer (isn't associated with an attribute)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // Set any uniforms associated with this object
        gl.uniformMatrix4fv(renderState.modelMatrixUniform, false, entity.transformation);
        gl.uniform1fv(renderState.materialUniform, this.material);

        // Bind the texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.material.albedo);
        gl.uniform1i(renderState.textureUniform, 1);

        // Draw the object
        if (this.wireframeEnabled) {
            gl.drawElements(gl.LINE_STRIP, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawElements(this.glDrawMode, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        }
    }

    public update(delta: number, entity: Entity): void {
        if (Input.isActionDown("toggleWireframe") && !Input.isActionDown("shift")) {
            this.wireframeEnabled = true;
        }
        if (Input.isActionDown("toggleWireframe") && Input.isActionDown("shift")) {
            this.wireframeEnabled = false;
        }
        if (Input.isActionDown("reset")) {
            this.wireframeEnabled = false;
        }
    }
}

export { Primitive };
