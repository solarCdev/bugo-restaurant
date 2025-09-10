import { getDocs, collection }from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const exp = document.querySelector('h5');
const title = document.querySelector('h1');
const add = document.querySelector('p');

const api_key = 'AIzaSyD99qDYYY2czB3thEEwbRBOR2ucdPfUjxs'

async function getRestaurants() {
  const snapshot = await getDocs(collection(db, "restaurants"));
  const restaurants = [];
  snapshot.forEach((doc) => {
    console.log(doc.data())
    restaurants.push({id: doc.id, ...doc.data()});
  });
  return restaurants;
}

async function getCoordinatesFromAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${api_key}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    return data.results[0].geometry.location; // {lat, lng}
  } else {
    console.error("Geocoding 실패:", data.status);
    return null;
  }
}

const allowedBounds = {
  north: 36.6,
  south: 36.4,
  west: 127.0,
  east: 127.3,
};

const loadGoogleMaps = () => new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}`;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

async function initMap() {
  document.querySelector('.loading').style.display = 'flex';
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.4527, lng: 127.1205 },
    restriction: {
      latLngBounds: allowedBounds,
      strictBounds: true,
    },
    zoom: 18,
    styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        },
      ],
    mapTypeId: "satellite"
  });


  const restaurants = await getRestaurants();

  for (const r of restaurants) {
    let position = null;

    if (r.address) {
      position = await getCoordinatesFromAddress(r.address);
    }
    if (position) {
      const marker = new google.maps.Marker({
        position,
        map,
        title: r.name || "맛집",
      });
      console.log(position)
      marker.addListener("click", () => {
        document.querySelector('.anchor').href = '/info.html?id=' + r.id;
        exp.textContent = (Array(r.features)).join("\n") || "설명이 없습니다.";
        title.textContent = r.name || "이름이 없습니다.";
        add.textContent = r.address || "주소가 없습니다.";
      })
    }
  }
  document.querySelector('.loading').style.display = 'none';
}

window.initMap = initMap;

(async () => {
  await loadGoogleMaps();
  initMap();
})();




