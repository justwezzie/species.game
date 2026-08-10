import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SpeciesGameUI() {
  const [activeTab, setActiveTab] = useState('species-cards');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedOrganism, setSelectedOrganism] = useState(null);

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
      image: '/cards/Bacillus.png'
    },
    {
      name: 'Streptomyces',
      type: 'Bacteria',
      description: 'Antibiotic-producing bacteria found in soil.',
      image: '/cards/Streptomyces.png'
    },
    {
      name: 'Acidobacteriota',
      type: 'Bacteria',
      description: 'Acidophilic bacteria thriving in low pH environments.',
      image: '/cards/Acidobacteriota.png'
    },
    {
      name: 'Pseudomonas',
      type: 'Bacteria',
      description: 'Versatile bacteria with diverse metabolic capabilities.',
      image: '/cards/Pseudomonas.png'
    },
    {
      name: 'Rhizobium',
      type: 'Bacteria',
      description: 'Nitrogen-fixing bacteria forming symbiosis with legumes.',
      image: '/cards/Rhizobium.png'
    },
    {
      name: 'Agaricales',
      type: 'Fungi',
      description: 'Order of mushroom-forming fungi including edible species.',
      image: '/cards/Agaricales.png'
    },
    {
      name: 'Eisenia Fetida',
      type: 'Worm',
      description: 'Composting worms important for soil aeration and decomposition.',
      image: '/cards/Eisenia-Fetida.png'
    },
    {
      name: 'Collembola',
      type: 'Arthropod',
      description: 'Springtails that help decompose organic material.',
      image: '/cards/Collembola.png'
    },
    {
      name: 'Hypnales',
      type: 'Moss',
      description: 'Order of pleurocarpous mosses growing in mats.',
      image: '/cards/Hypnales.png'
    },
    {
      name: 'Polypodiopsida',
      type: 'Fern',
      description: 'Class of true ferns with diverse species.',
      image: '/cards/Polypodiopsida.png'
    },
    {
      name: 'Asparagus',
      type: 'Plant',
      description: 'Perennial flowering plant used as a vegetable.',
      image: '/cards/Asparagus.png'
    },
    {
      name: 'Procris repens',
      type: 'Plant',
      description: 'Creeping herbaceous plant found in tropical regions.',
      image: '/cards/Procris-repens.png'
    }
  ];

  const tabs = [
    { id: 'species-cards', label: 'Species Cards' },
    { id: 'how-to-play', label: 'How to Play' }
  ];

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-white relative overflow-hidden m-0 p-0 gap-0">
      {/* Organism Card Modal */}
      {selectedOrganism && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg ${selectedOrganism.image ? 'bg-transparent border-0 p-2 mx-auto w-auto' : 'bg-neutral-800 border-2 border-neutral-600 p-8 mx-4 max-w-2xl w-full'}`}>
            {selectedOrganism.image ? (
              // Card layout with centered image at 300px height
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-end mb-1">
                  <button
                    onClick={() => setSelectedOrganism(null)}
                    className="text-neutral-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={selectedOrganism.image}
                  alt={selectedOrganism.name}
                  className="rounded-lg object-contain"
                  style={{ width: '400px', height: 'auto' }}
                />
              </div>
            ) : (
              // Standard card layout for other organisms
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
                    <div className="space-y-2 text-neutral-400">
                      <div className="flex justify-between">
                        <span>pH Range:</span>
                        <span className="font-mono">5.5 - 8.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-mono">15°C - 30°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span className="font-mono">40% - 90%</span>
                      </div>
                    </div>
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

      {/* Species Card Modal */}
      {selectedSpecies && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-8 max-w-md w-xs mx-4 border-2 border-neutral-600">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{selectedSpecies.icon}</span>
                <h2 className="text-3xl font-bold">{selectedSpecies.name}</h2>
              </div>
              <button
                onClick={() => setSelectedSpecies(null)}
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
                <div className="space-y-2 text-neutral-400">
                  <div className="flex justify-between">
                    <span>pH Level:</span>
                    <span className="font-mono">6.0 - 7.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-mono">18°C - 24°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <span className="font-mono">60% - 80%</span>
                  </div>
                </div>
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

      {/* Left Panel */}
      <div className="w-2/6 p-6 flex flex-col overflow-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          {/* Species Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Species</h2>
            <div className="flex gap-4">
              {species.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSpecies(s)}
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>{s.name}</span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-neutral-700">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'species-cards' && (
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-2">
                {organisms.map((org, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOrganism(org)}
                    className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm text-left transition-colors border border-neutral-700 hover:border-neutral-600"
                  >
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-neutral-500">{org.type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'how-to-play' && (
            <div className="mb-6 text-neutral-400 space-y-4">
              <p>
                In this game, you'll manage environmental
                parameters to create optimal conditions for various organisms to thrive.
              </p>
              <p>
                Adjust the pH, temperature, and humidity levels using the sliders in the Parameters
                tab. Each organism has its own preferred environmental conditions.
              </p>
              <p>
                Explore different species and organisms by clicking on them to learn more about their
                characteristics and optimal living conditions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-4/6 flex" style={{ backgroundColor: 'rgb(23, 23, 23)' }}>
        <iframe
          src="https://editor.p5js.org/saragaviria99/full/1JdW6t0F3"
          className="border-0 w-full h-full"
          title="Species Game"
        />
      </div>
    </div>
  );
}
