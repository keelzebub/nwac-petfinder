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
  const animalHtmlBlocks = animals.map((animal) => (
  `
    <a class='grid-item' href='/pets/show?petfinder_id=${animal.id}'>
      <div class='grid-image'>
        <div class='grid-image-inner-wrapper'>
            <img data-src='${animal.primary_photo_cropped.small}' data-image='${animal.primary_photo_cropped.small}' data-image-dimensions='300x400' data-image-focal-point='0.5,0.5' alt='${animal.name}  |  ${animal.age}' data-load='false' data-parent-ratio='1.0' class=' data-image-resolution='750w' src='${animal.primary_photo_cropped.small}' style='width: 100%; height: 100%; object-position: 50% 50%; object-fit: cover;' />
        </div>
      </div>
      <div class='portfolio-text'>
        <h3 class='portfolio-title preFade fadeIn' style='transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.285714s;'>${animal.name}  |  ${animal.age}</h3>
      </div>
    </a>
  `
  ));

  const gridContainer = document.getElementById('gridThumbs');
  gridContainer.innerHTML = animalHtmlBlocks.join('');
};

//
// Replace the main pet image
//
window.replaceMainPetImage = async (url) => {
  const mainImageContainer = document.getElementsByClassName('sqs-image-shape-container-element')[0];
  const mainImage = `
    <img class="thumb-image loaded" data-src="${url}" data-image="${url}" data-image-focal-point="0.5,0.5" alt="" data-load="false" data-type="image" src="${url}">
  `;
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


  // Update the animal description
  let getsAlongWith = [];
  for (const key in animal.environment) {
    if (animal.environment[key]) {
      getsAlongWith.push(key);
    }
  }
  getsAlongWith = getsAlongWith.length > 0 ? getsAlongWith.join(', ') : 'N/A';


  const descriptionContainer = document.getElementsByClassName('sqs-block-content')[2];
  const description = `
<h3 style="white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.253333s;" class="preFade fadeIn">${animal.name}</h3>
<p class="preFade fadeIn" style="white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.266667s;">
  ${animal.age} ${animal.gender} ${animal.breeds.primary} ${animal.colors.primary}${animal.colors.secondary ? ', ' + animal.colors.secondary : ''}
Coat length: ${animal.coat}
House-trained: ${animal.attributes.house_trained ? 'Yes' : 'No'}
Vaccinations up to date: ${animal.attributes.shots_current ? 'Yes' : 'No'}
Spayed / neutered: ${animal.attributes.spayed_neutered ? 'Yes' : 'No'}
Good in a home with: ${getsAlongWith}
</p>
<p class="sqsrte-small preFade fadeIn" style="white-space: pre-wrap; transition-timing-function: ease; transition-duration: 0.4s; transition-delay: 0.28s;">
${animal.description}
For full description, please visit the <a target='_blank' rel='noopener noreferrer' href='${animal.url}'>Petfinder page for ${animal.name}</a>!
</p>
  `;

  descriptionContainer.innerHTML = description;


  // Update the images
  window.replaceMainPetImage(largeImages[0]);

  const imageContainer = document.getElementsByClassName('sqs-block-content')[0];

  const imageGallery = document.createElement('div');
  imageGallery.style = 'margin-top: 12px;';

  imageContainer.appendChild(imageGallery);

  const imageThumbnails = smallImages.forEach((url, index) => {
    const thumbnailButton = document.createElement('button');
    thumbnailButton.style = 'background: transparent; border: none;';
    thumbnailButton.onClick = window.replaceMainPetImage(largeImages[index]);
    thumbnailButton.innerHTML = `<img data-id='${index}' src="${url}">`;

    imageGallery.appendChild(thumbnailButton);
  });
};
