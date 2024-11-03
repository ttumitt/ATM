document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON yüklenirken hata oluştu: ' + response.status);
            }
            return response.json();
        })
        .then(locations => {
            const locationList = document.getElementById('location-list');

            locations.forEach(location => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = location.name;
                item.addEventListener('click', () => {
                    window.location.href = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
                });
                locationList.appendChild(item);
            });
        })
        .catch(error => console.error('JSON yüklenirken hata oluştu:', error));
});