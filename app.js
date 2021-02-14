const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchField = document.getElementById("search");
const picInfo = document.getElementById("pic-info");
const selectedPic = document.getElementById("selected-pic");
const sliderField = document.getElementById("duration");

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
  const totalPic = document.getElementById("total-pic");
  totalPic.innerText = images.length;

  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
  loadingSpinner();
  picInfo.classList.remove("d-none");
}

//api
const getImages = (query) => {
  loadingSpinner();
  setTimeout(() => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
      .then(response => response.json())
      .then(data => showImages(data.hits))
      .catch(err => console.log(err))
  }, 600)
}


let selectedPictureCount; // count the selected picture
let slideIndex = 0;

// it store the selected image
const selectItem = (event, img) => {
const element = event.target;

selectedPictureCount = selectedPic.innerText;

  ///here added toggle to select the image or unselect the image
  const value = element.classList.toggle("added");
  if (value == true) {
    sliders.push(img);
    selectedPic.innerText = ++selectedPictureCount;
  }
  else {
    const index = sliders.indexOf(img);
    sliders.splice(index, 1);
    selectedPic.innerText = --selectedPictureCount;
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
  setTimeout(() => {
    loadingSpinner();
    document.querySelector('.main').style.display = 'block';
  }, 800)
  loadingSpinner();

  // hide image aria
  imagesArea.style.display = 'none';

  let duration = document.getElementById('duration').value || 1000;

  //here just check the duration is negative or not
  if (duration < 0) {
    duration = duration * (-1);
  }

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
    slideIndex = items.length - 1;
    index = slideIndex;
  }

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
  selectedPic.innerText = 0;
  //when the search button is click its clear the previous html 
  document.getElementById("gallery-id").innerHTML = "";
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
})


//for keyboard enter
const keyboardEnter = (field,btn)=>{
  field.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      btn.click();
    }
  })
}
//for searchBtn enter
keyboardEnter(searchField,searchBtn);
// for sliderBtn enter
keyboardEnter(sliderField,sliderBtn);

//for slider
sliderBtn.addEventListener('click', function () {
  createSlider();
})


//for loading 
const loadingSpinner = () => {
  document.getElementById("spinner-loading").classList.toggle("d-none");
}