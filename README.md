# 🚀 NASA Astronomy Picture of the Day

Pick any date and see NASA's Astronomy Picture of the Day (APOD) for it: the image or video, its title, and the astronomer's explanation.

🔗 **Live Demo:** [kareemahb.github.io/simple-nasa-api-bootcamp](https:/kareemahb.github.io/simple-nasa-api-bootcamp/)

![alt text](image.png)

## ✨ Features

- **Date picker**: choose any day from June 16, 1995 (the first APOD) through today. Future dates are blocked.
- **Images**: shows the full-resolution picture with its alt text.
- **Videos**: plays NASA-hosted videos in a `<video>` player and embeds YouTube and other players in an `<iframe>`.
- **Fallback link**: if a video can't be embedded, shows a link to the APOD page on NASA's site.
- **Clean text**: strips the HTML tags NASA includes in explanations and alt text.
- **Error messages**: clear feedback when a date has no APOD or NASA can't be reached.
- **Responsive design** with a full-screen hero section.

## 🔍 How It Works

```
Date → YYMMDD → NASA apod-basic API → JSON → image or video + explanation
```

1. Submitting the form stops the page refresh (`event.preventDefault()`) and reads the date.
2. `toApodId()` converts the date to NASA's `YYMMDD` format, for example `2024-06-01` → `240601`.
3. `getNasaData()` fetches `https://science.nasa.gov/wp-json/wp/v2/apod-basic/240601` using `async`/`await`.
4. `displayNasaData()` fills in the date, title, and explanation, then:
   - calls `displayImage()` when `media_type` is `"image"`, or
   - calls `displayVideo()`, which uses `DOMParser` to find a `<video>` or `<iframe>` in NASA's `basic_html`, and falls back to `displayNasaLink()`.

### About the API

In September 2026, NASA moved APOD to **science.nasa.gov** and retired the old `api.nasa.gov/planetary/apod` endpoint, which is being archived on December 1, 2026. This app uses the new endpoint:

| Request          | URL                                                            |
| ---------------- | -------------------------------------------------------------- |
| One specific day | `https://science.nasa.gov/wp-json/wp/v2/apod-basic/YYMMDD`     |
| Latest APOD      | `https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1` |

- **No API key** is needed.
- One day returns a single JSON object. A day with no APOD returns **404**.
- A `?date=YYYY-MM-DD` query is **ignored** and returns the latest 25 entries, so the date must go in the path.
- `hdurl` is the image. `url` is now the article page, not the image.
- `explanation` contains HTML, so the app strips the tags before showing it.

## 🎨 Design

| Color      | Hex       |
| ---------- | --------- |
| Black      | `#000000` |
| Dark       | `#101010` |
| Blue       | `#2F28FB` |
| Gray       | `#A9ADB5` |
| Light gray | `#D6D8DC` |
| White      | `#FFFFFF` |

Font: [Montserrat](https://fonts.google.com/specimen/Montserrat)

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom properties, media queries)
- JavaScript (`async`/`await`, Fetch API, `DOMParser`, template literals)
- [NASA APOD API](https://api.nasa.gov/)
  No frameworks, dependencies, or build tools.

## 📁 Project Structure

```
simple-nasa-api-bootcamp/
├── index.html       # Hero, date form, and result area
├── main.css         # Styling and color palette
├── main.js          # Fetches and displays the APOD
└── earth-hero.jpg   # Hero background image
```

## 🚀 Getting Started

```bash
git clone https://github.com/kareemahb/simple-nasa-api-bootcamp.git
cd simple-nasa-api-bootcamp
```

Open `index.html` in your browser, or use the **Live Server** extension in VS Code.

## 💡 What I Learned

- Reading API docs closely, and adapting when an API changes: NASA moved APOD to a new endpoint mid-project.
- Formatting a date for an API (`YYYY-MM-DD` → `YYMMDD`)
- Handling different response types (image vs. video) with one display function
- Using `DOMParser` to pull a video out of an HTML string and to strip HTML tags from text
- Using local time for the date picker, because `toISOString()` is UTC and would allow "tomorrow" every evening in the US
- Handling errors with `try`/`catch` and checking `response.status`

## 👩‍💻 Created By

**Kareemah Bahaadur**
[GitHub](https://github.com/kareemahb)
