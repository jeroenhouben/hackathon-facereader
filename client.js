$(document).ready(function () {

    ws = new WebSocket("ws://localhost:9292");
    
    var $placeholder = $("textarea").first();
    
    function processFaceReaderOutput(obj) {
        var emotions = obj["Classification"]["ClassificationValues"]["ClassificationValue"];
    
        var valenceObj = _.find(emotions, function(emo) {
          return emo["Label"] == "Valence";
        });
    
        var val = parseFloat(valenceObj.Value.float.substring(0, 6));
        
        $placeholder.text(val);
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

