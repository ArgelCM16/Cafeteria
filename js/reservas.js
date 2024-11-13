

// Selecciona el formulario
const form = document.getElementById("reservationForm");

// Función para enviar la reserva
async function sendReservation(reservationData) {
    try {
        const response = await fetch("https://apicafeteria-production.up.railway.app/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservationData),
        });

        if (response.ok) {
            alert("Reservación creada con éxito!")

            const result = await response.json();
            console.log(result);
            return true; // Reserva enviada
        } else {
            console.error("Error en la respuesta del servidor:", response.statusText);
            alert(error)
            return false; // Error en la reserva
        }
    } catch (error) {
        console.error("Error al enviar la reserva:", error);
        return false; // Error de conexión
    }
}

// Función para manejar el formulario
form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Captura los datos del formulario
    const nameInput = document.querySelector('input[placeholder="Nombre"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');
    const dateInput = document.querySelector('input[placeholder="Fecha"]');
    const timeInput = document.querySelector('input[placeholder="Hora"]');
    const peopleInput = document.querySelector('input[placeholder="People"]');

    // Verifica si los elementos fueron encontrados
    if (!nameInput || !emailInput || !dateInput || !timeInput || !peopleInput) {
        console.error("Uno o más campos del formulario no se encontraron.");
        return; // Sal de la función si hay un error
    }

    // Crea el objeto de la reservación
    const reservationData = {
        name: nameInput.value,
        email: emailInput.value,
        date: new Date(dateInput.value), // Asegúrate de que la fecha esté en el formato correcto
        time: timeInput.value,
        people: parseInt(peopleInput.value, 10),
    };

    // Intenta enviar la reservación
    const sent = await sendReservation(reservationData);

    // Si se envió correctamente, reinicia el formulario
    if (sent) {
        form.reset(); // Reinicia el formulario
        // alert("Reservación creada con éxito!");
    } else {
        saveReservationLocally(reservationData); // Si no se envió, guarda en localStorage
    }
});

// Función para guardar reservas localmente
function saveReservationLocally(reservationData) {
    // Obtiene las reservas guardadas o crea un array vacío
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservationData); // Agrega la nueva reserva
    localStorage.setItem('reservations', JSON.stringify(reservations)); // Guarda en localStorage
    alert("Reserva guardada localmente. Se enviará cuando haya conexión.");
    form.reset(); // Reinicia el formulario
}

// Función para enviar reservas almacenadas en localStorage
async function sendStoredReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    for (const reservation of reservations) {
        const sent = await sendReservation(reservation);

        // Si la reserva se envía con éxito, elimínala del localStorage
        if (sent) {
            removeReservationLocally(reservation);
        }
    }
}

// Función para eliminar una reserva del localStorage
function removeReservationLocally(reservationToRemove) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations = reservations.filter(reservation => {
        return JSON.stringify(reservation) !== JSON.stringify(reservationToRemove);
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Detectar cambios en la conexión
window.addEventListener('online', function () {
    console.log("Conexión restaurada. Enviando reservas guardadas.");
    sendStoredReservations(); // Envía las reservas almacenadas
});

// Ejecutar al cargar la página para intentar enviar las reservas guardadas si ya hay conexión
if (navigator.onLine) {
    sendStoredReservations();
}
