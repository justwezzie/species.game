import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SpeciesGameUI() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth
  );
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  // Live state broadcast out of the p5 sketch (see broadcastState() in sketch.js).
  // The sketch runs inside the p5 editor preview, so it posts to window.top and we
  // listen here. null until the first message arrives.
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== 'https://preview.p5js.org') return;
      if (!e.data || e.data.source !== 'aleg' || e.data.type !== 'state') return;
      setGameStats(e.data);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const closeModals = useCallback(() => {
    if (selectedOrganism) setSelectedOrganism(null);
    else if (selectedSpecies) setSelectedSpecies(null);
    else if (showHowTo) setShowHowTo(false);
  }, [selectedOrganism, selectedSpecies, showHowTo]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModals();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModals]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const species = [
    { name: 'Bacteria', icon: '🦠', description: 'Microscopic organisms that play crucial roles in decomposition and nutrient cycling.' },
    { name: 'Fungi', icon: '🍄', description: 'Thrives in moist, dark environments with neutral pH levels.' },
    { name: 'Insects', icon: '🐛', description: 'Diverse arthropods that contribute to pollination and soil aeration.' },
    { name: 'Plants', icon: '🌿', description: 'Photosynthetic organisms that form the base of most ecosystems.' }
  ];

  const organisms = [
    {
      name: 'Bacillus',
      type: 'Bacteria',
      description: 'Soil-dwelling bacteria that form endospores for survival.',
      image: '/cards-final/Bacillus.webp'
    },
    {
      name: 'Streptomyces',
      type: 'Bacteria',
      description: 'Antibiotic-producing bacteria found in soil.',
      image: '/cards-final/Streptomyces.webp'
    },
    {
      name: 'Acidobacteriota',
      type: 'Bacteria',
      description: 'Acidophilic bacteria thriving in low pH environments.',
      image: '/cards-final/Acidobacteriota.webp'
    },
    {
      name: 'Pseudomonas',
      type: 'Bacteria',
      description: 'Versatile bacteria with diverse metabolic capabilities.',
      image: '/cards-final/Pseudomonas.webp'
    },
    {
      name: 'Rhizobium',
      type: 'Bacteria',
      description: 'Nitrogen-fixing bacteria forming symbiosis with legumes.',
      image: '/cards-final/Rhizobium.webp'
    },
    {
      name: 'Agaricales',
      type: 'Fungi',
      description: 'Order of mushroom-forming fungi including edible species.',
      image: '/cards-final/Agaricales.webp'
    },
    {
      name: 'Eisenia Fetida',
      type: 'Worm',
      description: 'Composting worms important for soil aeration and decomposition.',
      image: '/cards-final/Eisenia-Fetida.webp'
    },
    {
      name: 'Collembola',
      type: 'Arthropod',
      description: 'Springtails that help decompose organic material.',
      image: '/cards-final/Collembola.webp'
    },
    {
      name: 'Hypnales',
      type: 'Moss',
      description: 'Order of pleurocarpous mosses growing in mats.',
      image: '/cards-final/Hypnales.webp'
    },
    {
      name: 'Polypodiopsida',
      type: 'Fern',
      description: 'Class of true ferns with diverse species.',
      image: '/cards-final/Polypodiopsida.webp'
    },
    {
      name: 'Asparagus',
      type: 'Plant',
      description: 'Perennial flowering plant used as a vegetable.',
      image: '/cards-final/Asparagus.webp'
    },
    {
      name: 'Procris repens',
      type: 'Plant',
      description: 'Creeping herbaceous plant found in tropical regions.',
      image: '/cards-final/Procris-repens.webp'
    }
  ];

  const typeGroups = {
    Bacteria: 'Bacteria',
    Fungi: 'Fungi',
    Worm: 'Insects',
    Arthropod: 'Insects',
    Moss: 'Plant',
    Fern: 'Plant',
    Plant: 'Plant',
  };

  // 20px icons in public/icons, cropped from new-imgs at 2x (40px) for retina.
  // Keyed by the sketch's SPECIES name, which doesn't always match the card
  // name (ACIDOBACTERIA -> the Acidobacteriota artwork).
  const speciesIcons = {
    ACIDOBACTERIA: '/icons/acidobacteriota.png',
    BACILLUS: '/icons/bacillus.png',
    PSEUDOMONAS: '/icons/pseudomonas.png',
    RHIZOBIUM: '/icons/rhizobium.png',
    STREPTOMYCES: '/icons/streptomyces.png',
    AGARICALES: '/icons/agaricales.png',
    COLLEMBOLA: '/icons/collembola.png',
    EISENIA: '/icons/eisenia.png',
    HYPNALES: '/icons/hypnales.png',
    POLYPODIOPSIDA: '/icons/polypodiopsida.png',
    ASPARAGUS: '/icons/asparagus.png',
    PROCRIS: '/icons/procris.png'
  };

  // Where the sketch's SPECIES name doesn't match a card name, say which card
  // a live-population row should open. Display name is unaffected.
  const cardNameOverrides = {
    ACIDOBACTERIA: 'Acidobacteriota'
  };

  // The sketch identifies species by a numeric id; speciesMap is its SPECIES constant
  // (e.g. { ACIDOBACTERIA: 0, BACILLUS: 1, ... }), so invert it to label the counts.
  const liveCounts = useMemo(() => {
    if (!gameStats || !gameStats.speciesMap) return [];
    const labels = {};
    Object.entries(gameStats.speciesMap).forEach(([key, id]) => {
      if (typeof id === 'number') labels[id] = key;
    });
    return Object.entries(labels)
      .map(([id, key]) => {
        // Match the sketch's key to a card so counts can use the card's fuller
        // name (EISENIA -> "Eisenia Fetida", PROCRIS -> "Procris repens").
        // When there's no exact match the sketch's own name wins: ACIDOBACTERIA
        // is the common name we display, while the card uses the Latin
        // Acidobacteriota. Don't loosen this to a prefix match — that would
        // overwrite the common name with the Latin one.
        const exact = organisms.find((o) =>
          o.name.toUpperCase().replace(/[^A-Z]/g, '').startsWith(key)
        );
        // The card to open on click. Resolved separately from the label so a
        // name override still opens the right card without renaming the row.
        const org = exact || organisms.find((o) => o.name === cardNameOverrides[key]);
        return {
          id,
          label: exact ? exact.name : key.charAt(0) + key.slice(1).toLowerCase(),
          group: org ? typeGroups[org.type] || org.type : null,
          icon: speciesIcons[key] || null,
          org: org || null,
          count: gameStats.gameState === 'playing' ? ((gameStats.byType || {})[id] || 0) : 0
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [gameStats, organisms, typeGroups, speciesIcons, cardNameOverrides]);

  if (showLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen w-full text-white gap-8"
        style={{ backgroundColor: '#000' }}
        onClick={() => setShowLoading(false)}
      >
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div className="rotate-phone-icon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="50" height="80" viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="46" height="76" rx="8" stroke="white" strokeWidth="2.5" />
              <line x1="2" y1="14" x2="48" y2="14" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="2" y1="66" x2="48" y2="66" stroke="white" strokeWidth="1" opacity="0.3" />
              <circle cx="25" cy="73" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <svg className="rotate-phone-arrow" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
            <path d="M 85 25 A 35 35 0 0 1 95 60" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polygon points="99,58 91,58 95,66" fill="white" />
          </svg>
        </div>
        <p className="text-neutral-500 text-center px-8" style={{ fontSize: '14px' }}>
          Rotate your phone to landscape
        </p>
        <p className="text-neutral-600 text-center" style={{ fontSize: '12px' }}>
          Tap to continue
        </p>
      </div>
    );
  }

  if (isPortrait) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-white gap-8" style={{ backgroundColor: '#000' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div className="rotate-phone-icon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="50" height="80" viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="46" height="76" rx="8" stroke="white" strokeWidth="2.5" />
              <line x1="2" y1="14" x2="48" y2="14" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="2" y1="66" x2="48" y2="66" stroke="white" strokeWidth="1" opacity="0.3" />
              <circle cx="25" cy="73" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <svg className="rotate-phone-arrow" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
            <path d="M 85 25 A 35 35 0 0 1 95 60" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polygon points="99,58 91,58 95,66" fill="white" />
          </svg>
        </div>
        <p className="text-neutral-500 text-center px-8" style={{ fontSize: '14px' }}>
          Rotate your phone to landscape
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full text-white relative overflow-hidden m-0 p-0 gap-0" style={{ backgroundColor: '#000' }}>
      {showOnboarding && (
        <div
          className="absolute inset-0 z-[60] flex"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => setShowOnboarding(false)}
        >
          <div className="absolute flex items-center gap-2" style={{ top: '21px', left: '250px', color: '#fff' }}>
            <span className="arrow-bounce-right" style={{ fontSize: '16px' }}>←</span>
            <span style={{ fontSize: '16px' }}>How to play</span>
          </div>

          <div className="absolute flex flex-col items-start gap-1" style={{ top: '200px', left: '60px', color: '#fff' }}>
            <span style={{ fontSize: '16px', maxWidth: '300px' }}>Click each species to reveal the information card</span>
            <span className="arrow-bounce-down" style={{ fontSize: '16px' }}>↓</span>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <span className="text-neutral-400" style={{ fontSize: '16px' }}>Tap anywhere to dismiss</span>
          </div>
        </div>
      )}
      {/* Organism Card Modal */}
      {selectedOrganism && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedOrganism.name} card`}
          onClick={() => setSelectedOrganism(null)}
        >
          <div className={`rounded-lg max-h-[90vh] overflow-auto hide-scrollbar ${selectedOrganism.image ? 'bg-transparent border-0 p-2 max-w-sm w-full' : 'bg-neutral-800 border-2 border-neutral-600 p-8 max-w-2xl w-full'}`} onClick={(e) => e.stopPropagation()}>
            {selectedOrganism.image ? (
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-end mb-1">
                  <button
                    onClick={() => setSelectedOrganism(null)}
                    aria-label="Close card"
                    className="text-neutral-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={selectedOrganism.image}
                  alt={`${selectedOrganism.name} species card`}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedOrganism.name}</h2>
                    <span className="inline-block bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-sm">
                      {selectedOrganism.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrganism(null)}
                    aria-label="Close card"
                    className="text-neutral-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-300">Description</h3>
                    <p className="text-neutral-400">{selectedOrganism.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-300">Environmental Preferences</h3>
                    <dl className="space-y-2 text-neutral-400">
                      <div className="flex justify-between">
                        <dt>pH Range:</dt>
                        <dd className="font-mono">5.5 - 8.0</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Temperature:</dt>
                        <dd className="font-mono">15°C - 30°C</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Humidity:</dt>
                        <dd className="font-mono">40% - 90%</dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    onClick={() => setSelectedOrganism(null)}
                    className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 rounded mt-4 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* How to Play Modal — opened by the i button next to the title */}
      {showHowTo && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-play-title"
          onClick={() => setShowHowTo(false)}
        >
          <div
            className="rounded-lg w-full max-h-[90vh] overflow-auto"
            style={{ backgroundColor: 'rgb(23, 23, 23)', padding: '20px', maxWidth: 'calc(28rem + 150px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: '15px' }}>
              <h2 id="how-to-play-title" className="font-bold" style={{ fontSize: '20px' }}>
                How to Play
              </h2>
              <button
                onClick={() => setShowHowTo(false)}
                aria-label="Close how to play"
                className="text-neutral-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="text-neutral-400 space-y-4" style={{ fontSize: '14px' }}>
              <p>
                Adjust pH, temperature, and humidity with the sliders. Each organism thrives under specific conditions.
              </p>
              <p>
                Click any species in the sidebar to see its card.
              </p>
            </div>

            <button
              onClick={() => setShowHowTo(false)}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 rounded mt-6 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Species Card Modal */}
      {selectedSpecies && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedSpecies.name} details`}
          onClick={() => setSelectedSpecies(null)}
        >
          <div className="bg-neutral-800 rounded-lg p-8 max-w-md w-xs mx-4 border-2 border-neutral-600" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <span className="text-6xl" role="img" aria-label={selectedSpecies.name}>{selectedSpecies.icon}</span>
                <h2 className="text-3xl font-bold">{selectedSpecies.name}</h2>
              </div>
              <button
                onClick={() => setSelectedSpecies(null)}
                aria-label="Close details"
                className="text-neutral-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-300">Description</h3>
                <p className="text-neutral-400">{selectedSpecies.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-300">Optimal Conditions</h3>
                <dl className="space-y-2 text-neutral-400">
                  <div className="flex justify-between">
                    <dt>pH Level:</dt>
                    <dd className="font-mono">6.0 - 7.5</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Temperature:</dt>
                    <dd className="font-mono">18°C - 24°C</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Humidity:</dt>
                    <dd className="font-mono">60% - 80%</dd>
                  </div>
                </dl>
              </div>

              <button
                onClick={() => setSelectedSpecies(null)}
                className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 rounded mt-4 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      {/* The sidebar takes whatever the game panel doesn't need. The panel is
          sized to the canvas' 4:3 ratio below, so there are no dead black bands
          either side of the canvas — that width goes to the nav instead. */}
      <nav
        className="flex-1 min-w-0 flex flex-col overflow-x-hidden overflow-y-auto"
        style={{ padding: '20px' }}
        aria-label="Species sidebar"
      >
        <div className="flex-1 pb-4">
          <div className="flex items-center justify-between" style={{ marginBottom: '15px' }}>
            <h1 className="text-2xl font-bold">ALE-G</h1>
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              aria-label="How to play"
              title="How to play"
              className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-neutral-600 text-neutral-400 font-serif italic leading-none hover:text-white hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-colors"
            >
              i
            </button>
          </div>

          {/* Live population — driven by postMessage from the p5 sketch */}
          <section aria-label="Live population">
            <div className="flex items-baseline justify-between mb-3 border border-neutral-700 rounded p-2">
              <h2 className="text-sm font-semibold">
                {gameStats && gameStats.gameState === 'playing'
                  ? <span className="text-green-400">Live</span>
                  : <span className="text-neutral-400">Inactive</span>}
              </h2>
              <span className="text-sm" aria-live="polite">
                {gameStats && gameStats.gameState === 'playing' ? gameStats.total : 0}
              </span>
            </div>

            {!gameStats ? (
              <p className="text-xs text-neutral-500">Waiting for the simulation…</p>
            ) : (
              <>
                {/* Each row is a button that opens that species' card — the whole
                    row is the target, not just the name, so it stays tappable. */}
                <ul className="text-xs">
                  {liveCounts.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => s.org && setSelectedOrganism(s.org)}
                        disabled={!s.org}
                        aria-label={
                          s.org ? `View ${s.label} card — ${s.count} alive` : undefined
                        }
                        title={s.org ? `View ${s.label} card` : s.label}
                        style={{ minHeight: '30px' }}
                        className={`w-full flex items-center gap-2 py-1 px-1 -mx-1 rounded text-left transition-colors ${
                          s.org
                            ? 'hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 cursor-pointer'
                            : 'cursor-default'
                        }`}
                      >
                        {s.icon && (
                          <img
                            src={s.icon}
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            className={`w-5 h-5 shrink-0 object-contain ${
                              s.count === 0 ? 'opacity-40' : ''
                            }`}
                          />
                        )}
                        <span
                          className={`truncate flex-1 ${
                            s.count === 0
                              ? 'text-neutral-600'
                              : 'text-neutral-300'
                          }`}
                        >
                          {s.label}
                        </span>
                        <span
                          className={`font-mono ${
                            s.count === 0 ? 'text-neutral-600' : 'text-white'
                          }`}
                        >
                          {s.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {gameStats.environment && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between text-xs font-mono text-neutral-400">
                    <span>{gameStats.environment.temperature.toFixed(1)}°C</span>
                    <span>{gameStats.environment.humidity.toFixed(0)}%</span>
                    <span>pH {gameStats.environment.pH.toFixed(1)}</span>
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </nav>

      {/* Game Panel */}
      {/* Sized to the canvas' 4:3 ratio so the panel is exactly as wide as the
          game needs. maxWidth keeps the sidebar usable on short, wide viewports. */}
      <main
        className="flex-none overflow-hidden"
        style={{
          backgroundColor: 'rgb(23, 23, 23)',
          height: '100%',
          aspectRatio: '4 / 3',
          maxWidth: '75%'
        }}
      >
        {/* The editor's full-view page puts a <nav class="nav preview-nav"> above the
            sketch. It's cross-origin, so CSS can't hide it — we scroll it out of view.
            It measures 42px at desktop width but reflows taller as the frame narrows,
            which is why a fixed -34px let it show. Crop a generous 90px instead.
            Height is 100% + (2 x 90) - 42 so the canvas stays centred in the visible
            panel: the hidden strip above is balanced by slack below.
            This is a workaround — serving the sketch from public/ would remove the
            nav, the crop and the cross-origin boundary in one go. */}
        <iframe
          src="https://editor.p5js.org/justwezzie/full/gFYUTqmqg"
          className="w-full block border-0"
          style={{ height: 'calc(100% + 138px)', marginTop: '-90px' }}
          title="ALE-G - Artificial Life Ecosystem Game"
          scrolling="no"
        />
      </main>
    </div>
  );
}
