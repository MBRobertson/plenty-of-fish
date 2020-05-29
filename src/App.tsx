import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import {useRipple} from 'react-use-ripple';

import { FMAMap, FMA } from './components/FMAMap';

function App() { 
  const [highlights, setHighlights] = useState<{[K in FMA]? : string}>({});
  const divRef = useRef(null);

  useRipple(divRef);

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
    <div ref={divRef} className="App">
      <FMAMap 
        onMouseClick={onClick}
        highlights={highlights}
      />
    </div>
  );
}

export default App;
