'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Fashion Designer',
    content: 'The quality of saris from Sari Shop is exceptional. I love how they maintain traditional craftsmanship while offering modern designs. Perfect for both casual and special occasions.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: '2',
    name: 'Anjali Patel',
    role: 'Bride',
    content: 'I found my dream bridal sari here! The collection is stunning and the customer service is outstanding. They helped me choose the perfect piece for my special day.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: '3',
    name: 'Meera Reddy',
    role: 'Corporate Professional',
    content: 'As someone who wears saris to work, I appreciate the comfort and style of their cotton collection. The handloom saris are breathable and elegant.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: '4',
    name: 'Sunita Verma',
    role: 'Teacher',
    content: 'Great variety and reasonable prices. I have been shopping here for years and the quality has always been consistent. Highly recommend for traditional wear.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  }
]

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Do not just take our word for it - hear from our satisfied customers about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-purple-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 line-clamp-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Unique Designs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Cities Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9</div>
              <div className="text-purple-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
