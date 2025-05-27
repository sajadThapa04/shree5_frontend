// components/RoomBooking/PriceSummary.jsx
const PriceSummary = ({
  pricePerNight,
  checkInDate,
  checkOutDate,
  totalPrice,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Price Breakdown
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">
            ${pricePerNight} ×{" "}
            {checkInDate && checkOutDate
              ? Math.ceil(
                  (new Date(checkOutDate) - new Date(checkInDate)) /
                    (1000 * 60 * 60 * 24)
                )
              : 0}{" "}
            nights
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
