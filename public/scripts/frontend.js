const header = document.querySelector('header.header')
const optionsMoreBtn = document.querySelector('.options-more-btn')
const playCards = document.querySelectorAll('.play-card')
const cardSummaries = document.querySelectorAll('.play-card-summary')
const cardBookmarks = document.querySelectorAll('.play-card-bookmark')
const softModalSubmit = document.querySelector('.soft-modal--content input[type="button"]')
const cardsList = document.querySelector('.cards-container')


console.log(cardsList)

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
      updateWishlist(cardBookmark)
    })
  })
}

const updateWishlist = (element) => {
  if (element.firstElementChild.classList.contains('far')) {
    element.firstElementChild.classList.replace('far', 'fas')
    addToWishlist(element.dataset.playInstanceId)
  } else {
    element.firstElementChild.classList.replace('fas', 'far')
    removeFromWishlist(element.dataset.playInstanceId)
  }
}

/*
  Review stars on the play pages 
 */

if (document.querySelector('.hero-play-stars')) {
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
      star.parentElement.nextElementSibling.classList.toggle('active')
      addReviewNote(star.parentElement.dataset.play, i+1)
    })
  })
}

/**
 * Open soft modal
 */
if (softModalSubmit) {
  softModalSubmit.addEventListener('click', () => {
    softModalSubmit.closest('.soft-modal--content').classList.toggle('active')
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
      // console.log('Success:', data);
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
      // console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


/**
 * API to reviews
 */

// Add a note to a play
const addReviewNote = (playId, note) => {
  fetch(`/users/review/note/${playId}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({note: note})
  })
  .then(response => response.json())
  .then(data => {
      // console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}



// Infinite Scroll 

 window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } =
      document.documentElement; 

      console.log({ scrollTop, scrollHeight, clientHeight }); 

      if (clientHeight + scrollTop >= scrollHeight - 5) {
        console.log("bottom reached")
      
         }     
      })

const addDataToIndex = () => {

cardsList.innerHTML = 

// let infScroll = new InfiniteScroll( elem, {
//   // options
//   // path: '.pagination__next',
//   append: playCards,
//   history: false,
// });







// let nextItem = 1;
// const loadMore = () => {
// for (var i = 0; i < 20; i++) {
// cardsList.appendChild(playCards)
// } 
// }
// loadMore()

// playCards.addEventListener('scroll', (e) => {
//         if (playCards.scrollTop + playCards.clientHeight >= playCards.scrollHeight) {
//              loadMore()
//          }     
//  })


// Sort the results 

// function compareValues(key, order = 'asc') {
//   return function innerSort(a, b) {
//     if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
//       // property doesn't exist on either object
//       return 0;
//     }

//     const varA = (typeof a[key] === 'string')
//       ? a[key].toUpperCase() : a[key];
//     const varB = (typeof b[key] === 'string')
//       ? b[key].toUpperCase() : b[key];

//     let comparison = 0;
//     if (varA > varB) {
//       comparison = 1;
//     } else if (varA < varB) {
//       comparison = -1;
//     }
//     return (
//       (order === 'desc') ? (comparison * -1) : comparison
//     );
//   };
// }

