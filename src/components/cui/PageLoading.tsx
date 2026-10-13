import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingSkeletonType =
  | "dashboard"
  | "table"
  | "details"
  | "cards"
  | "default";

interface PageLoadingProps {
  type?: LoadingSkeletonType;
  rowCount?: number;
}

export default function PageLoading({
  type = "default",
  rowCount = 7,
}: PageLoadingProps) {
  switch (type) {
    case "dashboard":
      return <DashboardSkeleton />;
    case "details":
      return <DetailsSkeleton />;
    case "cards":
      return <CardsSkeleton />;
    case "table":
    case "default":
    default:
      return <TableSkeleton rowCount={rowCount} />;
  }
}

/**
 * Dashboard Skeleton: Top filter bar, step tabs, KPI cards, large chart area, and snapshot panel.
 */
function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top filter row & step buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Step tabs pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["Revenue", "Gross Margin", "Orders", "Avg Booking", "Users", "Chefs"].map((_, idx) => (
            <Skeleton key={idx} className="h-9 w-24 md:w-28 rounded-full" />
          ))}
        </div>

        {/* Date range & custom popover filters */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      {/* Main Grid: Left KPI, Center Chart, Right Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: KPI cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-36" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>

          <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>

        {/* Center Column: Big chart */}
        <div className="lg:col-span-6 bg-gray-50/80 rounded-xl p-6 border border-gray-100 flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>

          {/* Chart bar placeholders with varying heights */}
          <div className="h-56 flex items-end justify-between gap-3 px-4 pt-6 border-b border-gray-200">
            {[45, 65, 30, 85, 55, 90, 70, 40, 75, 60, 95, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t-sm transition-all"
                  style={{ height: `${height}%` }}
                />
                <Skeleton className="h-2 w-4 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Snapshot panel */}
        <div className="lg:col-span-3 bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-none">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-2.5 w-14" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Skeleton: Top filter pills, search input, styled table rows with avatars/badges, and pagination footer.
 */
function TableSkeleton({ rowCount = 7 }: { rowCount?: number }) {
  return (
    <div className="p-4 md:p-6 space-y-5 animate-in fade-in duration-300">
      {/* Step filters & search row */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Active", "Completed", "Cancelled"].map((_, idx) => (
            <Skeleton key={idx} className="h-9 w-20 md:w-28 rounded-full" />
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <Skeleton className="col-span-2 h-4 w-20" />
          <Skeleton className="col-span-3 h-4 w-32" />
          <Skeleton className="col-span-3 h-4 w-28" />
          <Skeleton className="col-span-2 h-4 w-24" />
          <Skeleton className="col-span-2 h-4 w-16 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rowCount }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50"
            >
              {/* ID / Code */}
              <div className="col-span-2 flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded" />
              </div>

              {/* User / Customer / Chef */}
              <div className="col-span-3 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 w-full">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>

              {/* Date / Info */}
              <div className="col-span-3 space-y-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>

              {/* Status Badge */}
              <div className="col-span-2">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4">
          <Skeleton className="h-4 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Details Skeleton: Header with back button, user hero card, info breakdown cards, and activity table.
 */
function DetailsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header / Breadcrumbs */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full width activity / order history card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Cards Skeleton: For chat / comments / messaging split layouts.
 */
function CardsSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 animate-in fade-in duration-300 min-h-[500px]">
      {/* Left Chat list */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-xl border border-gray-200 p-4 space-y-4 shrink-0 shadow-xs">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/60">
              <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Conversation panel */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
        {/* Chat header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Message bubbles */}
        <div className="space-y-4 py-8">
          <div className="flex gap-3 items-end">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-14 w-64 rounded-2xl rounded-bl-xs" />
          </div>
          <div className="flex gap-3 items-end justify-end">
            <Skeleton className="h-16 w-72 rounded-2xl rounded-br-xs" />
          </div>
          <div className="flex gap-3 items-end">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-10 w-48 rounded-2xl rounded-bl-xs" />
          </div>
        </div>

        {/* Chat input footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
