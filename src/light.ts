import { Entity } from "./entity";
import { Vector3 } from "./vector3";

/**
 * A light source.
 */
class Light extends Entity {
    public constructor(
        public ambient: Vector3 = new Vector3(0.1, 0.1, 0.1),
        public diffuse: Vector3 = new Vector3(0.9, 0.9, 0.9),
        public specular: Vector3 = new Vector3(0.5, 0.5, 0.5)
    ) {
        super();
    }
}

export { Light };
