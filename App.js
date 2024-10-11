import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// Importing flag images
import brazilFlag from './flags/brazil.png';
import chinaFlag from './flags/china.png';
import englandFlag from './flags/england.png';
import germanyFlag from './flags/germany.png';
import indiaFlag from './flags/india.png';
import indonesiaFlag from './flags/indonesia.png';
import italyFlag from './flags/italy.png';
import japanFlag from './flags/japan.png';
import russiaFlag from './flags/russia.png';
import usaFlag from './flags/usa.png';
import bangladeshFlag from './flags/bangladesh.png';
import pakistanFlag from './flags/pakistan.png';
import nigeriaFlag from './flags/nigeria.png';
import mexicoFlag from './flags/mexico.png';

const PopulationBarChartRace = () => {
    const [year, setYear] = useState(1950); // Start at the year 1950
    const [data, setData] = useState([]);
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [isAutoRunning, setIsAutoRunning] = useState(true); // State for auto play
    const [continent, setContinent] = useState('All'); // State for continent selection

    const continents = ['All', 'Asia', 'Americas', 'Europe', 'Africa'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the Netlify function URL
                const response = await fetch(`https://ubiquitous-cat-da8a2e.netlify.app/.netlify/functions/population?year=${year}`);
                const result = await response.json();

                const filteredData = result.filter(d => d["Country name"] !== "World" && d["Country name"] !== "Less developed regions");

                // Filter by continent if selected
                const continentFilteredData = continent === 'All' 
                    ? filteredData 
                    : filteredData.filter(d => getContinentByCountry(d["Country name"]) === continent);

                // Calculate total population
                const newTotalPopulation = continentFilteredData.reduce((acc, d) => acc + d.Population, 0);

                const processedData = continentFilteredData
                    .map(d => ({
                        country: d["Country name"],
                        population: d.Population,
                    }))
                    .sort((a, b) => b.population - a.population)
                    .slice(0, 10);

                if (processedData.length > 0) {
                    setData(processedData);
                    setTotalPopulation(newTotalPopulation); // Update total population
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [year, continent]);

    useEffect(() => {
        let interval;
        if (isAutoRunning) {
            interval = setInterval(() => {
                setYear(prevYear => (prevYear < 2021 ? prevYear + 1 : 1950));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isAutoRunning]);

    // Function to get continent by country
    const getContinentByCountry = (country) => {
        switch (country) {
            case 'China':
            case 'India':
            case 'Japan':
            case 'Indonesia':
            case 'Pakistan':
            case 'Bangladesh':
                return 'Asia';
            case 'United States':
            case 'Brazil':
            case 'Mexico':
                return 'Americas';
            case 'Germany':
            case 'United Kingdom':
            case 'France':
            case 'Russia':
            case 'Italy':
                return 'Europe';
            case 'Nigeria':
            case 'Ethiopia':
            case 'Egypt':
                return 'Africa';
            default:
                return 'Others';
        }
    };

    // Function to get flag by country
    const getFlagByCountry = (country) => {
        switch (country) {
            case 'Brazil':
                return brazilFlag;
            case 'China':
                return chinaFlag;
            case 'United Kingdom':
                return englandFlag;
            case 'Germany':
                return germanyFlag;
            case 'India':
                return indiaFlag;
            case 'Indonesia':
                return indonesiaFlag;
            case 'Italy':
                return italyFlag;
            case 'Japan':
                return japanFlag;
            case 'Russia':
                return russiaFlag;
            case 'Bangladesh':
                return bangladeshFlag;
            case 'Pakistan':
                return pakistanFlag;
            case 'United States':
                return usaFlag;
            case 'Nigeria':
                return nigeriaFlag;
            case 'Mexico':
                return mexicoFlag;
            default:
                return null;
        }
    };

    // Function to get color by continent
    const getColorByCountry = (country) => {
        switch (country) {
            case 'China':
            case 'India':
            case 'Japan':
            case 'Indonesia':
            case 'Pakistan':
            case 'Bangladesh':
                return '#ff6384'; // Asia
            case 'United States':
            case 'Brazil':
            case 'Mexico':
                return '#36a2eb'; // Americas
            case 'Germany':
            case 'United Kingdom':
            case 'France':
            case 'Russia':
            case 'Italy':
                return '#4bc0c0'; // Europe
            case 'Nigeria':
            case 'Ethiopia':
            case 'Egypt':
                return '#ffce56'; // Africa
            default:
                return '#c9cbcf'; // Default color for others
        }
    };

    const handleYearChange = (event) => {
        setYear(Number(event.target.value));
    };

    const toggleAutoRun = () => {
        setIsAutoRunning(prev => !prev);
    };

    // Custom Bar Component to add flags and color by continent
    const CustomBar = (props) => {
        const { x, y, width, height, country } = props;
        const flag = getFlagByCountry(country);
        const color = getColorByCountry(country);

        return (
            <g>
                <rect x={x} y={y} width={width} height={height} fill={color} />
                {flag && (
                    <image
                        href={flag}
                        x={x + width - 35} // Adjust position to fit inside the bar
                        y={y + 2} // Adjust this to move the flag higher
                        width="30"
                        height="20"
                    />
                )}
            </g>
        );
    };

    // Define legend for the continents
    const renderLegend = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <div><span style={{ backgroundColor: '#ff6384', padding: '5px' }}></span> Asia</div>
                <div><span style={{ backgroundColor: '#36a2eb', padding: '5px' }}></span> Americas</div>
                <div><span style={{ backgroundColor: '#4bc0c0', padding: '5px' }}></span> Europe</div>
                <div><span style={{ backgroundColor: '#ffce56', padding: '5px' }}></span> Africa</div>
                <div><span style={{ backgroundColor: '#c9cbcf', padding: '5px' }}></span> Others</div>
            </div>
        );
    };

    const handleContinentChange = (event) => {
        setContinent(event.target.value);
    };

    return (
        <div className="container">
            <h1>Population growth per country, 1950 to 2021</h1>
            <h2>{year}</h2>
            <h2>Total Population: {totalPopulation.toLocaleString()}</h2>
            <div style={{ marginTop: '20px' }}>
                <select value={continent} onChange={handleContinentChange}>
                    {continents.map(cont => (
                        <option key={cont} value={cont}>{cont}</option>
                    ))}
                </select>
            </div>
            <div style={{ marginTop: '20px' }}>
                <input
                    type="range"
                    min="1950"
                    max="2021"
                    value={year}
                    onChange={handleYearChange}
                    style={{ width: '100%' }}
                />
            </div>
            <button onClick={toggleAutoRun} style={{ marginTop: '20px' }}>
                {isAutoRunning ? 'Stop Auto-Run' : 'Start Auto-Run'}
            </button>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="country" />
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                    <Legend content={renderLegend} />
                    <Bar
                        dataKey="population"
                        label={{ position: 'right', formatter: (value) => value.toLocaleString() }}
                        shape={<CustomBar />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PopulationBarChartRace;
