// temporary gray image as a placeholder until images are addded to the data
var imagePlaceholder = 'data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=';

//begin gloabl variables
var shelters = JSON.parse(data);
var filters = {};
var theMap = createMap('map', 33.6496328, -117.74345);

document.getElementById('breed').addEventListener('input', suggest);
document.body.addEventListener('click', handleClick);
//theMap.on('locationfound', function(e) { alert(e.latlng); });

function handleClick(clicked) {
  var action = '';
  var content = '';
  var target = clicked.target;

  while (!(target.hasAttribute('data-action')) && target.parentNode) {
    target = target.parentNode;
    if (typeof target.hasAttribute !== 'function') { return; }
  }

  action = target.getAttribute('data-action');

  if (target.hasAttribute('data-content')) {
    var content = target.getAttribute('data-content');
  }

  switch (action) {
    case 'complete-breed':
      complete('breed', content);
      break;
    case 'filter-breed':
      swap('headers', 'primary');
      swap('views', 'results');
      add(filters, {pet: {breed: content}});
      display(shelters);
      break;
    case 'show-hero':
      swap('headers', 'hero');
      swap('views', 'home');
      break;
    case 'show-shelter':
      set('hero', 'hidden', true);
      set('header', 'heroed', false);
      showShelter(content);
      display(shelters);
      break;
    case 'exitShelter':
      hideShelter();
      display(shelters);
      break;
    case 'show-animal':
      modal(content, 'animal');
      break;
    case 'hide-modal':
      set('modal-close', 'hidden', true);
      break;
  }
}

function swap(area, view) {
  var theArea = document.getElementById(area);
  var theActive = theArea.getElementsByClassName('active')[0];
  var theView = document.getElementById(view);

  theActive.classList.remove('active');
  theActive.classList.add('hidden');
  theView.classList.remove('hidden');
  theView.classList.add('active');
}

function add(filters, filter) {
  filters = _.extend(filters, filter);
}

function set(item, style, on) {
  var theItem = document.getElementById(item);

  if (on) {
    theItem.classList.add(style);
  } else {
    theItem.classList.remove(style);
  }
}

function hideShelter() {
  filters = filters.filter(function (a) {
    return a.type !== 'shelter';
  })
  document.getElementById('back').remove();
  document.getElementById('shelter-info').classList.add('hidden');
}

function showShelter(id) {
  //add a filter that will only show animals from the passed shelter id
  filters.push({type: 'shelter', value: id});

  // show the shelter div on the page and display the shelter-info header
  document.getElementById('shelter-info').classList.remove('hidden');

  // check to see if a back element exists and creat it if it does not
  var theLogo = document.getElementById('logo');
  if (document.getElementById('back')) { } // do nothing
  else { // create a back element and append it to the logo text
    var theBack = document.createElement('span');
    theBack.id = 'back';
    theBack.classList.add('small');
    theBack.textContent = ' – back';
    theBack.setAttribute('data-action', 'exitShelter');
    theLogo.appendChild(theBack);
  }

  // grab the shelter that we should be displaying
  var shelter;
  for (var i = 0; i < shelters.length; i++) {
    if (shelters[i].id === id) {
      shelter = shelters[i];
      i = shelters.length;
    }
  }

  // if we found a shelter display its map
  if (shelter) {
    var lat = shelter.latitude;
    var long = shelter.longitude;

    // place a marker on the map for this shelter and add a pop up to it
    theMap.remove();
    theMap = createMap('map', lat, long);
    var marker = L.marker([lat, long]).addTo(theMap);

    marker.bindPopup(
      '<h6>' + shelter.name + '<h6>' +
      shelter.address.number + ' ' + shelter.address.street + '<br>' +
      shelter.address.city + ', ' + shelter.address.state + ' ' + shelter.address.zip
    ).openPopup();
  }
}

// add a leafletjs map to a given element with id matching passed id
function createMap(id, lat, long) {
  var theMap = L.map(id).setView([lat, long], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'fblanton.19653a9c',
    accessToken: 'pk.eyJ1IjoiZmJsYW50b24iLCJhIjoiY2lzamNid2M1MDI3ODJ6b2Npd215Nm4xbSJ9.mgpAAP0NC5HRxKmfyP-eOQ'
  }).addTo(theMap);

  return theMap;
}

function complete(destination, content) {
    document.getElementById(destination).value = content;
    document.getElementById('filter-breed').setAttribute('data-content', content);
    clear(document.getElementById('breed-suggestions'));
}

function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

animals.returnBreeds = function(term) {
  var matched = []

  this.forEach(function(animalType) {
    animalType.breeds.forEach(function(breed) {
      if (breed.toLowerCase().indexOf(term) !== -1) {
        matched.push(breed);
      }
    })
  });

  return matched;
}

function makeList(array, limit) {
  var theList = [];

  for(var i = 0; i < array.length && i < 10; i++) {
    theList.push(
      element('li', {class: 'list-group-item', 'data-action': 'complete-breed', 'data-content': array[i]}, array[i])
    );
    if (i === limit-1) { break; }
  }

  return theList;
}

