
const model = {
  profiles: [
    {name: "Alpha", image: "alpha.png", numClicks: 0},
    {name: "Bravo", image: "bravo.jpg", numClicks: 0},
    {name: "Charlie", image: "charlie.jpg", numClicks: 0},
    {name: "Delta", image: "delta.jpg", numClicks: 0},
    {name: "Echo", image: "echo.jpg", numClicks: 0}
  ]
};

const view = {
  selected_i: -1, // a clear declaration with a placeholder initialization
  navElement: document.getElementsByTagName('nav')[0],
  mainElement: document.getElementsByTagName('main')[0],
  imageElement: document.getElementsByClassName('image')[0],
  nameInTitle: document.getElementsByClassName('profile-name-title')[0],
  nameInLabel: document.getElementsByClassName('profile-name-text')[0],
  clickCountElement: document.getElementsByClassName('click-count')[0]
};
view.renderProfile = function(index) {
  const profile = controller.profile(index);
  // DELETE:
  view.mainElement.style.backgroundColor = 'lavender';
  view.mainElement.innerHTML = `<p>${profile.name}</p>
                                <p>${profile.image}</p>
                                <p>${profile.numClicks}</p>`;
  // UNCOMMENT:
  // view.nameInTitle.textContent = profile.name;
  // view.imageElement.style.backgroundImage = `url(${profile.image})`;
  // view.imageElement.className = `image ${index}`;
  // view.nameInLabel.textContent = profile.name;
  // view.clickCountElement.textContent = profile.numClicks;
};
view.navItemClickResponse = function(event) {
  const classList = event.target.classList;
  if (classList.contains('item')===false) {
    return;
  }
  view.navElement.getElementsByClassName('selected')[0]
      .classList.remove('selected');
  classList.add('selected');
  view.selected_i = parseInt( classList.item(1) );
  view.renderProfile(view.selected_i);
};
view.navItemFirstClickResponse = function(event) {
  const classList = event.target.classList;
  if (classList.contains('item')===false) {
    // If target is not a nav item, do nothing.
    return;
  }
  classList.add('selected');
  view.selected_i = parseInt( classList.item(1) );
  view.renderProfile(view.selected_i);
  view.mainElement.style.visibility = 'visible';
  view.navElement.removeEventListener('click', view.navItemFirstClickResponse);
  view.navElement.addEventListener('click', view.navItemClickResponse);
};
view.renderNavBar = function() {
  const numProfiles = controller.numProfiles();
  for(let i=0; i<numProfiles; i++) {
    const navItem = document.createElement('h2');
    navItem.textContent = controller.profile(i).name;
    navItem.className = `item ${i}`;
    view.navElement.appendChild(navItem);
    // DELETE:
    controller.profile(i).numClicks = 10;
  }
};
view.initNavBar = function() {
  view.renderNavBar();
  view.navElement.addEventListener( 'click', view.navItemFirstClickResponse );
};
view.initClickCounter = function() {
  view.imageElement.addEventListener( 'click', function () {
    i = parseInt( view.imageElement.classList.item(1) );
    controller.profile(i).numClicks++;
    view.clickCountElement.textContent = controller.profile(i).numClicks;
  });
};

const controller = {
  init: function() {
    view.initNavBar();
    // view.initClickCounter(); UNCOMMENT
  },
  numProfiles: function() {
    return model.profiles.length;
  },
  profile: function(index) {
    return model.profiles[index];
  }
};

controller.init();
