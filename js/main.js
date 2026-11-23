// Temps quadrats amb els vídeos i àudios gravats
const seccions = {
  1: {
    titol: "Part 1: El mòbil i el bucle",
    pista: "Part 1: Introducció",
    tipus: "video",
    lloc: "llocVideo1",
    fitxer: "media/seccio1.mp4",
    durada: 209,
    marques: [
      { t: 52.2, tipus: "penjar" },
      { t: 86.6, tipus: "ratoli" },
      { t: 114.8, tipus: "marcar-bucle" },
      { t: 123.5, tipus: "pas", n: 1, rellotge: "00:01 min" },
      { t: 133.0, tipus: "pas", n: 2, rellotge: "00:02 min" },
      { t: 141.0, tipus: "pas", n: 3, rellotge: "00:06 min" },
      { t: 147.5, tipus: "pas", n: 4, rellotge: "00:30 min" },
      { t: 162.0, tipus: "desmarcar-bucle" }
    ]
  },
  2: {
    titol: "Part 2: Com ens retenen",
    pista: "Part 2: Dades i colors",
    tipus: "audio",
    lloc: null,
    fitxer: "media/seccio2.mp3",
    durada: 182,
    marques: [
      { t: 0.5, tipus: "destacar", id: "sec-scroll" },
      { t: 67.8, tipus: "destacar", id: "sec-colors" },
      { t: 136.0, tipus: "subway" },
      { t: 173.0, tipus: "destacar", id: "sec-refresh" }
    ]
  },
  3: {
    titol: "Part 3: Patrons i pressió",
    pista: "Part 3: Patrons i FOMO",
    tipus: "video",
    lloc: "llocVideo3",
    fitxer: "media/seccio3.mp4",
    durada: 131,
    marques: [
      { t: 0.5, tipus: "destacar", id: "sec-notis" },
      { t: 25.1, tipus: "destacar", id: "sec-trampa" },
      { t: 87.2, tipus: "fomo", id: "sec-fomo" }
    ]
  },
  4: {
    titol: "Part 4: Efectes i hàbits",
    pista: "Part 4: Cervell i consells",
    tipus: "audio",
    lloc: null,
    fitxer: "media/seccio4.mp3",
    durada: 106,
    marques: [
      { t: 0.5, tipus: "destacar", id: "blocEfectes" },
      { t: 44.2, tipus: "destacar", id: "blocConsells" },
      { t: 57.3, tipus: "consell", id: "consell1" },
      { t: 68.7, tipus: "consell", id: "consell2" },
      { t: 80.3, tipus: "consell", id: "consell3" }
    ]
  }
};

let partActual = 1;
let penjat = false;
let mobilFora = false;
let videoObert = true;
let timerPenjat = null;
let marquesFetes = [];

const video = document.getElementById("reproductorVideo");
const audio = document.getElementById("reproductorAudio");
const caixaVideo = document.getElementById("caixaVideo");
const barraTemps = document.getElementById("barraTemps");
const passosNav = document.querySelectorAll(".pas");

function reproductorActiu() {
  return seccions[partActual].tipus === "audio" ? audio : video;
}

function formatarTemps(segons) {
  const total = segons && segons > 0 ? Math.floor(segons) : 0;
  const min = Math.floor(total / 60);
  const seg = String(total % 60).padStart(2, "0");
  return min + ":" + seg;
}

function refrescarBarra() {
  const media = reproductorActiu();
  const durada = media.duration || seccions[partActual].durada;
  const actual = media.currentTime || 0;

  barraTemps.value = durada > 0 ? Math.min(100, (actual / durada) * 100) : 0;
  document.getElementById("tempsMedia").textContent = formatarTemps(actual) + " / " + formatarTemps(durada);

  const reproduint = !media.paused && !media.ended;
  document.getElementById("iconaPlay").classList.toggle("hidden", reproduint);
  document.getElementById("iconaPausa").classList.toggle("hidden", !reproduint);
}

