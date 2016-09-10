// temporary gray image as a placeholder until images are addded to the data
var imagePlaceholder = 'data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=';

//begin gloabl variables
var shelters = JSON.parse(data),
    filters = {pet: {breed: ''}},
    theMap = createMap('map', shelters[0]),
    adoption = {requests: []},
    favorites = [];

if (document.location.host) {
  var imgHost = 'https://file.ac/T9IQIs9EMaE/';
} else {
  var imgHost = '';
}


$('#breed').on('input', suggest);
//$('#breed').on('blur', autoComplete);
$('body').on('click', handleClick);
$('body').on('submit', handleSubmit);
$('body').keydown(handleKey);

function handleSubmit(submitted) {
  var theForm = submitted.target;
  submitted.preventDefault();

  if (!theForm.checkValidity()) {
    alert('Please confirm all the fields have been properly filled in.');
    return;
  }

  switch (theForm.id) {
    case 'apply':
      adoption.requests.push(intake(theForm));
      success(theForm, 'Thank you! We will review your request and get back to you shortly via email.');
      save('adoption', JSON.stringify(adoption));
      break;
    case 'breed-filter':
      search(theForm);
      break;
  }
}

function handleKey(key) {
  var target = key.target;
  // emulate a click on the cancel button if esc is pressed in a form with an id
  switch (key.keyCode) {
    case 27: // esc key
      if (target.hasAttributes('form')) {
        if (target.form) {
          if (target.form.hasAttributes('id')) {
            $('#' + target.form.id + ' .cancel').click();
          }
        }
      }
      if (target.id === 'breed') {
        clear($('#breed-suggestions')[0]);
        target.value = '';
      }
      break;
    case 38: // up arrow
      var theNext = move(target, 'up');
      if (theNext) {
        $('#filter-breed').attr('data-content', theNext.textContent);
      }
      break;
    case 9: // tab key
      var theNext = tab(target, key);
      if (theNext) {
        $('#filter-breed').attr('data-content', theNext.textContent);
      }
      break;
    case 40: // down arrow
      var theNext = move(target, 'down');
      if (theNext) {
        $('#filter-breed').attr('data-content', theNext.textContent);
      }
      break;
    default:
      //alert (key.keyCode);
  }
}

function tab(theList, key) {
  var theNext = key.shiftKey ? move(theList, 'up')
                             : move(theList, 'down');

  if (theNext) { key.preventDefault(); }

  return theNext;
}

function move(target, direction) {
  var theSibling = target.nextElementSibling;

  if (theSibling && theSibling.nodeName && theSibling.nodeName === 'UL') {
    if (target.nextElementSibling.hasChildNodes()) {
      var theNext = next(target.nextElementSibling, direction);
      theNext.classList.add('highlight');
      return theNext;
    }
  }

  return false;
}

function next(list, direction) {
  var active = list.getElementsByClassName('highlight')[0],
      theChildren = list.childNodes;

  if (!active) {
    return direction === 'down' ? list.firstElementChild
                                : list.lastElementChild;
  } else {
    active.classList.remove('highlight');

    if (direction === 'down') {
      return active.nextElementSibling ? active.nextElementSibling
                                       : list.firstElementChild;
    } else {
      return active.previousElementSibling ? active.previousElementSibling
                                           : list.lastElementChild;
    }
  }
}

function handleClick(clicked) {
  var action = '',
      content = '',
      target = clicked.target;

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
      swap('heros');
      swap('views', 'results');
      filters = _.extend(filters, {pet: {breed: content}});
      display(shelters);
      break;
    case 'filter-breed':
      break;
    case 'favorite':
      favorite(target, true, favorites);
      break;
    case 'unfavorite':
      favorite(target, false, favorites);
      break;
    case 'all-favorites':
      swap('heros');
      swap('views', 'favorites');
      display(shelters, 'favorites', {favorites: favorites});
      break;
    case 'show-hero':
      swap('heros', 'hero');
      swap('views', 'home');
      break;
    case 'show-shelter':
      modal(content, 'shelter');
      break;
    case 'show-animal':
      modal(content, 'pet');
      break;
    case 'hide-modal':
      $('#modal-close').attr('class', 'hidden');
      $('body').removeClass('noscroll');
      break;
    case 'adopt':
      swap('modals', 'adopt', true)
      break
  }
}

function search(theForm) {
  var theInput = theForm.querySelector('#breed');

  if (theInput.value !== '') {
    var theSibling = $(theInput).next()[0];
    if (theSibling.nodeName === 'UL') {
      var active = $(theSibling).children('.highlight')[0];
      if (active) {
        complete('breed', active.textContent);
      }
    }

    filters = _.extend(filters, {pet: {breed: theInput.value}});

    swap('heros');
    swap('views', 'results');
    display(shelters);
  }
}

