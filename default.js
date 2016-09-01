var imgHTML = '<img alt=\"140x140\" class=\"img-circle\" src=\"data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=\" data-holder-rendered=\"true\" style=\"width: 140px; height: 140px;\">'; // temporary gray image as a placeholder until images are addded to the data

var shelters = JSON.parse(data);
var filters = []; // a variable that will hold the current search query
var theQuery = document.getElementById('q-input');
var theSuggestions = document.getElementById('q-suggestions');
var theSearch = document.getElementById('search');
var initMap = true;
var theMap = {};
var resultsView = 'results';

theSearch.setAttribute('data-action', 'showBreed');
theQuery.addEventListener('input', displaySuggestions);

document.getElementById('logo').setAttribute('data-action', 'showHero');
document.body.addEventListener('click', handleClick);

function handleClick (clicked) {
  var action = '';
  var content = '';
  var target = clicked.target;

  if (target.hasAttribute('data-action')) {
    action = target.getAttribute('data-action');
  }

  if (target.hasAttribute('data-content')) {
    var content = target.getAttribute('data-content');
  }

  switch (action) {
    case 'setQuery':
      setQuery(content);
      break;
    case 'showBreed':
      for (i = 0; i < filters.length; i++) {
        if (filters[i].type === 'breed') {
          filters.splice(i, 1);
        }
      }
      if (content === '') { content = theQuery.value };
      if (content !== '') {
        filters.push({type: 'breed', value: content});
      }

      hideHero();
      display(resultsView, shelters);
      break;
    case 'showHero':
      showHero();
      break;
    case 'showShelter':
      hideHero();
      showShelter(content);
      resultsView = 'shelter-results';
      display(resultsView, shelters);
      break;
    case 'exitShelter':
      hideShelter();
      resultsView = 'results';
      display(resultsView, shelters);
      break;
  }
}

function view(show) {
  var theViews = document.getElementById('views');
  var theOld = theViews.getElementsByClassName('active')[0];

  if (theOld.id !== show) {
    theOld.classList.remove('active');
    theOld.classList.add('hidden');
  }

  document.getElementById(show).classList.remove('hidden');
  document.getElementById(show).classList.add('active');
}

function hideShelter () {
  filters = filters.filter(function (a) {
    return a.type !== 'shelter';
  })
  document.getElementById('back').remove();
  view('search-breed');
  document.getElementById('shelter-info').classList.add('hidden');
}

function showShelter(id) {
  //add a filter that will only show animals from the passed shelter id
  filters.push({type: 'shelter', value: id});

  // show the shelter div on the page and display the shelter-info header
  view('shelter');
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

    // only call showMap if we haven't done it once already
    if (initMap) {
      theMap = showMap('map', lat, long);
      initMap = false;
    }

    // place a marker on the map for this shelter and add a pop up to it
    var marker = L.marker([lat, long]).addTo(theMap);
    theMap.setView([lat, long]);
    theMap.setZoom(15);

    marker.bindPopup(
      '<h6>' + shelter.name + '<h6>' +
      shelter.address.number + ' ' + shelter.address.street + '<br>' +
      shelter.address.city + ', ' + shelter.address.state + ' ' + shelter.address.zip
    ).openPopup();
  }
}

// add a leafletjs map to a given element with id matching passed id
function showMap(id, lat, long) {
  var theMap = L.map(id).setView([lat, long], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'fblanton.19653a9c',
    accessToken: 'pk.eyJ1IjoiZmJsYW50b24iLCJhIjoiY2lzamNid2M1MDI3ODJ6b2Npd215Nm4xbSJ9.mgpAAP0NC5HRxKmfyP-eOQ'
  }).addTo(theMap);

  return theMap;
}

// Need to be able to show and hide our hero elements on demand
function hideHero() {
  var theHero = document.getElementById('hero');
  theHero.classList.add('hidden');
  var theHeader = document.getElementById('header');
  theHeader.classList.remove('heroed');
}

function showHero() {
  theHero = document.getElementById('hero');
  theHero.classList.remove('hidden');
  var theHeader = document.getElementById('header');
  theHeader.classList.add('heroed');
}

function setQuery(content) {
    theQuery.value = content;
    query = content;
    clear(theSuggestions);
}

function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displaySuggestions() {
  var value = theQuery.value.toLowerCase();
  matches = [];

  if (value !== '') {
    for (var item in animals) {
      for (var i = 0; i < animals[item].breeds.length; i++) {
        if (animals[item].breeds[i].toLowerCase().indexOf(value) !== -1) {
          matches.push(animals[item].breeds[i]);
        }
      }
    }
  }

  clear(theSuggestions);

  matches.sort(); // sort alphabtically
  matches.sort(function(a,b) { // and then by how soon our query appears
    return (a.toLowerCase().indexOf(value) - b.toLowerCase().indexOf(value));
  });

  for (var j = 0; j < matches.length && j < 10; j++) {
    if (!((matches.length === 1) && (matches[0].toLowerCase() === value))) {
      var theSuggestion = document.createElement('li');
      theSuggestion.classList.add('list-group-item');
      theSuggestion.setAttribute('data-action', 'setQuery');
      theSuggestion.setAttribute('data-content', matches[j]);
      theSuggestion.textContent = matches[j];
      theSuggestions.appendChild(theSuggestion);
    }
  }
}

function display (where, shelters) {
  var theResults = document.getElementById(where);

  clear(theResults);

  var count = 0;

  for (var i = 0; i < shelters.length; i++) {
    for (j = 0; j < shelters[i].pets.length; j++) {
      if (shouldDisplay(i, j)) {
        var theRow = createPanel(shelters[i], j);
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

function createPanel (shelter, pet) {
  var theRow = document.createElement('div');  // create a div for the resulting item
  theRow.classList.add('col-md-4', 'entry');
  var thePanel = document.createElement('div');
  thePanel.classList.add('panel','panel-default');

  var thePanelBody = document.createElement('div');
  thePanelBody.classList.add('panel-body');
  thePanel.appendChild(thePanelBody);

  var theImageRow = document.createElement('div');
  theImageRow.classList.add('row', 'center-contents');
  theImageRow.innerHTML = imgHTML;
  thePanelBody.appendChild(theImageRow);

  var thePetName = document.createElement('h5');
  thePetName.textContent = shelter.pets[pet].name;
  thePetName.classList.add('center-contents');
  thePanelBody.appendChild(thePetName);

  var theHR = document.createElement('hr');
  thePanelBody.appendChild(theHR);

  var theBreed = document.createElement('p');
  theBreed.textContent = shelter.pets[pet].breed;
  thePanelBody.appendChild(theBreed);

  var theAgeGenderSize = document.createElement('p');
  theAgeGenderSize.textContent =
  parseInt(shelter.pets[pet].age/12) + ' yrs '
  + parseInt(shelter.pets[pet].age%12) + ' mos | '
  + shelter.pets[pet].gender;
  // + ' | ' + shelters[i].pets[j].weight;
  thePanelBody.appendChild(theAgeGenderSize);

  var theRescueParagraph = document.createElement('p');
  var theRescueName = document.createElement('a');
  theRescueName.setAttribute('data-action', 'showShelter');
  theRescueName.setAttribute('data-content', shelter.id);
  theRescueName.textContent = shelter.name;
  theRescueParagraph.appendChild(theRescueName);
  thePanelBody.appendChild(theRescueParagraph);

  var theCityState = document.createElement('p');
  theCityState.textContent =
  shelter.address.city + ' '
  + shelter.address.state;

  thePanelBody.appendChild(theCityState);
  theRow.appendChild(thePanel);

  return theRow;
}

display('results', shelters);
