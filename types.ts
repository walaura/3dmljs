// Type definitions for parsed 3DML data

export interface Blockset {
    href: string;
}

export interface Title {
    name: string;
}

export interface Map {
    style: string;
    dimensions: string;
}

export interface Sky {
    texture: string;
}

export interface Orb {
    brightness: string;
    position: string;
    color: string;
}

export interface AmbientLight {
    brightness: string;
}

export interface AmbientSound {
    file: string;
}

export interface Head {
    title: Title;
    blockset: Blockset[];
    map: Map;
    sky: Sky;
    orb: Orb;
    ambient_light: AmbientLight;
    ambient_sound: AmbientSound;
}

export interface Param {
    movable?: string;
}

export interface Part {
    name: string;
    texture?: string;
    translucency?: string;
    style?: string;
    faces?: string;
}

export interface Define {
    scale_x: number;
    scale_y: number;
    scale_z: number;
}

export interface Exit {
    href: string;
    trigger?: string;
}

export interface Create {
    part?: Part | Part[];
    param?: Param;
    define?: Define;
    exit?: Exit;
    symbol?: string;
    block?: string;
}

export interface Body {
    create: Create[];
}

export interface Spot {
    head: Head;
    body: Body;
}

export interface ParsedData {
    spot: Spot;
}