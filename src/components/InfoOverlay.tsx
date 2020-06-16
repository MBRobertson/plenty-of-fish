import React from 'react';
import { FishType, FishInfo } from '../resources/data';

import './InfoOverlay.css';

interface IInfoOverlay {
    currentFish: FishType,
    disabled?: boolean
}

export const InfoOverlay: React.FC<IInfoOverlay> = ({ currentFish, disabled }) => {
    //@ts-ignore
    const fish = FishInfo[currentFish];

    if (fish !== undefined) {
        return <div className="InfoOverlay">
            <h1>{currentFish}</h1>
            <h2>{fish.subtitle}</h2>
            <p>{fish.description}</p>
        </div>
    } else {
        return <div></div>
    }
}