'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Discover Your Perfect{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sari
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Explore our exclusive collection of handcrafted saris, designer wear, and traditional Indian clothing. 
              Each piece tells a story of heritage and elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-purple-600 hover:text-purple-600 transition-colors inline-flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Designs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl font-bold">S</span>
                      </div>
                      <p className="text-gray-600 font-medium">Beautiful Sari Collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
            <div className="absolute bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-80 animate-bounce animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
