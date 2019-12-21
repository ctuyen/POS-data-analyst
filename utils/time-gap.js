const {timegaps} = require('../utils/enums')

module.exports = function(x){
    // 12:00PM - 1 + 12:00AM - 0

    // 48 periods of 30 mins
    let haH = 1/48;

    /* TIMESTAMP PERIODS */
    // 02:00am - 08:00am :  haH * 4 < x <= haH * 16 - a
    // 08:00am - 10:00am :  haH * 16 < x <= haH * 20 - b
    // 10:00am - 13:00pm :  haH * 20 < x <= haH * 26 - c
    // 13:00pm - 15:30pm :  haH * 26 < x <= haH * 31 - d
    // 15:30pm - 19:00pm :  haH * 31 < x <= haH * 38 - e
    // 19:00pm - 22:30pm :  haH * 38 < x <= haH * 45 - f
    // 22:30pm - 02:00am :  haH * 45 > x || x <= haH * 4 - g


    if (haH * 4 < x <= haH * 16){
        return timegaps.a
    }else if (haH * 16 < x <= haH * 20){
        return timegaps.b
    }else if (haH * 20 < x <= haH * 26){
        return timegaps.c
    }else if (haH * 26 < x <= haH * 31){
        return timegaps.d
    }else if (haH * 31 < x <= haH * 38){
        return timegaps.e
    }else if (haH * 38 < x <= haH * 45){
        return timegaps.f
    }else if (haH * 45 > x || x <= haH * 4){
        return timegaps.g
    }
}