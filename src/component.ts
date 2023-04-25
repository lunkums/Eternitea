import { Entity } from "./entity";
import { Input } from "./input";
import { Quaternion } from "./quaternion";
import { RenderState } from "./render_state";
import { Vector3 } from "./vector3";

/**
 * Encapsulates reusable update and render logic for entities.
 */
abstract class Component {
    public update(delta: number, entity: Entity): void {}

    public render(gl: WebGL2RenderingContext, renderState: RenderState, entity: Entity): void {}
}

/**
 * Spins an entity along each axis by the given speed.
 */
class Spinner extends Component {
    private xSpeed: number;
    private ySpeed: number;
    private zSpeed: number;

    public constructor(xSpeed: number, ySpeed: number, zSpeed: number) {
        super();
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.zSpeed = zSpeed;
    }

    public update(delta: number, entity: Entity): void {
        entity.rotateX(this.xSpeed * delta);
        entity.rotateY(this.ySpeed * delta);
        entity.rotateZ(this.zSpeed * delta);
    }
}

/**
 * Bobs an entity along the x and y axes by the given speed and within the specified bounds.
 */
class Bobber extends Component {
    private time: number;
    private xSpeed: number;
    private ySpeed: number;
    private xInitial: number;
    private yInitial: number;
    private amplitude: number;

    public constructor(
        xSpeed: number,
        ySpeed: number,
        xInitial: number,
        yInitial: number,
        amplitude: number,
        phase: number = 0
    ) {
        super();
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.xInitial = xInitial;
        this.yInitial = yInitial;
        this.amplitude = amplitude;
        this.time = phase;
    }

    public update(delta: number, entity: Entity): void {
        this.time += delta;
        entity.translation = new Vector3(
            this.xInitial + this.amplitude * Math.sin(this.time * this.xSpeed),
            this.yInitial + this.amplitude * Math.sin(this.time * this.ySpeed),
            entity.translation.z
        );
    }
}

/**
 * Updates the yaw, pitch, and roll of an entity based on user input.
 */
class RotationController extends Component {
    private yawSpeed: number;
    private pitchSpeed: number;
    private rollSpeed: number;
    private initialRotation: Quaternion;

    public constructor(yawSpeed: number, pitchSpeed: number, rollSpeed: number, initialRotation: Quaternion) {
        super();
        this.yawSpeed = yawSpeed;
        this.pitchSpeed = pitchSpeed;
        this.rollSpeed = rollSpeed;
        this.initialRotation = Quaternion.copy(initialRotation);
    }

    public update(delta: number, entity: Entity): void {
        if (Input.isActionDown("yaw") && Input.isActionDown("shift")) {
            entity.rotateX(this.yawSpeed * delta);
        } else if (Input.isActionDown("yaw")) {
            entity.rotateX(-this.yawSpeed * delta);
        }
        if (Input.isActionDown("pitch") && Input.isActionDown("shift")) {
            entity.rotateY(this.pitchSpeed * delta);
        } else if (Input.isActionDown("pitch")) {
            entity.rotateY(-this.pitchSpeed * delta);
        }
        if (Input.isActionDown("roll") && Input.isActionDown("shift")) {
            entity.rotateZ(this.rollSpeed * delta);
        } else if (Input.isActionDown("roll")) {
            entity.rotateZ(-this.rollSpeed * delta);
        }

        if (Input.isActionDown("reset")) {
            entity.rotation = Quaternion.copy(this.initialRotation);
        }
    }
}

/**
 * Moves an entity along the x and z axes based on user input.
 */
class MovementController extends Component {
    private speed: number;
    private initialTranslation: Vector3;

    public constructor(speed: number, initialTranslation: Vector3) {
        super();
        this.speed = speed;
        this.initialTranslation = Vector3.copy(initialTranslation);
    }

    public update(delta: number, entity: Entity): void {
        let direction: Vector3 = Vector3.zero;
        if (Input.isActionDown("moveForward")) {
            direction.subtract(Vector3.forward);
        }
        if (Input.isActionDown("moveBack")) {
            direction.add(Vector3.forward);
        }
        if (Input.isActionDown("moveLeft")) {
            direction.subtract(Vector3.right);
        }
        if (Input.isActionDown("moveRight")) {
            direction.add(Vector3.right);
        }
        direction.normalize();
        entity.translate(Vector3.multiply(direction, delta * this.speed));

        if (Input.isActionDown("reset")) {
            entity.translation = Vector3.copy(this.initialTranslation);
        }
    }
}

/**
 * Moves an entity along the x and z axes based on user input.
 */
class LightMovementController extends Component {
    private speed: number;
    private initialTranslation: Vector3;

    public constructor(speed: number, initialTranslation: Vector3) {
        super();
        this.speed = speed;
        this.initialTranslation = Vector3.copy(initialTranslation);
    }

    public update(delta: number, entity: Entity): void {
        let direction: Vector3 = Vector3.zero;
        if (Input.isActionDown("lightMoveForward")) {
            direction.subtract(Vector3.forward);
        }
        if (Input.isActionDown("lightMoveBack")) {
            direction.add(Vector3.forward);
        }
        if (Input.isActionDown("lightMoveLeft")) {
            direction.subtract(Vector3.right);
        }
        if (Input.isActionDown("lightMoveRight")) {
            direction.add(Vector3.right);
        }
        if (Input.isActionDown("lightMoveUp")) {
            direction.add(Vector3.up);
        }
        if (Input.isActionDown("lightMoveDown")) {
            direction.subtract(Vector3.up);
        }
        direction.normalize();
        entity.translate(Vector3.multiply(direction, delta * this.speed));

        if (Input.isActionDown("reset")) {
            entity.translation = Vector3.copy(this.initialTranslation);
        }
    }
}

class OverlayHider extends Component {
    private showDisplayStyle: string;

    public constructor(
        private showElement: HTMLElement,
        private hideElement: HTMLElement,
        private startHidden: boolean = true
    ) {
        super();
        this.showDisplayStyle = "";
        this.hide(startHidden);
    }

    public update(delta: number, entity: Entity): void {
        if (Input.isActionDown("hudToggle")) {
            this.hide(Input.isActionDown("shift") == this.startHidden);
        }
    }

    private hide(hidden: boolean): void {
        if (hidden) {
            this.showElement.style.display = "none";
            this.hideElement.style.display = this.showDisplayStyle;
        } else {
            this.hideElement.style.display = "none";
            this.showElement.style.display = this.showDisplayStyle;
        }
    }
}

export { Component, Spinner, Bobber, RotationController, MovementController, LightMovementController, OverlayHider };
