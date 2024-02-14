import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AboutUs = () => {
  const [aboutUs, setAboutUs] = useState({ title: '', content: '', imageUrl: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Adjust the fetch URL if your environment variable or direct URL is different
    axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`)
      .then(response => {
        setAboutUs(response.data);
      })
      .catch(err => {
        setError('Failed to fetch About Us data');
        console.error('Error fetching About Us data:', err);
      });
  }, []);

  return (
    <div className="AboutUs">
      {error && <p className="AboutUs-error">{error}</p>}
      {!error && (
        <>
          <h1>{aboutUs.title}</h1>
          {aboutUs.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <img src={aboutUs.imageUrl} alt="About Us" style={{ maxWidth: '100%' }} />
        </>
      )}
    </div>
  );
};

export default AboutUs;
