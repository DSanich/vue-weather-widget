const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  return pos.coords
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(success(position)); 
    } , reject, error, options);
  })
}