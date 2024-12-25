document.addEventListener('DOMContentLoaded', () => {
    const locationList = document.getElementById('location-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    let locations = [];
    let userLocation = null;

    // Kullanıcının konumunu al
    function getUserLocation() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(userLocation);
                    },
                    error => {
                        console.error("Konum alınamadı:", error);
                        resolve(null);
                    }
                );
            } else {
                resolve(null);
            }
        });
    }

    // İki nokta arasındaki mesafeyi hesapla
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Dünya'nın yarıçapı (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Konumları mesafeye göre sırala
    function sortLocationsByDistance(locations, userLocation) {
        if (!userLocation) return locations;

        return locations.map(location => ({
            ...location,
            distance: calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
        })).sort((a, b) => a.distance - b.distance);
    }

    // Konumları listele
    function displayLocations(locationsToShow) {
        locationList.innerHTML = '';
        locationsToShow.forEach(location => {
            const item = document.createElement('div');
            item.className = 'location-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'location-item-name';
            nameSpan.textContent = location.name;

            const distanceSpan = document.createElement('span');
            distanceSpan.className = 'location-item-distance';
            distanceSpan.textContent = location.distance 
                ? `${location.distance.toFixed(2)} km` 
                : '';

            const routeLink = document.createElement('a');
            routeLink.href = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
            routeLink.className = 'location-item-route';
            routeLink.textContent = 'Yol Tarifi';
            routeLink.target = '_blank';

            item.appendChild(nameSpan);
            item.appendChild(distanceSpan);
            item.appendChild(routeLink);

            locationList.appendChild(item);
        });
    }

    // Veriyi yükle ve işle
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON yüklenirken hata oluştu: ' + response.status);
            }
            return response.json();
        })
        .then(async loadedLocations => {
            locations = loadedLocations;
            
            // Kullanıcı konumunu al
            await getUserLocation();

            // İlk yükleme sırasında konumları mesafeye göre sırala
            const sortedLocations = sortLocationsByDistance(locations, userLocation);
            displayLocations(sortedLocations);

            // Arama işlevi
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredLocations = locations.filter(location => 
                    location.name.toLowerCase().includes(searchTerm)
                );

                // Filtrelenmiş konumları mesafeye göre sırala
                const sortedFilteredLocations = sortLocationsByDistance(filteredLocations, userLocation);
                displayLocations(sortedFilteredLocations);
            });

            // Enter tuşu ile arama
            searchInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    searchButton.click();
                }
            });
        })
        .catch(error => console.error('JSON yüklenirken hata oluştu:', error));
});
