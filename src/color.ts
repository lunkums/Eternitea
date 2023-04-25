/**
 * Represents a color whose rgba values are expressed as floats between 0 and 1.
 */
class Color extends Float32Array {
    public constructor(r: number, g: number, b: number, a: number = 1.0) {
        super(4);
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    }

    /**
     * Return the color corresponding to the given rgb values expressed as integers between 0 and 255.
     * @param r The red value.
     * @param g The green value.
     * @param b The blue value.
     * @returns The color corresponding to the given rgb values.
     */
    public static fromInt8(r: number, g: number, b: number): Color {
        return new Color(r / 255, g / 255, b / 255, 1);
    }

    /**
     * Interpolate between two different colors by the given amount and return the result.
     * @param a The first color.
     * @param b The second color.
     * @param t The interpolation value, between 0 and 1. If t is 0, returns color a; if t is 1, returns color b.
     * @returns The interpolation between the two colors by the given amount.
     */
    public static lerp(a: Color, b: Color, t: number): Color {
        t = t > 1 ? 1 : t < 0 ? 0 : t;
        return new Color(
            this.lerpNum(a[0], b[0], t),
            this.lerpNum(a[1], b[1], t),
            this.lerpNum(a[2], b[2], t),
            this.lerpNum(a[3], b[3], t)
        );
    }

    /**
     * Constants
     */

    public static get red(): Color {
        return new Color(1, 0, 0, 1);
    }

    public static get green(): Color {
        return new Color(0, 1, 0, 1);
    }

    public static get blue(): Color {
        return new Color(0, 0, 1, 1);
    }

    public static get white(): Color {
        return new Color(1, 1, 1, 1);
    }

    public static get black(): Color {
        return new Color(0, 0, 0, 1);
    }

    /**
     * Properties
     */

    public get red(): number {
        return this[0];
    }

    public set red(r: number) {
        r = Color.clamp("Red", r);
        this[0] = r;
    }

    public get green(): number {
        return this[1];
    }

    public set green(g: number) {
        g = Color.clamp("Green", g);
        this[1] = g;
    }

    public get blue(): number {
        return this[2];
    }

    public set blue(b: number) {
        b = Color.clamp("Blue", b);
        this[2] = b;
    }

    public get alpha(): number {
        return this[3];
    }

    public set alpha(a: number) {
        a = Color.clamp("Alpha", a);
        this[3] = a;
    }

    /**
     * Helper methods
     */

    private static lerpNum(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }

    private static clamp(fieldName: string, value: number): number {
        if (value > 1.0) {
            console.warn(`${fieldName} component of color exceeds 1.0; value was clamped.`);
            value = 1.0;
        } else if (value < 0) {
            console.warn(`${fieldName} component of color is below 0; value was clamped.`);
            value = 0;
        }
        return value;
    }
}

export { Color };
