$(function(){
    // close all tabs except the time
    $('#Schedule').hide();
    $('#options').hide();
// load urls from local storage
warnSound = localStorage.getItem('Warning');
endSound = localStorage.getItem('Ending');
startSound = localStorage.getItem('Start');
// sounds variables
var warnLoad, endLoad, startLoad
// console.log(warnLoad, endLoad, startLoad);
$('#testplay').click(function (){
    // load sound -> https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    warnLoad = new Audio(warnSound);
    endLoad = new Audio(endSound);
    // endLoad.play();
    // console.log('continue');
    startLoad = new Audio(startSound);
})
function allStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        archive.push( key + '=' + localStorage.getItem(key));
    }

    return archive;
}
// alert(allStorage())
function setSrc(test, targetEle){
    if (test == 'undefined' || test == null){
        $(targetEle).hide();
    }
    else{
        // console.log(test);
        $(targetEle).attr({'src': test, 'controls': true});
        $(targetEle).show();
    }
}
// set the src for the audio files ||
// close the audio ele if there is no src for them
setSrc(warnSound, '#PLAYinputWSound')
setSrc(endSound, '#PLAYinputESound')
setSrc(startSound, '#PLAYinputSSound')



// event handlers for tabs
    var current = 'clock';

    function changeTo(past, change){
        $('#' + past).hide()
        if (past == change){
            current = 'clock'
        }
        else{
            $('#' + change).show();
            current = change;
        }
    }
    $('#toggleSchedule').click(function (){    
        changeTo(current, 'Schedule');
    })
    $('#toggleOptions').click(function (){
        changeTo(current, 'options');
    })

// look at file object when selected
$('#inputWSound').on('change',
    function (evt){
        loadFile(this, $(this).attr('id'));
    }
    );
$('#inputESound').change(
function (evt){
    loadFile(this, $(this).attr('id'));
}  
);

$('#inputSSound').change(
    function (evt){
        loadFile(this, $(this).attr('id'));
    }  
    );


// function when file is selected
function loadFile(obj, target){
    // console.log(obj);
    var file = obj.files[0];
    var fr = new FileReader();
    fr.onload = function (){
        var tele = $(('#PLAY' + target))

        console.log(tele);
        // console.log(this.result);
        tele.attr({'src': this.result, 'controls':'true'});
        tele.show();
        // tele.play();
    }
    fr.readAsDataURL(file);

}

// event for when save button is pressed
$('#optionSave').click(
    function (){
        // save changed audio files to local storage
        function testChange(org, myNew, target){
            if (org == myNew){
                return
            }
            else{
                localStorage.setItem(target, myNew)
            }

        }
        testChange(warnSound, $('#PLAYinputWSound').attr('src'), 'Warning')
        testChange(endSound, $('#PLAYinputESound').attr('src'), 'Ending')
        testChange(startSound, $('#PLAYinputSSound').attr('src'), 'Start')
        // get all local storage key value pairs
        function allStorage() {

            var archive = [],
                keys = Object.keys(localStorage),
                i = 0, key;
        
            for (; key = keys[i]; i++) {
                archive.push( key + '=' + localStorage.getItem(key));
            }
        
            return archive;
        }
        alert(allStorage())

        location.reload(true);
    }
)
    // prototype using client side js to determine client time
    // issues :
        // if client time is wrong, then their clock will be wrong
            //  potential solutions:
                //  ping a external server to service the time 

        // quite slow to load
            // potential solutions:
                // check to see that requests are only being sent once


    startOfSchool = 9 * 3600
    periodLength = 50 * 60
    endOfSchool = 14 * 3600
    endOfDay = 24 * 3600
    passing = 10 * 60
    defaultpd = periodLength - passing
    function add0(v){
        if (v < 10){
            return '0'+ v.toString();
        }
        else{
            return v.toString()
        }
    }
        // create the schedule
    var period = 1
    for (x = startOfSchool; x < endOfSchool; x += periodLength){
        
        let tablerow = $('<tr></tr>');
        tablerow.append($('<td></td>').text(period));
        let start = Math.floor(x/3600).toString() + ':' + add0(Math.floor((x%3600)/60)).toString();
        let end = Math.floor((x + defaultpd)/3600).toString() + ':' + add0(Math.floor(((x+defaultpd)%3600)/60)).toString();
        tablerow.append( $('<td></td>').text(
        start + " - " + end
        ))
        

        $(Schedule).append(tablerow)
        period += 1;
    }
    function ClientSeconds(h, m, s){
        
        return (h * 3600 + m * 60 + s);	
    }   

    
    // setInterval(function (){console.log('test');}, 1000);
    setInterval(function (){Tick();}, 1000);

    function PeriodLeft(sec){
        // returns what pd, time of period left(including passing), time of period passed
        // in sec

        if (startOfSchool > sec){
            // before school
            return ['before school',sec , startOfSchool - sec];
        }
        else if (endOfSchool < sec){
            // after school
            return ['after school',sec - endOfSchool , endOfDay - sec];
        }
        else{
            let timeInSchool = (sec - startOfSchool);
            let period = Math.ceil(timeInSchool / periodLength)
            let left = period * periodLength - timeInSchool
            let pass = timeInSchool % periodLength
            return [period, pass, left];

        }
        
    }
    // [2, 2970, 2430]

    // make alarms only go off once
    var warning = false;
    var ending = false;
    var start = false;
    function Tick(){
        // console.log('test');
        var d = new Date();
        let h = d.getHours()
        let m = d.getMinutes()
        let s = d.getSeconds()
        let periodInfo = PeriodLeft(ClientSeconds(h, m, s));
        // console.log(periodInfo);
        let thisPd = periodInfo[0];
        let thisPass = Math.floor(periodInfo[1] / 60);
        let thisLeft = Math.ceil(periodInfo[2] / 60);
        
        if ((periodInfo[2] < (15 * 60)) && (typeof periodInfo[0] != 'string')) {
            // if 15 mins left -> warning bell
            // and it is not before/after school
            //  -> start warning bell sound
            ending = false;
            start = false;
            if (!warning){
                warnLoad.play();
                warning=true;
            }
            thisPd = thisPd.toString();
            thisLeft -= 10;
        }
        else if ((periodInfo[2] < (10 * 60)) && (typeof periodInfo[0] != 'string')) {
            // if >10 mins left -> end bell /start of passing
            // and it is not before/after school
            //  -> start endbell sound
            warning = false;
            start = false;
            if (!ending){
                endLoad.play();
                ending = true;
            }
            thisPd = "Before period " + (thisPd + 1).toString();
            thisPass -= 40;
        }
        else if ((periodInfo[1] < (2 * 60)) && (typeof periodInfo[0] != 'string')) {
            // if >2 mins of class -> start bell /start of class
            // and it is not before/after school
            //  -> start start bell sound
            warning = false;
            ending = false;
            if (!ending){
                startLoad.play();
                start = true;
            }
            thisPd = "Before period " + (thisPd + 1).toString();
            thisPass -= 40;
        }
        else if(typeof periodInfo[0] == 'string'){
            thisPd = thisPd.toString();
        }
        else{
            thisPd = thisPd.toString();
            thisLeft -= 10;
        }


        $('#period').text(thisPd);
        $('#pass').text(thisPass)
        $('#left').text(thisLeft);


        $('#time').text(h.toString() + ':' + add0(m) + ':' + add0(s))
    }

    


    

});