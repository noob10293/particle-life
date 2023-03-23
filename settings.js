const settings = {
  radius: 1
  , timeSteps:2
  , brushSize:1
  , friction: 0.6
  , repel: 1
  , maxDistance: 40
  , minDistance: 20
  , slowdown: false
  , wrap: true
}


class SettingsInput {
  constructor(setting, isNum, div) {
    this.input = document.createElement("input")
    this.input.setting = setting
    this.div = div;

    if (isNum) {
      this.input.type = "text"
      this.input.value = settings[setting]
      this.input.oninput = function() {
        if (this.value.match(/^\-?\d+\.?\d*$/)) settings[this.setting] = parseFloat(this.value);
      }
    } else {
      this.input.type = "checkbox"
      this.input.checked = settings[setting];
      this.input.oninput = function() {
        settings[this.setting] = this.checked;
      }
    }

    this.label = document.createElement("label")
    this.label.appendChild(document.createTextNode(setting + ": "));
    this.label.appendChild(this.input)
    div.appendChild(this.label);
    div.appendChild(document.createElement("br"));
  }
}
const settingsDiv = document.getElementById("settings")

const numInputs = ["repel", "friction", "radius", "maxDistance", "minDistance", "brushSize","timeSteps"]
numInputs.forEach((value, index, array) => { array[index] = new SettingsInput(value, true, settingsDiv) })
const checkInputs = ["slowdown", "wrap"]
checkInputs.forEach((value, index, array) => { array[index] = new SettingsInput(value, false, settingsDiv) })

document.addEventListener("keydown", (event) => {
  if (event.key == 's') {
    if (settingsDiv.style.display === "none") {
      settingsDiv.style.display = "block";
    } else {
      settingsDiv.style.display = "none";
    }
  }
})