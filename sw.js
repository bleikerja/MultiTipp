self.addEventListener("push", (event) => {
    const notification = event.data.json();

    event.waitUntil(
        self.registration.showNotification( 'Schon getippt?', {
            body: "Der nächste " + notification.league + " Spieltag startet bald!",
            icon: "logo.png",
            data: { url: "./tippen" }
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)        
    );
});