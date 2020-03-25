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

const uploadButton = document.querySelector('#upload-button')

const progressBar = document.querySelector('progress')

let imageFile

uploadButton.addEventListener('change', (event) => {
  let file = event.target.files[0]

  let name = event.target.files[0].name

  let storageRef = firebase.storage().ref(name)

  storageRef.put(file).on("state_changed",
    snapshot => {
      let percentage = Number(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)
      progressBar.value = percentage
    },
    error => {
      console.error(error.message)
    },
    () => {
      storageRef.put(file).snapshot.ref.getDownloadURL()
        .then((url) => {
          console.log(url)

          setTimeout(() => {
            progressBar.removeAttribute('value')
          }, 1000)

          firebase.firestore().collection('images').add({
            url: url
          })
            .then(success => console.log(success))
            .catch(error => console.error(error))
        })
    })
})

firebase.firestore().collection('images').onSnapshot(snapshot => {
  document.querySelector('#images').innerHTML = ""

  snapshot.forEach(each => {
    console.log(each.data().url);
    let div = document.createElement('div')
    let image = document.createElement('img')
    image.setAttribute('src', each.data().url)
    div.append(image)
    document.querySelector('#images').append(div)
  })
})

document.querySelector('#clear').addEventListener('click', () => {
  firebase.firestore().collection('images')
    .get()
    .then(function(snapshot) {
      snapshot.forEach(function(doc) {
        firebase.firestore().collection('images').doc(doc.id).delete()
          .then(function() {
            console.log('Document deleted.');
          })
          .catch(function(error) {
            console.error('Error removing document: ', error)
          })
      })
    })
    .catch(function(error) {
      console.error('Error getting documents: ', error)
    })
})
