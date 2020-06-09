import React, { useState, useCallback } from 'react';
import * as d3 from 'd3';
import './App.css';

import { FMA, NumFished, FishType } from './resources/data';
import { FMAMap, MapHighlight } from './components/FMAMap';
import { FishSelect } from './components/FishSelect';

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
      const color = d3.interpolateRdYlGn(1 - value/maxValue);
      highlights[fma] = {
        'fill': color,
        'border':  d3.rgb(color).darker(2).hex(),
        'opacity': 0.8
      }
    } else {
      highlights[fma] = {
        'fill': 'black',
        'border': 'darkgrey'
      }
    }
  }

  return highlights;
}

function App() {
  const [highlights, setHighlights] = useState<{[K in FMA]? : MapHighlight}>({});

  const onClick = useCallback((fish: FishType) => {
    setHighlights(computeHighlights(fish));
  }, [])

  return (
    <div className="App">
      <FMAMap 
        highlights={highlights}
      />
      <FishSelect onMouseClick={onClick}/>
    </div>
  );
}

export default App;
