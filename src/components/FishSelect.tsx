import React from 'react';
import { FishType } from '../resources/data';
import { Fishes } from '../resources/fish-images';

import './FishSelect.css';

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any,
    SelectedFish?: FishType[]
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick, SelectedFish }) => {

    return <div className="FishSelect">
        {Object.keys(Fishes).map(fishType => {
            const fishImage = Fishes[fishType as FishType];

            let extraClassName = ''
            if (SelectedFish && SelectedFish?.length > 0) {
                extraClassName = SelectedFish.indexOf(fishType as FishType) === -1 ? 'Inactive' : 'Active'
            }

            return <div key={fishType} className={`Fish ${extraClassName}`} onClick={() => {
                if (onMouseClick) onMouseClick(fishType as FishType);
            }}>
                <div className="popout">
                    <div className="popoutContent">Test</div>
                </div>
                <img src={fishImage} alt={fishType}/>
                <div className="name">{fishType}</div>
            </div>
        })}
    </div>
}