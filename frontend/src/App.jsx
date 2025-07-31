import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Filter, Star, Clock, Package, Zap, Globe, TrendingDown } from 'lucide-react';

const DealFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Mock data for demonstration
  const mockResults = [
    {
      id: 1,
      title: "iPhone 14 Pro Max 256GB",
      price: "$899",
      originalPrice: "$1099",
      discount: "18%",
      condition: "New",
      location: "New York, USA",
      coordinates: [40.7128, -74.0060],
      rating: 4.8,
      seller: "TechDeals Pro",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      source: "Amazon"
    },
    {
      id: 2,
      title: "iPhone 14 Pro Max 128GB",
      price: "$749",
      originalPrice: "$999",
      discount: "25%",
      condition: "3 months used",
      location: "California, USA",
      coordinates: [36.7783, -119.4179],
      rating: 4.5,
      seller: "SecondHand Tech",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      source: "eBay"
    },
    {
      id: 3,
      title: "iPhone 14 Pro Max 512GB",
      price: "$1199",
      originalPrice: "$1299",
      discount: "8%",
      condition: "New",
      location: "London, UK",
      coordinates: [51.5074, -0.1278],
      rating: 4.9,
      seller: "UK Electronics",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      source: "Local Store"
    },
    {
      id: 4,
      title: "iPhone 14 Pro Max 128GB",
      price: "$820",
      originalPrice: "$999",
      discount: "18%",
      condition: "Like new",
      location: "Tokyo, Japan",
      coordinates: [35.6762, 139.6503],
      rating: 4.7,
      seller: "Japan Electronics",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      source: "Local Store"
    }
  ];

  // Initialize map when results are shown
  useEffect(() => {
    if (showResults && results.length > 0 && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet CSS and JS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
      document.head.appendChild(cssLink);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    }
  }, [showResults, results]);

  const initializeMap = () => {
    if (!window.L || mapInstanceRef.current) return;

    // Calculate center point of all deals
    const avgLat = results.reduce((sum, result) => sum + result.coordinates[0], 0) / results.length;
    const avgLng = results.reduce((sum, result) => sum + result.coordinates[1], 0) / results.length;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([avgLat, avgLng], 4);
    mapInstanceRef.current = map;

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each deal
    results.forEach((result) => {
      const marker = window.L.marker(result.coordinates).addTo(map);
      
      // Custom popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <img src="${result.image}" alt="${result.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${result.title}</h4>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; font-weight: bold; color: #059669;">${result.price}</span>
            <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">-${result.discount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666;">
            <span>${result.condition}</span>
            <span>⭐ ${result.rating}</span>
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">
            <div>📍 ${result.location}</div>
            <div>🏪 ${result.seller}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      // Add click event to highlight corresponding deal card
      marker.on('click', () => {
        setSelectedDeal(result.id);
        // Scroll to the deal card
        const dealElement = document.getElementById(`deal-${result.id}`);
        if (dealElement) {
          dealElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    const group = new window.L.featureGroup(markersRef.current);
    map.fitBounds(group.getBounds().pad(0.1));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  const getConditionColor = (condition) => {
    return condition === "New" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  };

  const highlightDealOnMap = (dealId) => {
    setSelectedDeal(dealId);
    const deal = results.find(r => r.id === dealId);
    if (deal && mapInstanceRef.current && markersRef.current[dealId - 1]) {
      mapInstanceRef.current.setView(deal.coordinates, 8);
      markersRef.current[dealId - 1].openPopup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">DealFinder</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                Sign In
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        {!showResults && (
          <main className="container mx-auto px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
                Find the Best <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Deals</span> Worldwide
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Search for any product and discover the best prices from multiple sources. Our AI-powered system finds deals from local stores and online marketplaces.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                  <Search className="w-6 h-6 text-gray-400 ml-6" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for any product... (e.g., iPhone 14 Pro Max)"
                    className="flex-1 px-6 py-6 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 mr-2"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Globe className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Global Search</h3>
                  <p className="text-gray-300">Search across multiple countries and platforms simultaneously</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <TrendingDown className="w-12 h-12 text-green-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Best Prices</h3>
                  <p className="text-gray-300">AI-powered price comparison and condition analysis</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <MapPin className="w-12 h-12 text-pink-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Location Based</h3>
                  <p className="text-gray-300">Find deals near you with interactive map visualization</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Results Section */}
        {showResults && (
          <main className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => {
                  setShowResults(false);
                  setSelectedDeal(null);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                    markersRef.current = [];
                  }
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>New Search</span>
              </button>
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select className="bg-white/10 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/20">
                  <option value="price">Sort by Price</option>
                  <option value="condition">Sort by Condition</option>
                  <option value="location">Sort by Location</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Results List */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Found {results.length} deals for "{searchQuery}"
                </h3>
                
                {results.map((result) => (
                  <div 
                    key={result.id} 
                    id={`deal-${result.id}`}
                    className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                      selectedDeal === result.id 
                        ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/20' 
                        : 'border-white/20 hover:bg-white/20'
                    }`}
                    onClick={() => highlightDealOnMap(result.id)}
                  >
                    <div className="flex items-start space-x-6">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-2">{result.title}</h4>
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(result.condition)}`}>
                                {result.condition}
                              </span>
                              <div className="flex items-center space-x-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-gray-300">{result.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>{result.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-3xl font-bold text-white">{result.price}</span>
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">-{result.discount}</span>
                            </div>
                            <span className="text-gray-400 line-through">{result.originalPrice}</span>
                            <p className="text-sm text-purple-300 mt-1">via {result.source}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-300">Sold by {result.seller}</span>
                          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                            View Deal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Map Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-8">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Deal Locations
                  </h4>
                  
                  {/* Interactive Map */}
                  <div className="mb-4">
                    <div 
                      ref={mapRef}
                      className="w-full h-64 rounded-xl overflow-hidden"
                      style={{ minHeight: '256px' }}
                    />
                  </div>

                  {/* Location Summary */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 mb-3">Click on markers or deals to explore locations</p>
                    {results.map((result) => (
                      <div 
                        key={result.id} 
                        className={`flex items-center justify-between text-sm cursor-pointer p-2 rounded-lg transition-colors ${
                          selectedDeal === result.id ? 'bg-purple-500/20' : 'hover:bg-white/10'
                        }`}
                        onClick={() => highlightDealOnMap(result.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedDeal === result.id ? 'bg-purple-400' : 'bg-gray-400'}`}></div>
                          <span className="text-gray-300">{result.location}</span>
                        </div>
                        <span className="text-white font-medium">{result.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default DealFinder;