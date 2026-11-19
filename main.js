// ===============================
// HTML ELEMENTS
// ===============================

const form = document.querySelector("#nasaForm");

const dateInput = document.querySelector("#date");

const media = document.querySelector("#media");

const apodDate = document.querySelector("#apodDate");

const title = document.querySelector("#title");

const explanation = document.querySelector("#explanation");

// ===============================
// DATE SETTINGS
// ===============================

// Prevent the user from selecting
// a date in the future.

const now = new Date();

const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");

dateInput.max = today;

// The first APOD was published on June 16, 1995

dateInput.min = "1995-06-16";

// ===============================
// FORM EVENT
// ===============================

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  // Stop the page from refreshing
  event.preventDefault();

  const selectedDate = dateInput.value;

  if (!selectedDate) {
    alert("Please select a date.");

    return;
  }

  getNasaData(selectedDate);
}

// ===============================
// NASA API
// ===============================

// The apod-basic endpoint asks for one day as a path:
// /apod-basic/YYMMDD (for example 2024-06-01 -> 240601).

function toApodId(date) {
  const [year, month, day] = date.split("-");

  return `${year.slice(2)}${month}${day}`;
}

async function getNasaData(date) {
  const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${toApodId(date)}`;

  try {
    const response = await fetch(url);

    // NASA answers 404 when no APOD exists for that date

    if (response.status === 404) {
      throw new Error(`No APOD was found for ${date}.`);
    }

    if (!response.ok) {
      throw new Error("Could not retrieve NASA data.");
    }

    const result = await response.json();

    // A single date returns one object

    const data = Array.isArray(result) ? result[0] : result;

    if (!data || !data.title) {
      throw new Error(`No APOD was found for ${date}.`);
    }

    displayNasaData(data);
  } catch (error) {
    console.error(error);

    apodDate.textContent = "";

    title.textContent = "Something went wrong.";

    explanation.textContent = `${error.message} Please try another date.`;

    media.innerHTML = "";
  }
}

// ===============================
// DISPLAY NASA DATA
// ===============================

function displayNasaData(data) {
  apodDate.textContent = data.date;

  title.textContent = data.title;

  explanation.textContent = cleanText(data.explanation);

  if (data.media_type === "image") {
    displayImage(data);
  } else {
    displayVideo(data);
  }
}

// ===============================
// DISPLAY IMAGE
// ===============================

function displayImage(data) {
  // Remove the old media
  media.innerHTML = "";

  const image = document.createElement("img");

  image.src = data.hdurl;

  image.alt = cleanText(data.alt) || data.title;

  media.appendChild(image);
}

// ===============================
//  USED TO DISPLAY VIDEO
// ===============================

function displayVideo(data) {
  media.innerHTML = "";

  const parser = new DOMParser();

  const parsedDocument = parser.parseFromString(data.basic_html, "text/html");

  // NASA videos may be stored
  // as a <video> or <iframe>

  const video = parsedDocument.querySelector("video");

  const iframe = parsedDocument.querySelector("iframe");

  // Try regular HTML video first

  if (video) {
    const source = video.querySelector("source");

    const videoUrl = source?.src || video.src;

    if (videoUrl) {
      const videoElement = document.createElement("video");

      videoElement.src = videoUrl;

      videoElement.controls = true;

      media.appendChild(videoElement);

      return;
    }
  }

  // Try embedded video such as YouTube

  if (iframe) {
    const iframeElement = document.createElement("iframe");

    iframeElement.src = iframe.src;

    iframeElement.allowFullscreen = true;

    media.appendChild(iframeElement);

    return;
  }

  // Backup if a video
  // cannot be embedded

  displayNasaLink(data);
}

// ===============================
// NASA LINK BACKUP
// ===============================

function displayNasaLink(data) {
  const link = document.createElement("a");

  link.href = data.permalink;

  link.target = "_blank";

  link.textContent = "View this APOD on NASA →";

  media.appendChild(link);
}

// ===============================
// REMOVE HTML TAGS
// ===============================

function cleanText(html) {
  if (!html) {
    return "";
  }

  const parser = new DOMParser();

  const parsedDocument = parser.parseFromString(html, "text/html");

  return parsedDocument.body.textContent;
}
