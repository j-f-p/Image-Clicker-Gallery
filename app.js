
const model = {
  profiles: [
    {label: "Alpha", imageFile: "alpha.jpg", numClicks: 0,
     imageURL: ("https://www.thenational.ae/image/policy:1.776505:1538497810/" +
                "Na-03-OCT-Hyperloop-NEW.jpg?f=16x9&w=1200&$p$f$w=6c1d176") },
    {label: "Bravo", imageFile: "bravo.jpg", numClicks: 0,
     imageURL: ("https://grist.files.wordpress.com/2018/05/gettyimages-" +
                "176619985-e1535488791582.jpg?w=1024&h=576&crop=1") },
    {label: "Charlie", imageFile: "charlie.jpg", numClicks: 0,
     imageURL: "http://i.imgur.com/puDUy9I.jpg" },
    {label: "Delta", imageFile: "delta.jpg", numClicks: 0,
     imageURL: ("https://www.aopa.org/-/media/images/aopa-main/" +
                "news-and-media/2017/november/1120_terrafugia_tfx1/" +
                "1120_terrafugia_tfx1_16x9.jpg") },
    {label: "Echo", imageFile: "echo.jpg", numClicks: 0,
     imageURL: ("https://2gic212zgjlm2bcqpo21qnpk-wpengine.netdna-ssl.com/" +
                "wp-content/uploads/2018/09/" +
                "13670806_web1_180928-POI-M-hypersonic.jpg") }
  ]
};

const view = {
  selected_i: -1, // a clear declaration with a placeholder initialization
  navElement: document.getElementsByTagName('nav')[0],
  mainElement: document.getElementsByTagName('main')[0],
  labelInTitle: document.getElementsByClassName('profile-label-title')[0],
  imageElement: document.getElementsByClassName('image')[0],
  labelInLabel: document.getElementsByClassName('profile-label-text')[0],
  clickCountElement: document.getElementsByClassName('click-count')[0],
  imageCreditDiv: document.getElementsByClassName('image-url-div')[0],
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
};
view.renderNewImageLabels = function(newImageLabel) {
  view.navElement.children.item(view.selected_i).textContent = newImageLabel;
  view.labelInTitle.textContent = newImageLabel;
  view.labelInLabel.textContent = newImageLabel;
};
view.renderNewProfileImage = function(profile) {
  view.imageElement.style.backgroundImage = `url(${profile.imageFile})`;
  view.clickCountElement.textContent = profile.numClicks;
  view.imageCreditDiv.firstChild.textContent = 'Source: ' + profile.imageURL;
};
view.renderProfile = function() {
  const profile = controller.profile(view.selected_i);
  view.labelInTitle.textContent = profile.label;
  view.imageElement.style.backgroundImage = `url(${profile.imageFile})`;
  view.imageElement.className = `image ${view.selected_i}`;
  view.labelInLabel.textContent = profile.label;
  view.clickCountElement.textContent = profile.numClicks;
  view.imageCreditDiv.firstChild.textContent = 'Source: ' + profile.imageURL;
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
view.initRenderNavBar = function() {
  const numProfiles = controller.numProfiles();
  for(let i=0; i<numProfiles; i++) {
    const navItem = document.createElement('h2');
    navItem.textContent = controller.profile(i).label;
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
    <h3>Entered URL matched existing value, thus,
        prior image click count retained.</h3>
  `;
  return alertElement;
};
view.initSaveEditButton = function() {
  view.alertMessageFrame = view.initAlertElement();

  view.saveEditButton.addEventListener( 'click', function(event) {
    if( view.newImageLabelElement.checkValidity() &&
        view.newImageURLelement.checkValidity() ) {

      event.preventDefault();
      const profile = controller.profile(view.selected_i);

      if(view.newImageLabelElement.value!=profile.label &&
         view.newImageLabelElement.value!='') {
        profile.label = view.newImageLabelElement.value;
        view.renderNewImageLabels(profile.label);
      } // Otherwise, keep label.

      if(view.newImageURLelement.value!=profile.imageFile) {
        // Proceed only if image url is unique.
        profile.imageFile = view.newImageURLelement.value;
        profile.numClicks = 0;
        view.closeImageEditFrame();
        profile.imageURL = profile.imageFile;
        view.renderNewProfileImage(profile);
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
