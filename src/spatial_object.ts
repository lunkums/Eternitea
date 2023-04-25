import { Matrix4 } from "./matrix4";
import { Quaternion } from "./quaternion";
import { Vector3 } from "./vector3";

/**
 * An object that exists within a 3D space.
 */
abstract class SpatialObject {
    public constructor(
        public rotation: Quaternion = Quaternion.identity,
        public translation: Vector3 = Vector3.zero,
        public scale: Vector3 = Vector3.one,
        public parent: SpatialObject = null
    ) {}

    public translate(a: Vector3): void {
        this.translation.add(a);
    }

    public rotateX(radians: number): void {
        this.rotation.rotateX(radians);
    }

    public rotateY(radians: number): void {
        this.rotation.rotateY(radians);
    }

    public rotateZ(radians: number): void {
        this.rotation.rotateZ(radians);
    }

    /*
     * Properties
     */

    public get worldTranslation(): Vector3 {
        return this.transformation.getTranslation();
    }

    public get transformation(): Matrix4 {
        if (this.parent == null) {
            return Matrix4.fromRotationTranslationScale(this.rotation, this.translation, this.scale);
        } else {
            return Matrix4.multiply(
                this.parent.transformation,
                Matrix4.fromRotationTranslationScale(this.rotation, this.translation, this.scale)
            );
        }
    }
}

export { SpatialObject };
