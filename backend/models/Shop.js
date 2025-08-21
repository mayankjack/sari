const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Sari Shop'
  },
  logo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Your one-stop destination for beautiful saris'
  },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  settings: {
    currency: {
      type: String,
      default: 'USD'
    },
    currencySymbol: {
      type: String,
      default: '$'
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: 0
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#6366f1'
    },
    secondaryColor: {
      type: String,
      default: '#f59e0b'
    },
    accentColor: {
      type: String,
      default: '#10b981'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);
