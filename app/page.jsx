'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Building2,
  Wifi,
  Car,
  Coffee,
  UserPlus
} from 'lucide-react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  const features = [
    { icon: Calendar, title: 'Booking Mudah', desc: 'Reservasi ruangan dalam hitungan detik' },
    { icon: Clock, title: '24/7 Available', desc: 'Akses kapan saja, dimana saja' },
    { icon: MapPin, title: 'Lokasi Strategis', desc: 'Ruangan di berbagai lokasi premium' },
    { icon: Users, title: 'Tim Support', desc: 'Bantuan profesional siap membantu' }
  ];

  const amenities = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Car, label: 'Parking Area' },
    { icon: Coffee, label: 'Refreshments' },
    { icon: Building2, label: 'Modern Facilities' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-20' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-indigo-900/30" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div
          className={`relative z-10 max-w-4xl mx-auto px-6 text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6 leading-tight">
              Room Reservation
              <span className="block text-4xl md:text-5xl mt-2">CCWS</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
              Silakan masuk sebagai <span className="font-bold text-blue-600">Client</span>
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/register">
                <button className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 text-lg">
                  <UserPlus className="w-5 h-5" />
                  Daftar sebagai Client
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </button>
              </Link>
              
              <Link href="/login">
                <button className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 text-lg">
                  <Users className="w-5 h-5" />
                  Login sebagai Client
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">500+</div>
                <div className="text-sm text-gray-600">Ruangan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">10k+</div>
                <div className="text-sm text-gray-600">Reservasi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Mengapa Memilih Kami?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-800">Fasilitas Premium</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex flex-col items-center p-4 rounded-xl hover:bg-white/50 transition-all duration-300">
                <amenity.icon className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 bg-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">Room Reservation App</span>
          <Star className="w-4 h-4 text-yellow-500" />
        </div>
        <p className="text-sm">© 2025 - Reservasi Ruangan Terpercaya</p>
      </footer>
    </div>
  );
}
