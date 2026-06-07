
export class Vector3 {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public static Zero : Vector3 = new Vector3();

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}