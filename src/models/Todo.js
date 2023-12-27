import { getDate } from "src/helpers/date";

export default class Todo {
  constructor(title = "", description = "", deadline = getDate()) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
  }
}
