import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { FishType } from '../resources/data';
import { Fishes } from '../resources/fish-images';
import { ThreatLevels, FMA, DangerLevels } from '../resources/data';

import GreenFish from '../resources/fish-images/greenfish.png';
import OrangeFish from '../resources/fish-images/orangefish.png';
import RedFish from '../resources/fish-images/redfish.png';

import './FishSelect.css';

const FishImages = [GreenFish, GreenFish, OrangeFish, RedFish]

interface IFishSelect {
    onMouseClick?: (fish: FishType) => any,
    SelectedFish?: FishType[],
    SelectedFMA?: FMA
}

const levelToPercent = (level: DangerLevels) => {
    const val = parseInt(DangerLevels[level]) + 4;
    return val / 8;
}

export const FishSelect: React.FC<IFishSelect> = ({ onMouseClick, SelectedFish, SelectedFMA }) => {
    const [threatLevels, setThreatLevels] = useState<number[]>([]);
    const [fishHeights, setFishHeights] = useState<number[]>([]);

    useEffect(() => {
        if (SelectedFMA !== undefined) {
            setThreatLevels(Object.keys(Fishes).map(fishType => {
                const threat = ThreatLevels.filter(d => d.fishName === fishType)[0].fma[SelectedFMA as FMA]![0];
                if (threat) {
                    return 1-levelToPercent(threat);
                }
                return 0;
            }));
        }
    }, [SelectedFMA])

    useEffect(() => {
        if (SelectedFMA !== undefined) {
            setFishHeights(Object.keys(Fishes).map((fishType, i) => {
                const threat = ThreatLevels.filter(d => d.fishName === fishType)[0].fma[SelectedFMA as FMA]![1];
                if (threat) {
                    console.log(parseInt(DangerLevels[threat]) + 1);
                    return Math.max(1, parseInt(DangerLevels[threat]) + 1)
                }
                return 1;
            }));
        }
    }, [SelectedFMA])


    return <div className="FishSelect-Container">
        <div className={`FishData ${(SelectedFMA !== undefined) ? 'Active' : ''}`}>
            <span className="targettitle">Target Level</span>
            <div className="targetlimit">
                <span className="targettitle">Soft Limit</span>
                <div className="softlimit">
                    <span className="targettitle">Hard Limit</span>
                    <div className="hardlimit">
                        <span className="targettitle">Below Hard Limit</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="FishSelect">
            {Object.keys(Fishes).map((fishType, i) => {
                const fishImage = Fishes[fishType as FishType];

                let extraClassName = ''
                if (SelectedFish && SelectedFish?.length > 0) {
                    extraClassName = SelectedFish.indexOf(fishType as FishType) === -1 ? 'Inactive' : 'Active'
                }

                // let popupData: React.ReactNode[] = [];
                // if (threatLevels[i]) {
                //     popupData = threatLevels[i].map((level, i) => {
                //         const percent = levelToPercent(level);
                //         return <div style={{
                //             height: `${(percent * 100).toFixed(2)}%`,
                //             backgroundColor: d3.interpolateRdYlGn(percent)
                //         }} className="bar"></div>
                //     })
                // }

                return <div style={
                    SelectedFMA === undefined ? {} :
                    {
                        background: `radial-gradient(circle, rgba(4,101,128,0.4) 10%, rgba(0,66,110,0.6) 90%)`,
                        borderColor: d3.rgb(d3.interpolateRdYlGn(threatLevels[i])).darker(1).hex(),
                        backgroundColor: d3.interpolateRdYlGn(threatLevels[i])
                    }
                } key={fishType} className={`Fish ${extraClassName}`} onClick={() => {
                    if (onMouseClick) onMouseClick(fishType as FishType);
                }}>
                    {/* <div className={`popout ${SelectedFMA === undefined ? 'inactive' : ''}`}>
                        <div className={`popoutContent`}>{popupData}</div>
                    </div> */}
                    <div className={`popout ${SelectedFMA === undefined ? 'inactive' : ''}`}>
                        <div className={`popoutContent`}>
                            <img style={{
                                animationDelay: `${Math.round(Math.random()*2000)}ms`,
                                animationDuration: `${Math.round(Math.random()*2000)+2000}ms`
                            }} className={`FishAnim ${i % 3 !== 0 ? 'flipped' : ''} height-${fishHeights[i]}`} src={FishImages[fishHeights[i]-1]} alt="FishLevel"/>
                        </div>
                    </div>
                    <img src={fishImage} alt={fishType} />
                    <div className="name">{fishType}</div>
                </div>
            })}
        </div>
    </div>
}