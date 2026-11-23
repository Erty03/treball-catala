const posts = [
  { usuari: "@laia_04", text: "Avui a la platja amb les amigues", color: "#4a90d9" },
  { usuari: "@marc.futbol", text: "Quin gol ahir, no m'ho crec encara", color: "#3aa876" },
  { usuari: "@receptes", text: "Pasta en 10 minuts (desa-ho per a després)", color: "#e6a82e" },
  { usuari: "@memes_cat", text: "Jo dilluns a les 8 del matí...", color: "#df7834" },
  { usuari: "@viatges", text: "Aquest lloc sembla de mentida", color: "#7579d6" },
  { usuari: "@esport", text: "Dia 47 sense fallar cap entrenament", color: "#d95858" },
  { usuari: "@gats", text: "El meu gat fent coses rares un altre cop", color: "#a66bd1" }
];

const murScroll = document.getElementById("murScroll");
let postsCarregats = 0;
let iniciScroll = 0;
let timerScroll = null;
let likesScroll = 0;

function aturarScroll() {
  clearInterval(timerScroll);
  timerScroll = null;
}

function afegirPosts(quants) {
  for (let i = 0; i < quants; i++) {
    const p = posts[postsCarregats % posts.length];
    postsCarregats++;

    const card = document.createElement("div");
    card.className = "post";
    card.innerHTML = `
      <div class="post-usuari">${p.usuari}</div>
      ${p.text}
      <div class="post-foto" style="background:${p.color}"></div>
      <div class="post-peu"><button class="boto-like">M'agrada</button></div>
    `;

    const boto = card.querySelector(".boto-like");
    boto.addEventListener("click", () => {
      if (boto.classList.contains("marcat")) return;
      boto.classList.add("marcat");
      boto.textContent = "T'agrada";
      likesScroll++;
      document.getElementById("likesScroll").textContent = likesScroll;
    });

    murScroll.appendChild(card);
  }

  document.getElementById("postsScroll").textContent = postsCarregats;
  document.getElementById("comptadorScroll").textContent = postsCarregats + " publicacions";
}

afegirPosts(5);

murScroll.addEventListener("scroll", () => {
  if (mobilFora) return;
  if (!iniciScroll) iniciScroll = Date.now();

  if (!timerScroll) {
    timerScroll = setInterval(() => {
      if (partActual === 2 && !mobilFora) {
        const segs = ((Date.now() - iniciScroll) / 1000).toFixed(1).replace(".", ",");
        document.getElementById("tempsScroll").textContent = segs + " s";
      }
    }, 100);
  }

  // Equivalència aproximada de 3600 px d'scroll per metre
  const metres = (murScroll.scrollTop / 3600).toFixed(1).replace(".", ",");
  document.getElementById("metresScroll").textContent = metres + " m";

  if (murScroll.scrollTop + murScroll.clientHeight > murScroll.scrollHeight - 40) {
    afegirPosts(4);
  }
  if (postsCarregats >= 20) {
    document.getElementById("resultatScroll").textContent =
      `Portes ${postsCarregats} publicacions carregades i això no s'acaba mai.`;
  }
});

const apps = [
  { nom: "Xarxa+", color: "#d9385a", av: "9+" },
  { nom: "Vídeos", color: "#df7834", av: "14" },
  { nom: "Fotos", color: "#d44d8f", av: "24" },
  { nom: "Joc", color: "#8f5cd1", av: "3" },
  { nom: "Xat", color: "#2a9d5c", av: "7" },
  { nom: "Directes", color: "#d43d3d", av: "ARA" },
  { nom: "Botiga", color: "#d98c1c", av: "2" },
  { nom: "Música", color: "#1c9eb5", av: "" },
  { nom: "Notícies", color: "#3b78cf", av: "5" },
  { nom: "Apunts", color: "#5e6a75", av: "" },
  { nom: "Calculadora", color: "#49535e", av: "" },
  { nom: "Sèries", color: "#bd2b2b", av: "1" },
  { nom: "Reels", color: "#e04868", av: "9+" },
  { nom: "Fòrum", color: "#cf5a21", av: "4" },
  { nom: "Ofertes", color: "#cfa017", av: "6" },
  { nom: "Missatges", color: "#2b5fc4", av: "8" }
];

const graellaApps = document.getElementById("graellaApps");
apps.forEach(app => {
  const globus = app.av ? `<span class="globus">${app.av}</span>` : "";
  graellaApps.insertAdjacentHTML(
    "beforeend",
    `<div class="app-icona" style="background:${app.color}">${app.nom}${globus}</div>`
  );
});