function save(key, value) {
  localStorage.setItem(key, value);
}

function load(key) {
  _.extend(eval(key), JSON.parse(localStorage.getItem(key)));
  return localStorage.getItem(key);
}

function success(theForm, message) {
  var theParent = theForm.parentNode;

  $(theParent).empty();

  $(theParent).attr('style', 'background-color: rgba(0,255,0,.1);');
  $(theParent).append(
    element('h2', {class: 'success centered', style: 'color: darkgreen;'}, message)
  );
}

function intake(theForm) {
  var inputs = $('#' + theForm.id + ' .extract').toArray();

  var form = _.object(
    _.pluck(inputs, 'name'),
    _.pluck(inputs, 'value').map(function(value) { return _.escape(value)})
  );

  return form;
}

function blur(e) {
  e.target.blur();
  e.target.removeEventListener('mouseout', blur)
}

function favorite(target, fave, _favorites) {
  var id = target.getAttribute('data-content'),
      theSpans = $('.favorite[data-content="' + id + '"]');

  if (fave) {
    _favorites.push(id);
    theSpans.each(function(span) {
      $(this).attr({class: 'favorite glyphicon glyphicon-heart favorited', 'data-action': 'unfavorite'});
    });
    target.addEventListener('mouseout', blur);
  } else {
    favorites = _.without(_favorites, id);
    theSpans.each(function(span) {
      $(this).attr({class: 'favorite glyphicon glyphicon-heart', 'data-action': 'favorite'});
    });
    target.addEventListener('mouseout', blur);
  }

  save('favorites', JSON.stringify(favorites));
}

