var theResults = document.getElementById('results');
var shelters = JSON.parse(data);

var count = 0;

for (var i = 0; i < shelters.length; i++) {
  for (j = 0; j < shelters[i].pets.length; j++) {
    theEntry = document.createElement('div');
    theEntry.textContent =
    shelters[i].name
    + ' has a '
    + shelters[i].type
    + ' named '
    + shelters[i].pets[j].name
    + ' that is '
    + shelters[i].pets[j].status
    + '.';
    theResults.appendChild(theEntry);
    count++;
  }
}

theEntry = document.createElement('div');
theEntry.textContent = count;
theResults.appendChild(theEntry);