document.getElementById("botoGrisLocal").addEventListener("click", e => {
  const gris = graellaApps.classList.toggle("en-gris");
  e.currentTarget.textContent = gris ? "Tornar als colors brillants" : "Posar en escala de grisos";
  document.getElementById("avisGris").classList.toggle("hidden", !gris);
});

const premis = [
  "+11 nous m'agrades a la teva foto",
  "En Marc i 2 persones més han comentat",
  "Nou seguidor i un missatge directe"
];

let intentsRecarrega = 0;
let buitsRecarrega = 0;
let premisRecarrega = 0;

document.getElementById("botoRecarrega").addEventListener("click", e => {
  if (mobilFora) return;
  const boto = e.currentTarget;
  const spinner = document.getElementById("spinnerRecarrega");
  boto.disabled = true;
  spinner.classList.remove("hidden");

  setTimeout(() => {
    boto.disabled = false;
    spinner.classList.add("hidden");
    intentsRecarrega++;

    document.getElementById("comptadorRecarrega").textContent =
      intentsRecarrega === 1 ? "1 recàrrega" : intentsRecarrega + " recàrregues";

    const llista = document.getElementById("llistaRecarrega");
    if (llista.querySelector(".recarrega-buit")) llista.innerHTML = "";

    const surtPremi = intentsRecarrega % 3 === 0 || Math.random() < 0.25;
    const fila = document.createElement("div");
    if (surtPremi) {
      premisRecarrega++;
      fila.className = "item-recarrega premi";
      fila.textContent = premis[premisRecarrega % premis.length];
    } else {
      buitsRecarrega++;
      fila.className = "item-recarrega";
      fila.textContent = "Cap novetat (intent " + intentsRecarrega + ")";
    }
    llista.prepend(fila);

    document.getElementById("recarregaBuits").textContent = buitsRecarrega;
    document.getElementById("recarregaPremis").textContent = premisRecarrega;

    if (intentsRecarrega >= 5) {
      const veg = buitsRecarrega === 1 ? "vegada" : "vegades";
      document.getElementById("resultatRecarrega").textContent =
        `Ja ho has provat ${intentsRecarrega} cops (${buitsRecarrega} ${veg} sense res). El ganxo és esperar a veure si surt alguna cosa.`;
    }
  }, 650);
});

const temes = [
  { id: "esport", nom: "Esport", prep: "d'esport", text: "Els 5 millors gols de la setmana" },
  { id: "cuina", nom: "Cuina", prep: "de cuina", text: "Recepta ràpida de pasta cremosa" },
  { id: "tech", nom: "Tecnologia", prep: "de tecnologia", text: "Com funciona un xip per dins" },
  { id: "animals", nom: "Animals", prep: "d'animals", text: "Gats fent salts impossibles" },
  { id: "viatges", nom: "Viatges", prep: "de viatges", text: "Rutes secretes per la muntanya" },
  { id: "humor", nom: "Humor", prep: "d'humor", text: "Situacions típiques abans d'un examen" }
];

let puntsTema = { esport: 1, cuina: 1, tech: 1, animals: 1, viatges: 1, humor: 1 };

function pintarPerfil() {
  const contenidor = document.getElementById("barresPerfil");
  const valors = temes.map(t => puntsTema[t.id]);
  const total = valors.reduce((suma, v) => suma + v, 0);
  const maxim = Math.max(...valors);
  const hiHaLider = maxim > 1;

  contenidor.innerHTML = temes.map(t => {
    const pct = Math.round((puntsTema[t.id] / total) * 100);
    const classe = hiHaLider && puntsTema[t.id] === maxim ? "fila-perfil lider" : "fila-perfil";
    return `
      <div class="${classe}">
        <div class="cap-perfil"><span>${t.nom}</span><b>${pct}%</b></div>
        <div class="barra-perfil"><div style="width:${pct}%"></div></div>
      </div>
    `;
  }).join("");
}

