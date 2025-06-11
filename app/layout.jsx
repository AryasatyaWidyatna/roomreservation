import '../styles/globals.css';
import React from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Room Reservation App</title>
      </head>
      <body className="bg-gray-100 text-gray-800 font-sans p-4">
        <main className="max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
