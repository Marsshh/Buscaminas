// Funció per iniciar una nova partida del Buscaminas
function iniciarPartida() {
  // Sol·licita a l'usuari el nombre de files i columnes
  var filas = prompt("Introdueix el nombre de files (mínim 10, màxim 30):");
  var columnas = prompt(
    "Introdueix el nombre de columnes (mínim 10, màxim 30):"
  );

  // Assegura que el nombre estigui dins del rang permès
  filas = Math.max(10, Math.min(30, parseInt(filas))) || 10;
  columnas = Math.max(10, Math.min(30, parseInt(columnas))) || 10;

  console.log("Files: " + filas + ", Columnes: " + columnas);

  // Obté l'element del taulell i neteja el contingut existent
  var taulell = document.getElementById("taulell");
  taulell.innerHTML = "";

  // Crea el taulell amb innerHTML
  var tablaHTML = "<table>";

  for (let i = 0; i < filas; i++) {
    tablaHTML += "<tr>";
    for (let j = 0; j < columnas; j++) {
      tablaHTML +=
        '<td data-mina="false" onmousedown="manejarClic(event, this);">';
      tablaHTML += '<img src="img/fons20px.jpg" />';
      tablaHTML += "</td>";
    }
    tablaHTML += "</tr>";
  }

  tablaHTML += "</table>";

  taulell.innerHTML = tablaHTML;

  // Estableix les mines
  setMines(taulell, 17);

  // Calcula el nombre de mines adjacents
  calculaAdjacents(taulell);

  document.body.appendChild(taulell);
}

// Funció per manejar el clic a la cel·la
function manejarClic(event, cell) {
  if (event.button === 0) {
    obreCasella(cell);
  } else if (event.button === 2) {
    posarBandera(cell);
  }
}

// Funció per establir les mines en el taulell
function setMines(taulell, percentatge) {
  let casellesTotals = taulell.getElementsByTagName("td");
  let nombreCasellesAmbMina = Math.floor(
    (casellesTotals.length * percentatge) / 100
  );

  for (let i = 0; i < nombreCasellesAmbMina; i++) {
    let casellaAleatoria =
      casellesTotals[Math.floor(Math.random() * casellesTotals.length)];
    if (casellaAleatoria.getAttribute("data-mina") === "false") {
      casellaAleatoria.setAttribute("data-mina", "true");
    } else {
      i--;
    }
  }
}

// Funció per comprovar si una cel·la conté una mina
function esMina(x, y) {
  // Obtenim les files del taulell i el nombre de columnes
  let files = document.getElementById("taulell").getElementsByTagName("tr");
  let columnes = files[0].getElementsByTagName("td").length;

  // Verifiquem si les coordenades estan dins del taulell
  if (x >= 0 && x < files.length && y >= 0 && y < columnes) {
    let casella = files[x].getElementsByTagName("td")[y];
    return casella.getAttribute("data-mina") === "true";
  }

  return false;
}

// Funció per establir el nombre de mines adjacents a una cel·la
function setMinesAdjacents(x, y, nMinesAdjacents) {
  let files = document.getElementById("taulell").getElementsByTagName("tr");
  let columnes = files[0].getElementsByTagName("td").length;

  // Verifiquem si les coordenades estan dins del taulell
  if (x >= 0 && x < files.length && y >= 0 && y < columnes) {
    let casella = files[x].getElementsByTagName("td")[y];
    casella.setAttribute("data-num-mines", nMinesAdjacents);
  }
}

// Funció per obrir una cel·la
function obreCasella(casella) {
  let valorMina = casella.getAttribute("data-mina");
  let numMinesAdjacents = casella.getAttribute("data-num-mines");

  console.log(
    `Casella oberta! Valor de data-mina: ${valorMina}, Mines adjacents: ${numMinesAdjacents}`
  );
  casella.classList.add("oberta");

  // Verifiquem si la cel·la conté una mina
  if (valorMina === "true") {
    // Canviem la imatge a "mina20px.jpg"
    casella.getElementsByTagName("img")[0].src = "img/mina20px.jpg";

    // Mostrem totes les mines i alerta de la pèrdua
    mostraTotesLesMines();
  } else {
    // Mostrem el nombre de mines adjacents dins de la cel·la oberta
    casella.innerText = numMinesAdjacents;

    // Si el nombre de mines adjacents és 0, obre les cel·les adjacents
    if (numMinesAdjacents === "0") {
      obreCasellesAdjacents(casella);
    }
    // Aquí pots afegir lògica addicional segons les regles del joc.
    // Per exemple, si el nombre de mines adjacents és diferent de 0, pots prendre altres accions.
  }
}

