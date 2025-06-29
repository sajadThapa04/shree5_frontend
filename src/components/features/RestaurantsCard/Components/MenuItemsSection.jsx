import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";

const MenuItemsSection = ({ items = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
        Menu Highlights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <FaUtensils className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {item.name}
              </h4>
              <p className="text-rose-600 font-semibold">
                ${item.price.toFixed(2)}
              </p>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {items.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
        >
          {showAll ? "Show Less" : `Show All (${items.length})`}
        </button>
      )}
    </div>
  );
};

export default MenuItemsSection;
