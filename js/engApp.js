
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
          <input id="answer-input" class="form-input" type="text" required>
        </div>
        <div class="form-group">
          <p class="form-group__title">Select a image file:</p>
          <label class="form-input" for="image"><i class="fas fa-upload"></i>Choose a file</label>
          <input class="form-group__file" type="file" name="image" id="image">
          <p class="form-group__name"></p>
        </div>
        <div class="form-group form-group--submit">
          <button type="submit" id="send-form" class="btn btn--summit">Add</button>
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
  // Create card
  createCard() {
    const data = {};
    /* take image data */
    const imgFile = document.querySelector('.form-group__file');
    imgFile.addEventListener('change', (event) => {
      const file =  event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = function() {
        data.image = reader.result;
      }
      reader.readAsDataURL(file);
    })

    const formSendBtn = document.querySelector('#send-form');
    formSendBtn.addEventListener('click', (event) => {
      /* take data from input form */
      const answer = document.querySelector('#answer-input');
      if (answer.value === '') {
        return console.error('please, type input file!');
      }
      event.preventDefault();
      data.answer = answer.value;
      

      fetch(vocabulariesAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      /* .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      }) */
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
    ui.createCard();
  })

})