function colocarVideo() {
  const dades = seccions[partActual];
  const botoVideo = document.getElementById("botoVideo");
  const teVideo = dades.tipus === "video" && dades.lloc;

  botoVideo.classList.toggle("hidden", !teVideo);
  if (!teVideo) {
    caixaVideo.classList.add("hidden");
    return;
  }

  const contenidor = document.getElementById(dades.lloc);
  if (caixaVideo.parentElement !== contenidor) {
    contenidor.appendChild(caixaVideo);
  }
  caixaVideo.classList.toggle("hidden", !videoObert);
  botoVideo.textContent = videoObert ? "Amagar vídeo" : "Mostrar vídeo";
  document.getElementById("etiquetaVideo").textContent = "Vídeo - " + dades.pista;
}

document.getElementById("botoPlay").addEventListener("click", () => {
  if (penjat) return;
  const media = reproductorActiu();
  if (media.paused) {
    media.play();
  } else {
    media.pause();
  }
  refrescarBarra();
});

document.getElementById("botoVideo").addEventListener("click", () => {
  videoObert = !videoObert;
  colocarVideo();
});

document.getElementById("plegarVideo").addEventListener("click", () => {
  videoObert = false;
  colocarVideo();
});

barraTemps.addEventListener("input", () => {
  if (penjat) return;
  const media = reproductorActiu();
  const durada = media.duration || seccions[partActual].durada;
  media.currentTime = (parseFloat(barraTemps.value) / 100) * durada;
  refrescarBarra();
});

function netejarDestacats() {
  document.querySelectorAll(".destacat").forEach(el => el.classList.remove("destacat"));
  document.querySelectorAll(".destacat-fila").forEach(el => el.classList.remove("destacat-fila"));
}

function destacarElement(id) {
  netejarDestacats();
  const el = document.getElementById(id);
  if (el) el.classList.add("destacat");
}

function penjarPantalla() {
  penjat = true;
  video.pause();
  document.body.classList.add("congelat");
  document.getElementById("pantallaPenjada").classList.remove("hidden");

  timerPenjat = setTimeout(() => {
    penjat = false;
    document.body.classList.remove("congelat");
    document.getElementById("pantallaPenjada").classList.add("hidden");
    document.getElementById("pausa15s").classList.remove("hidden");
    video.play();
  }, 15000);
}

function comprovarMarques(segon) {
  const llista = seccions[partActual].marques;

  for (let i = 0; i < llista.length; i++) {
    const m = llista[i];
    if (segon < m.t || marquesFetes.includes(i)) continue;
    marquesFetes.push(i);

    if (m.tipus === "penjar") {
      penjarPantalla();
    } else if (m.tipus === "ratoli") {
      const ratoli = document.getElementById("ratoliGegant");
      ratoli.classList.add("hidden");
      setTimeout(() => ratoli.classList.remove("hidden"), 30);
      setTimeout(() => ratoli.classList.add("hidden"), 4300);
    } else if (m.tipus === "marcar-bucle") {
      document.getElementById("blocBucle").classList.add("destacat");
      caixaVideo.classList.add("remarcat");
    } else if (m.tipus === "desmarcar-bucle") {
      document.getElementById("blocBucle").classList.remove("destacat");
      caixaVideo.classList.remove("remarcat");
    } else if (m.tipus === "pas") {
      marcarPasRoda(m.n, false);
      document.getElementById("rellotgeBucle").textContent = m.rellotge;
    } else if (m.tipus === "subway") {
      obrirSubway();
    } else if (m.tipus === "destacar") {
      destacarElement(m.id);
    } else if (m.tipus === "fomo") {
      destacarElement(m.id);
      iniciarFomo();
    } else if (m.tipus === "consell") {
      document.querySelectorAll(".destacat-fila").forEach(el => el.classList.remove("destacat-fila"));
      document.getElementById(m.id).classList.add("destacat-fila");
    }
  }
}

