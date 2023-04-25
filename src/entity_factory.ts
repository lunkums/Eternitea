import { ComponentFactory } from "./component_factory";
import { Entity } from "./entity";
import { Material } from "./material";

/**
 * A collection of functions that create entities with specific components attached.
 */
namespace EntityFactory {
    export function createCube(gl: WebGL2RenderingContext, material: Material): Entity {
        let spinner: Entity = new Entity([ComponentFactory.createCube(gl, 1, material)]);
        return spinner;
    }

    export function createCylinder(gl: WebGL2RenderingContext, material: Material): Entity {
        let cylinder: Entity = new Entity([ComponentFactory.createCylinder(gl, 1, 1, 2, 36, 1, material)]);
        return cylinder;
    }

    export function createSphere(gl: WebGL2RenderingContext, material: Material): Entity {
        let sphere: Entity = new Entity([ComponentFactory.createSphere(gl, 0.75, 18, 18, material)]);
        return sphere;
    }
}

export { EntityFactory };
