import React from 'react';
import { FishType, FishInfo, IFishInfo } from '../resources/data';

import './InfoOverlay.css';

interface IInfoOverlay {
    currentFish: FishType,
}

export const InfoOverlay: React.FC<IInfoOverlay> = ({ currentFish }) => {
    //@ts-ignore
    const fish = FishInfo[currentFish] as IFishInfo;

    return <div className="InfoOverlay">
        <h1>{currentFish}</h1>
        <h2>{fish.subtitle}</h2>
        <p>{fish.description}</p>
    </div>   
}