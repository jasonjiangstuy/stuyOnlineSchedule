$(function(){


    // prototype using client side js to determine client time


    startOfSchool = 9 * 3600
    periodLength = 50 * 60
    endOfSchool = 14 * 3600
    endOfDay = 24 * 3600
    passing = 10 * 60
    function ClientSeconds(){
        var d = new Date();
        return (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds());	
    }   

    
    // setInterval(function (){console.log('test');}, 1000);
    setInterval(function (){Tick();}, 1000);

    function PeriodLeft(){
        // returns what pd, time of period left(including passing), time of period passed
        // in sec
        let sec = ClientSeconds()
        if (startOfSchool > sec){
            // before school
            return ['b', startOfSchool - sec, sec];
        }
        else if (endOfSchool < sec){
            // after school
            return ['a', endOfDay - sec, sec - endOfSchool];
        }
        else{
            let timeInSchool = (sec - startOfSchool);
            let period = Math.ceil(timeInSchool / periodLength)
            let left = period * periodLength - timeInSchool - passing
            let pass = timeInSchool % periodLength
            return [period, pass, left];

        }
        
    }
    // [2, 2970, 2430]
    function Tick(){
        console.log('test');
        
        let periodInfo = PeriodLeft();
        console.log(periodInfo);
        let 
        let thisPass = 0;
        let thisLeft = 0;
        
        if (periodInfo[2] < 10 * 60){
            if (periodInfo[2] > -10){
                thisPd = "Before period"
                thisLeft = 10;
            };
        };
        thisPd = ''+ toString(periodInfo[0])
        $('#period').text(thisPd);
        $('#pass').text(Math.floor(periodInfo[1] / 60))
        $('#left').text(thisLeft + Math.floor(periodInfo[2] / 60));
    }

    


    

});