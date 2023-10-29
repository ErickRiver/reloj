function formatearNumero(numero) {
    // return condición ? valor_si_verdadero : valor_si_falso;
    return numero < 10 ? `0${numero}` : `${numero}`;
}

function mostrarHora() {
    // Crear una instancia del objeto Date
    const fechaActual = new Date();

    // Obtener el dia, mes y año
    const dia = formatearNumero(fechaActual.getDate());
    const anio = fechaActual.getFullYear();

    const meses = {
        "1": "Enero",
        "2": "Febrero",
        "3": "Marzo",
        "4": "Abril",
        "5": "Mayo",
        "6": "Junio",
        "7": "Julio",
        "8": "Agosto",
        "9": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
    };

    const mes = meses[fechaActual.getMonth() + 1];
    const diaActual = `${dia} / ${mes} / ${anio}`;

    // Obtener la hora, minutos y segundos
    const horas = formatearNumero(fechaActual.getHours());
    const minutos = formatearNumero(fechaActual.getMinutes());
    const segundos = formatearNumero(fechaActual.getSeconds());

    // Formatear la hora actual en "HH:MM:SS"
    const horaActual = `${horas}:${minutos}:${segundos}`;

    // Obtener el elemento h1 con el id "hora"
    const elementoHora = document.getElementById("hora");
    const elementoFecha = document.getElementById("fecha");

    // Establecer el contenido del elemento h1 con la hora actual
    elementoHora.textContent = horaActual;
    elementoFecha.textContent = diaActual;
}

mostrarHora();
setInterval(mostrarHora, 1000);


/** FUNCION QUE MUESTRA LA BARRA DE NAVEGACION**/
function toggleNavbar() {
    var navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}

/** FUNCION QUE OCULTA LA BARRA DE NAVEGACION**/
function closeNavbarOutsideClick(event) {
    var navbar = document.querySelector('.navbar');
    var icon = document.querySelector('#navbar-icon');

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.classList.remove('active');
    }
}

/** AL DAR CLIC EN EL DOM SE OCULTARA LA NAVBAR**/
document.addEventListener('click', closeNavbarOutsideClick);

/** CLASE CON LAS FUNCIONES DEL CRONOMETRO **/
class Cronometro {
    constructor() {
        this.tiempoInicio = 0;
        this.estaCorriendo = false;
        this.intervalo = null;
        this.tiempoTrasncurrido = 0;
    }

    iniciar() {
        if (!this.estaCorriendo) {
            this.tiempoInicio = Date.now() - this.tiempoTrasncurrido;
            this.estaCorriendo = true;
            this.intervalo = setInterval(() => this.actualizar(), 10); //Se actualiza cada 10 millisegundos
        }
    }

    detener() {
        if (this.estaCorriendo) {
            clearInterval(this.intervalo); //Detiene el temporizador que está ejecutando el cronómetro.
            this.estaCorriendo = false;
            this.tiempoTrasncurrido = Date.now() - this.tiempoInicio; // Tiempo transcurrido mientras el cronómetro corria.
        }
    }

    reiniciar() {
        this.tiempoInicio = 0;
        this.estaCorriendo = false;
        this.tiempoTrasncurrido = 0;
        this.actualizar();
    }

    actualizar() {
        const currentTime = Date.now();

        // Valida si el cronometro se le ha dado play
        // Suma el tiempo transcurrido (currentTime - this.tiempoInicio) con el tiempo transcurrido previamente (this.tiempoTrasncurrido).
        // Si el cronometro esta detenido solo toma el tiempoTrasncurrido anteriormente
        const tiempoTrasncurrido = this.estaCorriendo ? currentTime - this.tiempoInicio + this.tiempoTrasncurrido : this.tiempoTrasncurrido;

        const horas = formatearNumero(Math.floor(tiempoTrasncurrido / 3600000));
        const minutos = formatearNumero(Math.floor((tiempoTrasncurrido % 3600000) / 60000));
        const segundos = formatearNumero(Math.floor((tiempoTrasncurrido % 60000) / 1000));
        const centesimas = formatearNumero(Math.floor((tiempoTrasncurrido % 1000) / 10));


        document.getElementById("cronometro").textContent = `${horas}:${minutos}:${segundos}.${centesimas}`;
    }
}

const cronometro = new Cronometro();

const btnIniciar = document.querySelector('.btn.btnIniciar');
const btnDetener = document.querySelector('.btn.btnDetener');
const btnReiniciar = document.querySelector('.btn.btnReiniciar');

var elementCronometro = document.getElementById("cronometro");

btnIniciar.addEventListener("click", function () {
    cronometro.iniciar();
    btnDetener.style.display = "block";
    btnIniciar.style.display = "none";
});

btnDetener.addEventListener("click", function () {
    cronometro.detener();
    btnDetener.style.display = "none";
    btnIniciar.style.display = "block";
});

btnReiniciar.addEventListener("click", function () {
    cronometro.reiniciar();
    btnDetener.style.display = "none";
    btnIniciar.style.display = "block";
});


