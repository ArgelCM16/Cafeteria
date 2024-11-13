(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// js/main.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./js/service-worker.js') // asegúrate de poner la ruta correcta
        .then(function(registration) {
          console.log('Service Worker registrado con éxito:', registration.scope);
        }, function(error) {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }
  

  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Evitar que el prompt de instalación se muestre automáticamente
  e.preventDefault();
  deferredPrompt = e;

  // Muestra tu propio botón de "Instalar PWA"
  const installButton = document.getElementById('installBtn');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Espera la respuesta del usuario
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó la instalación');
      } else {
        console.log('El usuario rechazó la instalación');
      }
      deferredPrompt = null;
    });
  });
});

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
    alert("Conexión restaurada. Enviando reservas guardadas.");
    sendStoredReservations(); // Envía las reservas almacenadas
});


// Solicitar permisos para las notificaciones
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Permiso de notificación concedido.");
            } else {
                console.log("Permiso de notificación denegado.");
            }
        });
    } else {
        console.error("Las notificaciones no están soportadas en este navegador.");
    }
}

// Llamar a la función cuando la página se carga
window.onload = requestNotificationPermission;

// Función para mostrar la notificación
function showNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        const options = {
            body: body,
            icon: "/path-to-icon/icon.png", // Opcional, agrega un ícono
        };
        new Notification(title, options);
    }
}



// Modificar la función de enviar reservas almacenadas
async function sendStoredReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    for (const reservation of reservations) {
        const sent = await sendReservation(reservation);

        // Si la reserva se envía con éxito, elimínala del localStorage y muestra notificación
        if (sent) {
            removeReservationLocally(reservation);
            showNotification("Reservación enviada", "Una reservación guardada localmente ha sido enviada.");
        }
    }
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
