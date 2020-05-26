import React from 'react';
import './App.css';

import { FMAMap, FMA } from './components/FMAMap';

function App() {
  return (
    <div className="App">
      <FMAMap onMouseClick={(fma) => console.log(FMA[fma])}/>
    </div>
  );
}

export default App;
