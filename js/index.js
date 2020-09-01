$(function(){

// close all tabs except the time
    $('#Schedule').hide();

// event handlers for tabs

    $('#toggleSchedule').click(function (){
        $('#Schedule').toggle();
    })




    // prototype using client side js to determine client time
    // issues 
    // if client time is wrong, then their clock will be wrong
    //  potential solutions -> later
    //  ping a external server to service the time 


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
            return ['afterschool',sec - endOfSchool , endOfDay - sec];
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
    function Tick(){
        console.log('test');
        var d = new Date();
        let h = d.getHours()
        let m = d.getMinutes()
        let s = d.getSeconds()
        let periodInfo = PeriodLeft(ClientSeconds(h, m, s));
        console.log(periodInfo);
        let thisPd = periodInfo[0];
        let thisPass = Math.floor(periodInfo[1] / 60);
        let thisLeft = Math.ceil(periodInfo[2] / 60);
        
        if ((periodInfo[2] < (10 * 60)) && (typeof periodInfo[0] != 'string')) {
            // if 10 mins left -> start warning countdown
            // and it is not before/after school
                thisPd = "Before period " + (thisPd + 1).toString();
                thisPass -= 40;
                

        }else{
            thisPd = thisPd.toString();
            thisLeft -= 10;
        }


        $('#period').text(thisPd);
        $('#pass').text(thisPass)
        $('#left').text(thisLeft);


        $('#time').text(h.toString() + ':' + add0(m) + ':' + add0(s))
    }

    


    

});