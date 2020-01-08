function loadData() {
    console.log("Loading data");
    $.getJSON( "../servers/", function( data ) {

        $.each( data, function( key, val ) {
            var updateTime = val.collectionTime;
            if(collectionTimes[val.name] !== undefined) {
                var lastCollectionTime = collectionTimes[val.name];
                if(updateTime <= lastCollectionTime) {
                    return;
                }
            }
            collectionTimes[val.name] = updateTime;
            var stateId = +val.name+'_state';
            $("#"+stateId).remove();
            $(".queueInfo").remove();

            if(val.state === 'BLOCKED') {
                $("#serverStatus").append('<button type="button" class="btn btn-danger btn-round" id="'+stateId+'">' + val.name + '</button>');
            } else {_
                $("#serverStatus").append('<button type="button" class="btn btn-success btn-round" id="'+stateId+'">' + val.name + '</button>');
            }
            // TODO : persist selection in URL
            // TODO : reload automatically
            // display the queues of the selected one (per default, the first)
            for(var i=0;i<val.queues.length;i++) {

                var q = val.queues[i];
                console.log(q.displayName);
                var innerContent = '<div class="row queueInfo">';
                var clazz = 'success';
                innerContent += '<div class="col-4 info-title">\n' + q.displayName +'</div>';
                if(q.blocked) {
                    innerContent += '<div class="col info-title">\<i class="fa fa-stop" style="color:#f5593d"></i></div>';
                    clazz = 'danger';
                } else {
                    innerContent += '<div class="col info-title">\<i class="fa fa-play success" style="color: #6bd098"></i></div>';
                }
                innerContent += '<div class="col-6"><div class="progress">\n' +
                    '                        <div class="progress-bar progress-bar-'+clazz+'" role="progressbar" style="width: '+q.filledPercentage+'%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>\n' +
                    '                    </div><br/></div>';

                innerContent += '<div class="col info-title"><a href="'+q.url+'" target="_blank"><i class="fa fa-question-circle"></i></a></div>';
                innerContent += "</div><br class='queueInfo'/>";


                $("#queues").append(innerContent);
            }
            $("#idle").text(data[0].queuesIdle);
            $("#busy").text(data[0].queuesBusy);
            $("#blocked").text(data[0].queuesBlocked);
        });


    });

}
var collectionTimes = {};

$(document).ready(function(){
    window.setInterval(loadData, 1000);

});