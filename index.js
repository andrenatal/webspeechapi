



    var final_transcript = '';
    var recognizing = false;

    var language = 'en-GB';  // change this to your language
    var recognition;
    var speechrecognitionlist ;
    var gumstream; 
    var down = [];
    $(document).keydown(function(e) {
        down[e.keyCode] = true;
    }).keyup(function(e) {
    

        if (down[17] && down[65] ) {

            if ($('#gramdiv').is(':hidden'))
            {
                $("#gramdiv").show();
                
            }
            else
            {
                $("#gramdiv").hide();   
            }
        }
        down[e.keyCode] = false;
    }); 

    $(document).ready(function() {
        
     
        // check that your browser supports the API
        if (!('SpeechRecognition' in window)) {
            alert("Your Browser does not support the Speech API");

        } 
        else 
        {

            $("#create_button").click(function(e) {


                    e.preventDefault();                


recognition = new SpeechRecognition();
recognition.lang ="en-US";
var sgl = new SpeechGrammarList();
sgl.addFromString($('#gram').val() , 1);
recognition.grammars = sgl;


/*
                    // Create the recognition object and define four event handlers (onstart, onerror, onend, onresult)
                   // $('#instructions').html('Creating SpeechRecognition');                    
                    recognition = new SpeechRecognition();     
                    recognition.lang ="fr-FR";
  */                  
                    $('#instructions').html('SpeechRecognition ready');

/*
                    if ($("#kws").is(':checked'))
                    {
                        recognition.continuous = true;
                    }
                    else
                    {
                        recognition.continuous = false;
                    }
*/

                    //recognition.continuous = true;         // keep processing input until stopped // MOZ: NS_ERROR_NOT_IMPLEMENTED
                    //recognition.interimResults = true;     // show interim results // MOZ: NS_ERROR_NOT_IMPLEMENTED
                    //recognition.lang = language;           // specify the language // MOZ: NS_ERROR_NOT_IMPLEMENTED


                    recognition.onstart = function() {
                        recognizing = true;
                        $('#instructions').html('Speak slowly and clearly');
                    };

                    recognition.onerror = function(event) {
                        console.log("There was a recognition error...");
                    };

                    recognition.onend = function() {
                        recognizing = false;
                        $('#instructions').html('Done');
                    };

                    recognition.onresult = function(event) {

                        console.log("recognition.onresult called");

                        //var interim_transcript = '';
                        var score = '';

                        // Assemble the transcript from the array of results
                        for (var i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                console.log("recognition.onresult : isFinal");                                
                                final_transcript += event.results[i][0].transcript;
                            } else {
                                console.log("recognition.onresult : not isFinal");                                                                
                                final_transcript += event.results[i][0].transcript;
                                score = event.results[i][0].confidence;
                            }
                        }

                        console.log("interim:  " + interim_transcript);
                        console.log("final:    " + final_transcript);
                        // update the web page
                        
                        $('#final_transcript').html(final_transcript );
                        $('#interim_transcript').html(final_transcript  )  ;            

                        $('#start_button').html('Click to speak');
            
                    };


            });

            $("#stop_button").click(function(e) {
                e.preventDefault();

                recognition.stop();
                $('#start_button').html('Click to Start Again');
                recognizing = false;

            });

            $("#start_button").click(function(e) {
                e.preventDefault();
                final_transcript = '';
                //alert("clicked");
                // Request access to the User's microphone and Start recognizing voice input
                recognition.start();
                $('#instructions').html('Allow the browser to use your Microphone');
                $('#start_button').html('waiting');
                $('#transcript').html('&nbsp;');
                recognizing = true;
            });

            $("#mic").click(function(e) {
                e.preventDefault();
                final_transcript = '';
                //alert("clicked");
                // Request access to the User's microphone and Start recognizing voice input
                recognition.start();
                $('#instructions').html('Allow the browser to use your Microphone');
                $('#start_button').html('waiting');
                $('#transcript').html('&nbsp;');
                recognizing = true;
            });



            $("#set_grammar").click(function(e) {
                e.preventDefault();
                speechrecognitionlist.addFromString  ( $('#gram').val() , 1 );
                $('#instructions').html('Grammar set');
            });


            $("#create_grammar").click(function(e) {
                e.preventDefault();                
                speechrecognitionlist = new SpeechGrammarList();
                $('#instructions').html('SpeechGrammarList created');                                
            });



            $("#associate_grammar").click(function(e) {
                e.preventDefault();
                recognition.grammars = speechrecognitionlist;                
            });

        }




    });