/** CLASE CON LAS FUNCIONES DE TEMPORIZADOR **/
class Temporizador {
    constructor(numero) {
        this.numero = numero;
        this.startTime = null; // Cambiar esto a null
        this.progress = null;
        this.progressPercentage = null;
        this.lastProgressStartTime = null; // Agregar una nueva propiedad

        const iniciar = {
            "1": 60000,
            "2": 180000,
            "3": 300000,
            "4": 600000,
        };

        this.duracion = iniciar[numero];
        this.tiempoRestante = iniciar[numero];
        this.temporizador = null;

        this.currentTime = null;
        this.elapsedTime = null;

        this.iniciarBtn = document.getElementById(`iniciar${this.numero}`);
        this.detenerBtn = document.getElementById(`detener${this.numero}`);
        this.reiniciarBtn = document.getElementById(`reiniciar${this.numero}`);
        this.elementoTemporizador = document.getElementById(`temporizador${this.numero}`);
        this.circularProgress = document.querySelector(`.circular-progress${this.numero}`);

        this.iniciarBtn.addEventListener("click", () => this.iniciarTemporizador());
        this.iniciarBtn.addEventListener("click", () => this.barraProgreso());
        this.detenerBtn.addEventListener("click", () => this.detenerTemporizador());
        this.reiniciarBtn.addEventListener("click", () => this.reiniciarTemporizador(iniciar[numero]));

        this.actualizarTiempo();
    }

    barraProgreso() {
        if (!this.progress) {
            if (!this.startTime) {
                this.startTime = Date.now();
            } else if (this.lastProgressStartTime) {
                // Si ya se inició previamente y se detuvo, ajustar startTime
                this.startTime += Date.now() - this.lastProgressStartTime;
            }
            
            this.progress = setInterval(() => {
                this.currentTime = Date.now();
                this.elapsedTime = this.currentTime - this.startTime;
                if (this.elapsedTime >= this.duracion) {
                    clearInterval(this.progress);
                    this.circularProgress.style.background = `conic-gradient(#236fa2 360deg, #ececec 0deg)`;
                } else {
                    this.iniciarTemporizador();
                }
            }, 10);
        }
    }

    iniciarTemporizador() {
        if (!this.temporizador) {
            this.temporizador = setInterval(() => {
                this.tiempoRestante -= 10;
                if (this.tiempoRestante <= 0) {
                    this.detenerTemporizador();
                } else {
                    this.actualizarTiempo();
                }
            }, 10);
            this.iniciarBtn.style.display = "none";
            this.detenerBtn.style.display = "block";
        }
    }

    detenerTemporizador() {
        clearInterval(this.temporizador);
        this.temporizador = null;
        clearInterval(this.progress);
        this.progress = null;
        this.lastProgressStartTime = Date.now(); // Guardar el tiempo cuando se detiene
        this.actualizarTiempo();
        this.iniciarBtn.style.display = "block";
        this.detenerBtn.style.display = "none";
    }

    reiniciarTemporizador(tiempoRestante) {
        this.detenerTemporizador();
        this.startTime = null; // Reiniciar startTime a null
        this.tiempoRestante = tiempoRestante;
        this.actualizarTiempo();
        this.iniciarBtn.style.display = "block";
        this.detenerBtn.style.display = "none";

        this.circularProgress.style.background = `conic-gradient(#236fa2 0deg, #ececec 0deg)`;
        console.log(this.progressPercentage)
    }

    actualizarTiempo() {
        const horas = formatearNumero(Math.floor(this.tiempoRestante / 3600000));
        const minutos = formatearNumero(Math.floor(this.tiempoRestante / 60000));
        const segundos = formatearNumero(Math.floor((this.tiempoRestante % 60000) / 1000));
        const milisegundos = formatearNumero(Math.floor(this.tiempoRestante % 1000) / 10);

        this.progressPercentage = Math.floor((this.elapsedTime / this.duracion) * 360);
        this.circularProgress.style.background = `conic-gradient(#236fa2 ${this.progressPercentage}deg, #ececec 0deg)`;
        this.elementoTemporizador.textContent = `${this.pad(horas, 2)}:${this.pad(minutos, 2)}:${this.pad(segundos, 2)}.${milisegundos}`;
    }

    pad(number, length) {
        return (number + "").padStart(length, "0");
    }
}

const temporizador1 = new Temporizador(1);
const temporizador2 = new Temporizador(2);
const temporizador3 = new Temporizador(3);
const temporizador4 = new Temporizador(4);


// Obtener los elementos del menú de navegación
const relojLink = document.getElementById("reloj-link");
const cronometroLink = document.getElementById("cronometro-link");
const temporizadorLink = document.getElementById("temporizador-link");

// Obtener los contenedores correspondientes
const relojContainer = document.querySelector(".contenedor.hora");
const cronometroContainer = document.querySelector(".contenedor.cronometro");
const temporizadorContainer = document.querySelector(".contenedor.temporizador");

// Ocultar todos los contenedores al cargar la página
relojContainer.style.display = "grid";
cronometroContainer.style.display = "none";
temporizadorContainer.style.display = "none";

// Función para mostrar el contenedor seleccionado y ocultar los demás
function mostrarContenedor(contenedor) {
    relojContainer.style.display = "none";
    cronometroContainer.style.display = "none";
    temporizadorContainer.style.display = "none";

    contenedor.style.display = "grid";
}

// Escuchar los clics en los enlaces de navegación
relojLink.addEventListener("click", () => mostrarContenedor(relojContainer));
cronometroLink.addEventListener("click", () => mostrarContenedor(cronometroContainer));
temporizadorLink.addEventListener("click", () => mostrarContenedor(temporizadorContainer));