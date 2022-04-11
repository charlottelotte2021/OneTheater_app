const header = document.querySelector('header.header')
const optionsMoreBtn = document.querySelector('.options-more-btn')
let playCards = document.querySelectorAll('.play-card')
const cardSummaries = document.querySelectorAll('.play-card-summary')
let cardBookmarks = document.querySelectorAll('.play-card-bookmark')
const softModalSubmit = document.querySelector('.soft-modal--content input[type="button"]')
const cardsList = document.querySelector('.cards-container')
let playsShowed = 5

let sortButton = document.querySelector("#options-sort-input")
console.log(sortButton)

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
      addReviewNote(star.parentElement.dataset.play, star.parentElement.dataset.playInstance, i+1)
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
const addReviewNote = (playId, playInstanceId, note) => {
  fetch('/users/review/note', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({playId: playId, playInstanceId: playInstanceId, note: note})
  })
  .then(response => response.json())
  .then(data => {
      // console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


// Profile pic
if (document.querySelector('.add-prof-pic')) {
  const addProfilePicBtn = document.querySelector('.add-prof-pic')
  addProfilePicBtn.addEventListener('click', (e) => {
    addProfilePicBtn.nextElementSibling.classList.toggle('active')
  })
}

// let file
// if (document.querySelector('.prof-pic-form')) {
//   document.querySelector('.prof-pic-form input[type="submit"]').addEventListener('change', () => {
//     const reader = new FileReader()
//     reader.addEventListener('load', () => {
//         file = reader.result;
//         console.log(file)
//     })
//     reader.readAsDataURL(fileInput.files[0])
//   })
// }





const createPlaysCard = (plays, data) => {
  plays.forEach((play) => {
    play.playsInstances.forEach((pi) => {
      let article = document.createElement('article')
      article.classList.add("card", "play-card")
      let div = document.createElement('div')
      div.classList.add("play-card-header")
      article.appendChild(div)
      div.insertAdjacentHTML("beforeend", `<h2><a class="play-card-title" href="/play/${play._id}/${pi._id}" title="${play.title}">${play.title}</a></h2>`)
      if(data.user){
        let button = document.createElement("button")
        button.classList.add("play-card-bookmark")
        button.dataset.playInstanceId = pi._id
        button.addEventListener('click', () => {
          updateWishlist(button)
        })
        // div.insertAdjacentHTML("beforeend", `<button class="play-card-bookmark" data-play-instance-id="${pi._id}">`)
        if(data.user.wishlist.some(entry => entry.playInstanceId.toString() == pi._id.toString())){
          button.insertAdjacentHTML("beforeend", `<i class="fas fa-bookmark"></i>`)
          div.appendChild(button)                                                                        
        }else{
          button.insertAdjacentHTML("beforeend", `<i class="far fa-bookmark"></i>`)
          div.appendChild(button) 
        }
      }
      let divContent = document.createElement('div')
      divContent.classList.add("play-card-content") 
      article.appendChild(divContent)
      let divRow = document.createElement('div')
      divRow.classList.add("card-row")
      divContent.appendChild(divRow)
      let divDates = document.createElement('div')
      divRow.appendChild(divDates)
      divDates.insertAdjacentHTML("beforeend", `${pi.date}`)
      let divTheater = document.createElement('div')
      divTheater.classList.add("play-card-theater")
      divRow.appendChild(divTheater)
      divTheater.insertAdjacentHTML("beforeend", `${pi.theater.name}`)
      let divRowTwo = document.createElement("div")
      divRowTwo.classList.add("card-row")
      let divTwo = document.createElement("div")
      let divSummary = document.createElement("div")
      divSummary.classList.add("play-card-summary")
      divSummary.insertAdjacentHTML("beforeend", `<p>${pi.summary}<br> </p> <button class="play-card-summary-seemore"><i class="fas fa-angle-down"></i></button>`)
      divTwo.appendChild(divSummary)
      divRowTwo.appendChild(divTwo)
      divContent.appendChild(divRowTwo)
      let divDirector = document.createElement("div")
      divTwo.appendChild(divDirector)
      let divProduction = document.createElement("div")
      divTwo.appendChild(divProduction)
      divDirector.insertAdjacentHTML("beforeend", play.director)
      divProduction.insertAdjacentHTML("beforeend", `${play.production ? play.production.length > 100 ? play.production.substr(0, 97) + '...' : play.production : ''}`)
      let divPicReviews = document.createElement("div")
      divContent.appendChild(divPicReviews)
      divPicReviews.classList.add("pic-reviews")
      divRowTwo.appendChild(divPicReviews)
      divPicReviews.insertAdjacentHTML("beforeend", `<img class="play-card-poster" src= ${pi.image} alt="">`)
      let divReviews = document.createElement("div")
      divPicReviews.appendChild(divReviews)
      divReviews.classList.add("play-card-reviews")
      divReviews.insertAdjacentHTML("beforeend", `<a href="/play/${play._id}/${pi._id}" title=" ${play.title}" class="reviews-link">`)
      

        const filteredReviews = data.reviews.filter(review => {
            console.log("inside filter", review.playId, play._id, review )
            return review.playId.toString() === play._id.toString()
                                                             })
        const reviewsWithComment = filteredReviews.filter(review => review.comment)
        console.log("helloWorld", play)
        console.log(filteredReviews)
        let divReviewsTwo = divReviews.querySelector(".reviews-link")
        if (reviewsWithComment.length > 0) {
                                    divReviewsTwo.insertAdjacentHTML("beforeend", `<p>Read ${reviewsWithComment.length}reviews</p>`)
                                } else { 
                                          let tmp
                                          if(!data.user) {
                                                    tmp = ""}else{
                                                    tmp = "Add yours"}
                                    divReviewsTwo.insertAdjacentHTML("beforeend", `<p>There are no reviews yet. ${tmp} </p>`)
                               } 
                                if (filteredReviews.length > 0) { 
                                    let reviewStar = document.createElement("div")

                                    reviewStar.insertAdjacentHTML("beforeend", `<div class="review-stars">`)
                                    const reviewsTotalStars = filteredReviews.map(review => review.star).reduce((review1, review2) => review1 + review2, 0)
                                    const average = Math.round((reviewsTotalStars/filteredReviews.length)*2)/2 
                                    for (let i = 0; i < 5; i++) { 
                                             if (i + 0.5 === average) { 
                                               reviewStar.insertAdjacentHTML("beforeend", `<i class="fas fa-star-half-stroke"></i>`) 
                                              }  else if (i < average) {
                                               reviewStar.insertAdjacentHTML("beforeend", `<i class="fas fa-star"></i>`)
                                              } else { 
                                               reviewStar.insertAdjacentHTML("beforeend", `<i class="far fa-star"></i>`)
                                              } 
                                    } 
                                  divReviews.querySelector(".reviews-link").appendChild(reviewStar) 

                                }
      // Derniere ligne qui ajoute la carte entiere au container
      cardsList.appendChild(article)

    })

  })
  setTimeout(() => {
    document.querySelector(".loader-cont").remove()

  }, 1000);
  
}


// Infinite Scroll 
const getFiveMorePlays = (nbr) => {
  fetch('/getfiveplays', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({limit : nbr})
  })
  .then(response => response.json())
  .then(data => { 
    // console.log(data)
    document.querySelector("body").insertAdjacentHTML("beforeend",`<div class="loader-cont"><svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
    <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
                 begin="0s" dur="0.8s"
                 values="15;9;15" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
                 begin="0s" dur="0.8s"
                 values="1;.5;1" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate attributeName="r" from="9" to="9"
                 begin="0s" dur="0.8s"
                 values="9;15;9" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="0.5" to="0.5"
                 begin="0s" dur="0.8s"
                 values=".5;1;.5" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
    <circle cx="105" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
                 begin="0s" dur="0.8s"
                 values="15;9;15" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
                 begin="0s" dur="0.8s"
                 values="1;.5;1" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
</svg> </div>`)
    createPlaysCard(data.plays, data)
    playsShowed = playsShowed + 5
    window.addEventListener('scroll', addEventListenerToWindow)
    
    // return data 
    // console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


const addEventListenerToWindow = () => {
  const { scrollTop, scrollHeight, clientHeight } =
       document.documentElement; 

       if (clientHeight + scrollTop >= scrollHeight - 5) {

         getFiveMorePlays(playsShowed)
         window.removeEventListener("scroll", addEventListenerToWindow )
       
      }  

}

let baseURL = document.location.protocol + '//' + document.location.host

if (document.URL.replace(baseURL, '') === '/') {
  window.addEventListener('scroll', addEventListenerToWindow)
}
 





