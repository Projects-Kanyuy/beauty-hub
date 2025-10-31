import React from 'react';
import { useParams } from 'react-router-dom'; // We'll use this hook

const ListingDetailPage = () => {
  // The useParams hook lets us read the ':id' from the URL
  const { id } = useParams();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-heading">Listing Detail Page</h1>
      <p className="mt-4">Showing details for listing with ID: <strong>{id}</strong></p>
      <p>This is where the full salon profile with gallery, services, and reviews will go.</p>
    </div>
  );
};

export default ListingDetailPage;