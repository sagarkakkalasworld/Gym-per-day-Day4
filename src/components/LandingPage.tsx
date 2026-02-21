import { Dumbbell, MapPin, Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Gym per Day</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-6 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Pay Per Day, Train Anywhere
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Your Fitness Journey
            <br />
            <span className="text-emerald-600">Never Stops</span>
          </h2>

          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Welcome to Gym Per Day, the ultimate solution for fitness enthusiasts who travel frequently and don't want to miss their workouts. With our app, you can easily find and book gyms in any city for a single day, paying only for what you use, and continue your fitness journey without interruption. At the same time, gym owners can register their gyms, set daily fees, and connect with travelers looking for flexible workout options, increasing visibility and revenue effortlessly. Gym Per Day brings gym-goers and gym owners together in one seamless platform, making fitness accessible, convenient, and affordable wherever you go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-lg shadow-md border border-slate-200">
              Register Your Gym
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Find Gyms Anywhere</h3>
            <p className="text-slate-600">
              Discover gyms in any city you're visiting with our comprehensive database
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pay Per Day</h3>
            <p className="text-slate-600">
              Only pay for the days you use. No subscriptions, no commitments
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Booking</h3>
            <p className="text-slate-600">
              Book your workout session in seconds and get instant confirmation
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">For Gym Owners</h3>
            <p className="text-slate-600">
              Register your gym and reach travelers looking for flexible options
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-slate-600 font-medium">Partner Gyms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-slate-600 font-medium">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">10k+</div>
              <div className="text-slate-600 font-medium">Happy Users</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-emerald-600" />
              <span className="text-slate-900 font-semibold">Gym per Day</span>
            </div>
            <p className="text-slate-600 text-sm">
              © 2024 Gym per Day. Making fitness accessible everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
