namespace TextureFactory {
    /**
     * Creates a default texture with a single white pixel.
     * @param gl The WebGL context.
     * @returns A default texture with a single white pixel.
     * @remarks This is useful for when a texture is required but none is available.
     */
    export function createDefaultTexture(gl: WebGL2RenderingContext): WebGLTexture {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a white pixel
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([255, 255, 255, 255])
        );
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    /**
     * Creates a texture from a source image.
     * @param gl The WebGL context.
     * @param source The source image.
     * @returns A texture created from the source image.
     */
    export function createTextureFromSource(gl: WebGL2RenderingContext, source: string): WebGLTexture {
        let texture = gl.createTexture();

        // Load the image
        let image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Fill the texture with the image
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            // Generate mipmaps
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = source;

        return texture;
    }
}

export { TextureFactory };
