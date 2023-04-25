/**
 * A 3D vector. Some methods borrowed from glMatrix, at https://glmatrix.net/.
 */
class Vector3 extends Float32Array {
    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    public static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public static copy(a: Vector3): Vector3 {
        return new Vector3(a.x, a.y, a.z);
    }

    public static distance(a: Vector3, b: Vector3): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    }

    public static multiply(a: Vector3, b: number): Vector3 {
        return new Vector3(a.x * b, a.y * b, a.z * b);
    }

    /**
     * Return a vector with each component being a random number between 0 and 1, all scaled by the given scale factor.
     * @param scale The number to multiply by for each component of the resultant vector.
     * @returns A vector with randomized components.
     */
    public static random(scale: number = 1): Vector3 {
        return new Vector3(Math.random() * scale, Math.random() * scale, Math.random() * scale);
    }

    public add(a: Vector3): void {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    public multiply(a: number): void {
        this.x *= a;
        this.y *= a;
        this.z *= a;
    }

    /**
     * Normalize this vector so that its magnitude is 1 (or 0 if this is the zero vector).
     */
    public normalize(): void {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
        }
        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;
    }

    public subtract(a: Vector3): void {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    /**
     * (0, 0, 0)
     */
    public static get zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    /**
     * (1, 1, 1)
     */
    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /**
     * (1, 0, 0)
     */
    public static get right(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    /**
     * (0, 1, 0)
     */
    public static get up(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    /**
     * (0, 0, 1)
     */
    public static get forward(): Vector3 {
        return new Vector3(0, 0, 1);
    }

    public get magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    public get x(): number {
        return this[0];
    }

    public set x(dx: number) {
        this[0] = dx;
    }

    public get y(): number {
        return this[1];
    }

    public set y(dy: number) {
        this[1] = dy;
    }

    public get z(): number {
        return this[2];
    }

    public set z(dz: number) {
        this[2] = dz;
    }
}

export { Vector3 };
