import React, { useState, useCallback } from 'react';
import * as d3 from 'd3';
import './App.css';

import { FMA, NumFished, FishType } from './resources/data';
import { FMAMap, MapHighlight } from './components/FMAMap';
import { FishSelect } from './components/FishSelect';

// const fishDataScale = d3.scaleLinear().domain([
//   NumFished.reduce((a, b) => {
//     const minVal = Object.values(b.fma).reduce((a2, b2) => Math.min(a2!, b2!), a)
//     return Math.min(a, minVal!);
//   }, Number.MAX_VALUE),
//   NumFished.reduce((a, b) => {
//     const minVal = Object.values(b.fma).reduce((a2, b2) => Math.max(a2!, b2!), a)
//     return Math.max(a, minVal!);
//   }, 0)
// ])

// Compute the highlights for the map for a given fishes data
const computeHighlights = (fish: FishType): {[K in FMA]? : MapHighlight} => {
  const data = NumFished.find(d => d.fishName === fish);
  if (!data) return {};

  const highlights: {[K in FMA]? : MapHighlight} = {};
  const maxValue = Object.values(data.fma).filter(a => a).reduce((a, b) => Math.max(a!, b!));

  for (const fmaKey in FMA) {
    const fma: FMA = FMA[fmaKey as keyof typeof FMA]
    const value = data.fma[fma];
    if (value && maxValue) {
      const color = d3.interpolateYlGnBu((1 - value/maxValue) * 0.85  + 0.075);
      highlights[fma] = {
        'fill': color,
        'border':  d3.rgb(color).darker(2).hex(),
        'opacity': 0.8
      }
    } else {
      highlights[fma] = {
        'fill': 'rgb(10, 10, 10)',
        'border': 'rgb(10, 10, 10)',
        'opacity': 0.5
      }
    }
  }

  return highlights;
}

function App() {
  const [highlights, setHighlights] = useState<{[K in FMA]? : MapHighlight}>({});
  const [selectedFish, setSelectedFish] = useState<FishType[]>([]);

  const onClick = useCallback((fish: FishType) => {
    if (selectedFish.length === 1 && selectedFish[0] === fish) {
      setSelectedFish([]);
      setHighlights({});
    } else {
      setSelectedFish([fish]);
      setHighlights(computeHighlights(fish));
    }
    
  }, [selectedFish, setSelectedFish])

  return (
    <div className="App">
      <FMAMap 
        highlights={highlights}
      />
      <FishSelect SelectedFish={selectedFish} onMouseClick={onClick}/>
    </div>
  );
}

export default App;
