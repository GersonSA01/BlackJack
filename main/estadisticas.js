class Estadisticas {
    constructor() {
      this.jugadorGanaElement = document.getElementById("jugadorGana");
      this.PCGanaElement = document.getElementById("PCGana");
      this.empatesElement = document.getElementById("empates");
      this.reiniciarEstadisticaButton = document.getElementById(
        "reiniciarEstadistica"
      );
  
      this.puntosPC = 0;
      this.puntosJugador = 0;
      this.empates = 0;
  
      this.reiniciarEstadisticaButton.addEventListener(
        "click",
        this.reiniciarTabla.bind(this)
      );
      this.cargarValoresGuardados();
      this.actualizarValores();
    }
  
    reiniciarTabla() {
      localStorage.setItem("puntosPC", "0");
      localStorage.setItem("puntosJugador", "0");
      localStorage.setItem("empates", "0");
      location.reload(true);
    }
  
    cargarValoresGuardados() {
      const puntosPCGuardados = localStorage.getItem("puntosPC");
      const puntosJugadorGuardados = localStorage.getItem("puntosJugador");
      const empatesGuardados = localStorage.getItem("empates");
  
      if (puntosPCGuardados) {
        this.puntosPC = parseInt(puntosPCGuardados);
      }
  
      if (puntosJugadorGuardados) {
        this.puntosJugador = parseInt(puntosJugadorGuardados);
      }
  
      
      if (empatesGuardados) {
        this.empates = parseInt(empatesGuardados);
      }
    }
  
    actualizarValores() {
      this.jugadorGanaElement.textContent = this.puntosJugador || "0";
      this.PCGanaElement.textContent = this.puntosPC || "0";
      this.empatesElement.textContent = this.empates || "0";
    }
  }
  
  const estadisticas = new Estadisticas();
  