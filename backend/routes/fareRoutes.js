const express = require('express');
const fareRouter = express.Router();
const axios = require('axios');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;



const getDistanceAndDuration = async (source, destination) => {
  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const res = await axios.get(url, {
    params: {
      origins: source,
      destinations: destination,
      key: GOOGLE_API_KEY,
    },
  });

  console.log('Google Distance API response:', res.data);
  const rows = res.data?.rows;
  const elements = rows?.[0]?.elements;

  if (!elements || elements.length === 0 || elements[0].status !== 'OK') {
    throw new Error('Invalid or missing data in Distance Matrix API response');
  }

  const distanceInKm = elements[0].distance.value / 1000;
  const durationInMin = elements[0].duration.value / 60;

  return {
    distance: distanceInKm,
    duration: durationInMin,
  };
};

const calculateFares = (distance, duration) => {
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour >= 22 || hour < 6;
  const isPeakHour = (hour >= 8 && hour < 11) || (hour >= 17 && hour < 20);

  const nightSurchargeRate = 0.2; // 20%
  const peakSurchargeRate = 0.15; // 15%

  const getSurgeMultiplier = () => {
    const surgeProb = Math.random();
    if (surgeProb > 0.85) return 1.5;
    if (surgeProb > 0.6) return 1.25;
    return 1;
  };

  const applyModifiers = (baseFare) => {
    let finalFare = baseFare;

    if (isNight) finalFare *= 1 + nightSurchargeRate;
    if (isPeakHour) finalFare *= 1 + peakSurchargeRate;

    finalFare *= getSurgeMultiplier();

    return +finalFare.toFixed(2);
  };

  return [
    // Uber
    {
      provider: 'Uber',
      type: 'Auto',
      fare: applyModifiers(35 + distance * 13 + duration * 1.5),
    },
    {
      provider: 'Uber',
      type: 'Bike',
      fare: applyModifiers(25 + distance * 10 + duration * 1.2),
    },
    {
      provider: 'Uber',
      type: 'Sedan',
      fare: applyModifiers(50 + distance * 14 + duration * 2.2),
    },
    {
      provider: 'Uber',
      type: 'XL',
      fare: applyModifiers(90 + distance * 18 + duration * 3),
    },

    // Ola
    {
      provider: 'Ola',
      type: 'Auto',
      fare: applyModifiers(30 + distance * 12 + duration * 1.4),
    },
    {
      provider: 'Ola',
      type: 'Bike',
      fare: applyModifiers(24 + distance * 9 + duration * 1.1),
    },
    {
      provider: 'Ola',
      type: 'Sedan',
      fare: applyModifiers(55 + distance * 14 + duration * 2.3),
    },
    {
      provider: 'Ola',
      type: 'XL',
      fare: applyModifiers(85 + distance * 17 + duration * 2.8),
    },

    // Rapido
    {
      provider: 'Rapido',
      type: 'Bike',
      fare: applyModifiers(22 + distance * 9 + duration * 1),
    },
    {
      provider: 'Rapido',
      type: 'Auto',
      fare: applyModifiers(32 + distance * 11.5 + duration * 1.3),
    },
    {
      provider: 'Rapido',
      type: 'Sedan',
      fare: applyModifiers(48 + distance * 13.5 + duration * 2.4),
    },
    {
      provider: 'Rapido',
      type: 'XL',
      fare: applyModifiers(82 + distance * 17.5 + duration * 2.9),
    },

    // Namma Yatri
    {
      provider: 'Namma Yatri',
      type: 'Auto',
      fare: applyModifiers(28 + distance * 11.5 + duration * 1.2),
    },
  ];
};

fareRouter.post('/estimate', async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: 'Source and destination are required' });
  }

  try {
    const { distance, duration } = await getDistanceAndDuration(source, destination);
    const fares = calculateFares(distance, duration);
    const sortedFares = fares.sort((a, b) => a.fare - b.fare);
    const recommendation = sortedFares[0];

    res.status(200).json({
      distance: `${distance.toFixed(2)} km`,
      duration: `${duration.toFixed(2)} mins`,
      fares: sortedFares,
      recommendation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

module.exports = fareRouter;
//comment