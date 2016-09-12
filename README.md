# rescue.me

#### Live Demo: https://fblanton.github.io/rescue.me/

###Summary

rescue.me is a prototype front-end web app that allows a user to search a predefined set of shelters and their animals.

The majority of DOM elements interacted with are created on demand using the javascript engine. The data included in data.js is a set of 100 shelters with a total of over 3000 cats and dogs.

A user can search by breed which will return a set of animal cards that are created on demand. Each animal can be favorited, or clicked on to get more detail. When viewing more detail, it is possible to "apply" to adopt the animal using an inline form.

Clicking on a particular shelter brings up an info page which display all of its pets and a leafletjs map of its location.

Any favorites or adoption requests are stored in local storage so the demo site will maintain a history of favorites and aoption requests for each indivual visitor on their machine.

### Key Acheivements
* Underscore.js used to quickly filter through the data to display the requested breeds and strealine general array access.
* Leaflet.js used for map display.
* Custom autocomplete input box for breed search.
* Extensive DOM manipulation based on user interaction.
* Bootstrap 3 and Bootstrapjs used for responsive design.
* Local storage read and write used to provide memory to the demo web app.
* jquery used to qucikly access DOM elements including the ability for a favoriting action in the modal dialog to also immediately update the favorite status in the main view.
---

![useexample](https://cloud.githubusercontent.com/assets/3937557/18452418/98a4f270-78ef-11e6-91c0-c1fe2cfd6313.png)

---
![jquery](https://cloud.githubusercontent.com/assets/3937557/18450949/e77484ac-78e9-11e6-824e-ab9fc91c87ed.png)

![bootstrap](https://cloud.githubusercontent.com/assets/3937557/18451008/2dd795e2-78ea-11e6-8103-08c7f2e73787.png)

![underscorejs](https://cloud.githubusercontent.com/assets/3937557/18451057/5a43a12a-78ea-11e6-91a4-9e6614850cb0.png)

![leafletjs](https://cloud.githubusercontent.com/assets/3937557/18451976/073eb150-78ee-11e6-8305-9a6315dd8bdd.png)
---