function pintarTargetes(personalitzat) {
  const graella = document.getElementById("targetesAlgo");
  graella.innerHTML = "";
  let llista = temes;

  if (personalitzat) {
    const ordenats = [...temes].sort((a, b) => puntsTema[b.id] - puntsTema[a.id]);
    const primer = ordenats[0];
    const segon = ordenats[1];
    llista = [
      { id: primer.id, nom: primer.nom, text: "Recomanat per a tu: més sobre " + primer.nom.toLowerCase() },
      { id: primer.id, nom: primer.nom, text: "Vídeo viral " + primer.prep },
      { id: segon.id, nom: segon.nom, text: "Perquè t'has aturat en " + segon.nom.toLowerCase() },
      { id: primer.id, nom: primer.nom, text: "Directe ara mateix sobre " + primer.nom.toLowerCase() },
      { id: segon.id, nom: segon.nom, text: "Top 10 " + segon.prep },
      { id: primer.id, nom: primer.nom, text: "Un altre clip " + primer.prep }
    ];
    document.getElementById("resultatAlgo").textContent =
      `En pocs segons t'ha muntat un mur quasi només ${primer.prep} i ${segon.nom.toLowerCase()}.`;
  }

  for (const tema of llista) {
    const div = document.createElement("div");
    div.className = "targeta-algo";
    div.innerHTML = `
      <div><b>${tema.nom}</b><br><small>${tema.text}</small></div>
      <button class="boto-like">M'agrada</button>
    `;

    div.addEventListener("mouseenter", () => {
      if (mobilFora) return;
      puntsTema[tema.id] += 2;
      pintarPerfil();
    });

    div.querySelector("button").addEventListener("click", e => {
      if (mobilFora) return;
      puntsTema[tema.id] += 5;
      e.currentTarget.classList.add("marcat");
      e.currentTarget.textContent = "T'agrada";
      pintarPerfil();
    });

    graella.appendChild(div);
  }
}

pintarTargetes(false);
pintarPerfil();

document.getElementById("generarMur").addEventListener("click", () => {
  if (!mobilFora) pintarTargetes(true);
});

document.getElementById("reiniciarAlgo").addEventListener("click", () => {
  puntsTema = { esport: 1, cuina: 1, tech: 1, animals: 1, viatges: 1, humor: 1 };
  document.getElementById("resultatAlgo").textContent = "";
  pintarTargetes(false);
  pintarPerfil();
});

const finestraSubway = document.getElementById("finestraSubway");
const videoSubway = document.getElementById("videoSubway");
let moventSubway = false;
let desfasamentX = 0;
let desfasamentY = 0;

function obrirSubway() {
  finestraSubway.style.left = "";
  finestraSubway.style.top = "";
  finestraSubway.style.right = "22px";
  finestraSubway.style.bottom = "74px";
  finestraSubway.classList.remove("hidden");
  videoSubway.currentTime = 0;
  videoSubway.play();
}

function tancarSubway() {
  finestraSubway.classList.add("hidden");
  videoSubway.pause();
}

document.getElementById("tancarSubway").addEventListener("mousedown", e => e.stopPropagation());
document.getElementById("tancarSubway").addEventListener("click", tancarSubway);

document.getElementById("capSubway").addEventListener("mousedown", e => {
  if (e.target.tagName === "BUTTON") return;
  const r = finestraSubway.getBoundingClientRect();
  finestraSubway.style.right = "auto";
  finestraSubway.style.bottom = "auto";
  finestraSubway.style.left = r.left + "px";
  finestraSubway.style.top = r.top + "px";
  moventSubway = true;
  desfasamentX = e.clientX - r.left;
  desfasamentY = e.clientY - r.top;
});

window.addEventListener("mousemove", e => {
  if (!moventSubway) return;
  const r = finestraSubway.getBoundingClientRect();
  const maxX = window.innerWidth - r.width - 8;
  const maxY = window.innerHeight - r.height - 8;
  const x = Math.max(8, Math.min(maxX, e.clientX - desfasamentX));
  const y = Math.max(8, Math.min(maxY, e.clientY - desfasamentY));
  finestraSubway.style.left = x + "px";
  finestraSubway.style.top = y + "px";
});

window.addEventListener("mouseup", () => {
  moventSubway = false;
});

const rondes = [
  [
    { color: "vermella", text: "Tens 4 missatges nous sense llegir" },
    { color: "", text: "Recordatori: beu un got d'aigua" },
    { color: "taronja", text: "A 12 persones els agrada la teva foto" }
  ],
  [
    { color: "", text: "El temps de demà: núvols" },
    { color: "vermella", text: "La Laia està en directe ara mateix" },
    { color: "taronja", text: "Aquest vídeo s'està fent viral" }
  ],
  [
    { color: "taronja", text: "Tens una recompensa diària pendent" },
    { color: "vermella", text: "T'han mencionat en un comentari" },
    { color: "", text: "Còpia de seguretat completada" }
  ],
  [
    { color: "", text: "Article desat per llegir més tard" },
    { color: "taronja", text: "Rècord de visites al teu perfil" },
    { color: "vermella", text: "Última hora: només queden 5 minuts" }
  ]
];

