// Function to validate and return a valid tab limit
function validateTabLimit(tabLimit) {
    if (typeof tabLimit === 'string') {
      tabLimit = parseInt(tabLimit, 10);
    }
    if (typeof tabLimit !== 'number' || isNaN(tabLimit) || tabLimit <= 0) {
      tabLimit = 15;
    } else {
      tabLimit = Math.ceil(tabLimit); // Round up if it's a float
    }
    return tabLimit;
  }
  