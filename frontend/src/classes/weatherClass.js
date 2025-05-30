export class Weather {
  constructor(location, temp, condition, date, lat, lon) {
    this._location = location
    this._temp = temp
    this._condition = condition
    this._lat = lat
    this._lon = lon
    this._date = date
  }

  get location() {
    return this._location
  }

  get temp() {
    return this._temp
  }

  get condition() {
    return this._condition
  }

  get lat() {
    return this._lat
  }

  get lon() {
    return this._lon
  }

  get date() {
    return this._date
  }
}