function swap(area, view) {
  var theArea = document.getElementById(area),
      theActive = theArea.getElementsByClassName('active')[0];

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

function createMap(id, shelter) {
  var lat = shelter.latitude,
      long = shelter.longitude;

  if (!(lat && long)) {
    lat = 33.6496328;
    long = -117.74345;
  }

  var theMap = L.map(id).setView([lat, long], 15);

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

function autoComplete(element) {
  theInput = element.target;

  if (theInput && theInput.value !== '') {
    var theSibling = $(theInput).next()[0];
    if (theSibling.nodeName === 'UL') {
      var active = $(theSibling).children('.highlight')[0];
      if (active) {
        complete('breed', active.textContent);
      }
    }
  }
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

function empty(theForm) {
  var inputs = $('#' + theForm.id + ' .extract');

  inputs.each(function(index, element) {
    if (element.type !== 'hidden') {
      element.value = '';
    }
  });
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

function suggest(e) {
  var target = e.target;
  var term = target.value;
  var matched = [];
  var theList = target.nextElementSibling;

  if (theList.nodeName && theList.nodeName === 'UL') {
    clear(theList);

    if (term !== '') {
      matched = returnBreeds(animals, term).sort();
    }

    if (!((matched.length === 1) && (matched[0].toLowerCase() === term.toLowerCase()))) {
      append(theList, makeList(matched, 10));
    }

    var theNext = move(e.target, 'down');
  }
  return term;
}

function display(shelters, where, _filters) {
  if (!where) { where = 'results'; }
  if (!_filters) { _filters = filters; }

  var theResults = document.getElementById(where);
  var pets = filter(shelters, _filters);

  clear(theResults);
  theResults.appendChild(
    element('div', {id: 'number-displayed', class: 'centered'}, 'Displaying ' + _.size(pets) + (_.size(pets) === 1 ? ' pet' : ' pets'))
  );
  append(theResults, _.map(pets,
    function(pet) {
      return (cardTemplate(getShelter({petID: pet.id}), pet));
    })
  );
}

function filter(array, filters) {
  var filteredShelters,
      filteredPets;

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

  if (filters.favorites) {
    filteredPets = _.chain(favorites)
                    .map(function (id) { return _.where(this, {id: id}) }, filteredPets)
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

  $('body').addClass('noscroll');
  $('#modal-close').removeClass('hidden');
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

function pets(shelterID) {
  var shelter = getShelter({shelterID: shelterID});
  return _.map(shelter.pets, function(pet) {
     return cardTemplate(this, pet);
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

function cardTemplate(shelter, pet) {
  return element('div', {class: 'col-sm-4'},
  [ element('div',
    { class: 'entry',
    'data-action': 'show-animal',
    'data-content': JSON.stringify({shelterID: shelter.id, petID: pet.id}) },
    [ heartTemplate(pet, favorites),
      element('div', {style: 'background-image: url(\'' + (imgHost + 'imgs/' + pet.type.toLowerCase() + 's/' + pet.image + '\')'), class: 'image'}),
      element('h3', {class: 'centered'}, pet.name),
      element('hr'),
      element('p', {}, pet.breed),
      element('p', {}, parseInt(pet.age/12) + ' yrs ' + parseInt(pet.age%12) + ' mos | ' + pet.gender),
      element('p', {},
        [ element('a', {'data-action': 'show-shelter','data-content': shelter.id }, shelter.name) ]),
      element('p', {}, shelter.address.city + ' ' + shelter.address.state)
    ])
  ]);
}

function heartTemplate(pet, favorites) {
  if (_.contains(favorites, pet.id)) {
    return element('span', {class: 'favorite glyphicon glyphicon-heart favorited', tabindex: 0, 'aria-hidden': true, 'data-action': 'unfavorite', 'data-content': pet.id});
  } else {
    return element('span', {class: 'favorite glyphicon glyphicon-heart', tabindex: 0, 'aria-hidden': true, 'data-action': 'favorite', 'data-content': pet.id});
  }
}

function adoptionTemplate(pet) {
  return element('div', {class: 'row'}, [
    element('div', {class: 'col-xs-11'}, [
      element('div', {class: 'collapse', id: 'adoption-form'}, [
        element('p', {class: ''}, 'Apply to Adopt'),
        element('div', {class: 'well'}, [
          element('form', {class: 'form-horizontal', id: 'apply'}, [
            element('input', {type: 'hidden', class: 'extract', name: 'pet', value:pet.id}),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-name', class: 'col-sm-2 control-label'}, 'Name'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'text', name: 'name', class: 'form-control extract', id: 'input-name', placeholder: 'Name', required: 'true'})
              ])
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-email', class: 'col-sm-2 control-label'}, 'Email'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'email', name: 'email', class: 'form-control extract', id: 'input-email', placeholder: 'Email', required: 'true'})
              ]),
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-phone', class: 'col-sm-2 control-label'}, 'Phone'),
              element('div', {class: 'col-sm-10'}, [
                element('input', {type: 'tel', name: 'telephone', class: 'form-control extract', id: 'input-phone', placeholder: '(555) 555-5555', required: 'true', pattern: '((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3}-\\d{4}'})
              ]),
            ]),
            element('div', {class: 'form-group'}, [
              element('label', {for: 'input-why', class: 'sr-only'}, 'Please describe why you would like to adopt ' + pet.name + '.'),
              element('div', {class: 'col-sm-12'}, [
                element('textarea', {name: 'why', class: 'form-control extract', id: 'input-why', placeholder: 'Please describe why you would like to adopt ' + pet.name + '.', required: 'true', rows: 3})
              ]),
            ]),
            element('div', {class: 'row'}, [
              element('div', {class: 'btn-group col-xs-12', role: 'group'}, [
                element('input', {class: 'btn btn-danger col-xs-6 cancel', 'data-toggle': 'collapse', 'data-target': '#adoption-form', type: 'button', value: 'Cancel'}),
                element('input', {class: 'btn btn-primary col-xs-6', type: 'submit', value: 'Submit'})
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
      heartTemplate(pet, favorites),
      element('div', {style: 'background-image: url(\'' + (imgHost + 'imgs/' + pet.type.toLowerCase() + 's/' + pet.image + '\')'), class: 'image'}),
      element('h3', {class: 'centered'}, pet.name),
      element('p', {}, pet.breed + ' | ' + pet.gender),
      element('p', {}, 'Adoption Fee: $' + pet.fee),
      element('p', {}, status(pet))
    ]),
    element('div', {class: 'col-sm-8'}, [
      element('h3', {class: 'centered'}, 'Description'),
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
    element('div', {class: 'col-sm-4'}, [
      element('h3', {class: 'centered', 'data-action': 'show-shelter','data-content': shelter.id }, shelter.name),
      element('pre', {class: 'centered', 'data-action': 'show-shelter','data-content': shelter.id }, shelter.address.number
        + ' '  + shelter.address.street
        + '\n' + shelter.address.city
        + ', ' + shelter.address.state
        + ' '  + shelter.address.zip
        + '\n' + shelter.phone)
    ]),
    element('div', {class: 'col-sm-8'}, [
      element('h3', {class: 'centered'}, 'Description'),
      element('p', {}, shelter.description)
    ]),
    element('div', {class: 'col-xs-12'}, [
      element('hr'),
      element('h3', {}, 'All Pets'),
      element('div', {id: 'pets'}, pets(shelter.id))
    ])
  ]);
}

display(shelters);
theMap.locate();
load('adoption');
load('favorites');
