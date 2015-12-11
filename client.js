function processArticles($articles, emoValue) {
    // $articles.each(function () {
    //
    //
    //
    // });
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
}

$(document).ready(function () {

    ws = new WebSocket("ws://localhost:9292");
    
    var $placeholder = $("textarea").first();
    
    var $articles = $('.artikel');
    
    function processFaceReaderOutput(obj) {
        console.log(obj);
        
        var emotions = obj["Classification"]["ClassificationValues"]["ClassificationValue"];
    
        var valenceObj = _.find(emotions, function(emo) {
          return emo["Label"] == "Valence";
        });
    
        var val = parseFloat(valenceObj.Value.float.substring(0, 6));
        
        $placeholder.text(val);
        
        val = mediatedValence(val);
        
        processArticles($articles, val);
    }

    ws.onopen = function() {
        console.log("Im connected to WS!");
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
    };
    
});

