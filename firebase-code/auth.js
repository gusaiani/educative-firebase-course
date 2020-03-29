// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBpbEBG41ca3HIASKRMHvw6J-CL0P1MMr4",
  authDomain: "chat-app-bd4e7.firebaseapp.com",
  databaseURL: "https://chat-app-bd4e7.firebaseio.com",
  projectId: "chat-app-bd4e7",
  storageBucket: "chat-app-bd4e7.appspot.com",
  messagingSenderId: "12402144255",
  appId: "1:12402144255:web:a47cf857e8d56250c8adca",
  measurementId: "G-WZ0W94NZXM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()

let uid

auth.onAuthStateChanged(user => {
  if (user) {
    console.log(user);
    uid = user.uid
    modal.style.display = 'none'

    hideWhenSignedIn.forEach(eachItem => {
      eachItem.classList.add('hide')
    })
    hideWhenSignedOut.forEach(eachItem => {
      eachItem.classList.remove('hide')
    })
  } else {
    console.log('not signed in');

    // Hides or shows elements depending on if user is signed out
    hideWhenSignedIn.forEach(eachItem => {
      eachItem.classList.remove('hide')
    });
    hideWhenSignedOut.forEach(eachItem => {
      eachItem.classList.add('hide')
    });
  }
})

const hideWhenSignedIn = document.querySelectorAll('.hide-when-signed-in')
const hideWhenSignedOut = document.querySelectorAll('.hide-when-signed-out')

const modal = document.getElementById('modal')

const close = document.getElementById('close')

close.addEventListener('click', () => {
  modal.style.display = 'none'
})

window.addEventListener('click', event => {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
})

showCreateUserForm = () => {
  hideAuthElements()
  modal.style.display = 'block'
  createUserForm.classList.remove('hide')
}

showSignInForm = () => {
  hideAuthElements()
  modal.style.display = 'block'
  signInForm.classList.remove('hide')
}

showForgotPasswordForm = () => {
  hideAuthElements()
  modal.style.display = 'block'
  forgotPasswordForm.classList.remove('hide')
}

const authAction = document.querySelectorAll('.auth')

authAction.forEach(eachItem => {
  eachItem.addEventListener('click', event => {
    let chosen = event.target.getAttribute('auth')
    if (chosen === 'show-create-user-form') {
      showCreateUserForm()
    } else if (chosen === 'show-sign-in-form') {
      showSignInForm()
    } else if (chosen === 'show-forgot-password-form') {
      showForgotPasswordForm()
    }
  })
})

const createUserForm = document.getElementById('create-user-form')
const signInForm = document.getElementById('sign-in-form')
const forgotPasswordForm = document.getElementById('forgot-password-form')

hideAuthElements = () => {
  createUserForm.classList.add('hide')
  signInForm.classList.add('hide')
  forgotPasswordForm.classList.add('hide')
}

createUserForm.addEventListener(`submit`, event => {
  event.preventDefault();
  // Grab values from form
  const displayName = document.getElementById(`create-user-display-name`).value;
  const email = document.getElementById(`create-user-email`).value;
  const password = document.getElementById(`create-user-password`).value;
  console.log({displayName, email, password})

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      auth.currentUser.updateProfile({
        displayName: displayName
      })
      createUserForm.reset()
      hideAuthElements()
    })
    .catch((error) => {
      console.error(error.message)
    })
});
