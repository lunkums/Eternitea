import { Entity } from "./entity";
import { Matrix4 } from "./matrix4";

/**
 * Determines the view matrix of the scene.
 */
class Camera extends Entity {
    public constructor(private fovy: number, public aspect: number, private near: number, private far: number) {
        super();
    }

    /**
     * Create a new camera.
     * @param gl The WebGL context.
     * @returns A new camera.
     */
    public static create(gl: WebGL2RenderingContext): Camera {
        const fovy: number = (45 * Math.PI) / 180;
        const aspect: number = gl.canvas.width / gl.canvas.height;
        const near: number = 0.1;
        const far: number = 100.0;

        return new Camera(fovy, aspect, near, far);
    }

    public get view(): Matrix4 {
        return this.transformation.inverse();
    }

    public get projection(): Matrix4 {
        return Matrix4.perspective(this.fovy, this.aspect, this.near, this.far);
    }

    public get viewProjection(): Matrix4 {
        return Matrix4.multiply(this.projection, this.view);
    }
}

export { Camera };
