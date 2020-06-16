import React, { useState, useCallback } from 'react';
import { FishType, FishInfo, IFishInfo } from '../resources/data';

import './InfoOverlay.css';

interface IInfoOverlay {
    currentFish: FishType,
}

export const InfoOverlay: React.FC<IInfoOverlay> = ({ currentFish }) => {
    const [visible, setVisible] = useState<boolean>(false);

    const onToggle = useCallback(() => {
        setVisible(!visible);
    }, [visible])

    const fish = FishInfo[currentFish] as IFishInfo;

    return <div className={`InfoOverlay ${visible ? '' : 'hidden'}`}>
        <div className="toggle" onClick={onToggle}>More Info</div>
        <h1>{currentFish}</h1>
        <h2>{fish.subtitle}</h2>
        <p>{fish.description}</p>
    </div>   
}