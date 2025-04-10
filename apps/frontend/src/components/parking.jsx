import { useState } from 'react';

const ParkingPage = () => {
  const [vacantSpots] = useState(['A1', 'A2', 'B3', 'C4', 'A5', 'A6', 'F9']);
  const [totalSpots, setTotalSpots] = useState(100);
  const NoOfVacantSpots = vacantSpots.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Parking Helper</h1>
      <div className="flex gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Total Spaces</h2>
          <p className="text-3xl font-bold">{totalSpots}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Vacant Spaces</h2>
          <p className="text-3xl font-bold">{NoOfVacantSpots}</p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {vacantSpots.map((spot, index) => (
          <div
            key={index}
            className={`h-16 rounded-lg flex items-center bg-red-400 justify-center text-black font-bold`}
          >
            {spot}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