function suggest(breeds) {
  var term = breeds.target.value.toLowerCase();
  var matched = [];
  var theSuggestions = document.getElementById('breed-suggestions');
  clear(theSuggestions);

  if (term !== '') {
    matched = animals.returnBreeds(term);
  }

  // sort the matched breeds alphabetically and then by how soon the term appears
  matched.sort();
  matched.sort(function(a,b) {
    return (a.toLowerCase().indexOf(term) - b.toLowerCase().indexOf(term));
  });

  // add the matched breeds to theSuggestions DOM element
  if (!((matched.length === 1) && (matched[0].toLowerCase() === term))) {
    append(theSuggestions, makeList(matched, 10));
  }

  document.getElementById('filter-breed').setAttribute('data-content', term);
}

function display(shelters, where) {
  if (!where) { where = 'results'; }
  var theResults = document.getElementById(where);
  var pets = [];
  var count = 0;

  clear(theResults);
  pets = filter(shelters);

  for (var i = 0; i < pets.length; i++) {
    var shelter = getShelter({petID: pets[i].id});
    theResults.appendChild(createCard(shelter, pets[i]));
  }

  theEntry = document.createElement('div');
  theEntry.textContent = count;
  theResults.appendChild(theEntry);
}

function filter(array) {
  if (filters.shelter) {
    filteredShelters = _.filter(shelters, filters.shelter);
  } else {
    filteredShelters = shelters;
  }

  if (filters.pet) {
    filteredPets = _.chain(filteredShelters)
                    .pluck('pets')
                    .flatten()
                    .filter(filters.pet).value();
  } else {
    filteredPets = _.chain(filteredShelters)
                    .pluck('pets')
                    .flatten().value();
  }

  return filteredPets;
}

function getShelter(obj) {
  if (obj.shelterID) {
    return _.find(shelters, {id: obj.shelterID});
  } else if (obj.petID) {
    return _.find(shelters, function(shelter) { return (_.find(shelter.pets, {id: obj.petID})); });
  }
}

function getPet(id, shelter) {
  return shelter.pets.find(function(pet) {
    return pet.id === id;
  });
}

function modal(data, type) {
  var theContent = document.getElementById('modal-content');
  clear(theContent);

  if (type === 'animal') {
    var dataObject = JSON.parse(data);
    var shelter = getShelter(dataObject.shelterID);
    var pet = getPet(dataObject.petID, shelter);

    theContent.appendChild(
      element('div', {class: 'jumbotron'}, [
        element('div', {class: 'col-xs-4'}, [
          element('img', {src: imagePlaceholder, class: 'placeholder'}),
          element('h3', {class: 'centered'}, pet.name),
          element('p', {}, pet.breed + ' | ' + pet.gender),
          element('p', {}, 'Adoption Fee: $' + pet.fee),
          element('p', {}, 'Availability: ' + pet.status)
        ]),
        element('div', {class: 'col-xs-8'}, [
          element('h3', {}, 'Description'),
          element('p', {}, pet.description),
          element('hr'),
          element('h3', {}, shelter.name),
          element('pre', {}, shelter.address.number
            + ' '  + shelter.address.street
            + '\n' + shelter.address.city
            + ', ' + shelter.address.state
            + ' '  + shelter.address.zip
            + '\n' + shelter.phone),
          element('p', {}, shelter.description)
        ])
      ])
    );
  }

  set('modal-close', 'hidden', false);
}

function element(tag, attributes, contents) {
  var theElement = document.createElement(tag);

  if (attributes) {
    for (var attribute in attributes) {
      theElement.setAttribute(attribute, attributes[attribute]);
    }
  }

  if (Array.isArray(contents)) {
    contents.forEach(function(item){
      theElement.appendChild(item);
    });
  } else if (typeof contents !== 'undefined') {
    theElement.textContent = contents;
  }

  return theElement;
}

function append(element, children) {
  children.forEach(function(child) {
    element.appendChild(child);
  });

  return element;
}

function addTo(element, attributes) {
  attributes.forEach(function(attribute) {
    element.setAttribute(attribute[0], attribute[1]);
  });

  return element;
}

function createCard(shelter, pet) {
  return element('div', {class: 'col-md-4'},
  [ element('div',
    { class: 'entry',
    'data-action': 'show-animal',
    'data-content': JSON.stringify({shelterID: shelter.id, petID: pet.id}) },
    [ element('img', {src: imagePlaceholder, class: 'placeholder'}),
      element('h5', {class: 'centered'}, pet.name),
      element('hr'),
      element('p', {}, pet.breed),
      element('p', {}, parseInt(pet.age/12) + ' yrs ' + parseInt(pet.age%12) + ' mos | ' + pet.gender),
      element('p', {},
        [ element('a', {'data-action': 'show-shelter','data-content': shelter.id }, shelter.name) ]),
      element('p', {}, shelter.address.city + ' ' + shelter.address.state)
    ])
  ]);
}

display(shelters);
theMap.locate();
