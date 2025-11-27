import React, { useState, useMemo } from 'react';
import { cases } from './data/cases';
import CaseCard from './components/CaseCard';
import './components/CaseCard.css';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

function App() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...new Set(cases.map(c => c.category))];

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesCategory = filter === 'All' || c.category === filter;
      const matchesSearch = c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchTerm]);

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="brand-name">earthcommunication.</div>
            <h1>2025年 施工事例</h1>
            <p>教育機関及び施設の音響・映像設備の導入事例をご紹介します。</p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="section">
        <div className="container">

          {/* Controls */}
          <div className="controls">
            <div className="filter-group">
              <Filter size={18} className="icon" />
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-group">
              <Search size={18} className="icon" />
              <input
                type="text"
                placeholder="事例を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCases.map(caseItem => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="no-results">
              <p>該当する事例が見つかりませんでした。</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Earth Communication. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
