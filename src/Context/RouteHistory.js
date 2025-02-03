// routeHistory.js
const routeHistory = [];

export const addRouteToHistory = (pathname) => {
  routeHistory.push(pathname);
};

export const getPreviousRoute = () => {
  if (routeHistory.length > 1) {
    return routeHistory[routeHistory.length - 2]; // Return second last route
  }
  return null;
};

export const getCurrentHistory = () => routeHistory;
