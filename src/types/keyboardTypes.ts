import type {Note} from "../music";

export interface BaseKey {
    contrast: string;
    fill: string;
    index: number;
    lowerHeight: number;
    lowerWidth: number;
    notes: Note[];
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
