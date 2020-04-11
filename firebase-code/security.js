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

var database = firebase.firestore();
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

    // Greet the user with a message and make it personal by using their name
    if (user.displayName) {
      document.getElementById('display-name-header').textContent =
        `Hello, ${user.displayName}`
    }

    database.collection('to-do-lists').doc(uid).collection('my-list')
      .onSnapshot(snapshot => {
        // generate to-do item and delete button for each entry in your collection
        document.getElementById('to-do-list-items').innerHTML = '';

        snapshot.forEach(element => {

          let p = document.createElement('p')

          p.textContent = element.data().item

          let deleteButton = document.createElement('button');
          deleteButton.textContent = 'x';
          deleteButton.classList.add('delete-button');
          deleteButton.setAttribute('data', element.id);
          p.appendChild(deleteButton);

          document.getElementById('to-do-list-items').appendChild(p)
        })
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
    } else if (chosen === 'sign-out') {
      signOut()
    }
  })
})

const createUserForm = document.getElementById('create-user-form')
const signInForm = document.getElementById('sign-in-form')
const forgotPasswordForm = document.getElementById('forgot-password-form')

hideAuthElements = () => {
  clearMessage()
  loading('hide')
  createUserForm.classList.add('hide')
  signInForm.classList.add('hide')
  forgotPasswordForm.classList.add('hide')
  // createUserDialog.classList.add('hide')
  // signInDialog.classList.add('hide')
  // haveOrNeedAccountDialog.classList.add('hide')
}

createUserForm.addEventListener(`submit`, event => {
  event.preventDefault();
  loading('show')
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
      displayMessage('error', error.message)
    })
    .then(() => {
      loading('hide')
    })
});

signOut = () => {
  auth.signOut()
  hideAuthElements()
}

signInForm.addEventListener('submit', event => {
  event.preventDefault()
  loading('show')

  const email = document.getElementById('sign-in-email').value
  const password = document.getElementById('sign-in-password').value

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      signInForm.reset()
      hideAuthElements()
    })
    .catch((error) => {
      displayMessage('error', error.message)
    })
    .then(() => {
      loading('hide')
    })
})

forgotPasswordForm.addEventListener('submit', event => {
  event.preventDefault();
  loading('show')

  var emailAddress = document.getElementById('forgot-password-email').value;

  firebase.auth().sendPasswordResetEmail(emailAddress)
    .then(() => {
      forgotPasswordForm.reset()
      displayMessage('success', 'Message sent. Please check your email')
    })
    .catch(error => {
      displayMessage('error', error.message)
    })
    .then(() => {
      loading('hide')
    })
})

const authMessage = document.getElementById('message');

let messageTimeout

displayMessage = (type, message) => {
  if (type === 'error') {
    authMessage.style.borderColor = 'red'
    authMessage.style.color = 'red'
    authMessage.style.display = 'block'
  } else if (type === 'success') {
    authMessage.style.borderColor = 'green'
    authMessage.style.color = 'green'
    authMessage.style.display = 'block'
  }

  authMessage.innerHTML = message
  messageTimeout = setTimeout(() => {
    authMessage.innerHTML = ''
    authMessage.style.display = 'none'
  }, 7000)
}

clearMessage = () => {
  clearTimeout(messageTimeout)
  authMessage.innerHTML = ''
  authMessage.style.display = 'none'
}

loading = action => {
  if (action === 'show') {
    document.getElementById('loading-outer-container').style.display = 'block'
  } else if (action === 'hide') {
    document.getElementById('loading-outer-container').style.display = 'none'
  } else {
    console.log('loading error');
  }
}


const toDoListForm = document.getElementById('to-do-list-form')

toDoListForm.addEventListener('submit', event => {
  event.preventDefault()

  database.collection('to-do-lists').doc(uid).collection('my-list').add({
    item: document.getElementById('item').value
  })

  toDoListForm.reset()
})

document.body.addEventListener('click', event => {
  if (event.target.matches('.delete-button')) {
    key = event.target.getAttribute('data');
    database.collection('to-do-lists').doc(uid).collection('my-list').doc(key).delete()
  }
})
