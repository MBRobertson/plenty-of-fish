import React, { useState, useCallback } from 'react';
import * as d3 from 'd3';
import './App.css';

import { FMA, NumFished, FishType, ThreatLevels } from './resources/data';
import { FMAMap } from './components/FMAMap';
import { FishSelect } from './components/FishSelect';

// Compute the highlights for the map for a given fishes data
const computeHighlights = (fish: FishType): {[K in FMA]? : string} => {
  const data = NumFished.find(d => d.fishName === fish);
  if (!data) return {};

  const highlights: {[K in FMA]? : string} = {};
  const maxValue = Object.values(data.fma).filter(a => a).reduce((a, b) => Math.max(a!, b!));

  for (const fmaKey in FMA) {
    const fma: FMA = FMA[fmaKey as keyof typeof FMA]
    const value = data.fma[fma];
    if (value && maxValue) {
      highlights[fma] = d3.interpolateViridis(value/maxValue);
    } else {
      highlights[fma] = 'black';
    }
  }

  return highlights;
}

function App() {
  const [highlights, setHighlights] = useState<{[K in FMA]? : string}>({});

  const onClick = useCallback((fish: FishType) => {
    setHighlights(computeHighlights(fish));
  }, [highlights])

  console.log(ThreatLevels)

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
