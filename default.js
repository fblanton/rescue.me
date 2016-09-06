// temporary gray image as a placeholder until images are addded to the data
var imagePlaceholder = 'data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=';

//begin gloabl variables
var shelters = JSON.parse(data);
var filters = {pet: {breed: ''}};
//var theMap = createMap('map', 33.6496328, -117.74345);
var theMap = createMap('map', shelters[0]);

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
      filters = _.extend(filters, {pet: {breed: content}});
      display(shelters);
      break;
    case 'show-hero':
      swap('headers', 'hero');
      swap('views', 'home');
      break;
    case 'show-shelter':
      modal(content, 'shelter');
      break;
    case 'show-animal':
      modal(content, 'pet');
      break;
    case 'hide-modal':
      swap('modals');
      set('modal-close', 'hidden', true);
      break;
    case 'adopt':
      swap('modals', 'adopt', true)
      break
  }
}

function swap(area, view) {
  var theArea = document.getElementById(area);
  var theActive = theArea.getElementsByClassName('active')[0];

  if (theActive) {
    theActive.classList.remove('active');
    theActive.classList.add('hidden');
  }

  if (view) {
    var theView = document.getElementById(view);
    theView.classList.remove('hidden');
    theView.classList.add('active');
  }
}

function set(item, style, on) {
  var theItem = document.getElementById(item);

  if (on) {
    theItem.classList.add(style);
  } else {
    theItem.classList.remove(style);
  }
}

function createMap(id, shelter) {
  var lat = shelter.latitude,
      long = shelter.longitude,
      theMap = L.map(id).setView([lat, long], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'fblanton.19653a9c',
    accessToken: 'pk.eyJ1IjoiZmJsYW50b24iLCJhIjoiY2lzamNid2M1MDI3ODJ6b2Npd215Nm4xbSJ9.mgpAAP0NC5HRxKmfyP-eOQ'
  }).addTo(theMap);

  var marker = L.marker([lat, long]).addTo(theMap);

  marker.bindPopup(
    '<h5 class=\'centered\'>' + shelter.name + '<h5>').openPopup();

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