let rondaActual = 0;
let iniciRonda = 0;
let tempsRondes = [];
let clicsUrgents = 0;

function iniciarNotis() {
  rondaActual = 0;
  tempsRondes = [];
  clicsUrgents = 0;
  document.getElementById("resultatNotis").textContent = "";
  mostrarRonda();
}

function mostrarRonda() {
  const zona = document.getElementById("zonaNotis");
  const etiqueta = document.getElementById("etiquetaRonda");

  if (rondaActual >= rondes.length) {
    const mitjana = (tempsRondes.reduce((a, b) => a + b, 0) / tempsRondes.length / 1000)
      .toFixed(2)
      .replace(".", ",");
    etiqueta.textContent = "Acabat";
    zona.innerHTML = '<button id="repetirNotis" class="btn btn-outline">Tornar a provar</button>';
    document.getElementById("repetirNotis").addEventListener("click", iniciarNotis);
    document.getElementById("resultatNotis").textContent =
      `Temps mitjà: ${mitjana} s. En ${clicsUrgents} de les 4 rondes has clicat una notificació vermella o taronja.`;
    return;
  }

  etiqueta.textContent = `Ronda ${rondaActual + 1} de 4`;
  zona.innerHTML = "";
  iniciRonda = Date.now();

  for (const opcio of rondes[rondaActual]) {
    const boto = document.createElement("button");
    boto.className = opcio.color ? "opcio-noti " + opcio.color : "opcio-noti";
    boto.textContent = opcio.text;
    boto.addEventListener("click", () => {
      if (mobilFora) return;
      tempsRondes.push(Date.now() - iniciRonda);
      if (opcio.color) clicsUrgents++;
      rondaActual++;
      mostrarRonda();
    });
    zona.appendChild(boto);
  }
}

function carregarTrampa(nivell) {
  document.getElementById("etiquetaTrampa").textContent = `Prova ${nivell} / 3`;
  document.getElementById("resultatTrampa").textContent = "";

  if (nivell === 1) {
    trampaGaletes();
  } else if (nivell === 2) {
    trampaConfirmshaming();
  } else {
    trampaCancelacio();
  }
}

function trampaGaletes() {
  const caixa = document.getElementById("caixaTrampa");
  caixa.innerHTML = `
    <h3>Avís de galetes (fricció asimètrica)</h3>
    <p>Acceptar-ho tot costa 1 clic. Intenta rebutjar el seguiment publicitari:</p>
    <button id="botoAcceptarGaletes" class="boto-verd">Acceptar totes les galetes</button>
    <button id="botoConfigGaletes" class="enllac-petit">Gestionar preferències manualment</button>
  `;

  document.getElementById("botoAcceptarGaletes").addEventListener("click", () => {
    document.getElementById("resultatTrampa").textContent =
      "Has anat pel camí ràpid, que és just el que busca aquest disseny.";
  });
  document.getElementById("botoConfigGaletes").addEventListener("click", trampaCasellesGaletes);
}

function trampaCasellesGaletes() {
  const caixa = document.getElementById("caixaTrampa");
  caixa.innerHTML = `
    <h3>Desactiva les 4 opcions una per una</h3>
    <div class="llista-galetes">
      <label class="fila-galeta"><span>Seguiment publicitari</span><input class="opcio-galeta" type="checkbox" checked></label>
      <label class="fila-galeta"><span>Venda de dades a tercers</span><input class="opcio-galeta" type="checkbox" checked></label>
      <label class="fila-galeta"><span>Perfil psicològic d'interessos</span><input class="opcio-galeta" type="checkbox" checked></label>
      <label class="fila-galeta"><span>Correus promocionals diaris</span><input class="opcio-galeta" type="checkbox" checked></label>
    </div>
    <button id="desarGaletes" class="btn btn-outline">Desar les preferències</button>
  `;

  document.getElementById("desarGaletes").addEventListener("click", () => {
    const pendents = caixa.querySelectorAll(".opcio-galeta:checked").length;
    if (pendents > 0) {
      document.getElementById("resultatTrampa").textContent = pendents === 1
        ? "Encara queda 1 casella marcada per defecte."
        : `Encara queden ${pendents} caselles marcades per defecte.`;
    } else {
      carregarTrampa(2);
    }
  });
}

