import React from 'react';
import './App.css';
import BlogStats from './components/BlogStats';
import WordPressSearch from './components/WordPressSearch';
import WordPressPosts from './components/WordPressPosts';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React WordPress API</h1>
        <p>Exploring jcreforme.home.blog with React</p>
      </header>
      
      <main className="App-main">
        <BlogStats />
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
