var final_transcript = '';
var recognizing = false;

var language = 'en-GB';  // change this to your language
//var recognition;
var speechrecognitionlist ;
var gumstream;
var down = [];

window.onload = function() {

    // check that your browser supports the API
    if (!('SpeechRecognition' in window)) {
        alert("Your Browser does not support the Speech API");
    }
    else
    {
        document.querySelector('#button_microphone').onclick = function(e) {

            recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            speechrecognitionlist = new SpeechGrammarList();
            speechrecognitionlist.addFromString("", 1);
            recognition.grammars = speechrecognitionlist;
            recognition.start();

            document.querySelector('#log_resultado').value += 'SpeechRecognition ready \n';

            recognition.onstart = function() {
                document.querySelector('#log_resultado').value += 'Speak slowly and clearly  \n';
            };

            recognition.onerror = function(event) {
                document.querySelector('#log_resultado').value += "There was a recognition error... " + event.message + " \n";
            };

            recognition.onend = function() {
                document.querySelector('#log_resultado').value += 'Done \n';
                // Get the checkbox
                var checkBox = document.getElementById("auto_start");
                if (checkBox.checked == true){
                    recognition.start();
                }
            };

            recognition.onresult = function(event) {

                console.log("recognition.onresult called");
                var score = '';

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

                console.log("final:    " + final_transcript);
                document.querySelector('#log_resultado').value += final_transcript + "," + score + " \n";
                document.querySelector("#log_resultado").scrollTop = document.querySelector("#log_resultado").scrollHeight
            };
        };

        document.querySelector('#button_abort').onclick = function(e) {
            recognition.abort();
        };

        document.querySelector('#button_automatic').onclick = function(e) {
/*
            var samples_list = {};
            samples_list["audio-wsa.ogg"] = "how are you";
            samples_list["audio-wsa2.ogg"] = "how are you 2";

            for(var key in samples_list){
                var value = samples_list[key];
                console.log(key,value);
            }
*/
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var myAudio = document.getElementById("audio-wsa");
            var dest = audioCtx.createMediaStreamDestination();
            var source = audioCtx.createMediaElementSource(myAudio);
            source.connect(dest);

            recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            speechrecognitionlist = new SpeechGrammarList();
            speechrecognitionlist.addFromString("", 1);
            recognition.grammars = speechrecognitionlist;
            recognition.start(dest.stream);
            myAudio.play();

            document.querySelector('#log_resultado').value += 'SpeechRecognition ready \n';

            recognition.onstart = function() {
                document.querySelector('#log_resultado').value += 'Speak slowly and clearly  \n';
            };

            recognition.onerror = function(event) {
                document.querySelector('#log_resultado').value += "There was a recognition error: " + event.message +" \n";
            };

            recognition.onend = function() {
                document.querySelector('#log_resultado').value += 'Done \n';
                // Get the checkbox
                var checkBox = document.getElementById("auto_start");
                if (checkBox.checked == true){
                    recognition.start(dest.stream);
                    myAudio.play();
                }
            };

            recognition.onresult = function(event) {

                console.log("recognition.onresult called");
                var score = '';

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

                console.log("final:    " + final_transcript);
                document.querySelector('#log_resultado').value += final_transcript + "," + score + " \n";
                document.querySelector("#log_resultado").scrollTop = document.querySelector("#log_resultado").scrollHeight
            };
        };
    }
};




