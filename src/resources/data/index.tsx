import data from './numFished.json'
import threatJson from './threatLevel.json'
import fishInfoJson from './fish_info.json'

export type FishType = "Blue Cod" |
    "Flat Fish" |
    "John Dory" |
    "Kingfish" |
    "Orange Roughy" |
    "Snapper" |
    "Tarakihi" |
    "Trevally";

// Maps the index of the paths in the SVG file to FMAs
export enum FMA {
    FMA1 = 8,
    FMA2 = 6,
    FMA3 = 3,
    FMA4 = 4,
    FMA5 = 1,
    FMA6 = 2,
    FMA7 = 0,
    FMA8 = 5,
    FMA9 = 7,
    FMA10 = -1 // To be assigned
}

export enum DangerLevels {
    Unknown = -4,
    ExtremelyBad = -3,
    VeryBad = -2,
    Bad = -1,
    Neutral = 0,
    Good = 1,
    VeryGood = 2,
    ExtremelyGood = 3,
}

export interface IFishData {
    fishName: FishType;
    fma: {[key in FMA]?:number};
    total: number;
}

export const NumFished = (() => {
    let fishData: IFishData[] = [];
    data.forEach(fish => {
        // Extract FMA data and convert to enums
        const fmaData: {[key in FMA]?:number} = {}
        Object.keys(fish.fma[0]).forEach(key => {
            // At least one ts-ignore, unavoidable :(
            // @ts-ignore
            fmaData[FMA[key.toUpperCase()]] = (fish.fma[0][key] as number);
        })


        let newFish: IFishData = {
            fishName: fish.fish as FishType,
            fma: fmaData,
            total: fish.total,
        }
        fishData.push(newFish);
    });
    return fishData;
})();

export interface IThreatData {
    fishName: FishType;
    fma: {[key in FMA]?:DangerLevels[]};
}

/* 
[
  relation to target level, => 1 good 7 bad
  relation to soft limit,   => 7 good 1 bad
  relation to hard limit,   => 7 good 1 bad
  overfished,               => 7 good 1 bad
]
*/

export const ThreatLevels = (() => {
    let threatData: IThreatData[] = [];
    threatJson.forEach(t => {
        const dangerData: {[key in FMA]?:DangerLevels[]} = {}
        Object.keys(t).forEach(key => {
            if (key !== "fish") {
                // At least one ts-ignore, unavoidable :(
                // @ts-ignore
                dangerData[FMA[key.toUpperCase()]] = [
                    // @ts-ignore
                    DangerLevels[(t[key][0] - 4) > -4 ? (t[key][0] - 4) * -1 : -4],
                    // @ts-ignore
                    DangerLevels[t[key][1] - 1],
                ]
            }
        });

        let threat: IThreatData = {
            fishName: t.fish as FishType,
            fma: dangerData,
        } 

        threatData.push(threat);
    });
    return threatData;
})();

export interface IFishInfo {
    subtitle: string,
    description: string
}

export const FishInfo = (() => {
    const fishInfoData: {[key in FishType]?:IFishInfo} = {};
    fishInfoJson.forEach(fish => {
        fishInfoData[fish.title as FishType] = {
            subtitle: fish.subtitle,
            description: fish.description,
        }
    });
    return fishInfoData;
})();