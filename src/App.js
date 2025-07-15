import React from 'react';
import './App.css';
import WordPressPosts from './components/WordPressPosts';
import WordPressSearch from './components/WordPressSearch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React WordPress API</h1>
        <p>Connect your React app to WordPress REST API</p>
      </header>
      
      <main className="App-main">
        <WordPressSearch />
        <WordPressPosts />
      </main>
      
      <footer className="App-footer">
        <p>Powered by React & WordPress REST API</p>
      </footer>
    </div>
  );
}

export default App;
