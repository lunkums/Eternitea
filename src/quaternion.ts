/**
 * A quaternion for representing rotations.
 */
class Quaternion extends Float32Array {
    public constructor() {
        super(new Float32Array(4));
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 1;
    }

    public static copy(q: Quaternion): Quaternion {
        let r: Quaternion = new Quaternion();
        r[0] = q[0];
        r[1] = q[1];
        r[2] = q[2];
        r[3] = q[3];
        return r;
    }

    public static fromEuler(x: number, y: number, z: number): Quaternion {
        let out: Quaternion = new Quaternion();
        let halfToRad = (0.5 * Math.PI) / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        return out;
    }

    public static get identity(): Quaternion {
        return new Quaternion();
    }

    public rotateX(radians: number): void {
        radians *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bx = Math.sin(radians),
            bw = Math.cos(radians);
        this[0] = ax * bw + aw * bx;
        this[1] = ay * bw + az * bx;
        this[2] = az * bw - ay * bx;
        this[3] = aw * bw - ax * bx;
    }

    public rotateY(radians: number): void {
        radians *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let by = Math.sin(radians),
            bw = Math.cos(radians);
        this[0] = ax * bw - az * by;
        this[1] = ay * bw + aw * by;
        this[2] = az * bw + ax * by;
        this[3] = aw * bw - ay * by;
    }

    public rotateZ(radians: number): void {
        radians *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bz = Math.sin(radians),
            bw = Math.cos(radians);
        this[0] = ax * bw + ay * bz;
        this[1] = ay * bw - ax * bz;
        this[2] = az * bw + aw * bz;
        this[3] = aw * bw - az * bz;
    }
}

export { Quaternion };
