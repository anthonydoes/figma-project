// Get the file
// Organize by IDs
// Generate images
// Add to the site

// loadFile().then(ids => {
//     loadImages(ids).then(imageUrls => {

//     })
// })

const loadingTag = document.querySelector("header p.loading");
const nextTag = document.querySelector("a.next");
const previousTag = document.querySelector("a.previous");
const stepsTag = document.querySelector("footer span");
const sliderTag = document.querySelector("div.slider");
const footerTag = document.querySelector("footer");

let currentSlide = 0;
let totalSlides = 0;


const apikey = "215049-ea6bdd3d-fb48-4ce3-864c-c492bb0d1024";
const apiHeaders = {
    headers: {
        "X-Figma-Token": apikey
    }
}

const loadFile = function (key) {
    return fetch("https://api.figma.com/v1/files/" + key, apiHeaders)
    .then(response => response.json())
    .then(data => {
        // return a list of FRAME ids
        const ids = data.document.children[0].children.map(frame => {
            return frame.id;
        })

        const title = data.name;

        return { 
            key: key, 
            title: title,
            ids: ids
        }
    })
    }


const loadImages = function (obj) { 
    const key = obj.key
    const ids = obj.ids.join(",")

    return fetch("https://api.figma.com/v1/images/" + key + "?ids=" + ids + "&scale=1", apiHeaders)
    .then(response => response.json())
    .then(data => {
        return obj.ids.map(id => {
            return data.images[id]
        })
    })
}

const addImageToSite = function (urls) {

    sliderTag.innerHTML = "";
    totalSlides = urls.length;

    footerTag.classList.add("show");

    urls.forEach(url => {
        sliderTag.innerHTML = sliderTag.innerHTML + `
        <div>
            <img src="${url}">
        </div>
        `
    })
}


loadFile("Wue04XBMTxRe4kIQnAAJRB")
    .then(file => {
        loadingTag.innerHTML = file.title
        document.title = file.title + " - AnthonyDoes"
        return file
    })
    .then(file => loadImages(file))
    .then(imageUrls => {
        addImageToSite(imageUrls);
    })
    

    // Events for next and previous
    const next = function () {
        currentSlide = currentSlide + 1;
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        moveSlider();
    }

    const previous = function () {
        currentSlide = currentSlide - 1;
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        moveSlider();
    }

    const moveSlider = function () {
        sliderTag.style.transform = `translate(${currentSlide * -100}vw, 0)`;
        stepsTag.innerHTML = `${currentSlide + 1} / ${totalSlides}`;
    }

    nextTag.addEventListener("click", function () {
        next()
    })

    previousTag.addEventListener("click", function () {
        previous()
    })