function ajustarDespresSalt(segon) {
  if (penjat) return;
  netejarDestacats();
  marquesFetes = [];

  const llista = seccions[partActual].marques;
  for (let i = 0; i < llista.length; i++) {
    if (llista[i].t <= segon) {
      marquesFetes.push(i);
    }
  }

  if (partActual === 1) {
    document.getElementById("pausa15s").classList.toggle("hidden", segon < 52.2);
    const enBucle = segon >= 114.8 && segon < 162.0;
    document.getElementById("blocBucle").classList.toggle("destacat", enBucle);
    caixaVideo.classList.toggle("remarcat", enBucle);

    netejarRoda();
    document.getElementById("rellotgeBucle").textContent = "00:00 min";
    for (const m of llista) {
      if (m.tipus === "pas" && segon >= m.t) {
        marcarPasRoda(m.n, false);
        document.getElementById("rellotgeBucle").textContent = m.rellotge;
      }
    }
  } else {
    if (partActual === 2 && segon < 136.0) tancarSubway();
    if (partActual === 2 && segon >= 136.0) obrirSubway();

    for (const m of llista) {
      if (segon < m.t) continue;
      if (m.tipus === "destacar" || m.tipus === "fomo") {
        destacarElement(m.id);
      } else if (m.tipus === "consell") {
        document.querySelectorAll(".destacat-fila").forEach(el => el.classList.remove("destacat-fila"));
        document.getElementById(m.id).classList.add("destacat-fila");
      }
    }
  }
}

[video, audio].forEach(media => {
  media.addEventListener("loadedmetadata", refrescarBarra);
  media.addEventListener("play", refrescarBarra);
  media.addEventListener("pause", refrescarBarra);
  media.addEventListener("ended", refrescarBarra);
  media.addEventListener("timeupdate", () => {
    if (reproductorActiu() !== media) return;
    refrescarBarra();
    if (!media.paused) comprovarMarques(media.currentTime);
  });
  media.addEventListener("seeked", () => {
    if (reproductorActiu() === media) ajustarDespresSalt(media.currentTime);
  });
});

function posarGris(actiu) {
  const nouEstat = typeof actiu === "boolean" ? actiu : !document.body.classList.contains("mode-gris");
  document.body.classList.toggle("mode-gris", nouEstat);
  document.getElementById("botoGris").classList.toggle("active", nouEstat);
  document.getElementById("textGris").textContent = nouEstat ? "Mode color" : "Mode gris";
  document.getElementById("switchGris").checked = nouEstat;
  actualitzarConsells();
}

function bloquejarMobil(fora) {
  mobilFora = fora;
  document.getElementById("switchMobilFora").checked = fora;
  document.getElementById("barraMobilFora").classList.toggle("hidden", !fora);

  if (fora) {
    aturarTaula();
    aturarFomo();
    esborrarPopupsEstudi();
  }

  document.querySelectorAll(".zona-mobil").forEach(zona => {
    const capa = zona.querySelector(".capa-bloqueig");
    if (fora && !capa) {
      const div = document.createElement("div");
      div.className = "capa-bloqueig";
      div.innerHTML = `
        <h3>El mòbil és fora de l'habitació</h3>
        <p>Com que has activat el consell 3, no pots fer servir el mòbil ni els minijocs mentre estigui fora.</p>
        <button class="btn btn-primary">Tornar a agafar el mòbil</button>
      `;
      div.querySelector("button").addEventListener("click", () => bloquejarMobil(false));
      zona.appendChild(div);
    } else if (!fora && capa) {
      capa.remove();
    }
  });

  actualitzarConsells();
}

document.getElementById("botoGris").addEventListener("click", () => posarGris());
document.getElementById("recuperarMobil").addEventListener("click", () => bloquejarMobil(false));

