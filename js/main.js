import db  from "./core/db.js";
import App from "./src/app.js";

async function bootstrap() {
    try {
        await db.connect();
        const app = new App();

        app.load();

    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

window.addEventListener("DOMContentLoaded", bootstrap);