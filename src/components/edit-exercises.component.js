import axios from "axios";
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      description: "",
      duration: 0,
      date: new Date(),
      users: [],
    };
  }
  componentDidMount() {
    axios
      .get(
        "https://personal-mongo.herokuapp.com/exercises" +
          this.props.match.params.id
      )
      .then((response) => {
        this.setState({
          username: response.data.username,
          description: response.data.description,
          duration: response.data.duration,
          date: new Date(response.data.date),
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("https://personal-mongo.herokuapp.com/users")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map((user) => user.username),
          });
        }
      })
      .catch((error) => {
        console.log("!!!!!ERROR!!!!!", error);
      });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value,
    });
  }

  onChangeDate(date) {
    this.setState({
      date: date,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
    };

    console.log(exercise);

    axios
      .post(
        "https://personal-mongo.herokuapp.com/exercises/update/" +
          this.props.match.params.id,
        exercise
      )
      .then((res) => console.log(res.data))
      .catch((error) => {
        console.log(error);
      });

    window.location = "/list";
  }
  render() {
    return (
      <div>
        <h1>Edit an Exercise</h1>
        <form onSubmit={this.onSubmit}>
          <div className='form-group'>
            <div className='input-label-field'>
              <label>Username: </label>
              <select
                useref='userInput'
                required
                className='form-control'
                value={this.state.username}
                onChange={this.onChangeUsername}
              >
                {this.state.users.map(function (user) {
                  return (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className='form-group'>
            <div className='input-label-field'>
              <label>Description: </label>
              <input
                type='text'
                required
                className='form-control'
                value={this.state.description}
                onChange={this.onChangeDescription}
              />
            </div>
          </div>

          <div className='form-group'>
            <div className='input-label-field'>
              <label>Duration (in minutes): </label>
              <input
                type='text'
                required
                className='form-control'
                value={this.state.duration}
                onChange={this.onChangeDuration}
              />
            </div>
          </div>

          <div className='form-group'>
            <div className='input-label-field'>
              <label>Date: </label>
              <div>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
                />
              </div>
            </div>
          </div>

          <div className='form-group'>
            <input
              type='submit'
              value='Edit the Exercise'
              className='submit-button'
            />
          </div>
        </form>
      </div>
    );
  }
}
