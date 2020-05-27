export enum FishType {
    BlueCod,
    FlatFish,
    JohnDory,
    KingFish,
    OrangeRoughy,
    Snapper,
    Tarakihi,
    Trevalley
}

export interface Fish {
    image: string;
    name: string;
}

export const Fishes: { [K in FishType]: Fish } = {
    [FishType.BlueCod]: {
        image: require('./bluecod.png'),
        name: 'Blue Cod'
    },
    [FishType.FlatFish]: {
        image: require('./flatfish.png'),
        name: 'Flat Fish'
    },
    [FishType.JohnDory]: {
        image: require('./johndory.png'),
        name: 'John Dory'
    },
    [FishType.KingFish]: {
        image: require('./kingfish.png'),
        name: 'Kingfish'
    },
    [FishType.OrangeRoughy]: {
        image: require('./orange_roughy.png'),
        name: 'Orange Roughy'
    },
    [FishType.Snapper]: {
        image: require('./snapper.png'),
        name: 'Snapper'
    },
    [FishType.Tarakihi]: {
        image: require('./tarakihi.png'),
        name: 'Tarakihi'
    },
    [FishType.Trevalley]: {
        image: require('./trevalley.png'),
        name: 'Trevalley'
    }
}