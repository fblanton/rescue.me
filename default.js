// temporary gray image as a placeholder until images are addded to the data
var imagePlaceholder = 'data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=';

//begin gloabl variables
var shelters = JSON.parse(data);
var filters = [];
var theMap = createMap('map', 33.6496328, -117.74345);

document.getElementById('breed').addEventListener('input', suggest);
document.body.addEventListener('click', handleClick);

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
      for (i = 0; i < filters.length; i++) {
        if (filters[i].type === 'breed') {
          filters.splice(i, 1);
        }
      }
      if (content === '') { content = theQuery.value };
      if (content !== '') {
        filters.push({type: 'breed', value: content});
      }

      set('hero', 'hidden', true);
      set('header', 'heroed', false);
      display(shelters);
      break;
    case 'showHero':
      set('hero', 'hidden', false);
      set('header', 'heroed', true);
      break;
    case 'showShelter':
      set('hero', 'hidden', true);
      set('header', 'heroed', false);
      showShelter(content);
      display(shelters);
      break;
    case 'exitShelter':
      hideShelter();
      display(shelters);
      break;
    case 'showDetails':
      set('modal', 'hidden', false);
      var view = document.getElementById('details');
      update(JSON.parse(content), view);
      break;
    case 'hideDetails':
      set('modal', 'hidden', true);
      break;
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
    clear(document.getElementById('breed-suggestions'));
}

function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function suggest(event) {
  var typed = event.target.value.toLowerCase();
  var matches = [];
  var theSuggestions = document.getElementById('breed-suggestions');

  clear(theSuggestions);

  if (typed !== '') {
    animals.forEach(function(animalType) {
      animalType.breeds.forEach(function(breed) {
        if (breed.toLowerCase().indexOf(typed) !== -1) {
          matches.push(breed);
        }
      })
    });
  }

  // sort the found matches alphabetically and then how soon our
  matches.sort();
  matches.sort(function(a,b) {
    return (a.toLowerCase().indexOf(typed) - b.toLowerCase().indexOf(typed));
  });


  if (!((matches.length === 1) && (matches[0].toLowerCase() === value))) {
    for(var i = 0; i < matches.length && i < 10; i++) {
      theSuggestions.appendChild(
        element('li', {class: 'list-group-item', 'data-action': 'complete-breed', 'data-content': matches[i]}, matches[i])
      );
    }
  }
}

function display(shelters) {
  var theResults = document.getElementById('results');

  clear(theResults);

  var count = 0;

  for (var i = 0; i < shelters.length; i++) {
    for (j = 0; j < shelters[i].pets.length; j++) {
      if (shouldDisplay(i, j)) {
        var theRow = createCard(shelters[i], shelters[i].pets[j]);
        theResults.appendChild(theRow);
        count++;
      }
    }
  }

  theEntry = document.createElement('div');
  theEntry.textContent = count;
  theResults.appendChild(theEntry);
}

function shouldDisplay(shelter, pet) {
  var should = true;

  // Iterate through the filters array, perform an && operation on the current value of the should variable along with a comparison operation to see if the current pet should be displayed. If any case fails the item should not be display and should becomes false. At that point we can exit the loop.
  for (var i = 0; (i < filters.length) && should; i++) {
    switch (filters[i].type) {
      case 'breed':
        should = (should && (shelters[shelter].pets[pet].breed.toLowerCase() === filters[i].value.toLowerCase()));
        break;
      case 'shelter':
        should = (should && (shelters[shelter].id === filters[i].value));
        break;
    }
  }

  return should;
}

function getShelter(id) {
  return shelters.find(function(shelter) {
    return shelter.id === id;
  });
}

function getPet(shelter, id) {
  return shelter.pets.find(function(pet) {
    return pet.id === id;
  })
}

function update(content, view) {
  var shelter = getShelter(content.shelterID);
  var pet = getPet(shelter, content.petID);

  clear(view);

  view.appendChild(
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
    'data-action': 'showDetails',
    'data-content': JSON.stringify({shelterID: shelter.id, petID: pet.id}) },
    [ element('img', {src: imagePlaceholder, class: 'placeholder'}),
      element('h5', {class: 'centered'}, pet.name),
      element('hr'),
      element('p', {}, pet.breed),
      element('p', {}, parseInt(pet.age/12) + ' yrs ' + parseInt(pet.age%12) + ' mos | ' + pet.gender),
      element('p', {},
        [ element('a', {'data-action': 'showShelter','data-content': shelter.id }, shelter.name) ]),
      element('p', {}, shelter.address.city + ' ' + shelter.address.state)
    ])
  ]);
}

display(shelters);
