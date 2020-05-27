import data from './resources/data/numFished.json'

export interface IFishData {
    fishName: string;
    fma: {[key:string]:number};
    total: number;
}

export function parseFish() {
    let fishData: IFishData[] = [];
    data.forEach(fish => {
        let newFish: IFishData = {
            fishName: fish.fish,
            fma: fish.fma[0],
            total: fish.total,
        }
        fishData.push(newFish);
    });
    return fishData;
}