function aturarTot() {
  clearTimeout(timerPenjat);
  aturarTaula();
  aturarScroll();
  aturarFomo();
  aturarEstudi();
  tancarSubway();

  penjat = false;
  document.body.classList.remove("congelat");
  document.getElementById("pantallaPenjada").classList.add("hidden");
  document.getElementById("ratoliGegant").classList.add("hidden");
  caixaVideo.classList.remove("remarcat");

  video.pause();
  video.removeAttribute("src");
  video.load();
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}

function anarAPart(num) {
  if (num < 1 || num > 4) return;
  aturarTot();
  partActual = num;
  marquesFetes = [];
  netejarDestacats();

  const dades = seccions[num];

  for (let i = 1; i <= 4; i++) {
    document.getElementById("part" + i).classList.toggle("hidden", i !== num);
  }

  document.getElementById("titolSeccio").textContent = dades.titol;
  document.getElementById("nomPista").textContent = dades.pista;
  document.getElementById("indicadorPart").textContent = `${num} / 4`;
  document.getElementById("botoAnterior").disabled = num === 1;

  const botoSeg = document.getElementById("botoSeguent");
  botoSeg.disabled = num === 4;
  botoSeg.textContent = num === 4 ? "Final" : "Següent part →";

  passosNav.forEach(pas => {
    const p = Number(pas.dataset.part);
    pas.classList.toggle("active", p === num);
    pas.classList.toggle("fet", p < num);
  });

  if (num === 1) {
    document.getElementById("pausa15s").classList.add("hidden");
    document.getElementById("rellotgeBucle").textContent = "00:00 min";
    netejarRoda();
    iniciarTaula();
  } else if (num === 3) {
    iniciarNotis();
    carregarTrampa(1);
    iniciarFomo();
  }

  videoObert = true;
  colocarVideo();

  const media = reproductorActiu();
  media.src = dades.fitxer;
  media.play().catch(() => {});
  refrescarBarra();
}

document.getElementById("botoAnterior").addEventListener("click", () => anarAPart(partActual - 1));
document.getElementById("botoSeguent").addEventListener("click", () => anarAPart(partActual + 1));
passosNav.forEach(pas => {
  pas.addEventListener("click", () => anarAPart(Number(pas.dataset.part)));
});

const rodaCaixa = document.getElementById("rodaBucle");
const rodaGir = document.getElementById("rodaGir");
const nodesRoda = document.querySelectorAll(".node-roda");
const arcsRoda = document.querySelectorAll(".roda-arc");
const textosRoda = document.querySelectorAll(".node-text");

let girantRoda = false;
let angleAnterior = 0;
let angleTotal = 0;

function netejarRoda() {
  nodesRoda.forEach(n => n.classList.remove("active"));
  arcsRoda.forEach(a => a.classList.remove("active"));
}

function marcarPasRoda(pas, netejarAbans) {
  if (netejarAbans) netejarRoda();
  nodesRoda.forEach(n => {
    if (Number(n.dataset.pas) === pas) n.classList.add("active");
  });
  arcsRoda.forEach(a => {
    if (Number(a.dataset.pas) === pas) a.classList.add("active");
  });
}

function calcularAngle(ev) {
  const r = rodaCaixa.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
}

function girarRoda(graus) {
  rodaGir.style.transform = `rotate(${graus.toFixed(1)}deg)`;
  textosRoda.forEach(txt => {
    txt.style.transform = `rotate(${(-graus).toFixed(1)}deg)`;
  });

  const normalitzat = ((graus % 360) + 360) % 360;
  const pas = (Math.round(normalitzat / 90) % 4) + 1;
  marcarPasRoda(pas, true);

  const voltes = Math.floor(Math.abs(graus) / 360);
  document.getElementById("voltesBucle").textContent = voltes;
  if (voltes > 0) {
    const mins = String(voltes * 25).padStart(2, "0");
    document.getElementById("rellotgeBucle").textContent = mins + ":00 min";
  }
}

rodaCaixa.addEventListener("mousedown", e => {
  girantRoda = true;
  rodaCaixa.classList.add("girant");
  angleAnterior = calcularAngle(e);
});

