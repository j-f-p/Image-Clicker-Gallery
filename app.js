
const model = {
  profiles: [
    {name: "Alpha", image: "alpha.jpg", numClicks: 0},
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
  nameInTitle: document.getElementsByClassName('profile-name-title')[0],
  imageElement: document.getElementsByClassName('image')[0],
  nameInLabel: document.getElementsByClassName('profile-name-text')[0],
  clickCountElement: document.getElementsByClassName('click-count')[0],
  editImageButton: document.getElementsByClassName('edit-image-button')[0],
  alertMessageFrame: null, // placed here for convenience of developer reference
  imageEditFrame: document.getElementsByClassName('image-edit-frame')[0],
  formElement: document.getElementsByTagName('form')[0],
  newImageLabelElement: document.getElementById('newImageLabel'),
  newImageURLelement: document.getElementById('newImageURL'),
  saveEditButton: document.getElementsByClassName('save-button')[0],
  cancelEditButton: document.getElementsByClassName('cancel-button')[0]
};
view.closeImageEditFrame = function() {
  view.imageEditFrame.style.visibility = 'hidden';
  view.formElement.reset();
}
view.renderProfile = function() {
  const profile = controller.profile(view.selected_i);
  view.nameInTitle.textContent = profile.name;
  view.imageElement.style.backgroundImage = `url(${profile.image})`;
  view.imageElement.className = `image ${view.selected_i}`;
  view.nameInLabel.textContent = profile.name;
  view.clickCountElement.textContent = profile.numClicks;
  if( view.imageEditFrame.style.visibility==='visible' ) {
    view.closeImageEditFrame();
  }
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
  view.renderProfile();
};
view.navItemFirstClickResponse = function(event) {
  const classList = event.target.classList;
  if (classList.contains('item')===false) {
    // If target is not a nav item, do nothing.
    return;
  }
  classList.add('selected');
  view.selected_i = parseInt( classList.item(1) );
  view.renderProfile();
  view.mainElement.style.visibility = 'visible';
  view.navElement.removeEventListener('click', view.navItemFirstClickResponse);
  view.navElement.addEventListener('click', view.navItemClickResponse);
};
view.reRenderSelectedNavItemText = function(newImageLabel) {
  view.navElement.children.item(view.selected_i).textContent = newImageLabel;
};
view.initRenderNavBar = function() {
  const numProfiles = controller.numProfiles();
  for(let i=0; i<numProfiles; i++) {
    const navItem = document.createElement('h2');
    navItem.textContent = controller.profile(i).name;
    navItem.className = `item ${i}`;
    view.navElement.appendChild(navItem);
  }
};
view.initNavBar = function() {
  view.initRenderNavBar();
  view.navElement.addEventListener( 'click', view.navItemFirstClickResponse );
};
view.initClickCounter = function() {
  view.imageElement.addEventListener( 'click', function () {
    i = parseInt( view.imageElement.classList.item(1) );
    controller.profile(i).numClicks++;
    view.clickCountElement.textContent = controller.profile(i).numClicks;
  });
};
view.initEditImageButton = function() {
  view.editImageButton.addEventListener( 'click', function() {
    view.imageEditFrame.style.visibility = 'visible';
  });
};
view.initAlertElement = function() {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert-message-frame');
  alertElement.innerHTML = `
    <h3>Inputs matched existing values, thus,
        prior image properties retained.</h3>
  `;
  return alertElement;
}
view.initSaveEditButton = function() {
  view.alertMessageFrame = view.initAlertElement();

  view.saveEditButton.addEventListener( 'click', function(event) {
    if( view.newImageLabelElement.checkValidity() &&
        view.newImageURLelement.checkValidity() ) {

      event.preventDefault();
      const profile = controller.profile(view.selected_i);

      if( view.newImageLabelElement.value!=profile.name ||
          view.newImageURLelement.value!=profile.image ) {
        // Proceed only if pair of profile values is unique.
        profile.name = view.newImageLabelElement.value;
        profile.image = view.newImageURLelement.value;
        profile.numClicks = 0;
        view.closeImageEditFrame();
        view.reRenderSelectedNavItemText(profile.name);
        view.renderProfile();
      } else {
        // Close form.
        view.closeImageEditFrame();

        // Render alert message.
        view.editImageButton
            .insertAdjacentElement('afterend',view.alertMessageFrame);

        // Remove alert message after 3 sec.
        setTimeout( function() {
          view.mainElement.removeChild(view.alertMessageFrame);
        }, 3000 );
      }
    }
  });
};
view.initCancelEditButton = function() {
  view.cancelEditButton.addEventListener( 'click', function(event) {
    event.preventDefault();
    view.closeImageEditFrame();
  });
};

const controller = {
  init: function() {
    view.initNavBar();
    controller.initClickListeners();
  },
  initClickListeners: function() {
    view.initClickCounter();
    view.initEditImageButton();
    view.initSaveEditButton();
    view.initCancelEditButton();
  },
  numProfiles: function() {
    return model.profiles.length;
  },
  profile: function(index) {
    return model.profiles[index];
  }
};

controller.init();
