import React from 'react';
import { Fishes, FishType } from '../resources/fish-images';

import './FishSelect.css';

export const FishSelect: React.FC = () => {
    return <div className="FishSelect">
        {Object.keys(Fishes).map(fishtype => {
            const fish = Fishes[Number(fishtype) as FishType];

            return <div className="Fish">
                <img src={fish.image} alt={fish.name}/>
                <div>{fish.name}</div>
            </div>
        })}
    </div>
}