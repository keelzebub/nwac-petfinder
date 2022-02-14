//
// Get query params
//
const getQueryParams = () => {
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
const loadAnimals = async (animalType, petfinderSecret) => {
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
const loadAnimal = async (petfinderId) => {
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
const replaceIndex = async (animals) => {
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
// Replace show page content
//
const replaceShow = async (animal) => {

  // get the petfinder_id from the query string
  const queryParams = getQueryParams();
  if (queryParams.petfinder_id === undefined) {
    return;
  }

};