window.addEventListener("mousemove", e => {
  if (!girantRoda) return;
  const actual = calcularAngle(e);
  let delta = actual - angleAnterior;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  angleAnterior = actual;
  angleTotal += delta;
  girarRoda(angleTotal);
});

window.addEventListener("mouseup", () => {
  if (!girantRoda) return;
  girantRoda = false;
  rodaCaixa.classList.remove("girant");
});

const avisosTaula = [
  { app: "WhatsApp (Grup de classe)", text: "No et creuràs què acaba de dir el professor..." },
  { app: "Instagram", text: "La Laia t'ha etiquetat en una foto nova" },
  { app: "TikTok", text: "3 amics han compartit un vídeo amb tu" },
  { app: "WhatsApp (Marc)", text: "Ei, estàs connectat? Mira això ràpid" },
  { app: "Xarxa+", text: "A 19 persones els agrada el teu comentari" }
];

let segonsTaula = 0;
let mobilGirat = false;
let timerTaula = null;
let avisosTimer = null;

const mobilTaula = document.getElementById("mobilTaula");
const avisosMobil = document.getElementById("avisosMobil");

function aturarTaula() {
  clearInterval(timerTaula);
  clearInterval(avisosTimer);
  timerTaula = null;
  avisosTimer = null;
}

function obrirMobilTaula() {
  if (!timerTaula) return;
  const t = segonsTaula.toFixed(1).replace(".", ",");
  aturarTaula();
  document.getElementById("reiniciarTaula").classList.remove("hidden");
  document.getElementById("resultatTaula").textContent =
    `L'has desbloquejat al cap de ${t} s. Amb un sol avís ja s'ha tallat la lectura.`;
}

function iniciarTaula() {
  if (mobilFora) return;
  aturarTaula();
  segonsTaula = 0;
  mobilGirat = false;

  mobilTaula.classList.remove("cap-per-avall", "vibra");
  avisosMobil.innerHTML = '<div class="avisos-buit">Mòbil en silenci sobre la taula...</div>';
  document.getElementById("resultatTaula").textContent = "";
  document.getElementById("reiniciarTaula").classList.add("hidden");
  document.getElementById("girarMobil").textContent = "Posar el mòbil cap per avall";
  document.getElementById("tempsTaula").textContent = "0,0 s";

  timerTaula = setInterval(() => {
    if (penjat || mobilFora) return;
    segonsTaula += 0.1;
    document.getElementById("tempsTaula").textContent = segonsTaula.toFixed(1).replace(".", ",") + " s";
  }, 100);

  avisosTimer = setInterval(() => {
    if (penjat || mobilGirat || mobilFora) return;
    if (avisosMobil.querySelector(".avisos-buit")) avisosMobil.innerHTML = "";

    const avis = avisosTaula[Math.floor(Math.random() * avisosTaula.length)];
    const caixa = document.createElement("div");
    caixa.className = "item-avis";
    caixa.innerHTML = `<b>${avis.app}</b>${avis.text}`;
    caixa.addEventListener("click", obrirMobilTaula);
    avisosMobil.prepend(caixa);

    mobilTaula.classList.add("vibra");
    setTimeout(() => mobilTaula.classList.remove("vibra"), 650);
  }, 3500);
}

document.getElementById("girarMobil").addEventListener("click", e => {
  mobilGirat = !mobilGirat;
  mobilTaula.classList.toggle("cap-per-avall", mobilGirat);
  e.currentTarget.textContent = mobilGirat ? "Tornar a girar el mòbil" : "Posar el mòbil cap per avall";
  if (mobilGirat) {
    document.getElementById("resultatTaula").textContent =
      "Sense veure com s'encén la pantalla costa molt menys seguir llegint.";
  }
});

document.getElementById("reiniciarTaula").addEventListener("click", iniciarTaula);
document.getElementById("desbloquejarMobil").addEventListener("click", obrirMobilTaula);

window.addEventListener("DOMContentLoaded", () => {
  anarAPart(1);
});
