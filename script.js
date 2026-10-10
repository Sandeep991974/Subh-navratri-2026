const nightData = [
  {name:"माँ शैलपुत्री",period:"पहली रात · प्रतिपदा",text:"Nayi shuruaat ke liye apne andar ki shakti aur sthirta ko jagayein.",blessing:"आपकी हर नई शुरुआत मंगलमय हो।"},
  {name:"माँ ब्रह्मचारिणी",period:"दूसरी रात · द्वितीया",text:"Shraddha, sanyam aur dridh sankalp ki divya shakti ka utsav manayein.",blessing:"आपकी श्रद्धा आपको निर्भय बनाए।"},
  {name:"माँ चंद्रघंटा",period:"तीसरी रात · तृतीया",text:"Sahas ko apnaayein aur har kadam par shanti ko saath rakhein.",blessing:"साहस हर पल आपके साथ चले।"},
  {name:"माँ कूष्मांडा",period:"चौथी रात · चतुर्थी",text:"Apne jeevan mein nayi urja, rachnatmakta aur umang ka swagat karein.",blessing:"आपका संसार खुशियों से जगमगाए।"},
  {name:"माँ स्कंदमाता",period:"पाँचवीं रात · पंचमी",text:"Apno ke liye prem, mamta aur karuna ko apne jeevan mein jagah dein.",blessing:"आपका घर प्रेम से सदा महके।"},
  {name:"माँ कात्यायनी",period:"छठी रात · षष्ठी",text:"Apne sach par atal rahein aur har chunauti ka saamna sahas se karein.",blessing:"आपकी अंतरशक्ति सदा चमके।"},
  {name:"माँ कालरात्रि",period:"सातवीं रात · सप्तमी",text:"Bhay ko chhodein, apni shakti par bharosa rakhein — ujala zaroor aayega.",blessing:"हर अँधेरा शक्ति में बदल जाए।"},
  {name:"माँ महागौरी",period:"आठवीं रात · अष्टमी",text:"Apne mann mein nirmalta, daya aur shanti ko aane dein.",blessing:"शांति और पवित्रता आपको घेरे रहें।"},
  {name:"माँ सिद्धिदात्री",period:"नौवीं रात · नवमी",text:"Gyaan, poornata aur aane wali anek sambhavnayon ka utsav manayein.",blessing:"आपके सपनों को नए पंख मिलें।"}
];

const $ = id => document.getElementById(id);
let toastTimer;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function setNight(index) {
  const data = nightData[index];
  if (!data) return;
  document.querySelectorAll(".night-tile").forEach((tile, i) => {
    tile.classList.toggle("active", i === index);
    tile.setAttribute("aria-pressed", i === index ? "true" : "false");
  });
  $("detailTitle").textContent = data.name;
  $("detailKicker").textContent = data.period;
  $("detailText").textContent = data.text;
  $("detailBlessing").textContent = data.blessing;
  if (typeof $("nightDetail").animate === "function") {
    $("nightDetail").animate(
      [{opacity: .55, transform: "translateY(5px)"}, {opacity: 1, transform: "translateY(0)"}],
      {duration: 360, easing: "ease-out"}
    );
  }
}

document.querySelectorAll(".night-tile").forEach(tile => {
  tile.addEventListener("click", () => setNight(Number(tile.dataset.night)));
});

const sparkleField = $("sparkles");
for (let i = 0; i < 32; i++) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = i % 4 === 0 ? "✦" : "·";
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.fontSize = `${8 + Math.random() * 13}px`;
  sparkle.style.animationDelay = `${Math.random() * 3}s`;
  sparkleField.appendChild(sparkle);
}

if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".section-heading,.feature-card,.nights-intro,.night-picker");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 90}ms`);
    revealObserver.observe(target);
  });
}

let voicePlaying = false;
let currentUtterance = null;

function updateVoiceButton(playing) {
  voicePlaying = playing;
  const label = playing ? "Stop" : "Please click";
  ["voiceToggle", "heroVoiceToggle"].forEach(id => {
    const button = $(id);
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "Stop the greeting" : "Please click to hear the greeting");
  });
  $("voiceLabel").textContent = label;
  document.querySelector(".hero-voice-label").textContent = label;
}

function stopGreeting() {
  currentUtterance = null;
  window.speechSynthesis.cancel();
  updateVoiceButton(false);
}

function playGreeting() {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    toast("Is browser mein voice playback support nahi hai.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(
    "जय माता दी। आपको और आपके परिवार को नवरात्रि की हार्दिक शुभकामनाएँ। " +
    "माँ दुर्गा आपके जीवन में सुख, शांति, साहस और खुशियाँ भरें। शुभ नवरात्रि।"
  );
  utterance.lang = "hi-IN";
  utterance.rate = 0.88;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  const hindiVoice = window.speechSynthesis.getVoices()
    .find(voice => voice.lang.toLowerCase().startsWith("hi"));
  if (hindiVoice) utterance.voice = hindiVoice;

  currentUtterance = utterance;
  utterance.onend = () => {
    if (currentUtterance !== utterance) return;
    currentUtterance = null;
    updateVoiceButton(false);
  };
  utterance.onerror = event => {
    if (currentUtterance !== utterance) return;
    currentUtterance = null;
    updateVoiceButton(false);
    if (event.error !== "canceled" && event.error !== "interrupted") {
      toast("Voice playback shuru nahi ho paaya. Dobara koshish karein.");
    }
  };

  try {
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
    updateVoiceButton(true);
  } catch {
    currentUtterance = null;
    updateVoiceButton(false);
    toast("Voice playback shuru nahi ho paaya. Dobara koshish karein.");
  }
}

function toggleGreeting() {
  if (voicePlaying) {
    stopGreeting();
  } else {
    playGreeting();
  }
}

$("voiceToggle").addEventListener("click", toggleGreeting);
$("heroVoiceToggle").addEventListener("click", toggleGreeting);

const navLinks = [...document.querySelectorAll(".nav-link")];
if ("IntersectionObserver" in window && navLinks.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, {rootMargin: "-30% 0px -60% 0px"});
  navLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) navObserver.observe(section);
  });
}
