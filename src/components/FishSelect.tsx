import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { FishType } from '../resources/data';
import { Fishes } from '../resources/fish-images';
import { ThreatLevels, FMA, DangerLevels } from '../resources/data';

import './FishSelect.css';

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any,
    SelectedFish?: FishType[],
    SelectedFMA?: FMA
}

const levelToPercent = (level: DangerLevels) => {
    const val = parseInt(DangerLevels[level]) + 4;
    return val/8;
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick, SelectedFish, SelectedFMA }) => {
    const [threatLevels, setThreatLevels] = useState<DangerLevels[][]>([]);

    useEffect(() => {
        if (SelectedFMA !== undefined) {
            setThreatLevels(Object.keys(Fishes).map(fishType => {
                const threat = ThreatLevels.filter(d => d.fishName === fishType)[0].fma[SelectedFMA as FMA];
                if (threat) {
                    return threat;
                }
                return [];
            }));
        }
    }, [SelectedFMA])


    return <div className="FishSelect">
        {Object.keys(Fishes).map((fishType, i) => {
            const fishImage = Fishes[fishType as FishType];

            let extraClassName = ''
            if (SelectedFish && SelectedFish?.length > 0) {
                extraClassName = SelectedFish.indexOf(fishType as FishType) === -1 ? 'Inactive' : 'Active'
            }

            let popupData: React.ReactNode[] = [];
            if (threatLevels[i]) {
                popupData = threatLevels[i].map((level, i) => {
                    const percent = levelToPercent(level);
                    return <div style={{ 
                        height: `${(percent*100).toFixed(2)}%`,
                        backgroundColor: d3.interpolateRdYlGn(i === 0 ? 1-percent : percent)
                    }} className="bar"></div>
                })
            }

            return <div key={fishType} className={`Fish ${extraClassName}`} onClick={() => {
                if (onMouseClick) onMouseClick(fishType as FishType);
            }}>
                <div className={`popout ${SelectedFMA === undefined ? 'inactive' : ''}`}>
                    <div className={`popoutContent`}>{popupData}</div>
                </div>
                <img src={fishImage} alt={fishType} />
                <div className="name">{fishType}</div>
            </div>
        })}
    </div>
}