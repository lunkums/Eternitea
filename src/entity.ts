import { Component } from "./component";
import { RenderState } from "./render_state";
import { SpatialObject } from "./spatial_object";

/**
 * A collection of components that can be rendered and updated.
 */
class Entity extends SpatialObject {
    public constructor(private components: Array<Component> = []) {
        super();
    }

    public update(delta: number): void {
        this.components.forEach((component) => {
            component.update(delta, this);
        });
    }

    public render(gl: WebGL2RenderingContext, renderState: RenderState): void {
        this.components.forEach((component) => {
            component.render(gl, renderState, this);
        });
    }

    /**
     * Add a component to this entity.
     * @param component The component to add.
     */
    public addComponent(component: Component): void {
        this.components.push(component);
    }

    /**
     * Get the first component of the given type.
     * @param isInstanceOf A function that returns true if the given component is of the desired type.
     * @returns The first component of the given type, or undefined if no such component exists.
     */
    public getComponent<T extends Component>(isInstanceOf: (component: Component) => component is T): T | undefined {
        return this.components.find(isInstanceOf);
    }
}

export { Entity };
