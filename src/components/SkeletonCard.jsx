import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-28 rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 rounded-2xl bg-slate-200" />
          <div className="h-4 w-full rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 rounded-full bg-slate-100" />
        </div>
        <div className="h-14 w-14 rounded-2xl bg-slate-200" />
      </div>
      <div className="mt-6 h-8 w-40 rounded-full bg-slate-100" />
    </div>
  );
};

export default SkeletonCard;
