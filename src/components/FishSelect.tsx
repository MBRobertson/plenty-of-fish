import React from 'react';
import { Fishes, FishType } from '../resources/fish-images';

import './FishSelect.css';

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick }) => {

    return <div className="FishSelect">
        {Object.keys(Fishes).map(fishtype => {
            const fish = Fishes[Number(fishtype) as FishType];

            return <div key={fishtype} className="Fish" onClick={() => {
                if (onMouseClick) onMouseClick(Number(fishtype) as FishType);
            }}>
                <img src={fish.image} alt={fish.name}/>
                <div>{fish.name}</div>
            </div>
        })}
    </div>
}