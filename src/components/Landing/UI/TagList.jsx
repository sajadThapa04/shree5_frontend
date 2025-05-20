import React from "react";

const TagList = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {tag.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  );
};

export default TagList;