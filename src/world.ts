import { Camera } from "./camera";
import { Color } from "./color";
import {
    Bobber,
    OverlayHider,
    LightMovementController,
    MovementController,
    RotationController,
    Spinner,
} from "./component";
import { Entity } from "./entity";
import { EntityFactory } from "./entity_factory";
import { Light } from "./light";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Primitive } from "./primitive";
import { RenderState } from "./render_state";
import { TextureFactory } from "./texture_factory";
import { Vector3 } from "./vector3";

/**
 * The main container for the scene. Includes every visible and updateable object that the user can see/interact with.
 */
class World {
    private constructor(private entities: Array<Entity> = []) {}

    /**
     * Create and return the world and attach the relevant components to the camera.
     * @param gl The WebGL context.
     * @param camera The main camera.
     * @returns The fully initialized world.
     */
    public static create(gl: WebGL2RenderingContext, camera: Camera, light: Light): World {
        // Create the pivot, or the object around which the camera moves and rotates
        let pivot: Entity = new Entity();
        pivot.addComponent(new RotationController(Math.PI / 2, Math.PI / 2, Math.PI / 2, pivot.rotation));

        // Initialize the camera
        camera.parent = pivot;
        camera.translation = new Vector3(0, 0, 6);
        camera.addComponent(new MovementController(10, camera.translation));

        // Initialize the light
        light.translation = new Vector3(1.1, 0.75, 2.5);
        light.ambient = new Vector3(0.125, 0.125, 0.125);
        light.diffuse = new Vector3(0.9, 0.9, 0.9);
        light.specular = new Vector3(0.5, 0.5, 0.5);
        light.addComponent(new LightMovementController(10, light.translation));

        // Create the "sun"
        let sun: Entity = EntityFactory.createSphere(gl, new Material());
        let sunMaterial: Material = sun.getComponent<Primitive>(Primitive.isPrimitive).material;
        sunMaterial.emission = Color.white;
        sunMaterial.shininess = 1.0;
        sun.scale = Vector3.multiply(Vector3.one, 0.1);
        sun.parent = light;

        // Create the cube
        let cube: Entity = EntityFactory.createCube(gl, Material.fromDiffuse(Color.white));
        cube.scale = Vector3.multiply(Vector3.one, 0.5);
        cube.addComponent(new Bobber(0, 2, 0, -1, 0.125));
        cube.addComponent(new Spinner(0, 0.25, 0));
        let cubeMaterial: Material = cube.getComponent<Primitive>(Primitive.isPrimitive).material;
        cubeMaterial.albedo = TextureFactory.createTextureFromSource(gl, require("../res/container.jpg"));

        // Create the cylinder, which is attached to the cube
        let cylinder: Entity = EntityFactory.createCylinder(gl, Material.fromDiffuse(Color.fromInt8(245, 239, 235)));
        cylinder.parent = cube;
        cylinder.translation = Vector3.multiply(Vector3.up, 4);
        cylinder.scale = Vector3.multiply(Vector3.one, 0.5);
        cylinder.addComponent(new Spinner(0, 2, 1.4));
        let cylinderMaterial: Material = cylinder.getComponent<Primitive>(Primitive.isPrimitive).material;
        cylinderMaterial.shininess = Material.MAX_SHININESS;

        // Load the sphere texture
        let sphereTexture: WebGLTexture = TextureFactory.createTextureFromSource(gl, require("../res/tile.jpg"));

        // Create the spheres, which orbit around the cylinder
        let spheres: Array<Entity> = [];
        let distanceFromCylinder: number = 3;
        let numberOfSpheres: number = 8;
        let color1: Color = Color.fromInt8(211, 71, 61);
        let color2: Color = Color.fromInt8(134, 188, 209);
        for (let i = 0; i < numberOfSpheres; i++) {
            let radians: number = 2 * Math.PI * (i / numberOfSpheres);
            let offset: Vector3 = new Vector3(Math.cos(radians), Math.sin(radians), 0);
            let translation: Vector3 = Vector3.multiply(offset, distanceFromCylinder);
            let color: Color;
            if (i === 0) {
                color = color1;
            } else {
                color = Color.lerp(color2, color1, Math.abs(Math.PI - radians) / Math.PI);
            }

            let currentSphere: Entity = EntityFactory.createSphere(gl, Material.fromDiffuse(color));
            currentSphere.parent = cylinder;
            currentSphere.translation = translation;
            currentSphere.addComponent(new Bobber(-10, 10, translation.x, translation.y, 0.125, i));

            let currentSphereMaterial: Material = currentSphere.getComponent<Primitive>(Primitive.isPrimitive).material;
            currentSphereMaterial.albedo = sphereTexture;
            currentSphereMaterial.shininess = 16.0;

            spheres.push(currentSphere);
        }

        // Create the teapot
        let teapot: Entity = new Entity();
        teapot.parent = cube;
        let teapotMesh: Mesh = require("../res/mesh_teapot.json");
        teapot.addComponent(
            Primitive.create(
                gl,
                teapotMesh.vertices,
                teapotMesh.indices,
                teapotMesh.normals,
                teapotMesh.texCoords,
                Material.fromDiffuse(Color.fromInt8(246, 173, 15))
            )
        );
        teapot.scale = Vector3.multiply(Vector3.one, 0.05);
        teapot.translation = new Vector3(0, 1.333, 0);
        let teapotMaterial: Material = teapot.getComponent<Primitive>(Primitive.isPrimitive).material;
        teapotMaterial.shininess = 48.0;

        // Create the overlay hider
        let overlayHider: Entity = new Entity();
        overlayHider.addComponent(
            new OverlayHider(document.getElementById("show-overlay"), document.getElementById("hide-overlay"))
        );

        // Return the world with all its components
        return new World(spheres.concat([camera, cube, cylinder, pivot, teapot, light, sun, overlayHider]));
    }

    /**
     * Update every entity in the world.
     * @param delta The elapsed time since the last frame.
     */
    public update(delta: number): void {
        this.entities.forEach((entity) => {
            entity.update(delta);
        });
    }

    /**
     * Render every visible entity in the world.
     * @param gl The WebGL context.
     * @param renderState The render state.
     */
    public render(gl: WebGL2RenderingContext, renderState: RenderState): void {
        this.entities.forEach((entity) => {
            entity.render(gl, renderState);
        });
    }

    /**
     * Add the given entity to the world.
     * @param entity The entity to add.
     */
    public addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    /**
     * Add each of the entities in the given list to the world.
     * @param entities The list of entities to add.
     */
    public addEntities(entities: Array<Entity>): void {
        entities.forEach((entity) => {
            this.addEntity(entity);
        });
    }
}

export { World };
