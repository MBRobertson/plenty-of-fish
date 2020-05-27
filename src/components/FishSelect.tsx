import React from 'react';
import { FishType } from '../resources/data';
import { Fishes } from '../resources/fish-images';

import './FishSelect.css';

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick }) => {

    return <div className="FishSelect">
        {Object.keys(Fishes).map(fishType => {
            const fishImage = Fishes[fishType as FishType];

            return <div key={fishType} className="Fish" onClick={() => {
                if (onMouseClick) onMouseClick(fishType as FishType);
            }}>
                <img src={fishImage} alt={fishType}/>
                <div>{fishType}</div>
            </div>
        })}
    </div>
}