class UsersStore {
  users = [];

  async getUsers(usersCount) {
    try {
      const res = await fetch(
        `https://randomuser.me/api/?results=${usersCount}`
      );
      const data = await res.json();
      this.users = data.results;
    } catch {
      throw new Error('⛔ Something went wrong! Try again');
    }
  }

  get totalUsers() {
    return this.users.length;
  }
}

class UsersView {
  refs = {
    numberOfUsersInput: document.querySelector('#numberOfUsersToLoad'),
    usersContainer: document.querySelector('.users-list'),
    loadBtn: document.querySelector('.load-btn'),
    message: document.querySelector('.message'),
  };

  constructor(usersStore) {
    this.usersStore = usersStore;

    this.refs.loadBtn.addEventListener(
      'click',
      this.handleLoadBtnClick.bind(this)
    );
  }

  renderUsers() {
    const markup = this.usersStore.users
      .map((user) => {
        return `
        <li class="user-item">
          <img
            alt="user picture"
            class="user-item__img"
            src="${user.picture.medium}"
          />
          <p class="user-item__detail">Name: ${user.name.first} ${user.name.last}</p>
          <p class="user-item__detail">City: ${user.location.city}</p>
          <p class="user-item__detail">Country: ${user.location.country}</p>
          <p class="user-item__detail">Postcode: ${user.location.postcode}</p>
        </li>`;
      })
      .join('');

    this.refs.usersContainer.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(messageText) {
    this.refs.message.textContent = messageText;
  }

  clearElements(...elements) {
    elements.forEach((element) => {
      element.innerHTML = '';
    });
  }

  toggleLoadBtnLoading() {
    this.refs.loadBtn.classList.toggle('loading');
  }

  async handleLoadBtnClick() {
    this.toggleLoadBtnLoading();

    try {
      this.clearElements(this.refs.message, this.refs.usersContainer);
      const numberOfUsers = this.refs.numberOfUsersInput.value;

      await this.usersStore.getUsers(numberOfUsers);

      this.renderUsers();
      this.renderMessage(
        `✅ Successfully loaded ${this.usersStore.totalUsers} users!`
      );
    } catch (err) {
      this.renderMessage(err.message);
    }

    this.toggleLoadBtnLoading();
  }
}

new UsersView(new UsersStore());
