import axios from '../lib/axios';

export const fetchFareEstimates = async (source, destination) => {
  const res = await axios.post('/cost/estimate', {
    source,
    destination,
  });
  return res.data;
};