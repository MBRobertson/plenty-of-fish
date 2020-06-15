import React, { useState, useCallback } from 'react';
import * as d3 from 'd3';
import './App.css';

import { FMA, NumFished, FishType } from './resources/data';
import { FMAMap, MapHighlight } from './components/FMAMap';
import { FishSelect } from './components/FishSelect';
import { ColorLegend } from './components/ColorLegend';

const colorScheme = d3.interpolateYlGnBu

// Compute the highlights for the map for a given fishes data
const computeHighlights = (fish: FishType): { highlights: {[K in FMA]? : MapHighlight}, maxValue: number } => {
  const data = NumFished.find(d => d.fishName === fish);
  if (!data) return { highlights: {}, maxValue: 1 };

  const highlights: {[K in FMA]? : MapHighlight} = {};
  const maxValue = Object.values(data.fma).filter(a => a).reduce((a, b) => Math.max(a!, b!));
  const total = Object.values(data.fma).filter(a => a).reduce((a, b) => a! + b!) ?? 0;

  for (const fmaKey in FMA) {
    const fma: FMA = FMA[fmaKey as keyof typeof FMA]
    const value = data.fma[fma];
    if (value && maxValue) {
      const color = colorScheme((1 - value/maxValue) * 0.85  + 0.075);
      highlights[fma] = {
        'fill': color,
        'border':  d3.rgb(color).darker(2).hex(),
        'opacity': 0.8,
        'tooltipTitle': `${FMA[fma]} - ${fish}`,
        'tooltipDescription': `${value} tonnes<br>${Math.round(((value)/total)*1000)/10}% of all <i>${fish}</i> fished`
      }
    } else {
      highlights[fma] = {
        'fill': 'rgb(10, 10, 10)',
        'border': 'rgb(10, 10, 10)',
        'opacity': 0.5,
        'tooltipDescription': 'No Data Avaliable'
      }
    }
  }

  return { highlights, maxValue: (maxValue ?? 1) };
}

function App() {
  const [highlights, setHighlights] = useState<{[K in FMA]? : MapHighlight}>({});
  const [selectedFish, setSelectedFish] = useState<FishType[]>([]);
  const [selectedFMA, setSelectedFMA] = useState<FMA | undefined>(undefined)
  const [legendDomain, setLegendDomain] = useState<[number, number]>([0, 1]);

  const onFishClick = useCallback((fish: FishType) => {
    setSelectedFMA(undefined);
    if (selectedFish.length === 1 && selectedFish[0] === fish) {
      setSelectedFish([]);
      setHighlights({});
    } else {
      setSelectedFish([fish]);
      const { highlights, maxValue } = computeHighlights(fish)
      setHighlights(highlights);
      setLegendDomain([0, maxValue]);
    }
    
  }, [selectedFish, setSelectedFish, setLegendDomain, setHighlights])

  const onFMAClick = useCallback((fma: FMA) => {
    setSelectedFish([]);
    setHighlights({});
    if (selectedFMA === fma) setSelectedFMA(undefined);
    else setSelectedFMA(fma);
  }, [selectedFMA])

  return (
    <div className="App">
      <FMAMap highlights={highlights} onMouseClick={onFMAClick} selectedFMA={selectedFMA}>
        <ColorLegend disabled={selectedFish.length !== 1} title="Quantity Fished (tonnes)" scale={colorScheme} domain={legendDomain}/>
      </FMAMap>
      <FishSelect SelectedFish={selectedFish} onMouseClick={onFishClick}/>
    </div>
  );
}

export default App;
