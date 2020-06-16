import React, { useState, useCallback, useEffect } from 'react';
import { FishType, FishInfo, IFishInfo } from '../resources/data';

import './InfoOverlay.css';

interface IInfoOverlay {
    currentFish?: FishType,
}

export const InfoOverlay: React.FC<IInfoOverlay> = ({ currentFish }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [prevFish, setPrevFish] = useState<FishType | undefined>();

    const onToggle = useCallback(() => {
        setVisible(!visible);
    }, [visible])

    useEffect(() => {
        if (currentFish !== undefined ) {
            setPrevFish(currentFish);
        }
    }, [currentFish])

    const fish = (currentFish !== undefined && FishInfo[currentFish] as IFishInfo) || 
        (prevFish !== undefined && FishInfo[prevFish] as IFishInfo) || 
        { subtitle: '', description: ''};

    return <div className={`InfoOverlay ${visible ? '' : 'hidden'} ${currentFish !== undefined ? '' : 'superhidden'}`}>
        <div className="toggle" onClick={onToggle}>{visible ? "Less" : "More"} Info</div>
        <h1>{currentFish || prevFish}</h1>
        <h2>{fish.subtitle}</h2>
        <p>{fish.description}</p>
    </div>   
}