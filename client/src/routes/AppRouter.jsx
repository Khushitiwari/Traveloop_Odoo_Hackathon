
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import MyTripsPage from '../pages/MyTripsPage';
import CreateTripPage from '../pages/CreateTripPage';
import ItineraryBuilderPage from '../pages/ItineraryBuilderPage';
import ItineraryViewPage from '../pages/ItineraryViewPage';
import CitySearchPage from '../pages/CitySearchPage';
import ActivitySearchPage from '../pages/ActivitySearchPage';
 import BudgetPage from '../pages/BudgetPage';
import PackingChecklistPage from '../pages/PackingChecklistPage';
import SharedItineraryPage from '../pages/SharedItineraryPage';
import ProfilePage from '../pages/ProfilePage';
import TripNotesPage from '../pages/TripNotesPage';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trips/:id/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />

        
       <Route path="/signup" element={<SignupPage />} />
        <Route path="/shared/:token" element={<SharedItineraryPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
        <Route path="/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
        <Route path="/trips/:id/builder" element={<ProtectedRoute><ItineraryBuilderPage /></ProtectedRoute>} />
        <Route path="/trips/:id/view" element={<ProtectedRoute><ItineraryViewPage /></ProtectedRoute>} />
        <Route path="/trips/:id/cities" element={<ProtectedRoute><CitySearchPage /></ProtectedRoute>} />
        <Route path="/trips/:id/activities/:stopId" element={<ProtectedRoute><ActivitySearchPage /></ProtectedRoute>} />
        <Route path="/trips/:id/checklist" element={<ProtectedRoute><PackingChecklistPage /></ProtectedRoute>} />
        <Route path="/trips/:id/notes" element={<ProtectedRoute><TripNotesPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} /> 
      </Routes>
    </BrowserRouter>
  );
}