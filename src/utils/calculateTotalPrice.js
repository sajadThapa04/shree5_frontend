/**
 * Calculates the total price for a room booking
 * @param {number} pricePerNight - The price per night for the room
 * @param {Date|string} checkInDate - The check-in date
 * @param {Date|string} checkOutDate - The check-out date
 * @returns {number} The total price for the booking
 */
export const calculateTotalPrice = (pricePerNight, checkInDate, checkOutDate) => {
  // If any required parameter is missing, return 0
  if (!pricePerNight || !checkInDate || !checkOutDate) {
    return 0;
  }

  // Convert to Date objects if they're strings
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);

  // Calculate the difference in days
  const timeDifference = endDate.getTime() - startDate.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Ensure we have a positive number of days
  const numberOfNights = dayDifference > 0
    ? dayDifference
    : 1;

  // Calculate and return the total price
  return pricePerNight * numberOfNights;
};