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
