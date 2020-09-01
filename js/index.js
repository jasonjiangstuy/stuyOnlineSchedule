$(function(){


    // prototype using client side js to determine client time


    startOfSchool = 9 * 3600
    periodLength = 50 * 60
    endOfSchool = 14 * 3600
    endOfDay = 24 * 3600
    passing = 10 * 60
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
        var d = new Date();
        let h = d.getHours()
        let m = d.getMinutes()
        let s = d.getSeconds()
        let periodInfo = PeriodLeft(ClientSeconds(h, m, s));
        console.log(periodInfo);
        let thisPd = periodInfo[0];
        let thisPass = Math.floor(periodInfo[1] / 60);
        let thisLeft = Math.ceil(periodInfo[2] / 60);
        
        if (periodInfo[2] < 10 * 60){
            // if 10 mins left -> start warning countdown

                thisPd = "Before period " + (thisPd + 1).toString();
                thisPass -= 40;
                thisLeft += 10;
                

        }else{
            thisPd = thisPd.toString();
        }


        $('#period').text(thisPd);
        $('#pass').text(thisPass)
        $('#left').text(thisLeft);

        function add0(v){
            if (v < 10){
                return '0'+ v.toString();
            }
            else{
                return v.toString()
            }
        }
        $('#time').text(h.toString() + ':' + add0(m) + ':' + add0(s))
    }

    


    

});