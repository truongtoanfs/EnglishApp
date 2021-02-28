/* ########## variables ######### */
const vocabulariesAPI = 'https://toan-english-app.herokuapp.com/vocabulary';
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
      // setup display default is vocabulary tab
      let display = 'd-none';
      if (item.type === 'vocabulary') {display = ''};
      html += `
        <div class="item ${item.type} ${display}" data-id=${item._id}>
          <img src=${item.image} alt=${item.answer} class="item-img">
          <div class="absolute-center item-head">
            <span class="trash-icon">
              <i class="fas fa-trash-alt fa-2x"></i>
            </span>
            <span class="audio-icon">
              <i class="fas fa-volume-up fa-4x"></i>
            </span>
            <button id="btn-go" class="btn btn--head">Go</button>
          </div>
          <div class="absolute-center item-tail d-none">
            <span id="close-tail" class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
            <input class="form-input item-tail__answer" type="text" placeholder="Type your answer...">
            <p class="error-message">Your answer is wrong!</p>
            <button  id="match-btn" class="btn btn-match">Match</button>
          </div>
          <div class="absolute-center item-success d-none">
            <span id="close-success" class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
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

    // handle filter features
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.btn--active').classList.remove('btn--active');
        btn.classList.add('btn--active');

        const value = btn.dataset.filter;
        const cardElms = document.querySelectorAll('.item:not(.item--user)');
        cardElms.forEach(card => {
          if (value === 'recycleBin' || value === 'all') {
            document.querySelector('.item--user').classList.add('d-none');
          } else {
            document.querySelector('.item--user').classList.remove('d-none');
          }
          if (value === 'all') {
            card.classList.remove('d-none');
          } else if (!card.classList.contains(value)) {
            card.classList.add('d-none');
          } else {
            card.classList.remove('d-none');
          }
        })
      })
    })
  }

  // use card
  useCard() {
    // create card
    this.createCard();
    // handle card
    const cardItems = document.querySelectorAll('.item:not(.item--user)');
    cardItems.forEach(card => {
      this.handleCard(card);
    })
  }

  createCard() {
    // collection data
    const data = {
      type: 'vocabulary',
    };
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
          itemElm.classList.add('item', 'vocabulary');
          itemElm.setAttribute('data-id', data._id);
          itemElm.innerHTML = `
            <img src=${data.image} alt=${data.answer} class="item-img">
            <div class="absolute-center item-head">
              <span class="trash-icon">
                <i class="fas fa-trash-alt fa-2x"></i>
              </span>
              <span class="audio-icon">
                <i class="fas fa-volume-up fa-4x"></i>
              </span>
              <button id="btn-go" class="btn btn--head">Go</button>
            </div>
            <div class="absolute-center item-tail d-none">
              <span id="close-tail" class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
              <input class="form-input item-tail__answer" type="text" placeholder="Type your answer...">
              <p class="error-message">Your answer is wrong!</p>
              <button  id="match-btn" class="btn btn-match">Match</button>
            </div>
            <div class="absolute-center item-success d-none">
              <span id="close-success" class="btn-close"><i class="far fa-window-close fa-2x"></i></span>
              <p class="success-message">Your answer is right!</p>
              <button class="btn btn-delete">Delete</button>
            </div>
          `
          content.insertBefore(itemElm, createElm);
          // reset createElm
          createElm.querySelector('#answer-input').value = '';
          createElm.querySelector('.form-group__name').innerHTML = '';
          
          // handle card
          this.handleCard(itemElm);
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
    const card = trashIcon.parentElement.parentElement;
    // remove item in database
    fetch(vocabulariesAPI + '/' + card.dataset.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response);
    })
      
    // remove item in DOM
    card.remove();
  }

  updateCard(card) {
    // update item in database
    fetch(vocabulariesAPI + '/' + card.dataset.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'recycleBin'
      })
    }).then((response) => {
      console.log(response);
    })
  }

  say(text) {
    const utterThis = new SpeechSynthesisUtterance(text);
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    utterThis.voice = voices.find((voice => voice.default === true));
    synth.speak(utterThis);
  }

  toggleCard(card1, card2) {
    card1.classList.toggle('d-none');
    card2.classList.toggle('d-none');
  }

  checkAnswer(card) {
    const textInput = card.querySelector('.item-tail__answer').value.trim();
    const answerText = card.querySelector('.item-img').getAttribute('alt');
    const answer = new RegExp('^'+ answerText + '$', 'i');
    const successCard = card.querySelector('.item-success');
    const tailCard = card.querySelector('.item-tail');
    if (answer.test(textInput)) {
      card.querySelector('.item-tail__answer').value = '';
      this.toggleCard(successCard, tailCard);
    } else {
      tailCard.classList.add('wrong-answer');
    }
  }

  handleCard(card) {
    const trashIcon = card.querySelector('.trash-icon');
    const speakerIcon = card.querySelector('.audio-icon');
    const goBtn = card.querySelector('#btn-go');
    const closeTail = card.querySelector('#close-tail');
    const closeSuccess = card.querySelector('#close-success');
    const headCard = card.querySelector('.item-head');
    const tailCard = card.querySelector('.item-tail');
    const successCard = card.querySelector('.item-success');
    const matchBtn = card.querySelector('#match-btn');
    const answerInput = card.querySelector('.item-tail__answer');
    const deleteBtn = card.querySelector('.btn-delete');

    // add event click to trash icon
    trashIcon.addEventListener('click', () => {
      this.removeCard(trashIcon);
    })

    // add event click to speaker
    speakerIcon.addEventListener('click', () => {
      const answerText = card.querySelector('.item-img').getAttribute('alt');
      this.say(answerText);
    })

    // add event click to go button
    goBtn.addEventListener('click', () => {
      this.toggleCard(headCard, tailCard);
    })

    // close tail card
    closeTail.addEventListener('click', () => {
      this.toggleCard(headCard, tailCard);
    })

    // handle match answer
    matchBtn.addEventListener('click', () => {
      this.checkAnswer(card);
    })
    answerInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.checkAnswer(card);
      }
    })
    answerInput.addEventListener('input', (event) => {
      if (tailCard.classList.contains('wrong-answer') && event.key !== 'Enter') {
        tailCard.classList.remove('wrong-answer');
      }
    })
    // handle close success btn
    closeSuccess.addEventListener('click', () => {
      this.toggleCard(headCard, successCard);
    })
    // handle delete card
    deleteBtn.addEventListener('click', () => {
      const card = deleteBtn.parentElement.parentElement;
      // update card in db
      this.updateCard(card);
      // add class recycleBin to card
      card.classList.remove('vocabulary');
      card.classList.add('recycleBin');
      // remove item in DOM
      card.remove();
    })
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
    ui.useCard();
  })

})




