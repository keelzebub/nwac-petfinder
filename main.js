//
// Get query params
//
window.getQueryParams = () => {
  const queryString = window.location.search.substring(1);
  const queryParams = {};
  queryString.split('&').forEach((querySet) => {
    if (querySet.length > 2) {
      const [name, value] = querySet.split('=');
      queryParams[name] = value;
    }
  });

  return queryParams;
};

//
// Load all animal of a type
//
window.loadAnimals = async (animalType, petfinderSecret) => {
  const tokenResponse = await fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: 'yJoHg3LOjzA3nsuYuLfH9gmhxs8PUqFPFePQO4BagL9ZgPO3dN',
      client_secret: petfinderSecret
    }),
  });

  const token = (await tokenResponse.json()).access_token;

  const animalResponse = await fetch(`https://api.petfinder.com/v2/animals?type=${animalType}&organization=OR141&page=1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  return (await animalResponse.json()).animals;
};

//
// Load data for one animal
//
window.loadAnimal = async (petfinderId, petfinderSecret) => {
  const tokenResponse = await fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: 'yJoHg3LOjzA3nsuYuLfH9gmhxs8PUqFPFePQO4BagL9ZgPO3dN',
      client_secret: petfinderSecret
    }),
  });

  const token = (await tokenResponse.json()).access_token;

  const animalResponse = await fetch(`https://api.petfinder.com/v2/animals/${petfinderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  return (await animalResponse.json()).animal;
};

//
// Replace index page content
//
window.replaceIndex = async (animals) => {
  const animalHtmlBlocks = animals.map((animal) => {
    let age = animal.age === 'Baby' && animal.type === 'Cat' ? 'Kitten' : animal.age;
    age = animal.age === 'Baby' && animal.type === 'Dog' ? 'Puppy' : age;
    return (
      `
        <a class='grid-item' href='/pets/show?petfinder_id=${animal.id}'>
          <div class='grid-image'>
            <div class='grid-image-inner-wrapper'>
                <img data-src='${animal.primary_photo_cropped.small}' data-image='${animal.primary_photo_cropped.small}' data-image-dimensions='300x400' data-image-focal-point='0.5,0.5' alt='${animal.name}  |  ${age}' data-load='false' data-parent-ratio='1.0' class=' data-image-resolution='750w' src='${animal.primary_photo_cropped.small}' style='width: 100%; height: 100%; object-position: 50% 50%; object-fit: cover;' />
            </div>
          </div>
          <div class='portfolio-text'>
            <h3 class='portfolio-title preFade fadeIn' style='transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.285714s;'>${animal.name}  |  ${age}</h3>
          </div>
        </a>
      `
    );
  });

  const gridContainer = document.getElementById('gridThumbs');
  gridContainer.innerHTML = animalHtmlBlocks.join('');
};

//
// Replace the main pet image
//
window.replaceMainPetImage = async (mainImage, imageUrl) => {
  mainImage.src = imageUrl;
};

//
// Replace show page content
//
window.replaceShow = async (animal) => {
  const smallImages = [];
  const largeImages = [];

  animal.photos.forEach((photo) => {
    smallImages.push(photo.small);
    largeImages.push(photo.large);
  });

  const mainContainer = document.getElementsByClassName('sqs-row')[0];
  mainContainer.style = 'display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.517241s;'
  mainContainer.className += ' custom-row preFade';
  mainContainer.innerHTML = '';

  const leftContainer = document.createElement('div');
  leftContainer.className = 'col sqs-col-6 span-6';
  leftContainer.style = 'float: none; padding: 0 17px;';

  const rightOuterContainer = document.createElement('div');
  rightOuterContainer.className = 'col sqs-col-5 span-5';
  rightOuterContainer.style = 'float: none;';

  rightInnerContainer = document.createElement('div');
  rightInnerContainer.className = 'sqs-block html-block sqs-block-html';
  rightOuterContainer.appendChild(rightInnerContainer);


  mainContainer.appendChild(leftContainer);
  mainContainer.appendChild(rightOuterContainer);

  // Update the animal description
  let getsAlongWith = [];
  for (const key in animal.environment) {
    if (animal.environment[key]) {
      getsAlongWith.push(key);
    }
  }
  getsAlongWith = getsAlongWith.length > 0 ? getsAlongWith.join(', ') : 'N/A';

  const name = document.createElement('h3');
  name.style = 'margin-top: 0px;';
  name.innerText = animal.name;
  rightInnerContainer.appendChild(name);

  let age = animal.age;
  if (age === 'Baby') {
    age = animal.type === 'Cat' ? 'Kitten' : 'Puppy';
  } else {
    age += ` ${animal.type}`
  }

  const detailsContent = [
    `${animal.gender} ${age}`,
    `Breed: ${animal.breeds.primary}`,
    `Color: ${animal.colors.primary}${animal.colors.secondary ? ', ' + animal.colors.secondary : ''}`,
    `Coat length: ${animal.coat}`,
    `House-trained: ${animal.attributes.house_trained ? 'Yes' : 'No'}`,
    `Vaccinations up to date: ${animal.attributes.shots_current ? 'Yes' : 'No'}`,
    `Spayed / neutered: ${animal.attributes.spayed_neutered ? 'Yes' : 'No'}`,
    `Good in a home with: ${getsAlongWith}`
  ];

  const details = document.createElement('p');
  details.style = 'white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.266667s;'
  details.innerText = detailsContent.join("\n");
  rightInnerContainer.appendChild(details);

  const description = document.createElement('p');
  description.style = 'white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.266667s;'
  description.innerHTML = `${animal.description} (<a style='text-decoration: underline !important;' target='_blank' rel='noopener noreferrer' href='${animal.url}'>Full description here</a>.)`
  rightInnerContainer.appendChild(description);

  const adoptionProcess = document.createElement('p');
  adoptionProcess.style = 'white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.266667s;'
  adoptionProcess.innerHTML = `Learn more about Northwest Animal Companions' <a style='text-decoration: underline !important;' href='/adoption-process'>adoption process here</a>.`;
  rightInnerContainer.appendChild(adoptionProcess);

  const applyToAdopt = document.createElement('p');
  applyToAdopt.style = 'white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.266667s;'
  applyToAdopt.innerHTML = `To apply to adopt ${animal.name}, fill out an <a style='text-decoration: underline !important;' href='/adoption-app'>adoption application</a> now!`;
  rightInnerContainer.appendChild(applyToAdopt);

  // Update the images
  const mainImage = document.createElement('img');
  mainImage.className = 'largeImages[0]';
  mainImage.src = largeImages[0];
  mainImage.alt = `${animal.name}`;
  mainImage.style = 'width: calc(100% - 34px);';
  leftContainer.appendChild(mainImage);

  const imageGallery = document.createElement('div');
  imageGallery.style = 'margin-top: 12px;';

  leftContainer.appendChild(imageGallery);

  smallImages.forEach((url, index) => {
    const thumbnailButton = document.createElement('button');
    thumbnailButton.style = 'background: transparent; border: none;';
    thumbnailButton.onclick = window.replaceMainPetImage.bind(null, mainImage, largeImages[index]);
    thumbnailButton.innerHTML = `<img data-id='${index}' src="${url}">`;

    imageGallery.appendChild(thumbnailButton);
  });

  mainContainer.className += ' fadeIn';

  document.querySelector('style').textContent +=
    "@media screen and (max-width: 767px) { .custom-row { justify-content: flex-start !important; } }"
};
