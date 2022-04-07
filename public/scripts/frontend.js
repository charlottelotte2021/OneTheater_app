const header = document.querySelector('header.header')
const optionsMoreBtn = document.querySelector('.options-more-btn')
const playCards = document.querySelectorAll('.play-card')
const cardSummaries = document.querySelectorAll('.play-card-summary')
const cardBookmarks = document.querySelectorAll('.play-card-bookmark')


window.addEventListener('scroll', () => {
  const scrollThreshold = '64'
  if (
    window.scrollY > scrollThreshold &&
    !header.classList.contains('scroll-down')
  ) {
    header.classList.add('scroll-down')
  } else if (
    window.scrollY < scrollThreshold &&
    header.classList.contains('scroll-down')
  ) {
    header.classList.remove('scroll-down')
  }
})

if (optionsMoreBtn) {
  optionsMoreBtn.addEventListener('click', (e) => {
    e.preventDefault()
    optionsMoreBtn.parentElement.classList.toggle('active')
    optionsMoreBtn.firstElementChild.classList.toggle('flip')
  })
}

if (playCards) {
  cardSummaries.forEach((cardSummary) => {
    cardSummary.addEventListener('click', () => {
      //   cardSummarySeemore.parentElement.classList.toggle('active')
      cardSummary.classList.toggle('active')
    })
  })

  cardBookmarks.forEach((cardBookmark) => {
    cardBookmark.addEventListener('click', () => {
      if (cardBookmark.firstElementChild.classList.contains('far')) {
        cardBookmark.firstElementChild.classList.replace('far', 'fas')
        addToWishlist(cardBookmark.dataset.playInstanceId)
      } else {
        cardBookmark.firstElementChild.classList.replace('fas', 'far')
        removeFromWishlist(cardBookmark.dataset.playInstanceId)
      }
    })
  })
}

/*
  Review stars on the play pages 
 */

if (document.querySelector('.hero-play')) {
  const heroPlayStars = [...document.querySelector('.hero-play-stars').children]

  heroPlayStars.forEach((star, i) => {
    star.addEventListener('click', function (e) {
      if (this.classList.contains('far')) {
        this.classList.replace('far', 'fas')
        for (let j = 0; j < i + 1; j++) {
          if (heroPlayStars[j].classList.contains('far')) {
            heroPlayStars[j].classList.replace('far', 'fas')
          }
        }
      } else {
        for (let j = heroPlayStars.length - 1; j > i; j--) {
          if (heroPlayStars[j].classList.contains('fas')) {
            heroPlayStars[j].classList.replace('fas', 'far')
          }
        }
      }
    })
  })
}



/**
 * API to Wishlist
 */

// Add a play to the user's wishlist
const addToWishlist = (playInstanceId) => {
  fetch(`/users/wishlist/${playInstanceId}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      }
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

// Remove a play from the user's wishlist
const removeFromWishlist = (playInstanceId) => {
  fetch(`/users/wishlist/${playInstanceId}`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      }
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}



