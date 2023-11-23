const addressForm = document.getElementById('addressForm');
let marker;

let map = L.map('map').setView([0, 0], 2); // Inicializa el mapa con una vista en coordenadas [0, 0] y zoom 2
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


// Esta función se usará para crear un marcador en una posición específica
function createMarker(lat, lon, display_name) {
  if (marker) {
    marker.remove(); // Eliminar el marcador existente si lo hay
  }
  marker = L.marker([lat, lon], { draggable: true }).addTo(map);
  marker.bindPopup(display_name).openPopup();

  // Al arrastrar el marcador, actualiza los campos de latitud y longitud
  marker.on('dragend', function (event) {
    const position = marker.getLatLng();
    document.getElementById('latitude').value = position.lat.toFixed(6);
    document.getElementById('longitude').value = position.lng.toFixed(6);
  });
}

// Función para buscar la dirección y mostrarla en el mapa
async function searchAddress() {
  const addressInput = document.getElementById('addressInput').value;
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${addressInput}`);
    const { lat, lon, display_name } = response.data[0];
    console.log(response.data[0]);
    createMarker(lat, lon, display_name);
    map.setView([lat, lon], 15);

    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lon;
    document.getElementById('addressName').value = display_name;
    return true;
  } catch (error) {
    console.error('Error al buscar dirección:', error);
    return null;
  }
}

// Buscar al presionar enter
addressInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchAddress();
    }
});

// Función para guardar la dirección obtenida
async function saveAddress() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const addressName = document.getElementById('addressName').value;

    try {
        await axios.post('http://127.0.0.1:8000/api/addresses', { latitude, longitude, addressName }); // Reemplaza con la URL de tu API        
        getAddresses();
        addressForm.reset();
        document.getElementById('addressInput').value = "";
    } catch (error) {
        console.error('Error al agregar dirección:', error);
    }
}


// Función para obtener y mostrar las direcciones
async function getAddresses() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/addresses'); // Reemplaza con la URL de tu API
    const addresses = response.data;
    displayAddresses(addresses);
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
  }
}


// Función para mostrar las direcciones en el DOM
function displayAddresses(addresses) {
    const addressList = document.getElementById('addressList'); // Selecciona el elemento HTML correcto aquí
    addressList.innerHTML = '';
    addresses.forEach(address => {
      const addressItem = document.createElement('div');
      addressItem.innerHTML = `
        <p id="id_address" style="display: none;">${address.id}</p>
        <p><strong>${address.addressName}</strong> - Lat: ${address.latitude} | Long: ${address.longitude}</p>
        <button onclick="deleteAddress(${address.id})">Eliminar</button>
        <button onclick="updateAddress(${address.id},'${address.latitude}','${address.longitude}','${address.addressName}')">Editar</button>
      `;
      addressList.appendChild(addressItem);
    });
  }

// Función para eliminar una dirección
async function deleteAddress(id) {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/addresses/${id}`); // Reemplaza con la URL de tu API
    getAddresses();
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
  }
}


function updateAddress(id, latitude, longitude, addressName){
  const marker = L.marker([latitude, longitude]).addTo(map);
  marker.bindPopup(addressName).openPopup();
  map.setView([latitude, longitude], 15);
  document.getElementById('save_button').style.display = "none";
  document.getElementById('actualizar_button').style.display = "";
  document.getElementById('latitude').value = latitude;
  document.getElementById('longitude').value = longitude;
  document.getElementById('addressName').value = addressName;
}
// Función para editar una dirección
async function editAddress() {
  const id = document.getElementById("id_address");
  const lat = document.getElementById('latitude').value;
  const long = document.getElementById('longitude').value;
  const name = document.getElementById('addressName').value;
  await axios.put(`http://127.0.0.1:8000/api/addresses/${parseInt(id.innerHTML)}`, { latitude:lat, longitude:long, addressName:name });
  getAddresses();
}

// Obtener y mostrar las direcciones al cargar la página
getAddresses();
