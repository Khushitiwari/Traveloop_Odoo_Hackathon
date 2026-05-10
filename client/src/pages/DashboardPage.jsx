
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  CalendarClock,
  Wallet,
  Building2,
  Compass,
  Plus,
  ArrowRight,
  MapPin,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import TripCard from '../components/trips/TripCard';
import Loader from '../components/common/Loader';

const POPULAR_DESTINATIONS = [
  {
    name: 'Paris', country: 'France', region: 'Europe', color: 'from-amber-100 to-amber-50',
    famousPlaces: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise'],
  },
  {
    name: 'Tokyo', country: 'Japan', region: 'Asia', color: 'from-blush-100 to-blush-50',
    famousPlaces: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Meiji Shrine'],
  },
  {
    name: 'Rome', country: 'Italy', region: 'Europe', color: 'from-mint-100 to-mint-50',
    famousPlaces: ['Colosseum', 'Roman Forum', 'Trevi Fountain', 'Vatican Museums'],
  },
  {
    name: 'Bangkok', country: 'Thailand', region: 'Asia', color: 'from-purple-100 to-purple-50',
    famousPlaces: ['Grand Palace', 'Wat Arun', 'Chatuchak Market', 'Chao Phraya Cruise'],
  },
  {
    name: 'New York', country: 'USA', region: 'Americas', color: 'from-blue-100 to-blue-50',
    famousPlaces: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const destinationIcon = (region) => {
    if (region === 'Europe') return Landmark;
    if (region === 'Asia') return Compass;
    return MapPin;
  };

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date()).slice(0, 3);
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget?.totalBudget || 0), 0);

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <p className="text-cream-500 text-sm font-medium mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-display font-semibold text-mint-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="text-mint-500">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-cream-500 mt-1">Ready to plan your next adventure?</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
            {[
              { label: 'Total Trips', value: trips.length, icon: Globe, color: 'bg-mint-50 border-mint-200' },
              { label: 'Upcoming', value: trips.filter(t => new Date(t.startDate) > new Date()).length, icon: CalendarClock, color: 'bg-amber-50 border-amber-200' },
              { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: Wallet, color: 'bg-blush-50 border-blush-200' },
              { label: 'Cities Planned', value: trips.reduce((s, t) => s + (t.stops?.length || 0), 0), icon: Building2, color: 'bg-cream-100 border-cream-300' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
                <div className="mb-2"><stat.icon size={22} className="text-mint-800" /></div>
                <div className="text-2xl font-display font-semibold text-mint-900">{stat.value}</div>
                <div className="text-xs text-cream-700 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Plan New Trip CTA */}
          <div className="bg-gradient-to-r from-mint-200 to-mint-100 border border-mint-300 rounded-2xl p-6 mb-8 flex items-center justify-between animate-fade-in">
            <div>
              <h3 className="text-lg font-display font-semibold text-mint-900 mb-1">Ready for a new adventure?</h3>
              <p className="text-mint-800 text-sm">Build your perfect itinerary in minutes.</p>
            </div>
            <button onClick={() => navigate('/trips/new')} className="bg-mint-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-mint-700 transition-colors whitespace-nowrap text-sm inline-flex items-center gap-2">
              <Plus size={16} /> Plan a Trip
            </button>
          </div>

          {/* Upcoming Trips */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading mb-0">Upcoming Trips</h2>
              <button onClick={() => navigate('/trips')} className="text-mint-500 text-sm font-medium hover:text-mint-700 transition-colors inline-flex items-center gap-1">
                View all <ArrowRight size={14} />
              </button>
            </div>
            {loading ? <Loader /> : upcomingTrips.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-10 text-center">
                <div className="mb-3 flex justify-center"><Compass className="text-mint-700" size={32} /></div>
                <p className="text-cream-700 font-medium">No upcoming trips yet</p>
                <p className="text-cream-600 text-sm mt-1">Start planning your next adventure!</p>
                <button onClick={() => navigate('/trips/new')} className="btn-primary mt-4">Create Trip</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onDelete={id => setTrips(prev => prev.filter(t => t.id !== id))} />
                ))}
              </div>
            )}
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="section-heading">Explore Destinations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {POPULAR_DESTINATIONS.map(dest => (
                <div key={dest.name} className={`bg-gradient-to-b ${dest.color} rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setSelectedDestination(dest)}>
                  <div className="mb-2 flex justify-center">
                    {(() => {
                      const Icon = destinationIcon(dest.region);
                      return <Icon size={26} className="text-mint-800" />;
                    })()}
                  </div>
                  <p className="font-display font-semibold text-sm text-mint-800">{dest.name}</p>
                  <p className="text-xs text-cream-700">{dest.country}</p>
                </div>
              ))}
            </div>

            {selectedDestination && (
              <div className="mt-5 bg-white rounded-2xl border border-cream-200 p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold text-mint-900 text-xl">
                      {selectedDestination.name}, {selectedDestination.country}
                    </h3>
                    <p className="text-sm text-cream-700 mt-1">Region: {selectedDestination.region}</p>
                  </div>
                  <button onClick={() => navigate('/trips/new')} className="btn-primary text-sm">
                    Plan Trip Here
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-mint-900 mb-2">Famous places:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.famousPlaces.map((place) => (
                      <span key={place} className="badge-cream text-xs">{place}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}