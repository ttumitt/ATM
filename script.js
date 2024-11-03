document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const locationList = document.getElementById('location-list');
    let locations = [];

    // Kullanıcının konumunu al
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.error('Tarayıcınız geolocation desteklemiyor.');
    }

    function success(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('JSON yüklenirken hata oluştu: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                locations = data;
                // Konumları kullanıcının konumuna göre sırala
                locations.sort((a, b) => {
                    const distanceA = getDistance(userLat, userLng, a.lat, a.lng);
                    const distanceB = getDistance(userLat, userLng, b.lat, b.lng);
                    return distanceA - distanceB;
                });

                // Başlangıçta tüm konumları listele
                displayLocations(locations);

                // Arama kutusuna dinleyici ekle
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredLocations = locations.filter(location => 
                        location.name.toLowerCase().includes(searchTerm)
                    );
                    displayLocations(filteredLocations);
                });
            })
            .catch(error => console.error('JSON yüklenirken hata oluştu:', error));
    }

    function error() {
        console.error('Kullanıcının konumunu alamadık.');
    }

    // Haversine formülü ile iki koordinat arasındaki mesafeyi hesapla
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Dünya yarıçapı (km)
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Mesafeyi km cinsinden hesapla
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Konumları ekrana yazdır
    function displayLocations(locations) {
        locationList.innerHTML = ''; // Önceki listeyi temizle
        locations.forEach(location => {
            const item = document.createElement('div');
            item.className = 'location-item';
            item.textContent = location.name;
            item.addEventListener('click', () => {
                window.location.href = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            });
            locationList.appendChild(item);
        });
    }
});
