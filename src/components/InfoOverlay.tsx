import React from 'react';
import { FishType, FishInfo, IFishInfo } from '../resources/data';

interface IInfoOverlay {
    currentFish: FishType,
    disabled?: boolean
}

export const InfoOverlay: React.FC<IInfoOverlay> = ({ currentFish }) => {

    const fish = FishInfo[currentFish] as IFishInfo;


    return <div className="InfoOverlay"> 
    </div>
}