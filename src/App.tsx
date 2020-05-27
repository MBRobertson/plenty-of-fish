import React, { useState, useCallback } from 'react';
import './App.css';

import { FMAMap, FMA } from './components/FMAMap';
import { FishSelect } from './components/FishSelect';

function App() {
  const [highlights, setHighlights] = useState<{[K in FMA]? : string}>({});

  const onClick = useCallback((fma: FMA) => {
    const data = { ...highlights };
    // Toggle colour on click
    if (data[fma] === undefined) {
      data[fma] = '#00b356';
    } else {
      data[fma] = undefined;
    }

    setHighlights(data);
  }, [highlights])

  return (
    <div className="App">
      <FMAMap 
        onMouseClick={onClick}
        highlights={highlights}
      />
      <FishSelect onMouseClick={console.log}/>
    </div>
  );
}

export default App;
