import { Component } from "./component";
import { Cylinder } from "./cylinder";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Primitive } from "./primitive";
import { Sphere } from "./sphere";

/**
 * A collection of utility methods to create complex components, especially primitive 3D objects.
 */
namespace ComponentFactory {
    const cubeMesh: Mesh = require("../res/mesh_cube.json");

    export function createCube(gl: WebGL2RenderingContext, size: number, material: Material): Primitive {
        let cube: Mesh = cubeMesh;
        // Adjust vertices
        for (let i = 0; i < cube.vertices.length; i++) {
            cube.vertices[i] *= size;
        }
        // Add colors
        return Primitive.create(gl, cube.vertices, cube.indices, cube.normals, cube.texCoords, material);
    }

    export function createCylinder(
        gl: WebGL2RenderingContext,
        baseRadius: number,
        topRadius: number,
        height: number,
        numberOfSlices: number,
        numberOfStacks: number,
        material: Material
    ): Primitive {
        let cylinder: Cylinder = new Cylinder(gl, baseRadius, topRadius, height, numberOfSlices, numberOfStacks, true);
        let vertices: Array<number> = cylinder.vertices;
        let indices: Array<number> = cylinder.indices;
        let normals: Array<number> = cylinder.normals;
        let texCoords: Array<number> = cylinder.texCoords;
        return Primitive.create(gl, vertices, indices, normals, texCoords, material);
    }

    export function createSphere(
        gl: WebGL2RenderingContext,
        radius: number,
        numberOfSlices: number,
        numberOfStacks: number,
        material: Material
    ): Component {
        let sphere: Sphere = new Sphere(gl, radius, numberOfSlices, numberOfStacks, true);
        let vertices: Array<number> = sphere.vertices;
        let indices: Array<number> = sphere.indices;
        let normals: Array<number> = sphere.normals;
        let texCoords: Array<number> = sphere.texCoords;
        return Primitive.create(gl, vertices, indices, normals, texCoords, material);
    }
}

export { ComponentFactory };
