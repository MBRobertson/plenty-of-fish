import React from 'react';
import { FishType } from '../resources/data';
import { Fishes } from '../resources/fish-images';
import { ThreatLevels, FMA } from '../resources/data';

import './FishSelect.css';

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any,
    SelectedFish?: FishType[],
    SelectedFMA?: FMA
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick, SelectedFish, SelectedFMA }) => {

    return <div className="FishSelect">
        {Object.keys(Fishes).map(fishType => {
            const fishImage = Fishes[fishType as FishType];

            let extraClassName = ''
            if (SelectedFish && SelectedFish?.length > 0) {
                extraClassName = SelectedFish.indexOf(fishType as FishType) === -1 ? 'Inactive' : 'Active'
            }

            const threat = ThreatLevels.filter(d => d.fishName === fishType)[0]
            console.log(threat);

            return <div key={fishType} className={`Fish ${extraClassName}`} onClick={() => {
                if (onMouseClick) onMouseClick(fishType as FishType);
            }}>
                <div className={`popout ${SelectedFMA === undefined ? 'inactive' : ''}`}>
                    <div className={`popoutContent`}>Test</div>
                </div>
                <img src={fishImage} alt={fishType}/>
                <div className="name">{fishType}</div>
            </div>
        })}
    </div>
}