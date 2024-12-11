export function parseDate(dateStr) {
  const date = new Date(dateStr);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Return the formatted date
  return `${day}-${month}-${year}`;
}

// Helper function to check if the event is within the same week as today
export const isSameWeek = (date) => {
  const startOfWeek = new Date(currentDate);
  // Adjust to Monday (1) instead of Sunday (0)
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};
