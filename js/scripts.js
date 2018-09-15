const body = document.querySelector('body');
const gallery = document.querySelector('#gallery');
const searchDiv = document.querySelector('.search-container');

// Creates 12 cards, one per person
for (let i = 0; i < 12; i++) {
  gallery.innerHTML += `<div class="card">
                          <div class="card-img-container">
                            <img class="card-img" src="https://placehold.it/90x90" alt="profile picture">
                          </div>
                          <div class="card-info-container">
                            <h3 id="name" class="card-name cap"></h3>
                            <p class="card-text"></p>
                            <p class="card-text cap"></p>
                          </div>
                        </div>`;
}

// Creates search bar
searchDiv.innerHTML = `<form action="#" method="get">
                         <input type="search" id="search-input" class="search-input" placeholder="Search...">
                         <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                       </form>`;

let cards = gallery.querySelectorAll('.card');
let searchInput = searchDiv.querySelector('#search-input');
let form = searchInput.parentNode;

// Puts each person on their respective card
// and adds functionality to the card
function createCard(people) {

  // Puts each person's information on their respective card
  for (let i = 0; i < cards.length; i++) {
    cards[i].querySelector('img').src = people[i].picture.large;
    cards[i].querySelector('h3').textContent = `${people[i].name.first} ${people[i].name.last}`;
    cards[i].querySelectorAll('p')[0].textContent = people[i].email;
    cards[i].querySelectorAll('p')[1].textContent = `${people[i].location.city}, ${people[i].location.state}`;
  }

  // Changes which cards are visible based on the search results
  checkSearch();

  // Adds functionality to the search button and each card
  cardClick();
  searchSubmit();
}

// Creates a modal window when a card is clicked
function cardClick() {
  cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => createModal(people[i]));
  }
}

// Creates a modal window
function createModal(person) {
  const location = `${person.location.street}, ${person.location.city}, ${person.location.state} ${person.location.postcode}`;

  // Rearranges the date of birth into month/day/year
  // format, and changes the dashes into slashes
  const dob = person.dob.date.slice(0 , person.dob.date.indexOf('T')).split("-");
  const birthday = `Birthday: ${[dob[1], dob[2], dob[0]].join("/")}`;

  // Creates the modal window with the person's information
  body.innerHTML += `<div class="modal-container">
                       <div class="modal">
                         <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                         <div class="modal-info-container">
                           <img class="modal-img" src=${person.picture.large} alt="profile picture">
                           <h3 id="name" class="modal-name cap">${person.name.first}</h3>
                           <p class="modal-text">${person.email}</p>
                           <p class="modal-text cap">${person.location.city}</p>
                           <hr>
                           <p class="modal-text">${person.phone}</p>
                           <p class="modal-text">${location}</p>
                           <p class="modal-text">${birthday}</p>
                         </div>
                       </div>
                       <div class="modal-btn-container">
                         <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                         <button type="button" id="modal-next" class="modal-next btn">Next</button>
                       </div>
                     </div>`;

  const closeButton = body.querySelector('#modal-close-btn');
  const prevButton = body.querySelector('#modal-prev');
  const nextButton = body.querySelector('#modal-next');

  // Removes the modal window if the "X" is clicked
  closeButton.addEventListener('click', removeModal);

  // Creates a modal window of the previous person based
  // on a list of people in the search results
  prevButton.addEventListener('click', () => {
    removeModal();
    if (searchPeople.indexOf(person) != 0) {
      createModal(searchPeople[searchPeople.indexOf(person) - 1]);
    } else {
      createModal(searchPeople[searchPeople.length - 1]);
    }
  })

  // Creates a modal window of the next person based
  // on a list of people in the search results
  nextButton.addEventListener('click', () => {
    removeModal();
    if (searchPeople.indexOf(person) != (searchPeople.length - 1)) {
      createModal(searchPeople[searchPeople.indexOf(person) + 1]);
    } else {
      createModal(searchPeople[0]);
    }
  })

  // Adds functionality to the cards and submit button again
  cardClick();
  searchSubmit();
}

// Removes the current modal window
function removeModal() {
  const modal = body.querySelector('.modal-container');
  body.removeChild(modal);
}

let searchPeople = [];

// Only shows the people who have names that contain the search value,
// and creates a list of people who have been searched
function checkSearch() {
  searchPeople = [];
  for (let i = 0; i < cards.length; i++) {
    if (`${people[i].name.first} ${people[i].name.last}`.includes(searchInput.value)) {
      cards[i].style.display = '';
      searchPeople.push(people[i]);
    } else {
      cards[i].style.display = 'none';
    }
  }
}

// Does what checkSearch() does when the search button is clicked
function searchSubmit() {
  searchInput = document.querySelector('#search-input');
  form = searchInput.parentNode;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkSearch();
  });
}

let people;

// Gets 12 random users from randomuser.me who has
// names that can be typed on a regular keyboard
fetch('https://randomuser.me/api/?results=12&nat=au,es,fi,gb,ie,nz,us')

  // Finds the people in the response and
  // creates the cards with those people
  .then(response => response.json())
  .then(data => data.results)
  .then(group => {
    console.log(group);
    people = group;
    createCard(people);
  })
  .catch(error => body.innerHTML += `Looks like there was a problem. ${error}`);
