import data from './numFished.json'

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

export interface IFishData {
    fishName: FishType;
    fma: {[key:string]:number};
    total: number;
}

export const NumFished = (() => {
    let fishData: IFishData[] = [];
    data.forEach(fish => {
        let newFish: IFishData = {
            fishName: fish.fish as FishType,
            fma: fish.fma[0],
            total: fish.total,
        }
        fishData.push(newFish);
    });
    return fishData;
})();