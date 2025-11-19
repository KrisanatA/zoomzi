window.Revealzoomzi = function () {
  return {
    id: "Revealzoomzi",
    init: function (deck) {
      const config = deck.getConfig().Revealzoomzi;
      const SCALE = config.zoomScale;
      document.addEventListener("DOMContentLoaded", function () {
        if (config.zoomDev) {
          window._zoomzi_state = {};

          const zoomableElements = getZoomableElements();
          const zoomziElements = getZoomziElements();
          // console.log(zoomableElements);
          // console.log(zoomziElements);

          zoomziElements.forEach((x) => setupZoomControls(x, SCALE));
          zoomableElements.forEach((z) => {
            // console.log(z);
            window._zoomzi_state[z.getAttribute("data-zoom-id")] = {
              clientX: -1,
              clientY: -1,
            };
          });

          addSaveMenuButton();
        } else {
          Reveal.on("ready", () => {
            document.querySelectorAll(".zoomzi img").forEach((elem) => {
              elem.style.transition = "all 3s ease-in";
            });
            Reveal.on("slidechanged", (event) => {
              // Assume state is loaded in
              // TODO: This is what needs to be generated
              let zoom_state = JSON.parse(config.zoomState);
              console.log(zoom_state);
              // zoom_state = zoom_state
              //   .replace(/(\d+):/g, '"$1":') // quote numeric keys
              //   .replace(/(\w+):/g, '"$1":') // quote identifiers
              //   .replace(/,(\s*[}\]])/g, "$1"); // remove trailing commas
              const idattr = event.currentSlide.getAttribute("data-zoom-id");
              // console.log(Object.keys(zoom_state));
              // console.log(idattr);

              if (Object.keys(zoom_state).includes(idattr)) {
                console.log("changing");
                console.log(zoom_state[idattr]);
                const zoomX = zoom_state[idattr].clientX;
                const zoomY = zoom_state[idattr].clientY;
                const zoomzi_img =
                  event.currentSlide.querySelector(".zoomzi img");
                const zoomzi_div = event.currentSlide.querySelector(".zoomzi");
                // console.log(zoomzi_img);
                // console.log(zoomzi_div);

                // document.querySelector("#holder_two img").style = `${currentStyles};transform: scale(1.5); transform-origin: bottom left`  }
                zoomzi_img.style.transition = "all 3s ease-in";
                if (+zoomX != -1) {
                  zoomzi_img.style.transform = `scale(${SCALE})`;
                  zoomzi_img.style.transformOrigin = `${zoomX}% ${zoomY}%`;
                }
              }
            });
          });
        }
      });
    },
  };
};

function addSaveMenuButton() {
  // Find the slide-menu-items ul inside menu-custom-panel div
  const slideMenuItems = document.querySelector(
    "div.slide-menu-custom-panel ul.slide-menu-items",
  );

  if (slideMenuItems) {
    // Find the highest data-item value
    const existingItems = slideMenuItems.querySelectorAll("li[data-item]");
    let maxDataItem = 0;
    existingItems.forEach((item) => {
      const dataValue = parseInt(item.getAttribute("data-item")) || 0;
      if (dataValue > maxDataItem) {
        maxDataItem = dataValue;
      }
    });

    // Create the new li element
    const newLi = document.createElement("li");
    newLi.className = "slide-tool-item";
    newLi.setAttribute("data-item", (maxDataItem + 1).toString());
    newLi.innerHTML =
      '<a href="#" onclick="saveZoom()"><kbd>?</kbd> Get zoomzied presentation</a>';

    // Append to the ul
    slideMenuItems.appendChild(newLi);
  }
}

function saveZoom() {
  const str = JSON.stringify(window._zoomzi_state);
  navigator.clipboard.writeText(str).then((success) => {
    alert("Copied to clipboard");
  });
}

function getZoomziElements() {
  return document.querySelectorAll(".zoomzi img");
}

function getZoomableElements() {
  return document.querySelectorAll("section.zoomable");
}

function setupZoomControls(elem, scale) {
  const dot = addDot();
  attachEventListeners(elem);

  function addDot() {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.top = "0px";
    container.style.left = "0px";
    container.style.width = "10px";
    container.style.height = "10px";
    container.style.borderRadius = "50%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "999";

    container.style.backgroundColor = "rgba(255, 100, 100, 1)";
    const parent = elem.parentNode;
    parent.appendChild(container);
    return container;
  }

  function getCoordinates(event) {
    const isTouch = event.type.startsWith("touch");

    // revealjs scales this .slides container element so that
    // the slide fits completely in the viewport. We have to
    // adjust the mouse/touch positions by this scaling.
    const slidesContainerEl = document.querySelector(".slides");
    const scale = window
      .getComputedStyle(slidesContainerEl)
      .getPropertyValue("--slide-scale");

    return {
      clientX: (isTouch ? event.touches[0].offsetX : event.offsetX) / scale,
      clientY: (isTouch ? event.touches[0].offsetY : event.offsetY) / scale,
    };
  }

  function getCoordOrigins(event) {
    const rect = event.target.getBoundingClientRect();
    const section = event.target.closest("section[data-zoom-id]");
    const container_rect = section.getBoundingClientRect();

    const x = event.clientX - rect.left; // pixel X
    const y = event.clientY - rect.top; // pixel Y

    const tx = container_rect.width / 2 - x * scale;
    const ty = container_rect.height / 2 - y * scale;

    const originX = (x / rect.width) * 100;
    const originY = (y / rect.height) * 100;

    return {
      clientX: originX,
      clientY: originY,
    };
  }

  function moveDot(dot, coords) {
    // dot.style.transform = `translate(${coords.clientX}px, ${coords.clientY}px)`;
    dot.style.top = `${coords.clientX}px`;
    dot.style.left = `${coords.clientY}px`;
  }

  function attachEventListeners(elem) {
    elem.addEventListener("click", (event) => {
      console.log(event);
      // const coords = getCoordinates(event);
      const coords = getCoordOrigins(event);
      const section = event.target.closest("section[data-zoom-id]");
      const zoomId = section.dataset.zoomId;
      console.log(zoomId); // "1"
      window._zoomzi_state[zoomId] = {
        clientX: coords.clientX,
        clientY: coords.clientY,
      };
      console.log(JSON.stringify(window._zoomzi_state));
      moveDot(dot, coords);
    });
  }
}
