var shelters = JSON.parse(data);

var display = function (shelters) {
  var theResults = document.getElementById('results');

  var count = 0;

  for (var i = 0; i < shelters.length; i++) {
    for (j = 0; j < shelters[i].pets.length; j++) {
      var theRow = document.createElement('div');
      theRow.classList.add('row', 'entry');
      theRow.classList.add('voffset2');

      var theEntry = document.createElement('div'); // create a div to contain the animal image
      theEntry.classList.add('col-lg-3', 'center-contents');
      theEntry.innerHTML = '<img alt=\"140x140\" class=\"img-rounded\" src=\"data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=\" data-holder-rendered=\"true\" style=\"width: 140px; height: 140px;\">'; // temporary gray image as a placeholder until images are addded to the data
      theRow.appendChild(theEntry);

      theEntry = document.createElement('div'); // create a div to hold the animals info
      theEntry.classList.add('col-lg-9');

      var theName = document.createElement('h1');
      theName.textContent =  shelters[i].pets[j].name;
      theEntry.appendChild(theName);

      var theAge = document.createElement('em');
      theAge.textContent = shelters[i].pets[j].age + ' month old ';
      theEntry.appendChild(theAge);

      var theGender = document.createElement('em');
      theGender.textContent = shelters[i].pets[j].gender;
      theEntry.appendChild(theGender);

      var theDescription = document.createElement('div');
      theDescription.classList.add('voffset');
      theDescription.textContent = shelters[i].pets[j].description;
      theEntry.appendChild(theDescription);

      theRow.appendChild(theEntry);
      theResults.appendChild(theRow);
      count++;
    }
  }

  theEntry = document.createElement('div');
  theEntry.textContent = count;
  theResults.appendChild(theEntry);
}

display(shelters);
