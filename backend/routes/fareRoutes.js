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
  return [
    {
      provider: 'Uber',
      type: 'Auto',
      fare: +(30 + distance * 9 + duration * 1.5).toFixed(2),
    },
    {
      provider: 'Ola',
      type: 'Sedan',
      fare: +(50 + distance * 10 + duration * 2).toFixed(2),
    },
    {
      provider: 'Rapido',
      type: 'Bike',
      fare: +(20 + distance * 8 + duration * 1).toFixed(2),
    },
    {
      provider: 'Namma Yatri',
      type: 'Auto',
      fare: +(25 + distance * 7.5 + duration * 1.2).toFixed(2),
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