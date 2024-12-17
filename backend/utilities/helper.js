function formatDate(dateStr) {
    const date = new Date(dateStr);
  
    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
  
    // Return the formatted date
    return `${day}-${month}-${year}`;
}

function convertArrayToStrings(arr) {
    return arr.map(item => {
      if (typeof item === "string") {
        return item; // Already a string
      }
      if (item === null || item === undefined) {
        return ""; // Handle null or undefined
      }
      return item.toString(); // Convert anything else to string
    });
  }
  

module.exports ={ formatDate, convertArrayToStrings };