function trampaConfirmshaming() {
  const caixa = document.getElementById("caixaTrampa");
  caixa.innerHTML = `
    <h3>Confirmshaming (fer-te dubtar per dir que no)</h3>
    <p>Moltes webs escriuen el text del botó de tancar perquè et faci vergonya clicar-lo:</p>
    <button id="botoAcceptarOfertes" class="boto-verd">Sí, vull rebre 10 ofertes al dia</button>
    <button id="botoRebutjarOfertes" class="enllac-petit">No, prefereixo pagar més car i no aprofitar res</button>
  `;

  document.getElementById("botoAcceptarOfertes").addEventListener("click", () => {
    document.getElementById("resultatTrampa").textContent =
      "Aquesta frase intenta fer-te dubtar per dir que no. Prova l'enllaç petit.";
  });
  document.getElementById("botoRebutjarOfertes").addEventListener("click", () => carregarTrampa(3));
}

function trampaCancelacio() {
  const caixa = document.getElementById("caixaTrampa");
  caixa.innerHTML = `
    <h3>Laberint de cancel·lació (pas 1 de 3)</h3>
    <p>Segur que vols cancel·lar la subscripció? Perdràs tots els avantatges:</p>
    <button id="botoMantenir" class="boto-verd">Mantenir subscripció</button>
    <button id="botoSeguirCancelant" class="enllac-petit">Continuar cancel·lant</button>
  `;

  document.getElementById("botoMantenir").addEventListener("click", () => {
    document.getElementById("resultatTrampa").textContent = "T'han tornat a frenar. Prova l'opció petita.";
  });
  document.getElementById("botoSeguirCancelant").addEventListener("click", trampaDobleNegacio);
}

function trampaDobleNegacio() {
  const caixa = document.getElementById("caixaTrampa");
  caixa.innerHTML = `
    <h3>Doble negació (pas 2 de 3)</h3>
    <p>Confirma que NO vols deixar de NO rebre els nostres beneficis:</p>
    <button id="botoNoCancelar" class="boto-verd">No cancel·lar</button>
    <button id="botoCancelarFinal" class="enllac-petit">Sí, cancel·lar definitivament</button>
  `;

  document.getElementById("botoNoCancelar").addEventListener("click", () => {
    document.getElementById("resultatTrampa").textContent = "Era una doble negació per confondre.";
  });

  document.getElementById("botoCancelarFinal").addEventListener("click", () => {
    document.getElementById("resultatTrampa").textContent = "";
    caixa.innerHTML = `
      <h3>Has passat els 3 patrons foscos</h3>
      <p>Acceptar costa 1 clic; dir que no costa 6 clics i molta paciència.</p>
      <button id="repetirTrampes" class="btn btn-outline">Tornar a provar</button>
    `;
    document.getElementById("repetirTrampes").addEventListener("click", () => carregarTrampa(1));
  });
}

let timerFomo = null;
let segonsFomo = 15;

function aturarFomo() {
  clearInterval(timerFomo);
  timerFomo = null;
}

function iniciarFomo() {
  if (mobilFora) return;
  aturarFomo();
  segonsFomo = 15;

  const rellotge = document.getElementById("rellotgeFomo");
  const barra = document.getElementById("barraFomo");
  const botoReinici = document.getElementById("reiniciarFomo");

  rellotge.textContent = "15 s";
  barra.style.width = "100%";
  document.getElementById("resultatFomo").textContent = "";
  botoReinici.classList.add("hidden");

  timerFomo = setInterval(() => {
    if (mobilFora) return;
    segonsFomo--;
    rellotge.textContent = segonsFomo + " s";
    barra.style.width = ((segonsFomo / 15) * 100) + "%";

    if (segonsFomo <= 0) {
      aturarFomo();
      botoReinici.classList.remove("hidden");
      document.getElementById("resultatFomo").textContent =
        "S'ha acabat el temps i no ha passat res. Tota la pressió era falsa.";
    }
  }, 1000);
}

document.getElementById("reiniciarFomo").addEventListener("click", iniciarFomo);

document.getElementById("salvarRatxa").addEventListener("click", () => {
  if (mobilFora) return;
  aturarFomo();
  document.getElementById("reiniciarFomo").classList.remove("hidden");
  document.getElementById("resultatFomo").textContent =
    "Has salvat la ratxa per no perdre el número, no perquè volguessis enviar res.";
});

