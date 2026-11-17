const STORAGE_KEY = "sakurazaka-setlist-draft";

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

function loadState() {
  const data = localStorage.getItem(
    STORAGE_KEY
  );

  if (!data) {
    return false;
  }

  const savedState = JSON.parse(data);

  Object.assign(state, savedState);

  return true;
}

function clearState() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}
