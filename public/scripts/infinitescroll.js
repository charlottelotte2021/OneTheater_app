import createPlaysCard from "./frontend.js"


let playsShowed = 5
// Infinite Scroll: loader
const getFiveMorePlays = (nbr) => {
    fetch("/getfiveplays", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: nbr, location: window.location }),
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data)
            document.querySelector("body").insertAdjacentHTML(
                "beforeend",
                `<div class="loader-cont"><svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
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
  </svg> </div>`
            )
            createPlaysCard(data.plays, data)
            playsShowed = playsShowed + 5
            window.addEventListener("scroll", addEventListenerToWindow)

            // return data
            // console.log('Success:', data);
        })
        .catch((error) => {
            console.error("Error:", error)
        })
}

// Infinite scroll: if the user's at the bottom of the page, load 5 more plays
const addEventListenerToWindow = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    if (clientHeight + scrollTop >= scrollHeight - 5) {
        getFiveMorePlays(playsShowed)
        window.removeEventListener("scroll", addEventListenerToWindow)
    }
}

window.addEventListener("scroll", addEventListenerToWindow)