export default class MockStorage {
  constructor() {
    this.data = null;
  }

  read() {
    return this.data;
  }

  write(data) {
    this.data = data;
  }
}
