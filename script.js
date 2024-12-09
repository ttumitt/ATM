document.addEventListener('DOMContentLoaded', () => {
    const username = 'ttumitt';
    const password = '12345';

    // Login kontrolü
    const loginForm = document.getElementById('login-form');
    const appContent = document.getElementById('app-content');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const enteredUsername = document.getElementById('username').value;
        const enteredPassword = document.getElementById('password').value;

        if (enteredUsername === username && enteredPassword === password) {
            loginForm.style.display = 'none';
            appContent.style.display = 'block';
        } else {
            alert('Kullanıcı adı veya şifre hatalı!');
        }
    });

    // Konumları yükleme
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
