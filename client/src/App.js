// App.js
import React from 'react';
import Clients from './components/Clients/Clients';
import Autos from './components/Autos/Autos';
import Items from './components/Items/Items';
import Orders from "./components/Orders/Orders";
import CurrentClientAndAuto from './components/CurrentClientAndAuto/CurrentClientAndAuto';
import AlertManager from "./components/AlertManager";

import './App.css';

function App() {
  return (
      <div className="App">
          <CurrentClientAndAuto />
        <div className="top-section">
          <Clients />
          <Autos />
        </div>
        <div className="bottom-section">
          <Items />
          <Orders />
        </div>
          <AlertManager />
      </div>
  );
}

export default App;