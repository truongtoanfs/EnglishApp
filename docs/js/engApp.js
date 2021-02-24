/* ########## variables ######### */
const vocabulariesAPI = 'http://localhost:3000/vocabulary';
const content = document.querySelector('.content');

class Vocabularies {
  async getVocabularies() {
    try {
      const result = await fetch(vocabulariesAPI);
      let vocabularies = await result.json();
      return vocabularies;
    } catch(error) {
      console.error(error);
    }
  }
}

class UI {
  displayVocabularies(vocabularies) {
    let html = '';
    vocabularies.forEach(item => {
      html += `
        <div class="item">
          <img src=${item.image} alt=${item.answer} class="item-img">
          <div class="absolute-center item-head">
            <span class="trash-icon" data-id=${item._id}>
              <i class="fas fa-trash-alt fa-2x"></i>
            </span>
            <span class="audio-icon">
              <i class="fas fa-volume-up fa-4x"></i>
            </span>
            <button class="btn btn--head">Go</button>
          </div>
          <div class="absolute-center item-tail">
            <span class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
            <input class="form-input item-tail__answer" type="text" placeholder="Type your answer...">
            <p class="error-message">Your answer is wrong!</p>
            <button class="btn btn-match">Match</button>
          </div>
          <div class="absolute-center item-success">
            <span class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
            <p class="success-message">Your answer is right!</p>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>
      `
    })
    content.innerHTML = html;
    // append create form to content
    const div = document.createElement('div');
    div.classList.add('item', 'item--user');
    div.innerHTML = `
      <img src="./img/img-add.jpg" alt="intuitive" class="item-img">
      <form class="absolute-center create-item">
        <div class="form-group">
          <p class="form-group__title">Type your Vocabulary:</p>
          <input id="answer-input" class="form-input" type="text">
        </div>
        <div class="form-group">
          <p class="form-group__title">Select an image file:</p>
          <label class="form-input" for="image"><i class="fas fa-upload"></i>Choose a file</label>
          <input class="form-group__file" type="file" name="image" id="image" accept="image/*">
          <p class="form-group__name"></p>
        </div>
        <div class="form-group form-group--submit">
          <button type="submit" id="send-form" class="btn btn--head btn--summit">Add</button>
        </div>
      </form>
    `
    content.appendChild(div);
    // Set file name when choose
    const fileInput = document.querySelector('.form-group__file');
    const nameElm = document.querySelector('.form-group__name');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const {name: fileName, size} = file;
      const fileSize = (size / 1000).toFixed(2);
      const fileNameAndSize = `${fileName} - ${fileSize}KB`;
      nameElm.innerHTML = fileNameAndSize;
    })
  }
  handleCard() {
    // create card
    this.createCard();
    // handle remove card
    const trashIcons = document.querySelectorAll('.trash-icon');
    trashIcons.forEach(item => {
      item.addEventListener('click', () => {
        this.removeCard(item);
      })
    })
    // handle speaker icon
    const speakerIcons = document.querySelectorAll('.audio-icon');
    speakerIcons.forEach(speaker => {
      speaker.addEventListener('click', () => {
        const cardElm = speaker.parentElement.parentElement;
        const textAnswer = cardElm.querySelector('.item-img').getAttribute("alt");
        this.say(textAnswer);
      })
    })
  }
  createCard() {
    // collection data
    const data = {};
    // take data from image file
    const fileElm = document.querySelector('.form-group__file');
    fileElm.addEventListener('change', function(event) {
      const file =  event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = function() {
        data.image = reader.result;
      }
      reader.readAsDataURL(file);
    })

    const formSendBtn = document.querySelector('#send-form');
    formSendBtn.addEventListener('click', (event) => {
      event.preventDefault();

      // take data from answer input
      const answer = document.querySelector('#answer-input').value;
      data.answer = answer;
      if (!data.answer) {
        return alert('please, type your vocabulary!');
      } else if (!data.image) {
        return alert('please, select an image file!');
      }

      this.postData(vocabulariesAPI, data)
        .then(data => {
          // add to DOM
          const createElm = document.querySelector('.item--user');
          const itemElm = document.createElement('div');
          itemElm.classList.add('item');
          itemElm.innerHTML = `
            <img src=${data.image} alt=${data.answer} class="item-img">
            <div class="absolute-center item-head">
              <span class="trash-icon" data-id=${data._id}>
                <i class="fas fa-trash-alt fa-2x"></i>
              </span>
              <span class="audio-icon">
                <i class="fas fa-volume-up fa-4x"></i>
              </span>
              <button class="btn btn--head">Go</button>
            </div>
            <div class="absolute-center item-tail">
              <span class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
              <input class="form-input item-tail__answer" type="text" placeholder="Type your answer...">
              <p class="error-message">Your answer is wrong!</p>
              <button class="btn btn-match">Match</button>
            </div>
            <div class="absolute-center item-success">
              <span class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
              <p class="success-message">Your answer is right!</p>
              <button class="btn btn-delete">Delete</button>
            </div>
          `
          content.insertBefore(itemElm, createElm);
          // reset createElm
          createElm.querySelector('#answer-input').value = '';
          createElm.querySelector('.form-group__name').innerHTML = '';
          
          // add event click to trash icon
          const trashIcon = itemElm.querySelector('.trash-icon');
          trashIcon.addEventListener('click', () => {
            this.removeCard(trashIcon);
          })
          // add event click to speaker
          const speakerIcon = itemElm.querySelector('.audio-icon');
          speakerIcon.addEventListener('click', () => {
            this.say(data.answer);
          })
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        
    })
  }
  async postData(vocabulariesAPI, data) {
    const response = await fetch(vocabulariesAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json();
  }

  removeCard(trashIcon) {
    // remove item in database
    fetch(vocabulariesAPI + '/' + trashIcon.dataset.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response);
    })
      
    // remove item in DOM
    const card = trashIcon.parentElement.parentElement;
    card.remove();
  }

  say(text) {
    const utterThis = new SpeechSynthesisUtterance(text);
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    utterThis.voice = voices.find((voice => voice.default === true));
    synth.speak(utterThis);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const vocabularies = new Vocabularies();
  const ui = new UI();

  vocabularies.getVocabularies()
  .then(vocabularies => {
    ui.displayVocabularies(vocabularies);
  })
  .then(() => {
    ui.handleCard();
  })

})