document.getElementById("deixarRatxa").addEventListener("click", () => {
  if (mobilFora) return;
  aturarFomo();
  document.getElementById("barraFomo").style.width = "0%";
  document.getElementById("reiniciarFomo").classList.remove("hidden");
  document.getElementById("resultatFomo").textContent =
    "No passa res per deixar-la caure: un número no val una amistat.";
});

let nivellEstudi = 0;
let estudiant = false;
let popupsActius = 0;
let timerEstudi = null;
let timerAvisosEstudi = null;

function aturarEstudi() {
  estudiant = false;
  clearInterval(timerEstudi);
  clearInterval(timerAvisosEstudi);
  timerEstudi = null;
  timerAvisosEstudi = null;
}

function esborrarPopupsEstudi() {
  popupsActius = 0;
  document.querySelectorAll(".popup-estudi").forEach(p => p.remove());
}

function treureDistraccio() {
  if (mobilFora) return;
  const nomesPersones = document.getElementById("switchNotis").checked;
  if (nomesPersones && Math.random() > 0.35) return;

  const textos = nomesPersones
    ? ["Missatge de casa: a quina hora sopes?"]
    : [
        "Instagram: 5 nous m'agrades",
        "Joc: recull la recompensa diària",
        "TikTok: vídeo recomanat per a tu",
        "Botiga: descompte només avui"
      ];

  popupsActius++;
  const pop = document.createElement("div");
  pop.className = "popup-estudi";
  pop.style.top = (10 + Math.random() * 68) + "%";
  pop.style.left = (6 + Math.random() * 38) + "%";
  pop.innerHTML = `<span>${textos[Math.floor(Math.random() * textos.length)]}</span><button>Tancar</button>`;

  pop.querySelector("button").addEventListener("click", () => {
    pop.remove();
    popupsActius = Math.max(0, popupsActius - 1);
  });

  document.getElementById("zonaEstudi").appendChild(pop);
}

function estudiar() {
  if (timerEstudi) return;

  timerEstudi = setInterval(() => {
    if (estudiant && popupsActius === 0 && nivellEstudi < 100) {
      nivellEstudi = Math.min(100, nivellEstudi + 0.7);
    } else if (popupsActius > 0 && nivellEstudi > 0 && nivellEstudi < 100) {
      nivellEstudi = Math.max(0, nivellEstudi - 0.25);
    }

    document.getElementById("progresEstudi").style.width = nivellEstudi + "%";
    document.getElementById("percentatgeEstudi").textContent = Math.round(nivellEstudi) + "%";

    if (nivellEstudi >= 100) {
      aturarEstudi();
      const marcats = document.querySelectorAll(".check-consell:checked").length;
      document.getElementById("resultatEstudi").textContent = marcats === 3
        ? "Has arribat al 100% sense interrupcions. Canviar l'entorn es nota molt."
        : "Has arribat al final, però amb força talls. Prova d'activar els tres consells i repeteix.";
    }
  }, 100);

  timerAvisosEstudi = setInterval(() => {
    if (nivellEstudi > 2 && nivellEstudi < 100) treureDistraccio();
  }, 2400);
}

const botoEstudiar = document.getElementById("botoEstudiar");
botoEstudiar.addEventListener("mousedown", () => {
  estudiant = true;
  estudiar();
});
botoEstudiar.addEventListener("touchstart", e => {
  e.preventDefault();
  estudiant = true;
  estudiar();
});

window.addEventListener("mouseup", () => { estudiant = false; });
window.addEventListener("touchend", () => { estudiant = false; });

document.getElementById("reiniciarEstudi").addEventListener("click", () => {
  aturarEstudi();
  nivellEstudi = 0;
  document.getElementById("progresEstudi").style.width = "0%";
  document.getElementById("percentatgeEstudi").textContent = "0%";
  document.getElementById("resultatEstudi").textContent = "";
  esborrarPopupsEstudi();
});

function actualitzarConsells() {
  const n = document.querySelectorAll(".check-consell:checked").length;
  document.getElementById("comptadorConsells").textContent = n + " / 3";
}

document.getElementById("switchGris").addEventListener("change", e => {
  posarGris(e.target.checked);
});

document.getElementById("switchNotis").addEventListener("change", actualitzarConsells);

document.getElementById("switchMobilFora").addEventListener("change", e => {
  bloquejarMobil(e.target.checked);
});
