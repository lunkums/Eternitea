import { Color } from "./color";

/**
 * A material represented as a float array of length 10.
 */
class Material extends Float32Array {
    public static readonly MAX_SHININESS: number = 128.0;
    public static readonly MIN_SHININESS: number = 0.00001;

    public albedo: WebGLTexture = null;

    public constructor(
        ambient: number[] = [1.0, 1.0, 1.0],
        diffuse: number[] = [1.0, 1.0, 1.0],
        specular: number[] = [1.0, 1.0, 1.0],
        emission: number[] = [0.0, 0.0, 0.0],
        shininess: number = 16.0
    ) {
        super(13);
        this[0] = ambient[0];
        this[1] = ambient[1];
        this[2] = ambient[2];
        this[3] = diffuse[0];
        this[4] = diffuse[1];
        this[5] = diffuse[2];
        this[6] = specular[0];
        this[7] = specular[1];
        this[8] = specular[2];
        this[9] = emission[0];
        this[10] = emission[1];
        this[11] = emission[2];
        this[12] = shininess;
    }

    /**
     * Creates and returns a material with default values.
     */
    public static get default(): Material {
        return new Material();
    }

    /**
     * Creates a material using the specified color for the diffuse component.
     * @param diffuse The color to use for the diffuse component.
     * @returns A material with the specified color for the diffuse component.
     */
    public static fromDiffuse(diffuse: Color): Material {
        let material: Material = new Material();
        material.diffuse = diffuse;
        return material;
    }

    /*
     * Properties
     */

    public get diffuse(): Color {
        return new Color(this[3], this[4], this[5]);
    }

    public set diffuse(value: Color) {
        this[3] = value.red;
        this[4] = value.green;
        this[5] = value.blue;
    }

    public set emission(value: Color) {
        this[9] = value.red;
        this[10] = value.green;
        this[11] = value.blue;
    }

    public set shininess(value: number) {
        // Clamp the shininess value to the range [0.00001, 128.0]
        this[12] = Math.max(Material.MIN_SHININESS, Math.min(Material.MAX_SHININESS, value));
    }

    public get shininess(): number {
        return this[12];
    }
}

export { Material };
