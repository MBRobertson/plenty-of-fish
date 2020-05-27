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