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
// a date in the future

const today = new Date().toISOString().split("T")[0];

dateInput.max = today;

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

async function getNasaData(date) {
  const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?date=${date}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not retrieve NASA data.");
    }

    const data = await response.json();

    console.log(data);

    displayNasaData(data);
  } catch (error) {
    console.error(error);

    title.textContent = "Something went wrong.";

    explanation.textContent =
      "NASA's data could not be loaded. Please try another date.";

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
