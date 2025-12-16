'use client';

import { useState } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { formatDateText } from '@/lib/utils/date.util';
import { cn } from '@/lib/utils/cn';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(selectedDate);

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handlePrevMonth = () => {
    setCalendarMonth(subDays(startOfMonth(calendarMonth), 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(addDays(endOfMonth(calendarMonth), 1));
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setShowCalendar(false);
  };

  // Generate calendar days
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for alignment
  const startDay = monthStart.getDay();
  const emptyCells = Array(startDay).fill(null);

  return (
    <div className="sticky top-[73px] z-50 bg-surface border-b border-border">
      {/* Date Navigation */}
      <div className="flex items-center justify-between px-4 py-3 relative">
        <button
          onClick={handlePrevDay}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-background transition-colors"
          aria-label="Previous day"
        >
          ◄
        </button>

        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-background transition-colors font-semibold text-[15px]"
        >
          <span>{formatDateText(selectedDate)}</span>
          <span className={cn('text-[10px] transition-transform', showCalendar && 'rotate-180')}>
            ▼
          </span>
        </button>

        <button
          onClick={handleNextDay}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-background transition-colors"
          aria-label="Next day"
        >
          ►
        </button>

        {/* Calendar Popup */}
        {showCalendar && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowCalendar(false)}
            />

            {/* Calendar */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[340px] max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-xl shadow-heavy z-50 animate-slide-down">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  ◄
                </button>
                <span className="font-bold text-[15px]">
                  {format(calendarMonth, 'MMMM yyyy')}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  ►
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 p-3">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center py-2 text-[12px] font-semibold text-gray-500">
                    {day}
                  </div>
                ))}

                {/* Empty cells */}
                {emptyCells.map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Date cells */}
                {days.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        'py-2.5 text-center text-[14px] rounded-lg transition-all hover:bg-background',
                        isSelected && 'bg-primary-light text-primary font-bold',
                        isToday && !isSelected && 'bg-primary text-white font-bold'
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}