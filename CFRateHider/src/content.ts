const COLOR_CLASSES = [
  "user-orange",
  "user-red",
  "user-purple",
  "user-blue",
  "user-cyan",
  "user-gray",
];

const ranks = [
  "Unrated",
  "Newbie", // 0 - 1199 (Gray)
  "Pupil", // 1200 - 1399 (Green)
  "Specialist", // 1400 - 1599 (Cyan)
  "Expert", // 1600 - 1899 (Blue)
  "Candidate Master", // 1900 - 2099 (Violet)
  "Master", // 2100 - 2299 (Orange)
  "International Master", // 2300 - 2399 (Orange)
  "Grandmaster", // 2400 - 2599 (Red)
  "International Grandmaster", // 2600 - 2899 (Red)
  "Legendary Grandmaster", // 2900+
];

function getCurrentUsername(): string | null {
  const userLink = document.querySelector(
    "#header > div.lang-chooser > div:nth-child(2) > a:nth-child(1)"
  );
  if (userLink instanceof HTMLAnchorElement) {
    const username = userLink.text;
    return username ? username : null;
  }
  return null;
}
function getProfilePageUsername(): string | null {
  const match = window.location.pathname.match(/^\/profile\/([^\/]+)/);
  return match ? match[1] : null;
}
function hideUserRatingAndColor(username: string) {
  const elements = document.querySelectorAll("*");
  const lists = document.querySelectorAll("li");
  const profileUser = getProfilePageUsername();
  const graphElement = document.getElementById("usersRatingGraphPlaceholder");
  if (graphElement && graphElement.parentElement && profileUser===username) {
    const parent = graphElement.parentElement;
    // Do something with parent, like remove it
    parent.remove();
  }
  elements.forEach((el) => {
    if (el instanceof HTMLElement) {
      const text = el.innerText;
      if (text.includes(username)) {
        if (COLOR_CLASSES.some((cls) => el.classList.contains(cls))) {
          el.classList.remove(...COLOR_CLASSES);
          el.style.color = "black";
        }

        //el.innerText = el.innerText.replace(/\d{4}/, "****");
      }
      if (profileUser === username) {
        if (ranks.some((cls) => el.innerText === cls)) {
          el.innerText = "chudir vai rate";
        }
      }
    }
  });
  lists.forEach((el) => {
    if (el.innerText.includes("Contest rating:") && profileUser === username) {
      el.remove();
    }
  });
}
function removeRatingGraph() {
  const headings = Array.from(document.querySelectorAll("h3"));

  for (const h3 of headings) {
    if (h3.textContent?.includes("Contest rating")) {
      const graphContainer = h3.parentElement;
      if (graphContainer) {
        graphContainer.style.display = "none";
      }
    }
  }
}

function getProfileRating(): number | null {
  const ratingSpan = document.querySelector(".info ul li span:has(> span)");
  if (ratingSpan) {
    const text = ratingSpan.textContent;
    const match = text?.match(/\d{3,4}/);
    if (match) return parseInt(match[0]);
  }
  return null;
}

function main() {
  const username = getCurrentUsername();
  if (!username) return;

  const profileRating = getProfileRating();
  if (profileRating !== null && profileRating >= 1400) return;

  hideUserRatingAndColor(username);
  removeRatingGraph();
  const observer = new MutationObserver(() => {
    hideUserRatingAndColor(username);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function waitForBody(callback: () => void) {
  if (document.body) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

waitForBody(() => {
  main();
});
