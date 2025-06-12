const PriceSummary = ({
  pricePerNight,
  checkInDate,
  checkOutDate,
  totalPrice,
}) => {
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    
    // Normalize to noon to match date handling
    start.setHours(12, 0, 0, 0);
    end.setHours(12, 0, 0, 0);
    
    const timeDiff = end - start;
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    return Math.max(1, Math.ceil(dayDiff));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Price Breakdown
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">
            ${pricePerNight} × {calculateNights()} nights
          </span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-rose-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
