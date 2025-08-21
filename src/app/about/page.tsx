'use client'

import React from 'react'
import { Heart, Award, Users, Globe, Star, Shield } from 'lucide-react'

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Heart },
    { label: 'Years of Experience', value: '25+', icon: Award },
    { label: 'Team Members', value: '50+', icon: Users },
    { label: 'Countries Served', value: '30+', icon: Globe }
  ]

  const values = [
    {
      icon: Star,
      title: 'Quality First',
      description: 'We never compromise on quality. Every sari is carefully selected and quality-checked before reaching our customers.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations with every interaction.'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'Building trust through transparent business practices and reliable service delivery.'
    }
  ]

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: '/api/placeholder/200/200',
      bio: 'With over 25 years of experience in the textile industry, Priya founded Sari Shop with a vision to bring authentic Indian craftsmanship to the world.'
    },
    {
      name: 'Rajesh Patel',
      role: 'Creative Director',
      image: '/api/placeholder/200/200',
      bio: 'Rajesh brings his artistic vision and deep understanding of traditional Indian designs to create unique collections.'
    },
    {
      name: 'Meera Singh',
      role: 'Head of Operations',
      image: '/api/placeholder/200/200',
      bio: 'Meera ensures smooth operations and maintains the highest standards of customer service.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Bringing the timeless elegance of Indian saris to the world, one beautiful piece at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              To preserve and promote the rich cultural heritage of Indian textiles while making authentic, 
              high-quality saris accessible to women worldwide. We believe every woman deserves to experience 
              the beauty and elegance of a handcrafted sari.
            </p>
            <p className="text-lg text-gray-600">
              Our mission extends beyond just selling saris - we are storytellers, connecting people with 
              the centuries-old traditions of Indian craftsmanship.
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-6">
              To become the world's most trusted destination for authentic Indian saris, known for our 
              commitment to quality, authenticity, and exceptional customer experience.
            </p>
            <p className="text-lg text-gray-600">
              We envision a world where the beauty of Indian textiles is celebrated globally, and every 
              woman can find her perfect sari that tells her unique story.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="md:w-1/2">
                <img
                  src="/api/placeholder/500/300"
                  alt="Our humble beginnings"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Beginning (1998)</h3>
                <p className="text-gray-600 mb-4">
                  It all started in a small shop in Mumbai, where our founder Priya Sharma began her journey 
                  with a simple dream - to share the beauty of Indian saris with the world.
                </p>
                <p className="text-gray-600">
                  What began as a small family business has grown into a beloved destination for sari lovers 
                  worldwide, while maintaining the same passion and commitment to quality.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="md:w-1/2">
                <img
                  src="/api/placeholder/500/300"
                  alt="Growth and expansion"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Growth & Expansion (2005-2015)</h3>
                <p className="text-gray-600 mb-4">
                  As our reputation grew, so did our reach. We expanded to multiple cities across India, 
                  bringing our curated collections to more customers.
                </p>
                <p className="text-gray-600">
                  We also began working directly with master artisans and weavers, ensuring fair compensation 
                  and preserving traditional techniques.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="md:w-1/2">
                <img
                  src="/api/placeholder/500/300"
                  alt="Going global"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Going Global (2015-Present)</h3>
                <p className="text-gray-600 mb-4">
                  With the advent of e-commerce, we took our passion global. Today, we serve customers in 
                  over 30 countries, bringing the magic of Indian saris to women worldwide.
                </p>
                <p className="text-gray-600">
                  Despite our growth, we remain true to our roots - every sari still tells a story, every 
                  piece still carries the warmth of Indian craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
