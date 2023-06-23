class Juego {
    constructor() {
      this.saldoHTML = document.getElementById("saldo");
      this.puntosPC = 0;
      this.puntosJugador = 0;
      this.empates = 0;
      this.baraja;
      this.sumaCarta = 0;
      this.sumaCartaPC = 0;
      this.numCartasSacadas = 0;
  
      this.empezar = this.empezar.bind(this);
      this.carta = this.carta.bind(this);
      this.parar = this.parar.bind(this);
      this.finalizar = this.finalizar.bind(this);
  
      document.getElementById("carta").style.display = "none";
      document.getElementById("parar").style.display = "none";
  
      document.getElementById("empezar").addEventListener("click", this.empezar);
      document.getElementById("carta").addEventListener("click", this.carta);
      document.getElementById("parar").addEventListener("click", this.parar);
      document.getElementById("finalizar").addEventListener("click", this.finalizar);
  
      this.saldo = parseInt(localStorage.getItem("saldo")) || 500;
      this.puntosPC = parseInt(localStorage.getItem("puntosPC")) || 0;
      this.puntosJugador = parseInt(localStorage.getItem("puntosJugador")) || 0;
      this.empates = parseInt(localStorage.getItem("empates")) || 0;
      this.saldoHTML.textContent = this.saldo;
    }
  
    finalizar() {
      localStorage.setItem("puntosPC", "0");
      localStorage.setItem("puntosJugador", "0");
      localStorage.setItem("empates", "0");
      localStorage.setItem("saldo", "500");
    }
  
    convertirValor(valor) {
      return valor === "ACE" ? 1 : valor === "JACK" || valor === "QUEEN" || valor === "KING" ? 10 : parseInt(valor);
    }
  
    carta() {
      if (this.numCartasSacadas >= 5) {
        alert("Has alcanzado el límite de 5 cartas.");
        return;
      }
  
      fetch("https://deckofcardsapi.com/api/deck/" + this.baraja + "/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
          const carta = data.cards[0];
          const valor = this.convertirValor(carta.value);
          this.SumaJugador(valor);
          const imagen = document.createElement("img");
          imagen.src = carta.image;
          document.getElementById("cartasJugador").appendChild(imagen);
          this.numCartasSacadas++;
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  
    empezar() {
  
      let apuesta = parseFloat(document.querySelector(".input").value);
      if (isNaN(apuesta) || apuesta <= 0 || apuesta >= this.saldo) {
        alert("Ingrese una apuesta válida o mayor al saldo");
        return;
      }
  
      
      document.getElementById("empezar").style.display = "none";
      document.getElementById("carta").style.display = "inline";
      document.getElementById("parar").style.display = "inline";
  
      this.saldo -= apuesta;
      this.saldoHTML.textContent = this.saldo;
  
      fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then((response) => response.json())
        .then((data) => {
          this.baraja = data.deck_id;
          this.cartas2();
  
          for (let i = 0; i < 2; i++) {
            const carta = data.cards[i];
            const valor = this.convertirValor(carta.value);
            this.SumaCartasJugador(valor);
          }
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
  
      const div = document.createElement("div");
      div.innerHTML = `<img class ="baraja" src="../img/baraja.png" alt="">`;
      document.getElementById("jugador2").appendChild(div);
    }
  
    cartas2() {
      fetch("https://deckofcardsapi.com/api/deck/" + this.baraja + "/draw/?count=2")
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.cards.length; i++) {
            const carta = data.cards[i];
            const valor = this.convertirValor(carta.value);
            this.SumaJugador(valor);
            const imagen = document.createElement("img");
            imagen.src = carta.image;
            document.getElementById("cartasJugador").appendChild(imagen);
          }
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  
    parar() {
      
      document.getElementById("carta").style.display = "none";
      document.getElementById("parar").style.display = "none";
  
      const puntuacionFinal = this.sumaCarta;
      const mensaje = document.createElement("p");
      mensaje.classList.add("mensaje");
      mensaje.innerHTML = `<b>Tu puntuación final es: ${puntuacionFinal}</b>`;
      document.getElementById("jugador").appendChild(mensaje);
  
      const reinicioButton = document.createElement("button");
      reinicioButton.innerHTML = "Reiniciar";
      reinicioButton.addEventListener("click", this.reiniciar.bind(this));
  
      document.getElementById("botones").appendChild(reinicioButton);
  
      this.Crupier();
    }
  
    Crupier() {
      fetch("https://deckofcardsapi.com/api/deck/" + this.baraja + "/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
          const carta = data.cards[0];
          const valor = this.convertirValor(carta.value);
          const imagen = document.createElement("img");
          imagen.classList.add("cartaPC");
          imagen.src = carta.image;
          document.getElementById("cartasPC").appendChild(imagen);
          this.SumaPC(valor);
  
          if (this.sumaCartaPC < 17) {
            this.Crupier();
          } else {
            this.validarGanador();
          }
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  
    SumaPC(carta) {
      this.sumaCartaPC += carta;
      document.getElementById("sumatoriaPC").innerHTML = `Sumatoria del Crupier: ${this.sumaCartaPC}`;
    }
  
    reiniciar() {
      localStorage.setItem("puntosPC", this.puntosPC);
      localStorage.setItem("puntosJugador", this.puntosJugador);
      localStorage.setItem("empates", this.empates);
      
      window.location.href = "./estadisticas.html";
  
      location.reload(true);
    }
  
  
    SumaJugador(carta) {
      this.sumaCarta += carta;
      document.getElementById("sumatoria").innerHTML = `Sumatoria del jugador: ${this.sumaCarta}`;
    }
  
    validarGanador() {
      const contenedorTodo = document.querySelector(".contenedor-ganador");
  
      if (this.sumaCartaPC > 21 && this.sumaCarta > 21 || this.sumaCartaPC === this.sumaCarta) {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>No hay ganador</h2>
          <img src="../img/no hay ganador.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.empates++;
        this.saldo += apuesta;
        this.saldoHTML.textContent = this.saldo;
        localStorage.setItem("saldo", this.saldo);
      } else if (this.sumaCarta === 21) {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>¡BLACKJACK!</h2>
          <img src="../img/black jack!!!.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.puntosJugador++;
        let apuesta = parseFloat(document.querySelector(".input").value * 2);
        this.saldo = this.saldo + apuesta;
        this.saldoHTML.textContent = this.saldo;
        localStorage.setItem("saldo", this.saldo);
        localStorage.setItem("puntosJugador", this.puntosJugador);
      } else if (this.sumaCartaPC <= 21 && this.sumaCarta > 21) {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>Computadora gana</h2>
          <img src="../img/cuando gane la pc.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.puntosPC++;
        let apuesta = parseFloat(document.querySelector(".input").value * 2);
        localStorage.setItem("saldo", this.saldo);
        localStorage.setItem("puntosPC", this.puntosPC);
      } else if (this.sumaCartaPC > 21 && this.sumaCarta <= 21) {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>Jugador gana</h2>
          <img src="../img/cuando gane el jugador.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.puntosJugador++;
        let apuesta = parseFloat(document.querySelector(".input").value * 2);
        this.saldo = this.saldo + apuesta;
        this.saldoHTML.textContent = this.saldo;
        localStorage.setItem("saldo", this.saldo);
        localStorage.setItem("puntosJugador", this.puntosJugador);
      } else if (this.sumaCartaPC > this.sumaCarta) {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>Computadora gana</h2>
          <img src="../img/cuando gane la pc.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.puntosPC++;
        let apuesta = parseFloat(document.querySelector(".input").value * 2);
        localStorage.setItem("saldo", this.saldo);
        localStorage.setItem("puntosPC", this.puntosPC);
      } else {
        const ganador = document.createElement("div");
        ganador.classList.add("ganador");
        ganador.innerHTML = `
          <h2>Jugador gana</h2>
          <img src="../img/cuando gane el jugador.gif" alt="">
        `;
        contenedorTodo.appendChild(ganador);
        this.puntosJugador++;
        let apuesta = parseFloat(document.querySelector(".input").value * 2);
        this.saldo = this.saldo + apuesta;
        this.saldoHTML.textContent = this.saldo;
        localStorage.setItem("saldo", this.saldo);
        localStorage.setItem("puntosJugador", this.puntosJugador);
      }
    }
  }
  
  const juego = new Juego();