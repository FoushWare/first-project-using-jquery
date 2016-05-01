function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetstr = $("#street").val();
    var citystr= $("#city").val();
    var address = streetstr + ', ' + citystr;

    $greeting.text('So, you want to live at '+ address +'?');
    
    var streetviewUrl = '<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
           address + '">';

    $body.append(streetviewUrl);

  ////////////////////////

var nytimesUrl="http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +citystr+ "&sort=newest&api-key=c357f743cbdedf2afcf125fe4c5448ea:19:75099580";


  $.getJSON(nytimesUrl,
        function( data ) {
            var docs = data.response.docs;  // filltering of the data that the server sent 
            var articles = [];

            $.each(docs, function(index, value){
                if(value.document_type == 'article') {
                    articles.push('<li class="article"><a href="'+value.web_url+'">'+value.headline.main+'</a><p>' + value.snippet + '</p></li>');
                }
            });

            $(articles.join( " " )).appendTo( $("#nytimes-articles") );

        }).error(function() {
            $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
        }
    );

        //////////////////wikipedia/////////

        //wikipedia AJAX request goes here

        var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax('http://en.wikipedia.org/w/api.php?action=opensearch&search='+citystr+'&format=json&callback=wikiCallBack', {
        dataType: "jsonp",
        success: function(response) {
            console.log(response);
            var articleTitles = response[1];
            var articleLinks = response[3];
            var numberOfArticles = articleLinks.length;
            for(var i = 0; i < numberOfArticles; i++) {
                $wikiElem.append('<li><a href="'+articleLinks[i]+'">'+articleTitles[i]+'</a></li>');
            }

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);



