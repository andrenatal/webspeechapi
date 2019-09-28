/* eslint-disable max-lines-per-function */
var final_transcript = "";
var speechrecognitionlist;
var recognizing = false;
var recognition;
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voices");
var voices = [];

const say = text => {
    var utterThis = new SpeechSynthesisUtterance(text);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
        }
    }
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
}

const append_to_chatwindow = (value, direction, background) => {
    var innerDiv = document.createElement("div");
    innerDiv.id = "rcorners2";
    innerDiv.innerHTML = value;
    innerDiv.style.background = background;
    innerDiv.style["text-align"] = direction;
    innerDiv.style.float = direction;
    document.getElementById("rcorners1").appendChild(innerDiv);
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));
    document.getElementById("rcorners1").appendChild(document.createElement("br"));

    if (direction === "left"){
        // synthesize
        say(value);
    }
}

const determine_intent = intent => {
    const lang = voiceSelect.selectedOptions[0].getAttribute("data-lang");
    if (lang === "en-US") {
        if (intent.indexOf("weather") > -1 && intent.indexOf("amsterdam") > -1) {
            append_to_chatwindow("Cold and rainy", "left", "lightgray");
        } else {
            append_to_chatwindow("Sorry I didn't understand", "left", "lightgray");
        }
    }
}

window.onload = () => {

    // check that your browser supports the API
    if (!("SpeechRecognition" in window)) {
        alert("Your Browser does not support the Speech API");
    }
    else {
        // eslint-disable-next-line max-lines-per-function
        document.querySelector("#microphone").onclick = () => {

            if (recognizing) {
                recognition.abort();
                return;
            }

            recognition = new SpeechRecognition();
            recognition.lang = voiceSelect.selectedOptions[0].getAttribute("data-lang");
            speechrecognitionlist = new SpeechGrammarList();
            speechrecognitionlist.addFromString("", 1);
            recognition.grammars = speechrecognitionlist;
            recognition.start();

            console.log("SpeechRecognition ready");

            recognition.onstart = function() {
                recognizing = true;
                console.log("Speak slowly and clearly");
            };

            recognition.onerror = function(event) {
                console.log("There was a recognition error... " + event.message);
            };

            recognition.onend = function() {
                console.log("Done");
                recognizing = false;
            };

            recognition.onresult = function(event) {

                console.log("recognition.onresult called");
                var score = "";

                // Assemble the transcript from the array of results
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        console.log("recognition.onresult : isFinal");
                        final_transcript = event.results[i][0].transcript;
                        score = event.results[i][0].confidence;
                    } else {
                        console.log("recognition.onresult : not isFinal");
                        final_transcript = event.results[i][0].transcript;
                        score = event.results[i][0].confidence;
                    }
                }
                append_to_chatwindow(final_transcript, "right", "lightgreen");
                determine_intent(final_transcript);
                console.log("final:    " + final_transcript + "," + score);
            };
        };
    }

    function populateVoiceList() {
        voices = synth.getVoices();
        var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
        voiceSelect.innerHTML = "";
        for(i = 0; i < voices.length ; i++) {
          var option = document.createElement("option");
          option.textContent = voices[i].name + " (" + voices[i].lang + ")";

          if(voices[i].default) {
            option.textContent += " -- DEFAULT";
          }

          option.setAttribute("data-lang", voices[i].lang);
          option.setAttribute("data-name", voices[i].name);
          voiceSelect.appendChild(option);
        }
        voiceSelect.selectedIndex = selectedIndex;
      }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

}
