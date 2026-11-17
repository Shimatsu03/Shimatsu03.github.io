document.addEventListener("DOMContentLoaded", init);

async function init() {

await loadSongs();

initSettings();

bindEvents();

updateSongCount();

}

async function loadSongs() {

const response = await fetch("./data/songs.json");

state.songs = await response.json();

state.availableSongs = [...state.songs];

}

function initSettings() {

fillSelect("target-count", 5, 25, 15);

fillSelect("candidate-count", 1, 15, 5);

fillSelect("pass-count", 0, 15, 3);

}

function fillSelect(id, min, max, selected) {

const select = document.getElementById(id);

for (let i = min; i <= max; i++) {

const option = document.createElement("option");

option.value = i;
option.textContent = i;

if (i === selected) {
option.selected = true;
}

select.appendChild(option);

}

}

function bindEvents() {

document
.getElementById("start-btn")
.addEventListener("click", startDraft);

}

function updateSongCount() {

document.getElementById("song-count").textContent =
`対象楽曲数：${state.availableSongs.length}曲`;

}

function startDraft() {

state.settings.targetCount =
Number(document.getElementById("target-count").value);

state.settings.candidateCount =
Number(document.getElementById("candidate-count").value);

state.settings.passCount =
Number(document.getElementById("pass-count").value);

state.remainingPasses =
state.settings.passCount;

document
.getElementById("settings-screen")
.classList.add("hidden");

document
.getElementById("draft-screen")
.classList.remove("hidden");

drawDraftScreen();

}

function drawDraftScreen() {

const remain =
state.settings.targetCount -
state.selectedSongIds.length;

const candidateCount = Math.min(
remain,
state.settings.candidateCount
);

const pool =
state.availableSongs.filter(
song =>
!state.selectedSongIds.includes(song.id)
);

state.currentCandidates =
shuffle(pool).slice(0, candidateCount);

document.getElementById("progress-text").textContent =
`${state.selectedSongIds.length} / ${state.settings.targetCount} 曲`;

document.getElementById("pass-text").textContent =
`残りパス：${state.remainingPasses}回`;

renderCandidates();

}

function renderCandidates() {

const container =
document.getElementById("candidate-list");

container.innerHTML = "";

state.currentCandidates.forEach(song => {

const card =
document.createElement("div");

card.className = "card";

card.innerHTML = `
<div class="song-title">${song.title}</div>
<div class="release">${song.release}</div>
<div class="badge">${formatCategory(song.category)}</div>
<button data-id="${song.id}">
選択
</button>
`;

card
.querySelector("button")
.addEventListener("click", () => {
selectSong(song.id);
});

container.appendChild(card);

});

}

function selectSong(songId) {

state.selectedSongIds.push(songId);

updateSelectedSongs();

if (
state.selectedSongIds.length >=
state.settings.targetCount
) {

alert("ドラフト完了");

return;

}

drawDraftScreen();

}

function updateSelectedSongs() {

const songs =
state.songs.filter(song =>
state.selectedSongIds.includes(song.id)
);

document.getElementById(
"selected-summary"
).textContent =
`選択済み楽曲（${songs.length}）`;

document.getElementById(
"selected-song-list"
).innerHTML =
songs
.map(song => `<div>${song.title}</div>`)
.join("");

}

function formatCategory(category) {

if (category === "なし") {
return "通常C/W曲";
}

return category;

}

function shuffle(array) {

const copy = [...array];

for (let i = copy.length - 1; i > 0; i--) {

const j = Math.floor(
Math.random() * (i + 1)
);

[copy[i], copy[j]] =
[copy[j], copy[i]];

}

return copy;

}