function returnBreeds(animals, term) {
  return _.chain(animals).pluck('breeds').flatten()
            .filter(function(breed) {
              return breed.toLowerCase().indexOf(term.toLowerCase()) !== -1;
            }).value();
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
  var term = breeds.target.value;
  var matched = [];
  var theSuggestions = document.getElementById('breed-suggestions');
  clear(theSuggestions);

  if (term !== '') {
    matched = returnBreeds(animals, term);
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
  var pets = filter(shelters, filters);

  clear(theResults);
  theResults.appendChild(element('div', {id: 'number-displayed'}, _.size(pets)));
  append(theResults, _.map(pets, function(pet) {
    return (createCard(getShelter({petID: pet.id}), pet));
  }));
}

function filter(array, filters) {
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

function modal(data, view, keep) {
  var theContent = document.getElementById(view);
  if (!keep) { clear(theContent); }
  swap('modals', view);

  switch (view) {
    case 'pet':
      var dataObject = JSON.parse(data);
      var shelter = getShelter({shelterID: dataObject.shelterID});
      var pet = getPet(dataObject.petID, shelter);

      theContent.appendChild(petTemplate(shelter, pet));
      break;
    case 'shelter':
      var shelter = getShelter({shelterID: data});
      theContent.appendChild(shelterTemplate(shelter));
      theMap = createMap('map', shelter);
      break;
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

function pets(shelterID) {
  var shelter = getShelter({shelterID: shelterID});
  return _.map(shelter.pets, function(pet) {
     return createCard(this, pet);
   }, shelter);
}

function status(pet) {
  var status;

  if (pet.status === 'Available') {
    status = [element('button', {class: 'btn btn-primary', type: 'button', 'data-toggle': 'collapse', 'data-target': '#adoption-form', 'aria-expanded': 'false', 'aria-controls': 'adoption-form'}, 'ADOPT NOW')];
  } else {
    status = pet.status;
  }

  return status;
}

function adoptionTemplate(pet) {
  return element('div', {class: 'row'}, [
    element('div', {class: 'col-xs-11'}, [
      element('div', {class: 'collapse', id: 'adoption-form'}, [
        element('p', {class: ''}, 'Apply to Adopt'),
        element('div', {class: 'well'}, [
          element('form', {class: 'form-horizontal'}, [
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-name', class: 'col-sm-2 control-label'}, 'Name'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'text', class: 'form-control', id: 'input-name', placeholder: 'Name', required: 'true'})
              ])
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-email', class: 'col-sm-2 control-label'}, 'Email'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'email', class: 'form-control', id: 'input-email', placeholder: 'Email', required: 'true'})
              ]),
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-phone', class: 'col-sm-2 control-label'}, 'Phone'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'tel', class: 'form-control', id: 'input-phone', placeholder: '(555) 555-5555', required: 'true', pattern: '((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3}-\\d{4}'})
              ]),
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-why', class: 'sr-only'}, 'Please describe why you would like to adopt ' + pet.name + '.'),
              element('div', {class: 'col-sm-12'}, [
                element('textarea', {class: 'form-control', id: 'input-why', placeholder: 'Please describe why you would like to adopt ' + pet.name + '.', required: 'true', rows: 3})
              ]),
            ]),
            element('div', {class: 'row'}, [
              element('div', {class: 'btn-group col-xs-12', role: 'group'}, [
                element('button', {class: 'btn btn-danger col-xs-6', 'data-toggle': 'collapse', 'data-target': '#adoption-form'}, 'Cancel'),
                element('button', {class: 'btn btn-primary col-xs-6'}, 'Apply')
              ])
            ])
          ])
        ])
      ])
    ])
  ]);
}

function petTemplate(shelter, pet) {
  return element('div', {class: 'jumbotron'}, [
    element('div', {class: 'col-sm-4'}, [
      element('img', {src: imagePlaceholder, class: 'placeholder'}),
      element('h3', {class: 'centered'}, pet.name),
      element('p', {}, pet.breed + ' | ' + pet.gender),
      element('p', {}, 'Adoption Fee: $' + pet.fee),
      element('p', {}, status(pet))
    ]),
    element('div', {class: 'col-sm-8'}, [
      element('h3', {}, 'Description'),
      element('p', {}, pet.description),
      adoptionTemplate(pet),
      element('hr'),
      element('h3', {'data-action': 'show-shelter','data-content': shelter.id }, shelter.name),
      element('pre', {'data-action': 'show-shelter','data-content': shelter.id }, shelter.address.number
        + ' '  + shelter.address.street
        + '\n' + shelter.address.city
        + ', ' + shelter.address.state
        + ' '  + shelter.address.zip
        + '\n' + shelter.phone),
      element('p', {}, shelter.description)
    ])
  ]);
}

function shelterTemplate(shelter) {
  return element('div', {class: 'jumbotron'}, [
    element('div', {id: 'map'}),
    element('div', {class: 'col-xs-4'}, [
      element('h3', {class: 'centered', 'data-action': 'show-shelter','data-content': shelter.id }, shelter.name),
      element('pre', {class: 'centered', 'data-action': 'show-shelter','data-content': shelter.id }, shelter.address.number
        + ' '  + shelter.address.street
        + '\n' + shelter.address.city
        + ', ' + shelter.address.state
        + ' '  + shelter.address.zip
        + '\n' + shelter.phone)
    ]),
    element('div', {class: 'col-xs-8'}, [
      element('h3', {}, 'Description'),
      element('p', {}, shelter.description),
      element('hr'),
      element('h3', {}, 'All Pets'),
      element('div', {id: 'pets'}, pets(shelter.id))
    ])
  ]);
}

display(shelters);
theMap.locate();
