// src/FormComponent.js
import React, { useState, useEffect } from 'react';
import { isNameValid, getLocations } from '../mockapi/apis';
import './FormComponent.css';

const FormComponent = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [nameValidity, setNameValidity] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const locationsData = await getLocations();
      setLocations(locationsData);
    } catch (error) {
      setError('Error fetching locations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = async (event) => {
    const newName = event.target.value;
    setName(newName);

    if (newName.trim() !== '') {
      try {
        setIsLoading(true);
        const isValid = await isNameValid(newName);
        setNameValidity(isValid);
      } catch (error) {
        setError('Error validating name');
      } finally {
        setIsLoading(false);
      }
    } else {
      setNameValidity(true);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleClear = () => {
    setName('');
    setLocation('');
    setNameValidity(true);
    setError(null);
  };

  const handleAdd = () => {
    if (name.trim() === '' || location.trim() === '') {
      setError('Please enter both name and location');
    } else {
      console.log('Name:', name);
      console.log('Location:', location);
      handleClear();
    }
  };

  return (
    <div className="form-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={handleNameChange}
          className={nameValidity ? 'valid' : 'invalid'}
          disabled={isLoading}
        />
        <select value={location} onChange={handleLocationChange} disabled={isLoading}>
          <option value="">Select location</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <div className="button-container">
          <button onClick={handleClear} disabled={isLoading}>
            Clear
          </button>
          <button onClick={handleAdd} disabled={isLoading}>
            Add
          </button>
        </div>
      </div>
      <div className="display-container">
        <h3>Selected Details:</h3>
        {error && <p className="error-message">{error}</p>}
        <p>Name: {name}</p>
        <p>Location: {location}</p>
      </div>
    </div>
  );
};

export default FormComponent;