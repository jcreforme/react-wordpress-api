import React, { useState } from 'react';
import './App.css';
import BlogStats from './components/BlogStats';
import WordPressSearch from './components/WordPressSearch';
import WordPressPosts from './components/WordPressPosts';
import LaravelDashboard from './components/LaravelDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('wordpress');

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + WordPress + Laravel</h1>
        <p>Full-Stack Application with jcreforme.home.blog</p>
        
        <nav className="app-nav">
          <button 
            className={`nav-button ${activeTab === 'wordpress' ? 'active' : ''}`}
            onClick={() => setActiveTab('wordpress')}
          >
            📝 WordPress Content
          </button>
          <button 
            className={`nav-button ${activeTab === 'laravel' ? 'active' : ''}`}
            onClick={() => setActiveTab('laravel')}
          >
            🚀 Laravel Backend
          </button>
        </nav>
      </header>
      
      <main className="App-main">
        {activeTab === 'wordpress' && (
          <div className="wordpress-section">
            <BlogStats />
            <WordPressSearch />
            <WordPressPosts />
          </div>
        )}
        
        {activeTab === 'laravel' && (
          <div className="laravel-section">
            <LaravelDashboard />
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Powered by React, WordPress REST API & Laravel Backend</p>
      </footer>
    </div>
  );
}

export default App;
