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

var db = firebase.firestore();

// if (!localStorage.getItem('name')) {
  name = prompt('What is your name?');
  // localStorage.setItem('name', name)
// } else {
//   name = localStorage.getItem('name')
// }
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
  name = prompt('What is your name?');
  // localStorage.setItem('name', name)
  document.querySelector('#name').innerText = name
})

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault()

  db.collection('messages')
    .add({
      name: name,
      message: document.querySelector('#message-input').value
    })
    .then(function (docRef) {
      console.log('Document written with ID:' , docRef.id);
      document.querySelector('#message-form').reset
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

db.collection('messages')
  .onSnapshot(function(snapshot) {
    document.querySelector('#messages').innerText = ''
    snapshot.forEach(function(doc) {
      var message = document.createElement('div')
      message.innerHTML = `
      <p class='name'>${doc.data().name}</p>
      <p>${doc.data().message}</p>
      `
      document.querySelector('#messages').prepend(message)
    })
  })

document.querySelector('#clear').addEventListener('click', () => {
  db.collection('messages')
    .get()
    .then(function(snapshot) {
      snapshot.forEach(function(doc) {
        db.collection('messages').doc(doc.id).delete()
          .then(function() {
            console.log('Document successfully deleted.');
          })
          .catch(function(error) {
            console.error('Error removing document: ', error)
          })
      })
    })
    .catch(function(error) {
      console.error('Error getting documents: ', error);
    })
})

