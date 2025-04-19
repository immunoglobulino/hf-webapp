let userZone = "Europa";

async function getSolarData() {
  const response = await fetch("https://api.hamqsl.com/solar.php?format=json");
  const data = await response.json();

  const sfi = data.solar.SFI;
  const sunspots = data.solar.sunspots;
  const kindex = data.geomag.kindex;
  const xray = data.solar.xray;

  document.getElementById("sfi").textContent = sfi;
  document.getElementById("sunspots").textContent = sunspots;
  document.getElementById("kindex").textContent = kindex;
  document.getElementById("xray").textContent = xray;

  const recommendation = getBandRecommendation(sfi, kindex);
  document.getElementById("recommendation").textContent = recommendation;
}

// Fallback e correzione zona
fetch("https://ipapi.co/json")
  .then(res => res.json())
  .then(data => {
    const map = {
      EU: "Europa", NA: "Nord America", SA: "Sud America",
      AS: "Asia", AF: "Africa", OC: "Oceania", AN: "Antartide"
    };
    userZone = map[data.continent_code] || "Europa";
    document.getElementById("geoMessage").textContent =
      `Stimo che ti trovi in: ${userZone}. Se non è corretto, seleziona la tua zona.`;
  })
  .catch(() => {
    document.getElementById("geoMessage").textContent =
      "Non riesco a stimare la tua posizione. Seleziona la zona manualmente.";
  });

function overrideZone(zone) {
  if (zone) {
    userZone = zone;
    document.getElementById("geoMessage").textContent =
      `Zona impostata manualmente: ${userZone}`;
  }
}

function getBandRecommendation(sfi, kindex) {
  if (kindex > 5) return "Tempesta magnetica in corso. HF instabile.";
  if (sfi > 100 && kindex < 4) return "Condizioni eccellenti su 15m e 10m.";
  if (sfi > 80) return "Buone condizioni su 20m e 17m.";
  return "Propagazione ridotta. Punta sulle bande basse.";
}

function speakWinston() {
  const text = document.getElementById("recommendation").textContent;
  const fullMessage = `Comandante Simo, analisi completata. ${text}`;
  const utterance = new SpeechSynthesisUtterance(fullMessage);
  utterance.lang = "it-IT";
  window.speechSynthesis.speak(utterance);
}

getSolarData();
