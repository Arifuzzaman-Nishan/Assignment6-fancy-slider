const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchField = document.getElementById("search");
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
  loadingSpinner();

}

const getImages = (query) => {
  loadingSpinner();
  setTimeout(() => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
      .then(response => response.json())
      .then(data => showImages(data.hits))
      .catch(err => console.log(err))
  }, 600)
}

// showImages(data.hits)
let slideIndex = 0;
const selectItem = (event, img) => {
  const element = event.target;

  ///here added toggle to select the image or unselect the image
  const value = element.classList.toggle("added");
  if (value == true) {
    sliders.push(img);
  }
  else {
    const index = sliders.indexOf(img);
    sliders.splice(index, 1);
  }

}

let timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

 
    // create slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);

    //for loading spinner time
    setTimeout(()=>{
      loadingSpinner();
      document.querySelector('.main').style.display = 'block';
    },1000)
    loadingSpinner();
    // hide image aria
    imagesArea.style.display = 'none';

  const duration = document.getElementById('duration').value || 1000;

  sliders.forEach(slide => {
    let item = document.createElement('div');
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);

}


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}


// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none";
  })

  items[index].style.display = "block";
}


//for mouse click
searchBtn.addEventListener('click', function () {
  //when the search button is click its clear the previous html 
  document.getElementById("gallery-id").innerHTML = "";
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
})


//for keyboard enter
searchField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
})


sliderBtn.addEventListener('click', function () {
  const duration = document.getElementById('duration').value;

  //here just check the duration is negative or not
  if (duration < 0) {
    alert("slider change duration cannot be negative");
  }
  else {
    createSlider();
  }

})


//for loading 
const loadingSpinner = () => {
  document.getElementById("spinner-loading").classList.toggle("d-none");
}