// Funció per obrir les cel·les adjacents
function obreCasellesAdjacents(casella) {
  // Obtenim el taulell i les seves dimensions
  let taulell = document.getElementById("taulell");
  let files = taulell.getElementsByTagName("tr");
  let columnes = files[0].getElementsByTagName("td").length;

  // Obtenim la posició de la fila i columna de la cel·la actual
  let filaActual = casella.parentNode.rowIndex;
  let columnaActual = casella.cellIndex;

  // Comencem a explorar les 8 cel·les adjacents
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let filaAdj = filaActual + i;
      let columnaAdj = columnaActual + j;

      // Verifiquem si la cel·la adjacent està dins del taulell
      if (
        filaAdj >= 0 &&
        filaAdj < files.length &&
        columnaAdj >= 0 &&
        columnaAdj < columnes
      ) {
        let casellaAdj = files[filaAdj].getElementsByTagName("td")[columnaAdj];

        // Verifiquem si la cel·la adjacent no està oberta ni té bandera
        if (
          !casellaAdj.classList.contains("oberta") &&
          !casellaAdj.classList.contains("bandera")
        ) {
          // Obrim la cel·la adjacent
          obreCasella(casellaAdj);

          // Si la cel·la té 0 mines adjacents, continuem obrint les cel·les adjacents
          if (casellaAdj.getAttribute("data-num-mines") === "0") {
            obreCasellesAdjacents(casellaAdj);
          }
        }
      }
    }
  }
}

// Funció per mostrar totes les mines quan es perd el joc
function mostraTotesLesMines() {
  let taulell = document.getElementById("taulell");
  let files = taulell.getElementsByTagName("tr");
  let columnes = files[0].getElementsByTagName("td").length;

  for (let i = 0; i < files.length; i++) {
    for (let j = 0; j < columnes; j++) {
      let casella = files[i].getElementsByTagName("td")[j];
      let valorMina = casella.getAttribute("data-mina");

      // Mostrem totes les mines
      if (valorMina === "true") {
        casella.getElementsByTagName("img")[0].src = "img/mina20px.jpg";
      }
    }
  }

  // Alerta de pèrdua
  hasperdut();
}

// Funció per gestionar la col·locació de la bandera en una cel·la
function posarBandera(casella) {
  // Verifiquem si la cel·la ja està oberta
  if (casella.classList.contains("oberta")) {
    return;
  }

  // Alterna entre col·locar o treure la bandera
  let teBandera = casella.classList.toggle("bandera");

  // Canviem la imatge segons si hi ha una bandera o no
  casella.getElementsByTagName("img")[0].src = teBandera
    ? "img/badera20px.jpg"
    : "img/fons20px.jpg";
}

// Funció per calcular el nombre de mines adjacents a cada cel·la
function calculaAdjacents(taulell) {
  let files = taulell.getElementsByTagName("tr");
  let columnes = files[0].getElementsByTagName("td").length;

  for (let i = 0; i < files.length; i++) {
    for (let j = 0; j < columnes; j++) {
      let casella = files[i].getElementsByTagName("td")[j];

      // Si la cel·la no és una mina, calculem el nombre de mines adjacents
      if (casella.getAttribute("data-mina") === "false") {
        let numMinesAdjacents = 0;

        // Comprovem les 8 cel·les adjacents
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            let filaAdj = i + k;
            let columnaAdj = j + l;

            if (
              filaAdj >= 0 &&
              filaAdj < files.length &&
              columnaAdj >= 0 &&
              columnaAdj < columnes
            ) {
              let casellaAdj =
                files[filaAdj].getElementsByTagName("td")[columnaAdj];
              if (casellaAdj.getAttribute("data-mina") === "true") {
                numMinesAdjacents++;
              }
            }
          }
        }

        // Assignem el nombre de mines adjacents a la propietat personalitzada
        casella.setAttribute("data-num-mines", numMinesAdjacents);
      }
    }
  }
}

// Funció per indicar la pèrdua del joc
function hasperdut() {
  alert("Has perdut! Totes les mines han estat revelades.");
 
}
