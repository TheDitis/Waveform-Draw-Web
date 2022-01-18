import type {NumberedNote} from "../music/music";

export interface BaseKey {
    contrast: string;
    fill: string;
    index: number;
    lowerHeight: number;
    lowerWidth: number;
    notes: NumberedNote[];
    offsetX: number;
    scaleX: number;
    stroke: string;
    strokeWidth: 1;
    upperHeight: number;
    upperOffset: number;
    upperWidth: number;
    visible: boolean;
}

export interface Key extends BaseKey {
    isPlaying: boolean;
}

export const addIsPlayingToAllKeys = (allKeys: BaseKey[]): Key[] => (
    allKeys.map((key) => ({...key, isPlaying: false}))
);
