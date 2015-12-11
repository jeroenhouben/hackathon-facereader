var MEDIATED_VALENCE = 0;
var VALENCE = 0;
var $innerMeter;
var $articles;

function renderMeter() {
    var val = VALENCE + 1;
    
    $innerMeter.css({
            "width": val * 60 + '%'
        }
    ).text(VALENCE);
}

function processArticles() {
    var classListToHide = ""
    var classListToShow = ""
    
    switch (MEDIATED_VALENCE) {
    case -1:
        classListToShow = "emo-min-1"
        break;
    case -0.5:
        classListToShow = "emo-min-half"
        break;

    case 0:
        classListToShow = "emo-0"
        break;

    case 0.5:
        classListToShow = "emo-plus-half"
        break;

    case 1:
        classListToShow = "emo-plus-1"
        break;
    }
    
    console.log("show ", classListToShow);
    
    $articles.hide();
    $articles.filter('.' + classListToShow).show();
}

function mediatedValue(val) {
    var newVal;
    
    if (val >= 1) {
        newVal = 1;
    } else if (val >= 0.5) {
        newVal = 0.5;
    } else if (val >= 0) {
        newVal = 0;
    } else if (val >= -0.5) {
        newVal = -0.5;
    } else {
        newVal = -1;
    }
    
    return newVal;
}

$(document).ready(function () {

    ws = new WebSocket("ws://localhost:9292");
    
    $innerMeter = $("#meter .inner");
    
    var $placeholder = $("textarea").first();
    
    $articles = $('div[data-valence]');
    
    function processFaceReaderOutput(obj) {
        var emotions = obj["Classification"]["ClassificationValues"]["ClassificationValue"];

        var valenceObj = _.find(emotions, function(emo) {
          return emo["Label"] == "Valence";
        });
        
        var emotion = {
            neutral: parseFloat(emotions[0]["Value"]["float"].substring(0, 6)),
            happy:parseFloat(emotions[1]["Value"]["float"].substring(0, 6)),
            sad:parseFloat(emotions[2]["Value"]["float"].substring(0, 6)),
            angry:parseFloat(emotions[3]["Value"]["float"].substring(0, 6)),
            surprised:parseFloat(emotions[4]["Value"]["float"].substring(0, 6)),
            scared:parseFloat(emotions[5]["Value"]["float"].substring(0, 6)),
            disgusted:parseFloat(emotions[6]["Value"]["float"].substring(0, 6)),
            valence:parseFloat(emotions[7]["Value"]["float"].substring(0, 6)),
            arousal:parseFloat(emotions[8]["Value"]["float"].substring(0, 6))
        }
        
    
        VALENCE = emotion.valence;
        
        console.log(VALENCE);
        
        
        MEDIATED_VALENCE = mediatedValue(emotion.valence);

        $placeholder.text(MEDIATED_VALENCE);
    }
    

    ws.onopen = function() {
        console.log("Im connected to WS!");
        
        setInterval(processArticles, 1000);

    };

    ws.onmessage = function (evt) {
       var str = evt.data;

       var json = null;

       try  {
           json = JSON.parse(str);
       } catch(e) {

       }

       if (json) {
         processFaceReaderOutput(json)
       }
       
       setInterval(renderMeter, 1);
       
    };
    
});

